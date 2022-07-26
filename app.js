const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }, err => {
        if (err) throw err;
        console.log('Connected to MongoDB!!!')
    });

    
require('./api/models/pessoa');
require('./api/models/endereco');

const app = express();

const pessoasRoutes = require('./api/routes/pessoas');
const enderecosRoutes = require('./api/routes/enderecos');

app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use('/pessoas', pessoasRoutes);
app.use('/enderecos', enderecosRoutes);

app.use('/api', (req, res, next) => {
    res.status(200).json({
        message: 'Hello word!'
    })
})

app.use((req, res, next) => {
    const error = new Error('Not Found')
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    })
});

module.exports = app;