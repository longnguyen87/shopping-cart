var express = require ('express');
var router = express.Router();
var user = require("./userController");
var productController = require ("./productController");
var order = require("./orderController");
var rest = require("./rest");
router.get("/", function (req,res,next){
    res.render ("main");
});

router.post("/login", user.login);
router.post("/signup", user.signup);
router.get("/userInfor",user.userInfor);
router.post("/updateUser", user.updateUser); // use to update user
router.get("/products", productController.getProducts);
router.get ("/signout", function (req, res, next){
    res.render("main");
});
router.post ("/submitOrder", order.addOrder);
router.post("/findOrder", order.getOrder);
router.post ("/updateProduct", productController.updateProduct);
router.get ("/orders", order.getOrders);
router.get("/users", user.getUsers);
router.post("/AdminUpdateOrder",order.updateOrder);
router.post("/AdminDeleteProduct", productController.deleteProduct);
router.post("/AdminAddProduct", productController.addProduct);
router.post("/AdminDeleteOrder", order.deleteOrder);

// REST API
router.get("/REST/allproduct/format/:formatType", rest.getAllProduct);
router.get("/REST/product/format/:formatType/name/:name", rest.getProductByName);
router.get("/REST/product/format/:formatType/min/:minP/max/:maxP", rest.getProductByRange);
module.exports = router;