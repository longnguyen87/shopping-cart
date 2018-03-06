// this file is use to connect all other services
app.factory ("service", ["$http", "productService", "adminService","authorizeService",
    function($http, productService, adminService, authorizeService){
        return {
            login: function ($scope) {
                authorizeService.login($scope);
            },
            logout: function ($scope) {
                authorizeService.logout ($scope);
            },
            register: function ($scope) {
                authorizeService.register($scope);
            }, 
            displayproduct: function ($scope){
                adminService.displayproduct($scope);
            },
            // admin function
            displayOrder : function ($scope){
                adminService.displayOrder($scope);
            },
            // admin function
            displayUser: function ($scope){

            },
            updateProduct : function ($scope, product){
                productService.updateProduct ($scope, product );
            },
            addProduct : function ($scope){
                productService.addProduct ($scope);
            },
            showAddProductTbl : function ($scope){
                adminService.showAddProductTbl ($scope);
            },
            displayUser: function ($scope){
                adminService.displayUser ($scope);
            },
            viewUserOrder: function ($scope, user){
                adminService.viewUserOrder ($scope, user);
            },
            updateOrder: function ($scope, order){
                adminService.updateOrder ($scope, order);
            },
            deleteProduct: function ($scope, product) {
                productService.deleteProduct ($scope, product);
            }, 
            deleteOrder: function ($scope, order) {
                adminService.deleteOrder ($scope, order);
            }

        }
    }])