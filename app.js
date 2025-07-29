const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const authRoutes = require('./routes/authRoutes');
const errorHandler = require('./middlewares/errorMiddleware');
const blockchain = require('./routes/blockchainRoutes');
const transaction = require('./routes/transactionRoute');
const uplaod = require('./routes/uploadRoutes');
const files = require('./routes/fileRoutes');
const downloadRoutes = require("./routes/downloadRoutes");
const viewRoutes = require("./routes/viewRoutes");

const app = express();
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));

// Security middlewares
app.use(helmet());


// JSON parsing & logging
app.use(express.json());
app.use(morgan('dev'));

// Rate limiting
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 500,
}));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/blockchain', blockchain);
app.use('/api/transaction', transaction);
app.use('/api/upload', uplaod);
app.use('/api/files', files);
app.use("/api/download", downloadRoutes);
app.use("/api/view", viewRoutes);

// Global error handler
app.use(errorHandler);

module.exports = app;
