const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const config = require('./config/env');
const { errorConverter, errorHandler } = require('./middlewares/error.middleware');

// Import routes (placeholders for now)
// const authRoutes = require('./routes/auth.routes');
// const chatRoutes = require('./routes/chat.routes');
// const voiceRoutes = require('./routes/voice.routes');
// const businessRoutes = require('./routes/business.routes');
// const analyticsRoutes = require('./routes/analytics.routes');

const app = express();

if (config.env !== 'test') {
    app.use(morgan('combined'));
}

// set security HTTP headers
app.use(helmet());

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// enable cors
app.use(cors());

// Health check
app.get('/', (req, res) => {
    res.send('AI Customer Support Server is running');
});

// v1 api routes
// app.use('/v1/auth', authRoutes);
// app.use('/v1/chat', chatRoutes);
// app.use('/v1/voice', voiceRoutes);
// app.use('/v1/business', businessRoutes);
// app.use('/v1/analytics', analyticsRoutes);

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
    res.status(404).json({ message: 'Not Found' });
});

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

module.exports = app;
