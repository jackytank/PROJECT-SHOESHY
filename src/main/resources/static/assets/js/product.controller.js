app.controller("product-ctrl", productController);

app.filter('rangeFilter', function () {
    return function (items, attr, min, max) {
        var range = [],
            min = parseFloat(min),
            max = parseFloat(max);
        for (var i = 0, l = items.length; i < l; ++i) {
            var item = items[i];
            if (item[attr] <= max && item[attr] >= min) {
                range.push(item);
            }
        }
        return range;
    };
});

function productController($scope, $http, $interval) {
    $scope.loading = true;
    $scope.productList = [];
    $scope.categories = [];
    $scope.sub_categories = [];
    $scope.selectedColor = '';
    $scope.priceRange = 0;
    $scope.rangeUI = {
        min: 0,
        max: 2000000,
        step: 100000,
        value: 2000000
    };

    $scope.sortUI = [
        { code: 'price_asc', name: 'Giá (Tăng dần)' },
        { code: 'price_desc', name: 'Giá (Giảm dần)' },
        { code: 'date_newest', name: 'Mới nhất' },
        { code: 'sold_best_seller', name: 'Bán chạy nhất' },
    ];

    $scope.colorArr = [
        {
            "id": UID(), "name": "BLACK", "value": "Đen",
        },
        {
            "id": UID(), "name": "WHITE", "value": "Trắng",
        }
        ,
        {
            "id": UID(), "name": "YELLOW", "value": "Vàng",
        }
        ,
        {
            "id": UID(), "name": "BLUE", "value": "Xanh biển",
        },
        {
            "id": UID(), "name": "GREEN", "value": "Xanh lá cây",
        }
    ];
    $scope.priceRangeArr = [
        {
            "id": UID(), "name": "Dưới 100.000đ",
        },
        {
            "id": UID(), "name": "100.000đ - 200.000đ",
        }
        ,
        {
            "id": UID(), "name": "200.000đ - 300.000đ",
        }
        ,
        {
            "id": UID(), "name": "400.000đ - 500.000đ",
        }
        ,
        {
            "id": UID(), "name": "Trên 500.000đ",
        }
    ];

    // gọi 2 api khi trang web vừa load xong để lấy list products, categories 
    $scope.initialize = function () {
        $scope.getProductList();
        $scope.getCategoryList();
        $scope.getSubCategoryList();
    };

    $scope.getProductList = function () {
        $http.get('/rest/products').then(res => {
            $scope.productList = res.data;
        }).catch(error => { console.error(error); })
            .finally(function () {
                $scope.loading = false;
            });
    };

    $scope.getCategoryList = function () {
        $http.get('/rest/categories').then(res => {
            $scope.categories = res.data;
        }).catch(error => { console.error(error); });
    };

    $scope.getSubCategoryList = function () {
        $http.get('/rest/sub-categories').then(res => {
            $scope.sub_categories = res.data;
        }).catch(error => { console.error(error); });
    };

    // generate random ID ngẫu nhiên để set cho id và for cho 2 tag <input> và <label> ở ng-repeat màu sắc trong components/_aside.html
    function UID() {
        return Math.floor(Math.random() * Math.floor(Math.random() * Date.now()));
    }

    $scope.sortProducts = function (sortCode) {
        $scope.productList = [];
        $scope.loading = true;
        $http.get('/rest/products?sort=' + sortCode).then(res => {
            $scope.productList = res.data;
        }).catch(error => { console.error(error); })
            .finally(function () {
                $scope.loading = false;
            });
    };

    $scope.filterProductByCategory = function (categoryId) {
        $scope.productList = [];
        $scope.loading = true;
        $http.get('/rest/products/category/' + categoryId).then(res => {
            $scope.productList = res.data;
        }).catch(error => { console.error(error); })
            .finally(function () {
                $scope.loading = false;
            });
    };

    $scope.filterProductBySubCategory = function (subCategoryId) {
        $scope.productList = [];
        $scope.loading = true;
        $http.get('/rest/products/sub-category/' + subCategoryId).then(res => {
            $scope.productList = res.data;
        }).catch(error => { console.error(error); })
            .finally(function () {
                $scope.loading = false;
            });
    };

    $scope.filterProductBySaleOff = function () {
        $scope.productList = [];
        $scope.loading = true;
        $http.get('/rest/products/sale-off/').then(res => {
            $scope.productList = res.data;
        }).catch(error => { console.error(error); })
            .finally(function () {
                $scope.loading = false;
            });
    };

    $scope.filterProductByPriceRange = function () {
        $scope.productList = [];
        $scope.loading = true;
        $http.get('/rest/products/sale-off/').then(res => {
            $scope.productList = res.data;
        }).catch(error => { console.error(error); })
            .finally(function () {
                $scope.loading = false;
            });
    };


    $scope.filterProductsBySelectedColor = function (selectedColor) {
        // ở product/list.html phần ng-repeat đã thêm filter : selectedColor nên ở đây chỉ cần
        // set $scope.selectedColor = selectedColor
        $scope.selectedColor = selectedColor;
    };

    $scope.removeAllFilters = function () {
        $scope.productList = [];
        $scope.loading = true;
        $scope.getProductList();
        $scope.selectedColor = '';
        $scope.priceRange = $scope.rangeUI.max;
    };

    $scope.pager = {
        page: 0,
        size: 8,
        get productList() {
            let start = this.page * this.size;
            return $scope.productList.slice(start, start + this.size);
        },
        get count() {
            return Math.ceil(1.0 * $scope.productList.length / this.size);
        },
        first() {
            this.page = 0;
        },
        prev() {
            this.page--;
            if (this.page < 0) {
                this.last();
            }
        },
        next() {
            this.page++;
            if (this.page >= this.count) {
                this.first();
            }
        },
        last() {
            this.page = this.count - 1;
        }
    };

    $scope.initialize();
}