const chai = require('chai');
chai.use(require('chai-as-promised'))
const should = chai.should();
const expect = chai.expect;

const subscriber = require('./../../lib/Subscriber.js').subscriber;

describe('validateSubscription', function() {
  var parsedBodyWithCompleteSubscription = {};
  
  beforeEach(function () {
    parsedBodyWithCompleteSubscription = {
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
  });

  describe('valid subscription', function() {
    it('accept subscription if it is valid', async function() {
      await expect(subscriber.validateSubscription(parsedBodyWithCompleteSubscription)).not.to.throw;
    });
  });

  describe('invalid subscription', function() {
    it('rejects subscription if the firstname is missing', async function() { 
      await delete parsedBodyWithCompleteSubscription.firstname;    
      await expect(subscriber.validateSubscription(parsedBodyWithCompleteSubscription)).to.be.rejectedWith('Inscription refusée: le prénom est manquant.');
    });

    it('rejects subscription if the lastname is missing', async function() { 
      await delete parsedBodyWithCompleteSubscription.lastname;    
      await expect(subscriber.validateSubscription(parsedBodyWithCompleteSubscription)).to.be.rejectedWith('Inscription refusée: le nom de famille est manquant.');
    });

    it('rejects subscription if the email address is missing', async function() { 
      await delete parsedBodyWithCompleteSubscription.email;    
      await expect(subscriber.validateSubscription(parsedBodyWithCompleteSubscription)).to.be.rejectedWith('Inscription refusée: l\'adresse email est invalide.');
    });

    it('rejects subscription if the email is invalid', async function() { 
      parsedBodyWithCompleteSubscription.email = 'additional>h@gmail.com';
      await expect(subscriber.validateSubscription(parsedBodyWithCompleteSubscription)).to.be.rejectedWith('Inscription refusée: l\'adresse email est invalide.');

      parsedBodyWithCompleteSubscription.email = 'additional h@gmail.com';
      await expect(subscriber.validateSubscription(parsedBodyWithCompleteSubscription)).to.be.rejectedWith('Inscription refusée: l\'adresse email est invalide.');

      parsedBodyWithCompleteSubscription.email = 'additional hgmail.com';
      await expect(subscriber.validateSubscription(parsedBodyWithCompleteSubscription)).to.be.rejectedWith('Inscription refusée: l\'adresse email est invalide.');
    })

    it('rejects subscription if the password is missing', async function() { 
      await delete parsedBodyWithCompleteSubscription.password;    
      await expect(subscriber.validateSubscription(parsedBodyWithCompleteSubscription)).to.be.rejectedWith('Inscription refusée: le mot de passe est invalide.');
    });

    it('rejects subscription if the password is invalid', async function() { 
      //has to contain at least one special character
      parsedBodyWithCompleteSubscription.password = 'nAxPyqdYZBV9a4';
      await expect(subscriber.validateSubscription(parsedBodyWithCompleteSubscription)).to.be.rejectedWith('Inscription refusée: le mot de passe est invalide.');

      //has to contain eight characters minimum
      parsedBodyWithCompleteSubscription.password = 'nAyqse!';
      await expect(subscriber.validateSubscription(parsedBodyWithCompleteSubscription)).to.be.rejectedWith('Inscription refusée: le mot de passe est invalide.');

      //has to contain at least one upper case letter
      parsedBodyWithCompleteSubscription.password = 'n%axpyqd[yzbv9a4';
      await expect(subscriber.validateSubscription(parsedBodyWithCompleteSubscription)).to.be.rejectedWith('Inscription refusée: le mot de passe est invalide.');

      //has to contain at least one lower case letter
      parsedBodyWithCompleteSubscription.password = 'N%AXPYQD[YZBV9A4';
      await expect(subscriber.validateSubscription(parsedBodyWithCompleteSubscription)).to.be.rejectedWith('Inscription refusée: le mot de passe est invalide.');

      //has to contain at least one number
      parsedBodyWithCompleteSubscription.password = 'n%AxPyqd[YZBVaa';
      await expect(subscriber.validateSubscription(parsedBodyWithCompleteSubscription)).to.be.rejectedWith('Inscription refusée: le mot de passe est invalide.');
    })

    it('rejects subscription if the password is not well confirmed', async function() { 
      await delete parsedBodyWithCompleteSubscription.confirmedPassword;    
      await expect(subscriber.validateSubscription(parsedBodyWithCompleteSubscription)).to.be.rejectedWith('Inscription refusée: les mots de passe ne correspondent pas.');
    });

    it('rejects subscription if the password does not match with the confimred password', async function() { 
      parsedBodyWithCompleteSubscription.confirmedPassword = 'notTheSamePassword';    
      await expect(subscriber.validateSubscription(parsedBodyWithCompleteSubscription)).to.be.rejectedWith('Inscription refusée: les mots de passe ne correspondent pas.');
    });

    it('rejects subscription if the birthdate is missing', async function() { 
      await delete parsedBodyWithCompleteSubscription.birthDate;    
      await expect(subscriber.validateSubscription(parsedBodyWithCompleteSubscription)).to.be.rejectedWith('Inscription refusée: la date de naissance est invalide.');
    });

    it('rejects subscription if the birthdate is not a date with format yyyy-mm-dd', async function() { 
      parsedBodyWithCompleteSubscription.birthDate = '1234567';    
      await expect(subscriber.validateSubscription(parsedBodyWithCompleteSubscription)).to.be.rejectedWith('Inscription refusée: la date de naissance est invalide.');

      parsedBodyWithCompleteSubscription.birthDate = '1990-27-04';    
      await expect(subscriber.validateSubscription(parsedBodyWithCompleteSubscription)).to.be.rejectedWith('Inscription refusée: la date de naissance est invalide.');

      parsedBodyWithCompleteSubscription.birthDate = '27-04-1990';    
      await expect(subscriber.validateSubscription(parsedBodyWithCompleteSubscription)).to.be.rejectedWith('Inscription refusée: la date de naissance est invalide.');

      parsedBodyWithCompleteSubscription.birthDate = '27-04-90';    
      await expect(subscriber.validateSubscription(parsedBodyWithCompleteSubscription)).to.be.rejectedWith('Inscription refusée: la date de naissance est invalide.');
    });

    it('rejects subscription if the address is missing', async function() { 
      await delete parsedBodyWithCompleteSubscription.address;    
      await expect(subscriber.validateSubscription(parsedBodyWithCompleteSubscription)).to.be.rejectedWith('Inscription refusée: l\'addresse est manquante.');
    });

    it('rejects subscription if the postal code is missing', async function() { 
      await delete parsedBodyWithCompleteSubscription.postalCode;    
      await expect(subscriber.validateSubscription(parsedBodyWithCompleteSubscription)).to.be.rejectedWith('Inscription refusée: le code postal est invalid.');
    });

    it('rejects subscription if the postal code is missing', async function() { 
      await delete parsedBodyWithCompleteSubscription.postalCode;    
      await expect(subscriber.validateSubscription(parsedBodyWithCompleteSubscription)).to.be.rejectedWith('Inscription refusée: le code postal est invalid.');
    });

    it('rejects subscription if the postal code is not with the right format (5 numbers)', async function() { 
      parsedBodyWithCompleteSubscription.postalCode = 'postalCodeWithLetters123';    
      await expect(subscriber.validateSubscription(parsedBodyWithCompleteSubscription)).to.be.rejectedWith('Inscription refusée: le code postal est invalid.');
      
      parsedBodyWithCompleteSubscription.postalCode = '123456';    
      await expect(subscriber.validateSubscription(parsedBodyWithCompleteSubscription)).to.be.rejectedWith('Inscription refusée: le code postal est invalid.');
    });

    it('rejects subscription if the city is missing', async function() { 
      await delete parsedBodyWithCompleteSubscription.city;    
      await expect(subscriber.validateSubscription(parsedBodyWithCompleteSubscription)).to.be.rejectedWith('Inscription refusée: la ville est manquante.');
    });
  })
})