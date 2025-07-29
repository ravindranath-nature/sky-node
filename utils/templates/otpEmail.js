exports.generateOtpHtml = (name, otp) => {
  return `
  <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:20px;border:1px solid #eee;border-radius:8px;">
    <h2 style="color:#4CAF50;">🔐 Email Verification Code</h2>
    <p>Hi <strong>${name}</strong>,</p>
    <p>Thank you for registering. Use the following OTP to verify your email:</p>
    <div style="font-size:32px;font-weight:bold;margin:20px 0;color:#333;">${otp}</div>
    <p>This OTP is valid for 15 minutes.</p>
    <hr />
    <p style="font-size:12px;color:#999;">If you did not request this, please ignore this email.</p>
  </div>`;
};
