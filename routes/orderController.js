var mongoose = require ("mongoose");
var Order = mongoose.model("Order");
var User = mongoose.model ("User");
var Product = mongoose.model ("Product");
// export function addOrder received from user
exports.addOrder = function (req, res, next){    
    var newOrder = new Order ({
        userName: req.body.user.userName,
        items: req.body.user.ItemsInCart,
        orderTotal: req.body.orderTotal
    });
    newOrder.save (function (err, orderResult){
        if (err) {
            res.json(500, {Error: "Failed to save order"});
            console.log("Failed to save order");
        } else {            
            User.update({userName: req.body.user.userName},
                {$set: {ItemsInCart: []},
                $push: {PastOrders:orderResult._id}})
                .exec (function (err, userResult){
                    if (err) {
                        res.json(404, {Error: "Failed to update user"});
                    } else {
                        // Update product table to reduce quantity sales
                        for (var i=0; i< req.body.user.ItemsInCart.length; i++){
                            var productInCart = req.body.user.ItemsInCart[i];
                            Product.update({_id: productInCart.product._id},
                                    {$inc: {Quantity:-productInCart.Quantity}})
                                    .exec (function (err, productResult){
                                        if (err) {
                                            console.log ("Having trouble with update product Quantity", err);
                                        } else {
                                            console.log("Successfully updated product collection");
                                        }   
                                    });
                        }
                        res.json ({Result: orderResult});
                    }
                });
            
        }
    });
};
exports.getOrder = function (req,res, next){
    Order.findOne({_id: req.body.orderNumber}, function (err, order){
        if (err){
            console.log("Could not find this order", err);
            res.json({Error: err});
        } else {
            res.json(order);
        }
    });
};
// get all orders
exports.getOrders = function (req,res,next){
    Order.find({}, function (err, orders){
        if (err) {
            res.json ({Error: err});
        } else {
            res.json(orders);
        }
    })
};
exports.updateOrder = function (req, res, next){
    console.log("Update order from server", req.body.order);
    var order = req.body.order;
    Order.update({_id: order._id },
        {$set: {orderTotal: order.orderTotal, orderStatus: order.orderStatus}})
        .exec (function (err, updateResult){
            if (err) {
                console.log("Error");
                res.json({Error: "Failed"});
            } else{
                console.log("Success");
                res.json({Success: "Success"});
            }
        });
};
exports.deleteOrder = function (req, res,next){
    console.log("Testing from server, Delete order", req.body.order);

    Order.remove({_id: req.body.order._id}, function (err, result){
        if (err){
            console.log("Failed to remove order", err);
            res.json ({Error: err});
        } else {
            console.log("Success delete order");
            User.findOne({userName: req.body.order.userName}, function(err, user){
                console.log("Find associated user for this order", user);
                var index = user.PastOrders.indexOf(req.body.order._id);
                if (index>-1){
                    user.PastOrders.splice(index,1);
                    User.update({userName: req.body.order.userName},
                        {$set:{PastOrders: user.PastOrders}}, function (err, result){
                            if (err){
                                console.log("Can't update user");
                                res.json ({Error: err});
                            } else {
                                res.json({Success: "Success removed an order from both order and user"});
                            }
                    });       
                } else {
                    console.log("Could not find this order from user");
                    res.json({Error: "Cound not find order in user"});
                }
            })
        }
    })
}