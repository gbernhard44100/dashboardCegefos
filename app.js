require('dotenv').config();
const http = require('http');
const fs = require('fs');

const port = process.env.port;
const hostname = process.env.hostname;

async function parseBody(body) {
  return new Promise((resolve) => {
    resolve(JSON.parse(body));
  }).catch(() => {
    // body request in from html form: "fullname=gg&height=180&weight=80"
    let parsedBody = {};

    if (body !== undefined) {
      String(body).split('&').map((data) => {
        let splittedData = data.split('=');
        parsedBody[splittedData[0]] = splittedData[1].replace(/\+/g, ' ');
        parsedBody[splittedData[0]] = parsedBody[splittedData[0]].replace(/%40/g, '@');
        parsedBody[splittedData[0]] = parsedBody[splittedData[0]].replace(/%C3%AB/g, 'ë');
      });
    }

    return parsedBody;
  });
}

async function handleHTTPRequest(req, res, body = undefined) {
  let htmlContent = '';
  let parsedBody = await parseBody(body);

  if (req.url === '/calculIMC') {
    const calculIMC = require('./lib/CalculIMC').calculIMC;
    htmlContent = await calculIMC.render(req, parsedBody);
  } else if (req.url === '/convertirDevises') {
    const convertisseurDevise = require('./lib/ConvertisseurDevise').convertisseurDevise;
    htmlContent = await convertisseurDevise.render(req, parsedBody);
  } else if (req.url === '/inscription') {
    const subscriber = require('./lib/Subscriber').subscriber;
    htmlContent = await subscriber.render(req, parsedBody);
  } else {
    const accueil = require('./lib/Accueil');
    htmlContent = await accueil.view;
  }

  sendResponse(res, htmlContent);
}

async function sendResponse(res, htmlContent) {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html');
  res.write(htmlContent);
  res.end();
}

function isFile(req) {
  return req.url.split('.').length > 1;
}

function getFileType(req) {
  let fileType = '';
  let extension = req.url.split('.')[1];
  if (['jpg', 'png'].find(value => value === extension.toLowerCase())) {
    fileType = 'image/' + extension;
  }

  return fileType;
}

async function loadFile(req, res, statusCode) {
  fs.readFile('.' + req.url, function(err, data) {
    if(err) {
        res.writeHead(500, { 'Content-Type' : 'text/plain' });
        res.end('500 - Internal Error');
    } else {
        res.writeHead(statusCode, { 'Content-Type' : getFileType(req) });
        res.end(data);
    }
  });
}

const server = http.createServer((req, res) => {
  if(req.url === '/favicon.ico') {
    loadFile(req, res, 204);
  } else if(isFile(req)) {
    if (req.url.includes('/resources/public')) {
      loadFile(req, res, 200);
    } else {
      res.writeHead(403, { 'Content-Type' : 'text/plain' });
      res.end('403 - Forbiden');
    }
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

exports.server = server; // for testing
