const fs = require('fs');

exports.view = fs.readFileSync(process.env.APP_VIEWS + 'header.html');