var express = require('express');
var router = express.Router();
var Product = require('../models/product.js');
var Charge = require('../models/charge.js');

var templateProps = { title: 'School of Knife Throwing' };

router.get('/', function(req, res, next) {
  if (req.session && req.session.userid) {
    templateProps.email = req.session.email;
    Product.find({}, 'name description amount', function(err, products) {
      templateProps.products = products;
      Charge.find({ user: req.session.userid }).populate('product')
      .exec(function(err, charges) {
        templateProps.charges = charges;
        res.render('account', templateProps);
      });
    });
  }
  else {
    res.render('signup', templateProps);
  }
});

router.get('/login', function(req, res, next) {
  if (req.session && req.session.userid) { return res.redirect('/'); }
  res.render('login', templateProps);
});

router.get('/logout', function(req, res, next) {
  req.session.destroy();
  res.render('login', templateProps);
})

router.post('/purchase', function(req, res, next) {
  Product.findById(req.body._id, function(err, product) {
    if (!err && product) {
      product.purchase(req.body.stripeToken, req.session.userid, function(err, charge){
        if (err) { templateProps.message = err.message; }
        else { templateProps.message = 'Purchased! We\'ll email you the PDF shortly'; }
        res.render('account', templateProps);
      });
    }
  });
});

module.exports = router;
