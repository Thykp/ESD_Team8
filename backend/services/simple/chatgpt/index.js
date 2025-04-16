const express = require('express');
const path = require('path');
require('dotenv').config();
const { FE_ENDPOINT } = process.env;
const client = require('prom-client');
const PORT = process.env.PORT || 3000;
const cors = require('cors');
const app = express();
const logger = require('./util/logger');

const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics();

const httpRequestCounter = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'path', 'status'],
});

app.use((req, res, next) => {
  res.on('finish', () => {
    httpRequestCounter.labels(req.method, req.path, res.statusCode).inc();
  });
  next();
});

app.use(express.json()); 
app.use(express.static(path.join(__dirname, 'public')));
app.use(
  cors({
    origin: ['http://localhost:5173', FE_ENDPOINT],
    credentials: true
  })
);

app.get('/', (req, res) => {
  res.status(200).send('ok');
});

let apiRouter = require('./api/index');
app.use('/', apiRouter);

app.use(function(err, req, res, next) {
  logger.error(err);
  res.status(err.status || 500);
  res.json({
      message: err.message
  });
});

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = app;