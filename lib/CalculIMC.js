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
      this.htmlContent = this.renderIMCResult(parsedBody);
    }

    return this.htmlContent;
  }
  
  async renderIMCForm(parsedBody = {}) {
    return ejs.renderFile(process.env.views + 'getIMCForm.ejs', {parsedBody: parsedBody});
  }

  async renderIMCResult(parsedBody) {
    const imc = await this.calculateIMC(parsedBody);
    const fatnessData = await this.getFatnessData(imc);
    
    return ejs.renderFile(
      process.env.views + 'imcResults.ejs',
      {
        parsedBody: parsedBody,
        imc: imc,
        fatnessData: fatnessData
      }
    );
  }

  async getFatnessData(imc) { 
    return this.fatnessList.find((fatness) => imc < fatness.maxTresholdIMC);
  }

  async calculateIMC(parsedBody) {
    return (
      parsedBody.weight / Math.pow(parsedBody.height / 100, 2)
    ).toFixed(2);
  }
}

exports.calculIMC = new CalculIMC;