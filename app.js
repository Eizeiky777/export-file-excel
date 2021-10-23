/* eslint-disable no-unused-vars */

require('dotenv').config();

const express = require('express');

const router = require('./routes/api');

const { env } = process;

const app = express();
app.enable('trust proxy');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/public', express.static(`${__dirname}/public`));

app.use(router);

module.exports = app;
