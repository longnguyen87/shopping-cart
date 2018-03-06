app.factory("productService", ["$http", function($http){
    return {
        getProduct: function ($scope){
            $http.get ("/products").success(function(data, status, headers, config){
                $scope.products = data;
            }).error (function (data, status, headers, config){
                $scope.products = [];
            });            
        },
        // admin function: update 1 particular product
        updateProduct: function ($scope, product){
            $http.post("/updateProduct",{product}).success (function (data, status, headers, config){
                if (data.hasOwnProperty ("Error")){
                    $scope.Error = data.Error;
                    alert (data.Error);
                } else {
                    product.disabled = ! product.disabled;
                    console.log("Success", data);
                }

            }).error (function (data, status, headers, config){
                console.log("Failure", data);

            })
        }, 
        addProduct : function ($scope){
            //admin function add product
        
            $http.post("/AdminAddProduct", {Category: $scope.productCategory,
                                            Name: $scope.productName,
                                            Description: $scope.productDescription,
                                            Price: $scope.productPrice,
                                            Quantity: $scope.productQuantity })
            .success(function (data, status, headers, config){
                console.log("Success adding product information", data);
                $scope.displayproduct();
            }).error (function(data, status, headers, config){
                console.log("Something wrong");
                $scope.Error = data.Error;
                $scope.content = "/error.html";
            })
        },
        deleteProduct: function ($scope, product){
            console.log(" Delete Product Testing", product);
            $http.post("/AdminDeleteProduct", {product})
            .success(function (data, status, headers, config){
                console.log("Success Delete product", data);
                $scope.displayproduct();
            }).error (function(data, status, headers, config){
                console.log("Something wrong");
                $scope.Error = data.Error;
                $scope.content = "/error.html";
            })
        }
    };
}]); 

