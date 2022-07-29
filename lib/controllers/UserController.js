const bcrypt = require("bcrypt");

const User = require('./../models/UserModel');

class UserController {
  constructor () {}

  async subscribe(req, res) {
    let subscriptionResult = {};
    
    try {
      await this.validateSubscription(req.body);
      
      try {
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(req.body.password, salt);
        let newUser = new User(req.body);
        newUser.password = hashedPassword;
        
        newUser.save((err, user) => {
          if (err) {
            res.render(
              'subscriptionForm.ejs',
              { 
                alert: {
                  status: 'danger',
                  message: 'erreur lors de l\'inscription'
                } 
              }
            )
          } else {
            res.redirect('/');
          }
        });
      } catch(err) {
        res.render(
          'subscriptionForm.ejs',
          { 
            alert: {
              status: 'danger',
              message: 'erreur lors de l\'inscription'
            } 
          }
        )
      }
    } catch (error) {
      subscriptionResult.valid = false;
      subscriptionResult.message = error;
      this.renderSubscriptionForm(req, res, subscriptionResult);
    }  
  }

  async renderSubscriptionForm(req, res, subscriptionResult = {}) {
    return res.render(
      'subscriptionForm.ejs',
      {
        parsedBody: req.body,
        subscriptionResult: subscriptionResult,
        session: req.session
      }
    );
  }

  async validateSubscription(parsedBody) {
    if (!parsedBody.firstname) {
      throw('Inscription refusée: le prénom est manquant.');
    }
    
    if (!parsedBody.lastname) {
      throw('Inscription refusée: le nom de famille est manquant.');
    }
    
    if (!parsedBody.email || ! await this.isEmailValid(parsedBody.email)) {
      throw('Inscription refusée: l\'adresse email est invalide.');
    }
    
    if (!parsedBody.password || ! await this.isPasswordValid(parsedBody.password)) {
      throw('Inscription refusée: le mot de passe est invalide.');
    }

    if (!parsedBody.confirmedPassword || parsedBody.confirmedPassword !== parsedBody.password) {
      throw('Inscription refusée: les mots de passe ne correspondent pas.');
    }

    if(!parsedBody.birthDate || ! await this.isDateValid(parsedBody.birthDate)) {
      throw('Inscription refusée: la date de naissance est invalide.');
    }

    if (!parsedBody.address) {
      throw('Inscription refusée: l\'addresse est manquante.');
    }

    if (!parsedBody.postalCode || !await this.isPostalCodeValid(parsedBody.postalCode)) {
      throw('Inscription refusée: le code postal est invalid.');
    }

    if (!parsedBody.city) {
      throw('Inscription refusée: la ville est manquante.');
    }
  }

  async isEmailValid(emailAddress) {
    // RFC5321 and 5322 valid email format acccording to
    // https://stackoverflow.com/questions/13992403/regex-validation-of-email-addresses-according-to-rfc5321-rfc5322
    const regexEmailFormat = /([!#-'*+\/-9=?A-Z^-~-]+(\.[!#-'*+\/-9=?A-Z^-~-]+)*|"([]!#-[^-~ \t]|(\\[\t -~]))+")@([!#-'*+\/-9=?A-Z^-~-]+(\.[!#-'*+\/-9=?A-Z^-~-]+)*|\[[\t -Z^-~]*])/;
    
    let match = emailAddress.match(regexEmailFormat);
    return (match && match.index === 0) ? true : false;
  }

  async isPasswordValid(emailAddress) {
    // Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character
    // https://stackoverflow.com/questions/19605150/regex-for-password-must-contain-at-least-eight-characters-at-least-one-number-a
    const regexPasswordFormat = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&\]\[])[A-Za-z\d@$!%*?\]\[&]{8,}$/;
    
    let match = emailAddress.match(regexPasswordFormat);
    return (match && match.index === 0) ? true : false;
  }

  async isDateValid(dateString) {
    const regexDateFormat = /^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/;
  
    if (dateString.match(regexDateFormat) === null) {
      return false;
    }
  
    const date = new Date(dateString);
  
    const timestamp = date.getTime();
  
    if (typeof timestamp !== 'number' || Number.isNaN(timestamp)) {
      return false;
    }
  
    return date.toISOString().startsWith(dateString);
  }

  async isPostalCodeValid(postalCode) {
    const regexCodePostalFormat = /^[0-9]{5,5}$/;
    
    let match = postalCode.match(regexCodePostalFormat);
    return (match && match.index === 0) ? true : false;
  }
  async renderLoginForm(req, res) {
    res.render(
        'login.ejs',
        { session: req.session }
    )
  }
  async connect(req, res) {      
    User.findOne({ email: req.body.email }, (err, user) => {
      if(err || user === null) {
        res.render(
          'login.ejs',
          {
            alert: {
              status: 'danger',
              message: 'Connection impossible'
            },
            session: req.session
          }
        );
      } else {
        let match = bcrypt.compareSync(req.body.password, user.password);
        if (match) {
          req.session.username = user.firstname + ' ' + user.lastname;
          // regenerate the session, which is good practice to help
          // guard against forms of session fixation
          req.session.regenerate(function (err) {
            if (err) next(err)
            
            // store user information in session, typically a user id
            req.session.username = user.firstname + ' ' + user.lastname;

            // save the session before redirection to ensure page
            // load does not happen before session is saved
            req.session.save(function (err) {
              if (err) return next(err)
              res.redirect('/')
            })
          })
        } else {
          res.render(
            'login.ejs',
            {
              alert: {
                status: 'danger',
                message: 'Connection impossible'
              },
              session: req.session
            }
          );
        }
      }
      
    });
  }

  async logout(req, res) {
    // clear the user from the session object and save.
    // this will ensure that re-using the old session id
    // does not have a logged in user
    req.session.username = null
    req.session.save(function (err) {
      if (err) next(err)

      // regenerate the session, which is good practice to help
      // guard against forms of session fixation
      req.session.regenerate(function (err) {
        if (err) next(err)
        res.redirect('/')
      })
    })
  }
}
  
module.exports = new UserController();