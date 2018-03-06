var mongoose = require ("mongoose");
var Product = mongoose.model ("Product");
exports.getAllProduct = function (req, res, next){
    var format = req.params.formatType;
    Product.find({}, function (err, products){
        if (!products) {
            res.send ("Something wrong!");
        } else {
            if (format.toLowerCase() == "xml") {
                XMLDisplay (products, res);
            } else {
                res.json(products);
            }
        }
    });
};
exports.getProductByName = function (req, res, next) {
    var format = req.params.formatType;
    var productName = req.params.name;
    Product.find({Name: productName}, function (err, products){
        if (!products){
            res.send ("Could not find product:", productName);
        } else {
            if (format.toLowerCase() == "xml") {
                XMLDisplay (products, res);
            } else {
                res.json(products);
            }
        }
        
    })
};
exports.getProductByRange = function (req, res,next){
    var format = req.params.formatType;
    var minPrice = parseInt(req.params.minP);
    var maxPrice = parseInt(req.params.maxP);
    Product.find({$and: [{Price: {$gte: minPrice}}, {Price: {$lte: maxPrice}}]}, function (err, products){
        if (!products){
            res.send ("Could not find product in your price range!");
        } else {
            if (format.toLowerCase() == "xml") {
                XMLDisplay (products, res);
            } else {
                res.json(products);
            }
        }
    })
}

function XMLDisplay(products, res){
    var XMLproducts = "<?xml version='1.0'?>\n <Products>\n";
    for (var i=0; i< products.length; i++){
        XMLproducts += "<Product id= '"+ products[i]._id +"'>\n" +
                    "<Category>" +products[i].Category + "</Category>\n" +
                    "<Name>" + products[i].Name + "</Name>\n" + 
                    "<Description>" + products[i].Description + "</Description>\n" +
                    "<Price>" + products[i].Price + "</Price>\n" +
                    "<AvailableQuantity>" + products[i].Quantity + "</AvailableQuantity>\n" +
                    "</Product>\n";
    }
    XMLproducts += "</Products>";

    
    res.header("Content-Type", "text/xml");
    res.send(XMLproducts);
}
