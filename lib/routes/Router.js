const PostController = require('../controllers/PostController');
const HomeController = require('../controllers/HomeController');
const IMCController = require('../controllers/IMCController');
const ExchangeRateController = require('../controllers/ExchangeRateController');
const UserController = require('../controllers/UserController');

exports.defineRoutes = (app) => {
  // HomeController
  app.get('/', (req, res) => {
    HomeController.renderHomePage(req, res);
  });
  
  // PostController
  app.route('/posts')
  .all(isAuthenticated)
  .get((req, res) => {
    PostController.getPostList(req, res);
  })
  .post((req, res) => {
    PostController.addNewPost(req, res);
  });

  app.route('/posts/:postId')
  .all(isAuthenticated)
  .get((req, res) => {
    PostController.getPostWithId(req, res);
  })
  .put((req, res) => {
    PostController.updatePost(req, res);
  })
  .delete((req, res) => {
    PostController.deletePost(req, res);
  });

  app.get(
    '/posts/incrementLoveIts/:postId', isAuthenticated,
    (req, res) => {
      PostController.incrementLoveIts(req, res);
    }
  );

  app.get(
    '/posts/decrementLoveIts/:postId', isAuthenticated,
    (req, res) => {
      PostController.decrementLoveIts(req, res);
    }
  );

  app.get(
    '/nouveauPost', isAuthenticated,
    (req, res) => {
      PostController.renderPostForm(req, res);
    }
  );

  app.route('/posts/update/:postId')
  .all(isAuthenticated)
  .get((req, res) => {
    PostController.renderModificationPostForm(req, res);
  })
  .post((req, res) => {
    PostController.updatePost(req, res);
  });

  app.get(
    '/posts/delete/:postId', isAuthenticated,
    (req, res) => {
      PostController.deletePost(req, res);
    }
  );

  // IMCController
  app.route('/calculIMC')
  .all(isAuthenticated)
  .get((req, res) => {
    IMCController.renderIMCForm(req, res);
  })
  .post((req, res) => {
    IMCController.renderIMCResults(req, res);
  });

  // ExchangeRateController
  app.route('/convertirDevises')
  .all(isAuthenticated)
  .get((req, res) => {
    ExchangeRateController.getExchangeRateForm(req, res);
  })
  .post((req, res) => {
    ExchangeRateController.getExchangeRateResults(req, res);
  });

  // UserController
  app.route('/inscription')
  .get((req, res) => {
    UserController.renderSubscriptionForm(req, res);
  })
  .post((req, res) => {
    UserController.subscribe(req, res);
  });

  app.route('/login')
  .get((req, res) => {
    UserController.renderLoginForm(req, res);
  })
  .post((req, res) => {
    UserController.connect(req, res);
  });

  app.get('/logout', (req, res) => {
    UserController.logout(req,res);
  });  
  
  function isAuthenticated(req, res, next) {
    if (req.session.username) {
      next();
    } else {
      res.redirect('/login');
    } 
  };
};
