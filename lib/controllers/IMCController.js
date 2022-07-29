
const IMC = require('./../models/IMCModel');

class IMCController {
    fatnessList = [];
    
    constructor () {
      this.fatnessList = require('./../constants/FatnessList');
    }
    
    async renderIMCForm(req, res) {
      res.render('getIMCForm.ejs', {parsedBody: req.body, session: req.session});
    }
  
    async renderIMCResults(req, res) {
      const imc = await this.calculateIMC(req.body);
      const fatnessData = await this.getFatnessData(imc);

      let newIMC = new IMC(req.body);
      newIMC.save((err, imcRecord) => {});

      res.render(
        'imcResults.ejs',
        {
          parsedBody: req.body,
          imc: imc,
          fatnessData: fatnessData,
          session: req.session
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

module.exports = new IMCController();