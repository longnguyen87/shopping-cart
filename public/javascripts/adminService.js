app.factory("adminService", ["$http", "productService", function ($http, productService){
    return {
        displayproduct: function ($scope){
            productService.getProduct($scope);
            $scope.adminProductTbl = true;
            $scope.adminOrderTbl = false;
            $scope.adminUserTbl = false;
            $scope.adminViewUserOrderTbl = false;
            $scope.adminAddProductTbl = false;
        }, 
        displayOrder : function ($scope){
            $http.get ("/orders").success(function(data, status, headers, config){
                $scope.orders = data;
                $scope.column = "timestamp";
            }).error (function (data, status, headers, config){
                console.log( "Failure", data);
                $scope.content = "/error.html";
                $scope.orders = [];
            });
            $scope.adminProductTbl = false;
            $scope.adminOrderTbl = true;
            $scope.adminUserTbl = false;
            $scope.adminViewUserOrderTbl = false;
            $scope.adminAddProductTbl = false;
        },
        displayUser : function ($scope){
            $http.get("/users").success(function(data, status, headers, config){
                $scope.users = data;
                $scope.column = "userName";
            }).error (function (data, status, headers, config){
                console.log( "Failure", data);
                $scope.content = "/error.html";
                $scope.users = [];
            });
            $scope.adminProductTbl = false;
            $scope.adminOrderTbl = false;
            $scope.adminUserTbl = true;
            $scope.adminViewUserOrderTbl = false;
            $scope.adminAddProductTbl = false;
        },
        showAddProductTbl : function ($scope){
            $scope.adminProductTbl = false;
            $scope.adminOrderTbl = false;
            $scope.adminUserTbl = false;
            $scope.adminAddProductTbl = true;
            $scope.adminViewUserOrderTbl = false;
        },
        viewUserOrder: function ($scope, user){
            $scope.userView = user;
            console.log("User:",user);
            console.log ("XXXXXXXXXXXXXXX:", user.PastOrders);
            $scope.userView.orderDetail =[];
            for (var i=0; i<user.PastOrders.length; i++){
                
                order = user.PastOrders[i];
                $http.post("/findOrder", {orderNumber:order })
                .success(function (data, status, headers, config){
                    console.log("Success getting order information", data);
                    $scope.userView.orderDetail.push(data);
                }).error (function(data, status, headers, config){
                    console.log("Something wrong");
                    $scope.Error = data.Error;
                    $scope.content = "/error.html";
                })
            }
            $scope.column = "_id";
            $scope.adminProductTbl = false;
            $scope.adminOrderTbl = false;
            $scope.adminUserTbl = false;
            $scope.adminAddProductTbl = false;
            $scope.adminViewUserOrderTbl = true;
        },
        updateOrder: function ($scope, order ){
            // update order from admin
            console.log("call update order from admin", order);
            $http.post ("/AdminUpdateOrder", {order})
            .success(function (data, status, headers, config){
                console.log("Success updating order", data);
                order.disabled = !order.disabled;
                $scope.viewUser($scope.userView);
            }).error (function(data, status, headers, config){
                console.log("Something wrong");
                $scope.Error = data.Error;
                $scope.content = "/error.html";
            })
        },
        deleteOrder: function ($scope, order){
            console.log("Delete order", order);
            $http.post("/AdminDeleteOrder", {order})
            .success(function (data, status, headers, config){
                console.log("Success updating order", data);
                $scope.displayOrder();
            }).error (function(data, status, headers, config){
                console.log("Something wrong");
                $scope.Error = data.Error;
                $scope.content = "/error.html";
            })
        }
    }
    
}]);