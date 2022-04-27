const fs = require('fs');

exports.view = fs.readFileSync(process.env.views + 'header.html');