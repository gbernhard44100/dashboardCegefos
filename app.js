require('dotenv').config();
const http = require('http');

const port = process.env.port;
const hostname = process.env.hostname;

const header = require('./lib/Header');
const nav = require('./lib/Nav');
const footer = require('./lib/Footer');

const convertisseurDevise = require('./lib/ConvertisseurDevise');

const server = http.createServer((req, res) => {
  if(req.url === '/favicon.ico') {
    res.statusCode = 204;

  } else {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    res.write(header.view);
    res.write(nav.view);

    if (req.url === '/calculIMC') {
      const calculIMC = require('./lib/CalculIMC');
      res.write(calculIMC.getView);
    } else {
      const accueil = require('./lib/Accueil');
      res.write(accueil.view);
    }

    res.write(footer.view);
  }

  res.end();
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});