const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { sendMail } = require('../utils/mailer');
const generateOtp = require('../utils/otp_generator');
const { generateOtpHtml } = require('../utils/templates/otpEmail');

exports.register = async ({ name, email, password }) => {
  try {
    const otp = generateOtp(6);
    const expires = Date.now() + 15 * 60 * 1000;

    const existing = await User.findOne({ email });

    if (existing && existing.isVerified === false) {
      existing.verificationCode = otp;
      existing.verificationCodeExpires = expires;
      await existing.save();

      await sendMail({
        to: email,
        subject: 'Verify your email – OTP Code',
        html: generateOtpHtml(name, otp),
      });

      return { success: true, message: 'Please verify OTP sent to your email.' };
    } else if (existing) {
      throw new Error('User already exists');
    }

    const user = await User.create({
      name,
      email,
      password,
      isVerified: false,
      verificationCode: otp,
      verificationCodeExpires: expires,
    });

    await sendMail({
      to: email,
      subject: 'Verify your email – OTP Code',
      html: generateOtpHtml(name, otp),
    });

    return { success: true, message: 'Please verify OTP sent to your email.' };
  } catch (e) {
    throw new Error(e.message);
  }
};

exports.login = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user || !user.isVerified)
    throw new Error('Invalid credentials or unverified user');

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) throw new Error('Invalid credentials');

  const token = jwt.sign(
    {
      id: user._id,
      email: user.email,
    },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  return {
    success: true,
    message: 'Login successful',
    token,
    userDetails: {
      name: user.name,
      email: user.email,
    },
  };
};

exports.verifyOtp = async ({ email, code }) => {
  const user = await User.findOne({ email });
  if (!user || user.isVerified) throw new Error('Invalid request');

  if (
    user.verificationCode !== code ||
    Date.now() > user.verificationCodeExpires
  ) {
    throw new Error('Invalid or expired OTP');
  }

  user.isVerified = true;
  user.verificationCode = null;
  user.verificationCodeExpires = null;
  await user.save();

  return { success: true, message: 'Email verified successfully' };
};

exports.resendOtp = async ({ email }) => {
  const user = await User.findOne({ email });
  if (!user || user.isVerified)
    throw new Error('Invalid request or already verified');

  const otp = generateOtp(6);
  const expires = Date.now() + 15 * 60 * 1000;
  user.verificationCode = otp;
  user.verificationCodeExpires = expires;
  await user.save();

  await sendMail({
    to: email,
    subject: 'Verify your email – OTP Code',
    html: generateOtpHtml(user.name, otp),
  });

  return { success: true, message: 'OTP resent successfully' };
};
