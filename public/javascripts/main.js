var app = angular.module('myApp', []);
app.controller("shoppingController",["$scope", "$http", "$window", "service", 
                function ($scope, $http, $window, service){
    function initialClientJS (){
        $scope.logout = ""
        $scope.content = "/login.html";
        $scope.showAccount = false; // use to show button after user login
        $scope.displayTable = false; // use to display order detail for user
        $scope.displayNotification = false; // use to display notification if no order from user.
        $scope.hideShoppingButton = true;
        $scope.adminProductTbl = false;
        $scope.adminOrderTbl = false;
        $scope.adminUserTbl = false;
        $scope.adminViewUserOrderTbl = false;
        $scope.adminAddProductTbl = false;
        $scope.userAccountBtn = false;
        // orderCache is used to store order information related to pastOrder from normal user
        // when user request to view a past order - will check order from orderCache
        // if order is not found, request order information from server, and store it in orderCache
        $scope.cartTotal = 0;
        $scope.orderCache = [{
            orderID: ""    ,
            orderDetail: {}
        }]
    }
    initialClientJS ();
    $scope.logoutSubmit = function (){
        service.logout($scope);        
    }
    // define login function
    $scope.login = function (){
        service.login ($scope)
    }
    $scope.register = function (){
        $scope.content = "/signup.html";
    } 
    // cancel register
    $scope.cancelRegister = function () {
        $scope.content = "/login.html";
    }
    $scope.registerSubmit = function(){
        service.register($scope)
    }
    $scope.addToCart = function (product){
        if (product.Quantity ==0) {
            product.outOfStock = true;
        } else {
            $scope.cartTotal +=1;
            for (var i=0; i< $scope.user.ItemsInCart.length;i++){
                var item = $scope.user.ItemsInCart[i];
                // if product.id matched with item in cart, increase Quantity
                if (product._id == item.product._id) {
                    $scope.user.ItemsInCart[i].Quantity +=1;
                    break;
                } 
            }
            if (i== $scope.user.ItemsInCart.length){
                // add product into cart

                $scope.user.ItemsInCart.push ({product: {_id: product._id,
                                                         Category: product.Category,
                                                         Name: product.Name,
                                                         Description: product.Description,
                                                         Price: product.Price}, Quantity: 1});
            }
            product.Quantity -=1;
        }
        
    }
    $scope.setContent = function (page){
        if (page =="cart.html") {
            cartTotal();
        }
        $scope.content = "/" + page;
        
    }
    function cartTotal(){
        $scope.total = 0;
        for (var i= 0; i< $scope.user.ItemsInCart.length; i++){
            var item = $scope.user.ItemsInCart[i];
            $scope.total += item.product.Price * item.Quantity;            
        }
    }
    $scope.Sort = function (column){
        console.log ("Sorting Called", column);
        $scope.column = column;
        $scope.reverse = !$scope.reverse;
    }
    $scope.removeItem = function (removedItem){
        // use to remove items from Cart.html
        $scope.cartTotal -=1;
        for (var i=0; i< $scope.user.ItemsInCart.length; i++){
            var item = $scope.user.ItemsInCart[i];
            if (removedItem == item){
                if (item.Quantity ==1) { // remove this item from cart
                    $scope.user.ItemsInCart.splice(i,1);
                    console.log ("Remaining item in cart", $scope.user.ItemsInCart);
                } else { // reduce Quantity by 1
                    item.Quantity -=1
                    console.log ("Updated Quantity", $scope.user.ItemsInCart[i]);
                    console.log ("Quantity in temp item", item.Quantity);
                }
                cartTotal(); // called to update total price
                break;
            } 
        }
    }
    $scope.submitOrder = function (){
        // send ItemsInCart to server
        $http.post("/submitOrder", {user: $scope.user, orderTotal: $scope.total}).success(function(data,status,headers, config){
            console.log ("Sever successfully received order", data);
            if (data.hasOwnProperty("Error")){
                $scope.Error = data.Error;
                $scope.content ="/error.html"; 
            } else {
                // display order confirmation page & update user
                $scope.cartTotal = 0;
                $scope.orderResult = data.Result;
                $http.get("/userInfor").success(function(data,status,headers, config){
                    $scope.user = data;
                }).error(function(data, status, headers, config){
                    $scope.Error = data.Error;
                    $scope.content ="/error.html";
                })
                $scope.content = "/confirmation.html";
            }
        }).error (function(data, status, headers, config){
            console.log ("Could not get to server");
        })
    }
    $scope.displayAccount = function (){
        if ($scope.user.Role =="Admin") {
            $scope.content = "/adminPage.html";
        } else {
            $scope.content = "/userProfile.html"
            //initialize order information to display for normal user
            if ($scope.user.PastOrders.length>0) {
                $scope.displayTable = true;
                $scope.displayNotification = false;
                var lastOrder = $scope.user.PastOrders[$scope.user.PastOrders.length -1];
                console.log("Last order:", lastOrder);
                getOrder(lastOrder);
            } else {
                $scope.displayTable = false;
                $scope.displayNotification = true;
            }
        }
    }
    $scope.displayOrder = getOrder;
    
    function getOrder  (order){
        console.log("Call display order", order);
        for (var i= 0; i< $scope.orderCache.length; i++){
            if (order == $scope.orderCache[i].orderID) {
                console.log("Found matching order in cache");
                $scope.orderDetail = $scope.orderCache[i].orderDetail;
                break;
            }
        }
        if (i== $scope.orderCache.length){
            // can't find order in orderCache
            console.log("call get order from server");
            $http.post("/findOrder", {orderNumber: order})
            .success(function (data, status, headers, config){
            $scope.orderDetail = data;
            $scope.orderCache.push({orderID: order, orderDetail: data});
            var item = $scope.orderDetail.items[0];

        }).error (function(data, status, headers, config){
            console.log("Something wrong");
            $scope.Error = data.Error;
            $scope.content = "/error.html";
        })
        }
    }
    $scope.displayproduct= function (){
        service.displayproduct($scope);
    }; 
    // admin function
    $scope.updateProduct = function (product){
        service.updateProduct($scope, product);
    };
    $scope.addProduct = function (){
        service.addProduct ($scope);
    };
    $scope.showAddProductTbl = function (){
        service.showAddProductTbl($scope);
    };
    $scope.displayOrders = function (){
        service.displayOrder ($scope);
    };
    $scope.displayUser = function (){
        service.displayUser($scope);
    };
    $scope.viewUser = function (user){
        service.viewUserOrder ($scope, user);
    }
    $scope.updateOrder = function (order){
        service.updateOrder ($scope, order);
    }
    $scope.deleteProduct = function (product){
        service.deleteProduct ($scope, product);
    }
    $scope.deleteOrder = function (order) {
        service.deleteOrder ($scope, order);
    }
}]);