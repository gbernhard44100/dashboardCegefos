const chai = require('chai');
const chaiHttp = require('chai-http');
const testServer = require('./../app').app;
const should = chai.should();
const expect = chai.expect;
const mongoose = require('mongoose');
const bcrypt = require("bcrypt");

const User = require('./../lib/models/UserModel');
const supertest = require('supertest')

chai.use(chaiHttp);

describe('Access to public pages', function() {
  it('can access the home page', function(done) {
    chai.request(testServer)
      .get('/')
      .end((err, res) => {
        res.should.have.status(200);
        expect(res.text).to.match(/Cegefos est une société de formations en ligne/);
        done();
      })
  });

  it('can access the subscription page', function(done) {
    chai.request(testServer)
      .get('/inscription')
      .end((err, res) => {
        res.should.have.status(200);
        expect(res.text).to.match(/Inscription/);
        done();
      })
  });

  it('can access the login page', function(done) {
    chai.request(testServer)
      .get('/login')
      .end((err, res) => {
        res.should.have.status(200);
        expect(res.text).to.match(/Pas encore inscrit/);
        done();
      })
  });
});

describe('Access to restricted pages - Successful after login', function() {
  const agent = supertest.agent('http://localhost:3000') ;
  
  before (function(done) {
    User.findOne(
      { 
        email: 'john.doe@gmail.com', 
        password: 'n%AxPyqd[YZBV9a4'
      }, 
      (err, user) => {
        if (user === null) {
          var params = {
            firstname: 'John',
            lastname: 'Doe',
            email: 'john.doe@gmail.com',
            password: 'n%AxPyqd[YZBV9a4',
            confirmedPassword: 'n%AxPyqd[YZBV9a4',
            birthDate: '1990-01-27',
            address: '15 rue des Lilas',
            postalCode: '12345',
            city: 'Angers',
          };
    
          const salt = bcrypt.genSaltSync(10);
          const hashedPassword = bcrypt.hashSync(params.password, salt);
          params.password = hashedPassword;
          // Create a user so the db isn't empty
          // May help us uncover odd bugs
          new User(params).save((err, user) => {})
        }

        agent
        .post('/login')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .type('form')
        .send('email=john.doe@gmail.com')
        .send('password=n%AxPyqd[YZBV9a4')
        .end(function(err, response){
          if (err) return done(err);
              done();
        });
      }
    );
  });

  after(function(done){
    agent
      .get('/logout')
      .end(function(err, res) {
        if (err) return done(err);
        done();
      });
  })

  it('can access the form to create a new post after login', function(done) {
    agent.get('/nouveauPost')
    .end((err, response) => {
      response.should.have.status(200);
      expect(response.text).to.match(/Nouveau Post :/);
      done();
    })
  })

  it('can access the list of posts after login', function(done) {
    agent.get('/posts')
    .end((err, response) => {
      response.should.have.status(200);
      expect(response.text).to.match(/Posts/);
      done();
    })
  })

  it('can access the IMC page after login', function(done) {
    agent.get('/calculIMC')
    .end((err, response) => {
      response.should.have.status(200);
      expect(response.text).to.match(/IMC/);
      done();
    })
  })
  
  it('can access the Exchange Rate Convertor after login', function(done) {
    agent.get('/convertirDevises')
    .end((err, response) => {
      response.should.have.status(200);
      expect(response.text).to.match(/Convertisseur de devises/);
      done();
    })
  })  
});

describe('Access to restricted pages - Failed because not authenticated', function() {
  const agent = supertest.agent('http://localhost:3000') ;

  it('cannot access the form to create a new post without authentication', function(done) {
    agent.get('/nouveauPost')
    .end((err, response) => {
      response.should.have.status(302);
      response.should.redirectTo('/login');
      done();
    })
  })

  it('cannot access the list of posts without authentication', function(done) {
    agent.get('/posts')
    .end((err, response) => {
      response.should.have.status(302);
      response.should.redirectTo('/login');
      done();
    })
  })

  it('cannot access the IMC page without authentication', function(done) {
    agent.get('/calculIMC')
    .end((err, response) => {
      response.should.have.status(302);
      response.should.redirectTo('/login');
      done();
    })
  })
  
  it('cannot access the Exchange Rate Convertor without authentication', function(done) {
    agent.get('/convertirDevises')
    .end((err, response) => {
      response.should.have.status(302);
      response.should.redirectTo('/login');
      done();
    })
  })  
});