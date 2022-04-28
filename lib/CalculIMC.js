const ejs = require('ejs');

class CalculIMC {
  fatnessList = [];
  htmlContent = '';
  
  constructor () {
    this.fatnessList = require('./constants/FatnessList').fatnessList;
  }

  async render(req, parsedBody) {
    this.htmlContent = '';
    
    if (req.method === 'GET') {
      this.htmlContent = this.renderIMCForm();
    } else if (req.method === 'POST') {
      this.renderIMCForm();
      this.renderIMCResult(parsedBody);
    }

    return this.htmlContent;
  }
  
  async renderIMCForm() {
    return ejs.renderFile(process.env.views + 'getIMCForm.ejs');
  }

  async renderIMCResult(parsedBody) {
    const imc = await this.calculateIMC(parsedBody);
    const result = await this.getFatnessData(imc);
    console.log(result);
    this.htmlContent += result;
  }

  async getFatnessData(imc) { 
    return this.fatnessList.find((fatness) => imc < fatness.maxTresholdIMC);
  }

  async calculateIMC(parsedBody) {
    return parsedBody.weight / Math.pow(parsedBody.height / 100, 2);
  }
}

exports.calculIMC = new CalculIMC;