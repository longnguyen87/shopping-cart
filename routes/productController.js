// employee Schema using Mongoose
var mongoose = require ("mongoose");
var Product = mongoose.model ("Product");

// user function
exports.getProducts = function (req,res,next){
    Product.find({}, function (err, documents){
        if (err) throw err;
        res.json (documents);
    })
};

// admin functions
exports.orderUpdate = function (productID, orderQuantity, orderID){
    var query = Product.findOne ({_id:productID});
    query.exec (function(err, product){
        if (!product) {
            res.render ('error',{Error:"Product not found"});
        } else {
            if (product.Quantity>= orderQuantity){
                //reduce quantity by orderQuantity
                var newQuantity = product.Quantity - orderQuantity;
                product.set('Quantity', newQuantity);
                product.save (function(err){
                    if (err) throw err;
                    console.log ("Saving success");
                })
            } else {
                // does not have enough to fill order- create automatic backorder
                var orderQuan = orderQuantity - product.Quantity + 20; // order what need to fill customer order + 20 more
                var backOrder = mongoose.model('backOrder');
                var thisBackOrder = new backOrder({
                    product:product,
                    orderID: orderID,
                    status: 'Ordered',
                    orderQuan: orderQuan
                });
            }
        }
    })
};
exports.findProduct = function (productID, renderPage, res){
    var query = Product.findOne({_id: productID});
    query.exec (function (err, product){
        if (!product) {
            res.render ('error',{Error:"Product not found"});
        } else {
            res.render (renderPage, {result:product});
        }    
    });
};

exports.addProduct = function (req, res){
    var newProduct = new Product({
        Category: req.body.Category,
        Name: req.body.Name,
        Description: req.body.Description,
        Price: req.body.Price,
        Quantity: req.body.Quantity
    });
    newProduct.save(function (err){
        if (err) {
            console.log("Problem with saving product", req.body);
            res.json({Error:err});
        } else {
            console.log("Success saving product");
            res.json({Success: "Success"});
        }
    });
};
// code change on 2/25/2018: Admin Update
exports.updateProduct = function (req,res){
    var query = Product.findOne ({_id:req.body.product._id });
    query.exec (function(err, product){
        if (!product) {
            res.json ({Error:"Failed Look Up"});
        } else {
            var query = product.update({$set: {Category:req.body.product.Category,
                                   Name:req.body.product.Name,
                                   Description: req.body.product.Description,
                                   Price: req.body.product.Price,
                                   Quantity: req.body.product.Quantity }});
            query.exec(function(err, results){
                if (err) {
                    res.json({Error: "Failed Saved"});
                } else {
                    res.json({Success: "success!"})
                }
            });
        }
    });
};
exports.deleteProduct = function (req, res){
    console.log("Delete Product from server", req.body.product);
    var product = req.body.product;
    Product.remove({_id:product._id }, function (err, result){
        if (err) {
            console.log("Something wrong", err);
            res.json({Error: err});
        } else {
            console.log("Good, delete successful", result);
            res.json({Success: "Success"});
        }
    })
}

