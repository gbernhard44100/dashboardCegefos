const chai = require('chai');
const chaiHttp = require('chai-http');
const testServer = require('./../app').server;
const should = chai.should();
const expect = chai.expect;

chai.use(chaiHttp);
describe('Access to main pages', function() {
  it('should access the home page', function(done) {
    chai.request(testServer)
      .get('/')
      .end((err, res) => {
        res.should.have.status(200);
        expect(res.text).to.match(/Cegefos est une société de formations en ligne/);
        done();
      })
  });

  it('should access the IMC page', function(done) {
    chai.request(testServer)
      .get('/calculIMC')
      .end((err, res) => {
        res.should.have.status(200);
        expect(res.text).to.match(/IMC/);
        done();
      })
  });

  it('should access the currency conversion page', function(done) {
    chai.request(testServer)
      .get('/convertirDevises')
      .end((err, res) => {
        res.should.have.status(200);
        expect(res.text).to.match(/Convertisseur de devises/);
        done();
      })
  });

  it('should access the subscription page', function(done) {
    chai.request(testServer)
      .get('/inscription')
      .end((err, res) => {
        res.should.have.status(200);
        expect(res.text).to.match(/Inscription/);
        done();
      })
  });
});