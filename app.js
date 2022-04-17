require('dotenv').config();
const http = require('http');

const port = process.env.port;
const hostname = process.env.hostname;

const header = require('./lib/Header');
const nav = require('./lib/Nav');
const footer = require('./lib/Footer');

const accueil = require('./lib/Accueil');
const calculIMC = require('./lib/CalculIMC');
const convertisseurDevise = require('./lib/ConvertisseurDevise');

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