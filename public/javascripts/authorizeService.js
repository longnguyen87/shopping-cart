app.factory("authorizeService", ["$http", "productService", function($http, productService){
    function cleanUp ($scope) {
        $scope.user = [];
        $scope.password = [];
        $scope.confirmPass = [];
        $scope.orderCache = [];
        $scope.products = [];
        $scope.showAccount = false;
        $scope.displayTable = false;
        $scope.displayNotification = false;
        $scope.cartTotal = 0;
        $scope.hideShoppingButton = true;
        $scope.adminProductTbl = false;
        $scope.adminOrderTbl = false;
        $scope.adminUserTbl = false;
        $scope.adminAddProductTbl = false;
        $scope.userAccountBtn = false;

    }
    return {
        login: function ($scope){
            $http.post("/login", {userName: $scope.userName, password: $scope.password}).
                success(function(data, status, headers, config){
                    // if success, and display page for either normal user or admin
                    // check the data returned.
                    console.log("Login from authorize service was called");
                    if (data.hasOwnProperty("Error")){
                        //display error page
                        $scope.Error = data.Error;
                        $scope.content ="/error.html";
                    } else {
                        $scope.showAccount = true;
                        $scope.user = data;
                        for (var i=0; i<$scope.user.ItemsInCart.length; i++){
                            // go through ItemsInCart list -- sum all items in the list
                            $scope.cartTotal += $scope.user.ItemsInCart[i].Quantity;
                            console.log("Increase cartTotal", $scope.cartTotal);
                        }
                        // displayProducts();
                        productService.getProduct($scope);
                        $scope.logout ="Logout";
                        if (data.Role =="Admin") {
                            $scope.content ="/adminPage.html";
                        } else {
                            $scope.userAccountBtn = true;
                            $scope.hideShoppingButton = false;
                            $scope.column = "Name";
                            $scope.reverse = false;
                            $scope.content = "/products.html";
                        }
                    }
                }).error (function (data, status, headers, config){
                    $scope.Error = "Could not get to server";
                    $scope.content ="/error.html";  
                })
            },
        logout: function ($scope){
            if ($scope.user.ItemsInCart.length >0) {
                // save this to server before logout
                $http.post("/updateUser", {user: $scope.user}).success(function(data, status, headers, config){
                    console.log("Successfully save itemsIncart to user database", data);
                }).error (function(data, status,header, config){
                    console.log("Something wrong", data);
                })
            }
            $http.get ("/signout").success(function(data, status, headers, config){
                $scope.content = "/login.html";
                cleanUp($scope);
            }).error (function (data, status, headers, config){
                $scope.Error = "Could not get to server";
                $scope.content ="/error.html"; 
            });
        },
        register: function ($scope){
            if ($scope.password == $scope.confirmPass) {
                $http.post("/signup", {userName: $scope.userName, email: $scope.email, password: $scope.password})
                .success(function(data, status, headers, config) {
                    $scope.logout ="Logout";
                    $scope.showAccount = true;
                    productService.getProduct($scope);
                    // initalize user
                    $scope.user = {userName: $scope.userName, Email: $scope.email, 
                                    ItemsInCart: [], PastOrders: [], Role: "Normal" };
                    $scope.hideShoppingButton = false;
                    $scope.column = "Name";
                    $scope.reverse = false;
                    $scope.content = "/products.html";                                
                    $scope.content = "/products.html";
                }).error (function(data, status, headers, config){
                    $scope.Error = "Could not get to server";
                    $scope.content ="/error.html"; 
                });
            } else {
                $scope.Error = "Password entered did not match";
                $scope.content ="/error.html"; 
            }
        }
    }
    
}]);