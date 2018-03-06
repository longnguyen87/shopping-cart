var crypto = require ("crypto");
var mongoose = require ("mongoose");
var User = mongoose.model ("User");
function hashPW (pwd) {
    return crypto.createHash ("sha256").update (pwd).digest ("base64").toString();
}
exports.login = function (req, res, next){
    User.findOne ({userName: req.body.userName}, function (err, document){
        if (!document){
            res.json ({Error: "UserName did not match"});
        } else if (document.Password == hashPW (req.body.password.toString())) {
            req.session.regenerate (function (){
                req.session.user = document._id;
                req.session.userRole = document.Role;
                req.session.userName = document.userName;
                var userInfor = {id: document._id,
                                Role: document.Role, 
                                userName: document.userName, 
                                ItemsInCart: document.ItemsInCart,
                                PastOrders: document.PastOrders}
                res.json (userInfor);
            });
        }else {
            res.json({Error: "password did not match"});
        }    
    });
};
exports.signup = function (req, res, next) {
    var user = new User({
        userName : req.body.userName,
        Email : req.body.email,
        Password : hashPW (req.body.password),
        PastOrders: [],
        ItemsInCart:[],
        Role: "Normal"
    });
    user.save(function (err){
        req.session.user = user.id;
        req.session.userRole = user.Role;
        req.session.userName = user.userName;
        console.log ("Successfully created this user!");
    });
    res.json("Success");
};
exports.userInfor = function (req, res, next){
    if (req.session.user){
        console.log("Session worked", req.session.userName);
        User.findOne ({userName: req.session.userName}, function (err, document){
            if (!document){
                console.log ("could not find this user");
                res.json ({Error: err});
            }else{
                var userInfor = {id: document._id, 
                    userName: document.userName, 
                    ItemsInCart: document.ItemsInCart,
                    PastOrders: document.PastOrders}
                res.json (userInfor);
            }
        });
    }else {
        console.log("Session did not work");
        res.json({Error:"Could not find this user"})
    }
}
exports.updateUser = function (req, res, next){
    User.update({userName: req.body.user.userName},
        {$set: {ItemsInCart: req.body.user.ItemsInCart}})
        .exec(function (err, result){
       if (err) {
           console.log("Something wrong", err);
           res.json({Error: err});
       } else {
           res.json({Message: "Successfully saving user"})
       }
    })
};
exports.getUsers = function (req, res, next){
    User.find({}, function (err, users){
        if (err) throw err;
        res.json (users);
    })
}
