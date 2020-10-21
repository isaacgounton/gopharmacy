var express = require("express");
var router  = express.Router();
var Product = require("../models/product");
var middleware = require("../middleware");


//INDEX - show all products
router.get("/", function(req, res){
    // Get all products from DB
    Product.find({}, function(err, allProducts){
       if(err){
           console.log(err);
       } else {
          res.render("products/index",{products: allProducts});
       }
    });
});

//CREATE - add new product to DB
router.post("/", middleware.isLoggedIn, function(req, res){
    // get data from form and add to products array
    var title = req.body.title;
    var image = req.body.image;
    var desc = req.body.desc;
    var price = req.body.price;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newProduct = {title: title, image: image, desc: desc, price: price, author: author}
    
    // Create a new product and save to DB
    Product.create(newProduct, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to products page
            console.log(newlyCreated);
            res.redirect("/products");
        }
    });
});

//NEW - show form to create new product
router.get("/new", middleware.isLoggedIn, function(req, res){
   res.render("products/new"); 
});

// SHOW - shows more info about one product
router.get("/:id", function(req, res){
    //find the product with provided ID
    Product.findById(req.params.id).exec(function(err, foundProduct){
        if(err){
            console.log(err);
        } else {
            console.log(foundProduct)
            //render show template with that product
            res.render("products/show", {product: foundProduct});
        }
    });
});

// EDIT PRODUCT ROUTE
router.get("/:id/edit", middleware.checkProductOwnership, function(req, res){
    Product.findById(req.params.id, function(err, foundProduct){
        res.render("products/edit", {product: foundProduct});
    });
});

// UPDATE PRODUCT ROUTE
router.put("/:id",middleware.checkProductOwnership, function(req, res){
    // find and update the correct product
    Product.findByIdAndUpdate(req.params.id, req.body.product, function(err, updatedProduct){
       if(err){
           res.redirect("/products");
       } else {
           //redirect somewhere(show page)
           res.redirect("/products/" + req.params.id);
       }
    });
});

// DESTROY PRODUCT ROUTE
router.delete("/:id",middleware.checkProductOwnership, function(req, res){
   Product.findByIdAndRemove(req.params.id, function(err){
      if(err){
          res.redirect("/products");
      } else {
          res.redirect("/products");
      }
   });
});


module.exports = router;

