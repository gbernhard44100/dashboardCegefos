const ejs = require('ejs');

exports.view = ejs.renderFile(process.env.views + 'home.ejs');