const fs = require('fs');

exports.view = fs.readFileSync(process.env.views + 'nav.html');