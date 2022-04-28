const fs = require('fs');

class CalculIMC {
  fatnessList = [];
  htmlContent = '';
  
  constructor () {
    this.fatnessList = require('./constants/FatnessList').fatnessList;
  }

  async render(req, parsedBody) {
    this.htmlContent = '';
    
    if (req.method === 'GET') {
      this.renderIMCForm();
    } else if (req.method === 'POST') {
      this.renderIMCForm();
      this.renderIMCResult(parsedBody);
    }

    return this.htmlContent;
  }
  
  renderIMCForm() {
    this.htmlContent += fs.readFileSync(process.env.views + 'calculIMCForm.html');
  }

  async renderIMCResult(parsedBody) {
    const result = await this.getFatnessData(parsedBody);
    console.log(result);
    this.htmlContent += result;
  }

  async getFatnessData(parsedBody) { 
    const imc = await this.calculateIMC(parsedBody);

    return this.fatnessList.find((fatness) => imc < fatness.maxTresholdIMC);
  }

  async calculateIMC(parsedBody) {
    return parsedBody.weight / Math.pow(parsedBody.height / 100, 2);
  }
}

exports.calculIMC = new CalculIMC;