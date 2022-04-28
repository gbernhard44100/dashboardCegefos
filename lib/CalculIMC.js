const fs = require('fs');

class CalculIMC {
  fatnessList = [];
  htmlContent = '';
  
  constructor () {
    this.fatnessList = require('./constants/FatnessList')
  }

  async render(req) {
    if (req.method === 'GET') {
      return this.renderIMCForm();
    } else if (req.method === 'POST') {
      this.renderIMCResult(req);
      return this.htmlContent;
    }
  }
  
  async calculateIMC(req) {    
    return 'coucou';
  }

  renderIMCForm() {
    return fs.readFileSync(process.env.views + 'calculIMCForm.html');
  }

  async renderIMCResult(req) {
    const result = this.calculateIMC(req);
    this.htmlContent = fs.readFileSync(process.env.views + 'calculIMCForm.html') + result;
  }
}

exports.calculIMC = new CalculIMC;