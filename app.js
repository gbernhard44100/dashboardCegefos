require('dotenv').config();
const http = require('http');
const { resolve } = require('path');

const port = process.env.port;
const hostname = process.env.hostname;

const convertisseurDevise = require('./lib/ConvertisseurDevise');

async function handleHTTPRequest(req, res, body = '') {
  var mainContent = '';

  if (req.url === '/calculIMC') {
    const calculIMC = require('./lib/CalculIMC').calculIMC;
    var mainContent = await calculIMC.render(req);
  } else {
    const accueil = require('./lib/Accueil');
    var mainContent = accueil.view;
  }

  sendResponse(res, mainContent);
}

async function sendResponse(res, mainContent) {
  const header = require('./lib/Header');
  const nav = require('./lib/Nav');
  const footer = require('./lib/Footer');

  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html');
  res.write(header.view);
  res.write(nav.view);
  res.write(mainContent);
  res.write(footer.view);
  res.end();
}

const server = http.createServer((req, res) => {
  if(req.url === '/favicon.png') {
    res.statusCode = 204;
    res.end();
  } else {
    var body = '';
    
    req.on('readable', function() {
      if (req.method === 'GET') {
        handleHTTPRequest(req, res);
      } else if (req.method === 'POST') {
        // http module handle the same request twice with no data to read in the second time.
        while (null !== (body = req.read())) {
          handleHTTPRequest(req, res, body);
        }
      }
    });
  }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});