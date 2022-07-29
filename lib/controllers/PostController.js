const Post = require('./../models/PostModel');

exports.addNewPost = (req,res) => {
  let newPost = new Post(req.body);

  newPost.save((err, post) => {
    if (err) {
      res.send(err);
    }

    res.redirect('/posts');
  });
};

exports.getPostList = (req, res) => {
  Post.find({}, (err, posts) => {
    if(err) {
      res.send(err);
    }

    res.render('getPostList.ejs', {
      posts: posts,
      session: req.session
    });
  })
};

exports.getPostWithId = (req, res) => {
  Post.findById(req.params.postId, (err, post) => {
    if (err) {
      res.send(err)
    }

    res.json(post);
  });
};

exports.updatePost = (req, res) => {
  Post.findOneAndUpdate({ _id: req.params.postId }, req.body, { new: true }, (err, post) => {
    if (err) {
      res.send(err)
    }

    res.redirect('/posts');
  });
};

exports.deletePost = (req, res) => {
  Post.findOneAndDelete({ _id: req.params.postId }, {}, (err, post) => {
    if (err) {
      res.send(err)
    }

    res.redirect('/posts');
  });
};

exports.incrementLoveIts = (req, res) => {
  Post.findById(req.params.postId, (err, post) => {
    if (err) {
      res.send(err)
    }
    
    if (post) {
      ++post.loveIts;

      post.save((err, post) => {
        if (err) {
          res.send(err);
        }
        
        res.redirect('/posts');
      });
    }
  });
};

exports.decrementLoveIts = (req, res) => {
  Post.findById(req.params.postId, (err, post) => {
    if (err) {
      res.send(err)
    }

    --post.loveIts;

    post.save((err, post) => {
      if (err) {
        res.send(err);
      }

      res.redirect('/posts');
    });
  });
};

exports.renderPostForm = (req, res) => {
  res.render('getPostForm.ejs', {session: req.session});
}

exports.renderModificationPostForm = (req, res) => {
  Post.findById(req.params.postId, (err, post) => {
    if (err) {
      res.send(err)
    } else {
      res.render('getPostForm.ejs', {
        post: post,
        session: req.session
      });
    }
  });
}