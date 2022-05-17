const ejs = require('ejs');
const fs = require('fs');
const JSONStream = require('JSONStream');

const rateListPath = process.env.privatefiles + 'exchangeRate.json';

class ConvertisseurDevise {
  constructor() {}

  async render(req, parsedBody) {
    let exchangeAmounts = {};
    
    if (req.method === 'POST') {
      exchangeAmounts = await this.getExchangeRates(parsedBody);
    }

    return this.renderExchangeRate(parsedBody, exchangeAmounts);
  }

  async renderExchangeRate(parsedBody, exchangeAmounts) {
    return ejs.renderFile(
      process.env.views + 'exchangeRateForm.ejs',
      {
        parsedBody: parsedBody,
        exchangeAmounts: exchangeAmounts
      }
    );
  }

  async getExchangeRates(parsedBody) {
    const changedCurrency = parsedBody.changedCurrency;
    
    var exchangeAmounts = parsedBody;
    const JSONRateListStream = await this.getJSONRateListStream();
    
    return new Promise(function(resolve) {
      JSONRateListStream.on('data', (currencies) => {
        for(const currency in currencies) {
          if(currency === changedCurrency) {
            continue;
          } else {
            exchangeAmounts[currency] = (
              currencies[currency]['rate'] / currencies[changedCurrency]['rate'] * exchangeAmounts[changedCurrency]
              ).toFixed(currencies[currency]['decimals']);
          }
        }

        resolve(exchangeAmounts);
      });
    });
  }

  async getJSONRateListStream() {
    const rateListStream = fs.createReadStream(rateListPath, {flags: 'r', encoding: 'UTF-8'});
    const JSONRateListStream = JSONStream.parse('currencies');
    
    return rateListStream.pipe(JSONRateListStream);
  }
}

exports.convertisseurDevise = new ConvertisseurDevise;