const ejs = require('ejs');

class ConvertisseurDevise {
  htmlContent = '';
  
  constructor () {
  }

  async render(req, parsedBody) {
    this.htmlContent = '';
    
    if (req.method === 'GET') {
      this.htmlContent = this.renderExchangeRateForm();
    } else if (req.method === 'POST') {
      //this.htmlContent = this.renderIMCResult(parsedBody);
    }

    return this.htmlContent;
  }
  
  async renderExchangeRateForm(parsedBody = {}) {
    return ejs.renderFile(process.env.views + 'exchangeRateForm.ejs', {parsedBody: parsedBody});
  }

  async renderExchangeRateResult(parsedBody) {
    return ejs.renderFile(
      process.env.views + 'exchangeRateForm.ejs',
      {
        parsedBody: parsedBody
      }
    );
  }
}

exports.convertisseurDevise = new ConvertisseurDevise;