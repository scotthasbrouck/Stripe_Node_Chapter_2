var express = require('express');
var router = express.Router();
var Product = require('../models/product.js');

var templateProps = { title: 'School of Knife Throwing' };

router.get('/', function(req, res, next) {
  if (req.session && req.session.userid) {
  	templateProps.email = req.session.email;
    Product.find({}, function(err, products) {
        console.log(products.length);
      templateProps.products = products;
      return res.render('account', templateProps);
    });
  }
  res.render('signup', templateProps);
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
  Product.findById(req.body.id, function(err, product) {
    product.purchase(req.body.token, function(err, charge){
      if (err) { res.send(500, err); }
      res.send(204, charge);
    });
  });
});

module.exports = router;
