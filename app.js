require('dotenv').config();
const http = require('http');

const port = process.env.port;
const hostname = process.env.hostname;

const header = require('./modules/Header');
const nav = require('./modules/Nav');
const footer = require('./modules/Footer');

const accueil = require('./modules/Accueil');
const calculIMC = require('./modules/CalculIMC');
const convertisseurDevise = require('./modules/ConvertisseurDevise');

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html');
  res.write(header.view);
  res.write(nav.view);
  res.write(accueil.view);
  res.write(footer.view);
  res.end();
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});