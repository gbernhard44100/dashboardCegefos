const fs = require('fs');
const JSONStream = require('JSONStream');

const rateListPath = process.env.privatefiles + 'exchangeRate.json';

const Devise = require('./../models/DeviseModel');

class ExchangeRateController {
  constructor() {}

  async getExchangeRateForm(req, res) {
    this.renderExchangeRate(req, res);
  }

  async getExchangeRateResults(req, res) {
    let exchangeAmounts = await this.getExchangeRates(req);
    
    let newDevise = new Devise({
      amount: req.body[req.body.changedCurrency],
      currency: req.body.changedCurrency
    });
    newDevise.save((err, devise) => {});

    this.renderExchangeRate(req, res, exchangeAmounts);
  }

  async renderExchangeRate(req, res, exchangeAmounts = {}) {
    res.render(
      'exchangeRateForm.ejs',
      {
        parsedBody: req.body,
        exchangeAmounts: exchangeAmounts,
        session: req.session
      }
    );
  }

  async getExchangeRates(req) {
    const changedCurrency = req.body.changedCurrency;
    
    var exchangeAmounts = req.body;
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

module.exports = new ExchangeRateController();