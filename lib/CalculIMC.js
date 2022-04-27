const fs = require('fs');

const fatnessList = require('./constants/FatnessList');

exports.getView = fs.readFileSync(process.env.views + 'calculIMCForm.html');