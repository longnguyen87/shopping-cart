var mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.Promise = global.Promise;
// define product Schema
var productSchema = new Schema ({
    Category: String,
    Name: String,
    Description: String,
    Price: Number,
    Quantity: Number
}, {collection: "Products"});
mongoose.model ("Product", productSchema);
// define item in Cart - which showed a product that had not yet purchased by user
var itemInCart = new Schema ({
    product: productSchema,
    Quantity: Number
},{_id: false});
mongoose.model("itemsInCart", itemInCart);
// define userSchema
var userSchema = new Schema ({
    userName : {type: String, unique: true},
    Email: String,
    Password: String,
    PastOrders: [String],
    ItemsInCart: [itemInCart],
    Role: String
}, {collection: "users"});
mongoose.model ("User", userSchema);

// define Order Schema
var orderSchema = new Schema ({
    items: [itemInCart],
    orderTotal: Number,
    userName: String,
    orderStatus: {type: String, default: "Pending"},
    timestamp: {type: Date, default: Date.now}
},{collection:'Orders'});
mongoose.model ("Order", orderSchema);
// define backOrder Schema
var backOrder = new Schema ({
    product: String,
    orderID : String,
    status: {type: String, default: 'Ordered'}, // status can have 2 stages: ordered, and complete
    orderQuan : Number
},{collection: "backOrder"});

backOrder.methods.orderComplete = function(){
    this.status ='Complete';
    this.orderQuan = 0;
}
mongoose.model ('BackOrder', backOrder);
