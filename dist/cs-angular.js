var cs;
(function (cs) {
    cs.app = angular ? angular.module('csAngular', []) : null;
    if (cs.app) {
        cs.app.filter('startFrom', function () {
            return function (input, start) {
                if (input) {
                    return input.slice(start - 1);
                }
                return [];
            };
        });
    }
})(cs || (cs = {}));
var cs;
(function (cs) {
    var directives;
    (function (directives) {
        'use-strict';
        var DatatableDirective = /** @class */ (function () {
            function DatatableDirective($sce, sorting) {
                this.$sce = $sce;
                this.sorting = sorting;
                this.restrict = 'EA';
                this.scope = {
                    options: '=csOptions'
                };
                this.template = "\n        <table ng-if=\"initialized === true\">\n            <thead>\n                <tr>\n                    <th ng-repeat=\"column in options.columns\">\n                        <span>{{column.title}}</span>\n                        <div class=\"icon-sort\" \n                            ng-bind-html=\"svgSort\"\n                            ng-click=\"sort(column, 'asc')\"\n                            ng-if=\"column.sortable && options.sort.columnName!==column.name\"> \n                        </div>\n                        <div class=\"icon-sort\" \n                            ng-bind-html=\"svgSortAsc\"\n                            ng-click=\"sort(column, 'desc')\"\n                            ng-if=\"column.sortable && options.sort.columnName===column.name && options.sort.direction==='asc'\"> \n                        </div>\n                        <div class=\"icon-sort\" \n                            ng-bind-html=\"svgSortDesc\"\n                            ng-click=\"sort(column, 'asc')\"\n                            ng-if=\"column.sortable && options.sort.columnName===column.name && options.sort.direction==='desc'\"> \n                        </div>\n                    </th>\n                </tr>\n            </thead>\n            <tbody>\n                <tr ng-repeat=\"item in filteredData | startFrom: paginationOptions.page == 1 ? 1 : ((paginationOptions.page - 1) * paginationOptions.pageSize) + 1 | limitTo: paginationOptions.pageSize track by $index\"\n                    ng-class-even=\"'even'\">\n                    <td ng-repeat=\"column in options.columns\" ng-if=\"!column.onDraw && [4,5].indexOf(column.dataType) === -1\">{{item[column.name]}}</td>\n                    <td ng-repeat=\"column in options.columns\" ng-if=\"!column.onDraw && column.dataType === 4\">{{renderDateColumn(item[column.name])}}</td>\n                    <td ng-repeat=\"column in options.columns\" ng-if=\"!column.onDraw && column.dataType === 5\">{{renderDateStringColumn(item[column.name])}}</td>\n                    <td ng-repeat=\"column in options.columns\" ng-if=\"column.onDraw\">{{column.onDraw({ value: item[column.name], model: item})}}</td>\n                </tr>\n            </tbody>\n            <tfoot>\n                <tr>\n                    <td colspan=\"{{options.columns.length}}\">\n                        <div cs-pagination cs-options=\"paginationOptions\">\n                    </td>\n                </tr>\n            </tfoot>   \n        </table>\n        ";
                var self = this;
                self.link = self.unboundLink.bind(self);
            }
            DatatableDirective.prototype.unboundLink = function ($scope, $element, attrs) {
                var self = this;
                $scope.filter = filter;
                $scope.renderDateColumn = self.renderDateColumn.bind(self);
                $scope.renderDateStringColumn = self.renderDateStringColumn.bind(self);
                $scope.sort = sort;
                self.initialize($scope, $element);
                if ($scope.options && $scope.options.sort !== undefined && $scope.options.sort !== null) {
                    var column = $scope.options.columns.filter(function (column) { return column.name === $scope.options.sort.columnName; })[0];
                    if (column) {
                        sort(column, $scope.options.sort.direction);
                    }
                }
                function filter() {
                    if ($scope.options && ($scope.options.filter !== undefined && $scope.options.filter !== null && $scope.options.filter !== '')) {
                        $scope.filteredData = $scope.options.data.filter(function (item, index, data) {
                            var columnLength = $scope.options.columns.length;
                            var match = false;
                            for (var i = 0; i < columnLength; i++) {
                                var column = $scope.options.columns[i];
                                if (item[column.name]) {
                                    switch (column.dataType) {
                                        case directives.DataTableColumnType.string:
                                            if (item[column.name].toLowerCase().indexOf($scope.options.filter.toLowerCase()) > -1) {
                                                match = true;
                                            }
                                            break;
                                        case directives.DataTableColumnType.number:
                                            if (item[column.name].toString().toLowerCase().indexOf($scope.options.filter.toLowerCase()) > -1) {
                                                match = true;
                                            }
                                            break;
                                        case directives.DataTableColumnType.dateString:
                                            var date = column.onDateStringConvert ? column.onDateStringConvert(item[column.name]) : new Date(item[column.name]);
                                            var matchDateStrimg = column.onDraw ? column.onDraw({ model: item, value: item[column.name] }) : self.renderDateColumn(new Date(item[column.name]));
                                            if (matchDateStrimg.indexOf($scope.options.filter) > -1) {
                                                match = true;
                                            }
                                            break;
                                        case directives.DataTableColumnType.date:
                                            var matchDate = column.onDraw ? column.onDraw({ model: item, value: item[column.name] }) : self.renderDateColumn(new Date(item[column.name]));
                                            if (matchDate.indexOf($scope.options.filter) > -1) {
                                                match = true;
                                            }
                                            break;
                                    }
                                }
                            }
                            return match;
                        });
                    }
                    else {
                        $scope.filteredData = $scope.options.data;
                    }
                    // Sort
                    var column = $scope.options.columns.filter(function (column) { return column.name === $scope.options.sort.columnName; })[0];
                    if (column) {
                        sort(column, $scope.options.sort.direction);
                    }
                    // Set pagination
                    if ($scope.paginationOptions.refresh) {
                        $scope.paginationOptions.total = $scope.filteredData ? $scope.filteredData.length : 1;
                        $scope.paginationOptions.refresh();
                    }
                }
                function sort(column, direction) {
                    $scope.options.sort = { columnName: column.name, direction: direction };
                    $scope.sorting.sortData($scope.filteredData, $scope.options);
                    self.scopeApply($scope);
                }
            };
            DatatableDirective.prototype.initialize = function ($scope, $element) {
                var self = this;
                $element.addClass('cs-datatable');
                if ($scope.options !== undefined && $scope.options !== null) {
                    if ($scope.options.columns === undefined || $scope.options.columns === null) {
                        $scope.options.columns = [];
                    }
                    if ($scope.options.data === undefined || $scope.options.data === null) {
                        $scope.options.data = [];
                        $scope.filteredData = $scope.options.data.slice(0);
                    }
                    $scope.sorting = self.sorting;
                    $scope.$watch('options.filter', function () {
                        $scope.filter();
                    });
                    $scope.svgSort = self.$sce.trustAsHtml(directives.svgSort);
                    $scope.svgSortAsc = self.$sce.trustAsHtml(directives.svgSortAsc);
                    $scope.svgSortDesc = self.$sce.trustAsHtml(directives.svgSortDesc);
                    $scope.paginationOptions = {
                        gap: 5,
                        pageSize: 5,
                        total: $scope.filteredData ? $scope.filteredData.length : 1
                    };
                    $scope.filter();
                    $scope.initialized = true;
                }
            };
            DatatableDirective.prototype.renderDateColumn = function (value) {
                var year = value.getFullYear();
                var month = value.getMonth() + 1;
                var day = value.getDate();
                return pad(month, 2) + "/" + pad(day, 2) + "/" + year;
                function pad(value, length) {
                    return (value.toString().length < length) ? pad("0" + value.toString(), length) : value;
                }
            };
            DatatableDirective.prototype.renderDateStringColumn = function (value, dateConverter) {
                var self = this;
                if (dateConverter) {
                    return self.renderDateColumn(dateConverter(value));
                }
                else {
                    return self.renderDateColumn(new Date(value));
                }
            };
            DatatableDirective.prototype.scopeApply = function ($scope) {
                if ($scope == undefined && $scope == null) {
                    return;
                }
                var phase = $scope.$root.$$phase;
                var result = false;
                if (phase !== '$apply' && phase !== '$digest') {
                    $scope.$apply();
                    result = true;
                }
                return result;
            };
            return DatatableDirective;
        }());
        if (cs.app) {
            cs.app.directive('csDatatable', ['$sce', 'datatableSortService', function ($sce, datatableSortService) { return new DatatableDirective($sce, datatableSortService); }]);
        }
    })(directives = cs.directives || (cs.directives = {}));
})(cs || (cs = {}));
var cs;
(function (cs) {
    var directives;
    (function (directives) {
        'use-strict';
        /** SVG image for datatable header column neutral sort icon  */
        directives.svgSort = "\n    <?xml version=\"1.0\" encoding=\"utf-8\"?>\n    <svg height=\"100%\" width=\"100%\" viewBox=\"0 0 1792 1792\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M1408 1088q0 26-19 45l-448 448q-19 19-45 19t-45-19l-448-448q-19-19-19-45t19-45 45-19h896q26 0 45 19t19 45zm0-384q0 26-19 45t-45 19h-896q-26 0-45-19t-19-45 19-45l448-448q19-19 45-19t45 19l448 448q19 19 19 45z\" fill=\"#fff\"/></svg>\n    ";
        /** SVG image for datatable header column ascending sort icon  */
        directives.svgSortAsc = "\n    <?xml version=\"1.0\" encoding=\"utf-8\"?>\n    <svg height=\"100%\" width=\"100%\" viewBox=\"0 0 1792 1792\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M1395 736q0 13-10 23l-466 466q-10 10-23 10t-23-10l-466-466q-10-10-10-23t10-23l50-50q10-10 23-10t23 10l393 393 393-393q10-10 23-10t23 10l50 50q10 10 10 23z\" fill=\"#fff\"/></svg>\n    ";
        /** SVG image for datatable header column descending sort icon  */
        directives.svgSortDesc = "\n    <?xml version=\"1.0\" encoding=\"utf-8\"?>\n    <svg height=\"100%\" width=\"100%\" viewBox=\"0 0 1792 1792\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M1395 1184q0 13-10 23l-50 50q-10 10-23 10t-23-10l-393-393-393 393q-10 10-23 10t-23-10l-50-50q-10-10-10-23t10-23l466-466q10-10 23-10t23 10l466 466q10 10 10 23z\" fill=\"#fff\"/></svg>\n    ";
        /**
         * Type enum for data type
         */
        var DataTableColumnType;
        (function (DataTableColumnType) {
            /** String/Text */
            DataTableColumnType[DataTableColumnType["string"] = 1] = "string";
            /** Number */
            DataTableColumnType[DataTableColumnType["number"] = 2] = "number";
            /** True/False */
            DataTableColumnType[DataTableColumnType["boolean"] = 3] = "boolean";
            /** Javascript Date */
            DataTableColumnType[DataTableColumnType["date"] = 4] = "date";
            /** String/Text that contains a date */
            DataTableColumnType[DataTableColumnType["dateString"] = 5] = "dateString";
        })(DataTableColumnType = directives.DataTableColumnType || (directives.DataTableColumnType = {}));
    })(directives = cs.directives || (cs.directives = {}));
})(cs || (cs = {}));
var cs;
(function (cs) {
    var directives;
    (function (directives) {
        'use-strict';
        var PaginationDirective = /** @class */ (function () {
            function PaginationDirective($sce) {
                this.$sce = $sce;
                this.restrict = 'EA';
                this.scope = {
                    options: '=csOptions'
                };
                this.template = "\n        <ul>\n            <li ng-if=\"pages.length>options.gap\">\n                <a href=\"\" ng-click=\"firstPage()\" class=\"first\" ng-bind-html=\"svgPagerToStart\" ng-class=\"{disabled: options.page == 1}\"></a>\n            </li>\n            <li ng-if=\"pages.length>0\">\n                <a href=\"\" ng-click=\"prevPage()\" class=\"prev\" ng-bind-html=\"svgPagerBackward\" ng-class=\"{disabled: options.page == 1}\"></a>\n            </li>\n            <li ng-repeat=\"page in pages | startFrom: startPage | limitTo: options.gap\"\n                ng-class=\"{active: page === options.page}\">\n                <a href=\"\" ng-click=\"setPage(page)\" class=\"page\">{{page}}</a>\n            </li>\n            <li ng-if=\"pages.length>0\">\n                <a href=\"\" ng-click=\"nextPage()\" class=\"next\" ng-bind-html=\"svgPagerForward\" ng-class=\"{disabled: options.page == pages.length}\"></a>\n            </li>\n            <li ng-if=\"pages.length>options.gap\">\n                <a href=\"\" ng-click=\"lastPage()\" class=\"last\" ng-bind-html=\"svgPagerToEnd\" ng-class=\"{disabled: options.page == pages.length}\"></a>\n            </li>\n        </ul>\n        ";
                var self = this;
                self.link = self.unboundLink.bind(self);
            }
            PaginationDirective.prototype.unboundLink = function ($scope, $element, attrs) {
                var self = this;
                self.initialize($scope, $element);
                $scope.options.refresh = refresh;
                $scope.firstPage = firstPage;
                $scope.lastPage = lastPage;
                $scope.nextPage = nextPage;
                $scope.prevPage = prevPage;
                $scope.setPage = setPage;
                function firstPage() {
                    if ($scope.options.page > 1) {
                        $scope.options.page = 1;
                    }
                    setStartPage();
                }
                function lastPage() {
                    if ($scope.options.page < $scope.pages.length - 1) {
                        $scope.options.page = $scope.pages.length;
                    }
                    setStartPage();
                }
                function nextPage() {
                    if ($scope.options.page < $scope.pages.length) {
                        $scope.options.page++;
                    }
                    setStartPage();
                }
                function prevPage() {
                    if ($scope.options.page > 1) {
                        $scope.options.page--;
                    }
                    setStartPage();
                }
                function refresh() {
                    self.initialize($scope, $element);
                }
                function setPage(page) {
                    $scope.options.page = page;
                    setStartPage();
                }
                function setStartPage() {
                    var page = Math.ceil($scope.options.page / $scope.options.gap);
                    $scope.startPage = page == 1 ? 1 : ((page - 1) * $scope.options.gap) + 1;
                }
            };
            PaginationDirective.prototype.initialize = function ($scope, $element) {
                var self = this;
                $element.addClass('cs-pagination');
                if ($scope.options !== undefined && $scope.options !== null) {
                    $scope.svgPagerBackward = self.$sce.trustAsHtml(directives.svgPagerBackward);
                    $scope.svgPagerForward = self.$sce.trustAsHtml(directives.svgPagerForward);
                    $scope.svgPagerToEnd = self.$sce.trustAsHtml(directives.svgPagerToEnd);
                    $scope.svgPagerToStart = self.$sce.trustAsHtml(directives.svgPagerToStart);
                    self.setPages($scope);
                    $scope.options.page = $scope.options.page ? $scope.options.page : 1;
                    $scope.startPage = 1;
                    $scope.initialized = true;
                }
            };
            PaginationDirective.prototype.range = function (start, end) {
                var result = [];
                for (var i = start; i <= end; i++) {
                    result.push(i);
                }
                return result;
            };
            PaginationDirective.prototype.setPages = function ($scope) {
                var self = this;
                if ($scope.options.total == 0) {
                    $scope.pages = [];
                }
                else {
                    $scope.pages = self.range(1, Math.ceil($scope.options.total / $scope.options.pageSize));
                }
            };
            return PaginationDirective;
        }());
        if (cs.app) {
            cs.app.directive('csPagination', ['$sce', function ($sce) { return new PaginationDirective($sce); }]);
        }
    })(directives = cs.directives || (cs.directives = {}));
})(cs || (cs = {}));
var cs;
(function (cs) {
    var directives;
    (function (directives) {
        'use-strict';
        /** SVG image for datatable pagination backward navigation */
        directives.svgPagerBackward = "\n    <?xml version=\"1.0\" encoding=\"utf-8\"?>\n    <svg height=\"100%\" width=\"100%\" viewBox=\"0 0 1792 1792\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M1683 141q19-19 32-13t13 32v1472q0 26-13 32t-32-13l-710-710q-9-9-13-19v710q0 26-13 32t-32-13l-710-710q-19-19-19-45t19-45l710-710q19-19 32-13t13 32v710q4-10 13-19z\" fill=\"#fff\"/></svg>\n    ";
        /** SVG image for datatable pagination forward navigation */
        directives.svgPagerForward = "\n    <?xml version=\"1.0\" encoding=\"utf-8\"?>\n    <svg height=\"100%\" width=\"100%\" viewBox=\"0 0 1792 1792\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M109 1651q-19 19-32 13t-13-32v-1472q0-26 13-32t32 13l710 710q9 9 13 19v-710q0-26 13-32t32 13l710 710q19 19 19 45t-19 45l-710 710q-19 19-32 13t-13-32v-710q-4 10-13 19z\" fill=\"#fff\"/></svg>\n    ";
        /** SVG image for datatable pagination jump to last page navigation */
        directives.svgPagerToEnd = "\n    <?xml version=\"1.0\" encoding=\"utf-8\"?>\n    <svg height=\"100%\" width=\"100%\" viewBox=\"0 0 1792 1792\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M45 1651q-19 19-32 13t-13-32v-1472q0-26 13-32t32 13l710 710q9 9 13 19v-710q0-26 13-32t32 13l710 710q9 9 13 19v-678q0-26 19-45t45-19h128q26 0 45 19t19 45v1408q0 26-19 45t-45 19h-128q-26 0-45-19t-19-45v-678q-4 10-13 19l-710 710q-19 19-32 13t-13-32v-710q-4 10-13 19z\" fill=\"#fff\"/></svg>\n    ";
        /** SVG image for datatable pagination jump to first page navigation */
        directives.svgPagerToStart = "\n    <?xml version=\"1.0\" encoding=\"utf-8\"?>\n    <svg height=\"100%\" width=\"100%\" viewBox=\"0 0 1792 1792\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M1747 141q19-19 32-13t13 32v1472q0 26-13 32t-32-13l-710-710q-9-9-13-19v710q0 26-13 32t-32-13l-710-710q-9-9-13-19v678q0 26-19 45t-45 19h-128q-26 0-45-19t-19-45v-1408q0-26 19-45t45-19h128q26 0 45 19t19 45v678q4-10 13-19l710-710q19-19 32-13t13 32v710q4-10 13-19z\" fill=\"#fff\"/></svg>\n    ";
    })(directives = cs.directives || (cs.directives = {}));
})(cs || (cs = {}));
var cs;
(function (cs) {
    var services;
    (function (services) {
        'use-strict';
        var DataTableColumnType = cs.directives.DataTableColumnType;
        var DatatableSortService = /** @class */ (function () {
            function DatatableSortService() {
            }
            DatatableSortService.prototype.sortData = function (data, options) {
                var self = this;
                var column = options.columns.filter(function (column) { return column.name === options.sort.columnName; })[0];
                if (options.sortSecondare !== undefined && options.sortSecondare !== null) {
                    var secondColumn = options.columns.filter(function (column) { return column.name === options.sortSecondare.columnName; })[0];
                    data.sort(self.sortDataMultipleDynamic(options.sort.direction, column, secondColumn));
                }
                else {
                    data.sort(self.sortDataDynamic(options.sort.direction, column));
                }
            };
            DatatableSortService.prototype.sortDataDynamic = function (type, column) {
                var self = this;
                if (column.dataType === DataTableColumnType.number) {
                    return function (a, b) {
                        var propA = a[column.name];
                        var propB = b[column.name];
                        if (propA === propB)
                            return 0;
                        else if (propA === null)
                            return 1;
                        else if (propB === null)
                            return -1;
                        return type === 'asc' ? propA - propB : propB - propA;
                    };
                }
                if (column.dataType === DataTableColumnType.string) {
                    return function (a, b) {
                        var propA = a[column.name];
                        var propB = b[column.name];
                        if (propA === propB)
                            return 0;
                        else if (propA === null)
                            return 1;
                        else if (propB === null)
                            return -1;
                        propA = propA.toLowerCase();
                        propB = propB.toLowerCase();
                        if (propA < propB)
                            return type === 'asc' ? -1 : 1;
                        if (propA > propB)
                            return type === 'asc' ? 1 : -1;
                        return 0;
                    };
                }
                if (column.dataType === DataTableColumnType.date) {
                    return function (a, b) {
                        var propA = a[column.name];
                        var propB = b[column.name];
                        var dateA = new Date(propA);
                        var dateB = new Date(propB);
                        if (propA === propB) {
                            return 0;
                        }
                        else if (propA === null) {
                            return 1;
                        }
                        else if (propB === null) {
                            return -1;
                        }
                        ;
                        return type === 'asc' ? dateA.getTime() - dateB.getTime() : dateB.getTime() - dateA.getTime();
                    };
                }
                if (column.dataType === DataTableColumnType.dateString) {
                    return function (a, b) {
                        var propA = a[column.name];
                        var propB = b[column.name];
                        var dateA = column.onDateStringConvert ? column.onDateStringConvert(propA) : new Date(propA);
                        var dateB = column.onDateStringConvert ? column.onDateStringConvert(propB) : new Date(propB);
                        if (propA === propB) {
                            return 0;
                        }
                        else if (propA === null) {
                            return 1;
                        }
                        else if (propB === null) {
                            return -1;
                        }
                        ;
                        return type === 'asc' ? dateA.getTime() - dateB.getTime() : dateB.getTime() - dateA.getTime();
                    };
                }
            };
            DatatableSortService.prototype.sortDataMultipleDynamic = function (sortType) {
                var columns = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    columns[_i - 1] = arguments[_i];
                }
                var self = this;
                /*
                * save the arguments object as it will be overwritten
                * note that arguments object is an array-like object
                * consisting of the names of the properties to sort by
                */
                return function (obj1, obj2) {
                    var i = 0, result = 0, numberOfProperties = columns.length;
                    /* try getting a different result from 0 (equal)
                     * as long as we have extra properties to compare
                     */
                    while (result === 0 && i < numberOfProperties) {
                        if (i === 0) {
                            result = self.sortDataDynamic(sortType, columns[i])(obj1, obj2);
                        }
                        else {
                            result = self.sortDataDynamic('asc', columns[i])(obj1, obj2);
                        }
                        i++;
                    }
                    return result;
                };
            };
            return DatatableSortService;
        }());
        if (cs.app) {
            cs.app.service('datatableSortService', [function () { return new DatatableSortService(); }]);
        }
    })(services = cs.services || (cs.services = {}));
})(cs || (cs = {}));
//# sourceMappingURL=cs-angular.js.map