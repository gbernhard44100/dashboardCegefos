const fs = require('fs');

class CalculIMC {
  fatnessList = [];
  htmlContent = '';
  
  constructor () {
    this.fatnessList = require('./constants/FatnessList')
  }

  async render(req, parsedBody) {
    this.htmlContent = '';
    
    if (req.method === 'GET') {
      this.renderIMCForm();
    } else if (req.method === 'POST') {
      this.renderIMCForm();
      this.renderIMCResult(req, parsedBody);
    }

    return this.htmlContent;
  }
  
  async calculateIMC(req) {    
    return 'coucou';
  }

  renderIMCForm() {
    this.htmlContent += fs.readFileSync(process.env.views + 'calculIMCForm.html');
  }

  async renderIMCResult(req) {
    const result = this.calculateIMC(req);
    this.htmlContent += result;
  }
}

exports.calculIMC = new CalculIMC;