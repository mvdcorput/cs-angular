var cs;
(function (cs) {
    cs.app = angular.module('csAngular', []);
})(cs || (cs = {}));
var cs;
(function (cs) {
    var services;
    (function (services) {
        'use-strict';
        var PagingService = /** @class */ (function () {
            function PagingService() {
                var self = this;
                self.pagesGap = 5;
                self.currentPage = 0;
                self.groupedItems = [];
                self.pagedItems = [];
            }
            PagingService.prototype.range = function (size, start, end) {
                var self = this;
                var ret = [];
                if (size < end) {
                    end = size;
                    start = size - self.pagesGap;
                    if (start < 0) {
                        start = 0;
                    }
                }
                for (var i = start; i < end; i++) {
                    ret.push(i);
                }
                return ret;
            };
            ;
            PagingService.prototype.firstPage = function () {
                var self = this;
                if (self.currentPage > 0) {
                    self.currentPage = 0;
                }
            };
            ;
            PagingService.prototype.lastPage = function () {
                var self = this;
                if (self.currentPage < self.pagedItems.length - 1) {
                    self.currentPage = self.pagedItems.length - 1;
                }
            };
            ;
            PagingService.prototype.prevPage = function () {
                var self = this;
                if (self.currentPage > 0) {
                    self.currentPage--;
                }
            };
            ;
            PagingService.prototype.nextPage = function () {
                var self = this;
                if (self.currentPage < self.pagedItems.length - 1) {
                    self.currentPage++;
                }
            };
            ;
            return PagingService;
        }());
        services.PagingService = PagingService;
        cs.app.service("pagingService", [function () { return new PagingService(); }]);
    })(services = cs.services || (cs.services = {}));
})(cs || (cs = {}));
var cs;
(function (cs) {
    var services;
    (function (services) {
        'use-strict';
        var SortingService = /** @class */ (function () {
            function SortingService() {
            }
            SortingService.prototype.sortData = function (data, options) {
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
            SortingService.prototype.sortDataDynamic = function (type, column) {
                var self = this;
                if (column.dataType === cs.directives.DataTableColumnType.number) {
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
                if (column.dataType === cs.directives.DataTableColumnType.string) {
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
                if (column.dataType === cs.directives.DataTableColumnType.date) {
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
            };
            SortingService.prototype.sortDataMultipleDynamic = function (sortType) {
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
            return SortingService;
        }());
        services.SortingService = SortingService;
        cs.app.service("sortingService", [function () { return new SortingService(); }]);
    })(services = cs.services || (cs.services = {}));
})(cs || (cs = {}));
var cs;
(function (cs) {
    var directives;
    (function (directives) {
        'use-strict';
        var DatatableDirective = /** @class */ (function () {
            function DatatableDirective($sce, pagingService, sortingService) {
                this.$sce = $sce;
                this.pagingService = pagingService;
                this.sortingService = sortingService;
                this.restrict = 'EA';
                this.scope = {
                    options: '=csOptions'
                };
                this.template = "\n        " + cssStyle + "\n        <table ng-if=\"initialized === true\">\n            <thead>\n                <tr>\n                    <th ng-repeat=\"column in options.columns\">\n                        <span>{{column.title}}</span>\n                        <div class=\"icon-sort\" \n                            ng-bind-html=\"svgSort\"\n                            ng-click=\"sort(column, 'asc')\"\n                            ng-if=\"column.sortable && options.sort.columnName!==column.name\"> \n                        </div>\n                        <div class=\"icon-sort\" \n                            ng-bind-html=\"svgSortAsc\"\n                            ng-click=\"sort(column, 'desc')\"\n                            ng-if=\"column.sortable && options.sort.columnName===column.name && options.sort.direction==='asc'\"> \n                        </div>\n                        <div class=\"icon-sort\" \n                            ng-bind-html=\"svgSortDesc\"\n                            ng-click=\"sort(column, 'asc')\"\n                            ng-if=\"column.sortable && options.sort.columnName===column.name && options.sort.direction==='desc'\"> \n                        </div>\n                    </th>\n                </tr>\n            </thead>\n            <tbody>\n                <tr ng-repeat=\"item in paging.pagedItems[paging.currentPage]\">\n                    <td ng-repeat=\"column in options.columns\">{{item[column.name]}}</td>\n                </tr>\n            </tbody>\n            </tr>\n            </thead>\n            <tfoot>\n                <td colspan=\"{{options.columns.length}}\">\n                    <div class=\"pagination\">\n                        <ul>\n                            <li ng-if=\"paging.pagedItems.length<paging.pagesGap\">\n                                <a href ng-click=\"paging.firstPage()\" class=\"prev\" ng-bind-html=\"svgPagerToStart\" ng-class=\"{disabled: paging.currentPage == 0}\"></a>\n                            </li>\n                            <li>\n                                <a href ng-click=\"paging.prevPage()\" class=\"prev\" ng-bind-html=\"svgPagerBackward\" ng-class=\"{disabled: paging.currentPage == 0}\"></a>\n                            </li>\n                            <li ng-repeat=\"n in paging.range(paging.pagedItems.length, paging.currentPage, paging.currentPage + paging.pagesGap) \"\n                                ng-class=\"{active: n == paging.currentPage}\"\n                                ng-click=\"setPage()\">\n                                <a href ng-bind=\"n + 1\" class=\"page\">1</a>\n                            </li>\n                            <li>\n                                <a href ng-click=\"paging.nextPage()\" class=\"next\" ng-bind-html=\"svgPagerForward\" ng-class=\"{disabled: paging.currentPage == paging.pagedItems.length - 1}\"></a>\n                            </li>\n                            <li ng-if=\"paging.pagedItems.length<paging.pagesGap\">\n                                <a href ng-click=\"paging.lastPage()\" class=\"prev\" ng-bind-html=\"svgPagerToEnd\" ng-class=\"{disabled: paging.currentPage == paging.pagedItems.length - 1}\"></a>\n                            </li>\n                        </ul>\n                    </div>\n                </td>\n            </tfoot>                     \n        </table>\n        ";
                var self = this;
                self.link = self.unboundLink.bind(self);
            }
            DatatableDirective.prototype.unboundLink = function ($scope, $element, attrs) {
                var self = this;
                self.initialize($scope, $element);
                $scope.sort = sort;
                if ($scope.options.sort !== undefined && $scope.options.sort !== null) {
                    var column = $scope.options.columns.filter(function (column) { column.name === $scope.options.sort.columnName; })[0];
                    sort(column, $scope.options.sort.direction);
                }
                else {
                    setPages();
                }
                function setPages() {
                    $scope.paging.pagedItems = [];
                    for (var i = 0; i < $scope.options.data.length; i++) {
                        if (i % $scope.options.paging.pageSize === 0) {
                            $scope.paging.pagedItems[Math.floor(i / $scope.options.paging.pageSize)] = [$scope.options.data[i]];
                        }
                        else {
                            $scope.paging.pagedItems[Math.floor(i / $scope.options.paging.pageSize)].push($scope.options.data[i]);
                        }
                    }
                }
                function sort(column, direction) {
                    $scope.options.sort = { columnName: column.name, direction: direction };
                    self.sortingService.sortData($scope.options.data, $scope.options);
                    setPages();
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
                    }
                    $scope.svgPagerBackward = self.$sce.trustAsHtml(svgPagerBackward);
                    $scope.svgPagerForward = self.$sce.trustAsHtml(svgPagerForward);
                    $scope.svgPagerToEnd = self.$sce.trustAsHtml(svgPagerToEnd);
                    $scope.svgPagerToStart = self.$sce.trustAsHtml(svgPagerToStart);
                    $scope.svgSort = self.$sce.trustAsHtml(svgSort);
                    $scope.svgSortAsc = self.$sce.trustAsHtml(svgSortAsc);
                    $scope.svgSortDesc = self.$sce.trustAsHtml(svgSortDesc);
                    $scope.paging = self.pagingService;
                    $scope.options.paging.pageSize = 5;
                    $scope.setPage = function () {
                        $scope.paging.currentPage = this.n;
                    };
                    $scope.initialized = true;
                }
            };
            return DatatableDirective;
        }());
        var DataTableColumnType;
        (function (DataTableColumnType) {
            DataTableColumnType[DataTableColumnType["string"] = 1] = "string";
            DataTableColumnType[DataTableColumnType["number"] = 2] = "number";
            DataTableColumnType[DataTableColumnType["boolean"] = 3] = "boolean";
            DataTableColumnType[DataTableColumnType["date"] = 4] = "date";
            DataTableColumnType[DataTableColumnType["dateJson"] = 5] = "dateJson";
        })(DataTableColumnType = directives.DataTableColumnType || (directives.DataTableColumnType = {}));
        var cssStyle = "\n        <style>\n            .cs-datatable table {\n                border-collapse: collapse;\n            }\n\n            .cs-datatable table thead {\n                background-color: #000;\n                color: white;\n            }\n\n            .cs-datatable table th {\n                padding: 5px;\n            }\n\n            .cs-datatable table th span {\n                display:inline-block;\n            }\n\n            .cs-datatable table th .icon-sort {\n                cursor: pointer;\n                display:inline-block;\n                float: right;\n                height: 1em;\n                width: 1em;\n            }\n\n            .cs-datatable .pagination ul {\n                display: inline-block;\n                list-style: none;\n                margin: 0;\n                padding: 0;\n            }\n\n            .cs-datatable .pagination ul li {\n                display: inline-block;\n            }\n\n            .cs-datatable .pagination a.next,\n            .cs-datatable .pagination a.prev {\n                display: inline-block;\n                float: left;\n                height: 1em;\n                padding: 5px;\n                width: 1em;\n            }\n\n            .cs-datatable .pagination a.page {\n                display: inline-block;\n                float: left;\n                padding: 5px;\n            }\n\n            .cs-datatable .pagination .active {\n                font-weight: bold;\n            }\n\n            .cs-datatable .pagination svg path {\n                fill: #000;\n            }\n\n            .cs-datatable .pagination a.disabled svg path {\n                fill: #aaa;\n            }\n        </style>\n    ";
        var svgPagerBackward = "\n    <?xml version=\"1.0\" encoding=\"utf-8\"?>\n    <svg height=\"100%\" width=\"100%\" viewBox=\"0 0 1792 1792\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M1683 141q19-19 32-13t13 32v1472q0 26-13 32t-32-13l-710-710q-9-9-13-19v710q0 26-13 32t-32-13l-710-710q-19-19-19-45t19-45l710-710q19-19 32-13t13 32v710q4-10 13-19z\" fill=\"#fff\"/></svg>\n    ";
        var svgPagerForward = "\n    <?xml version=\"1.0\" encoding=\"utf-8\"?>\n    <svg height=\"100%\" width=\"100%\" viewBox=\"0 0 1792 1792\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M109 1651q-19 19-32 13t-13-32v-1472q0-26 13-32t32 13l710 710q9 9 13 19v-710q0-26 13-32t32 13l710 710q19 19 19 45t-19 45l-710 710q-19 19-32 13t-13-32v-710q-4 10-13 19z\" fill=\"#fff\"/></svg>\n    ";
        var svgPagerToEnd = "\n    <?xml version=\"1.0\" encoding=\"utf-8\"?>\n    <svg height=\"100%\" width=\"100%\" viewBox=\"0 0 1792 1792\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M45 1651q-19 19-32 13t-13-32v-1472q0-26 13-32t32 13l710 710q9 9 13 19v-710q0-26 13-32t32 13l710 710q9 9 13 19v-678q0-26 19-45t45-19h128q26 0 45 19t19 45v1408q0 26-19 45t-45 19h-128q-26 0-45-19t-19-45v-678q-4 10-13 19l-710 710q-19 19-32 13t-13-32v-710q-4 10-13 19z\" fill=\"#fff\"/></svg>\n    ";
        var svgPagerToStart = "\n    <?xml version=\"1.0\" encoding=\"utf-8\"?>\n    <svg height=\"100%\" width=\"100%\" viewBox=\"0 0 1792 1792\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M1747 141q19-19 32-13t13 32v1472q0 26-13 32t-32-13l-710-710q-9-9-13-19v710q0 26-13 32t-32-13l-710-710q-9-9-13-19v678q0 26-19 45t-45 19h-128q-26 0-45-19t-19-45v-1408q0-26 19-45t45-19h128q26 0 45 19t19 45v678q4-10 13-19l710-710q19-19 32-13t13 32v710q4-10 13-19z\" fill=\"#fff\"/></svg>\n    ";
        var svgSort = "\n    <?xml version=\"1.0\" encoding=\"utf-8\"?>\n    <svg height=\"100%\" width=\"100%\" viewBox=\"0 0 1792 1792\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M1408 1088q0 26-19 45l-448 448q-19 19-45 19t-45-19l-448-448q-19-19-19-45t19-45 45-19h896q26 0 45 19t19 45zm0-384q0 26-19 45t-45 19h-896q-26 0-45-19t-19-45 19-45l448-448q19-19 45-19t45 19l448 448q19 19 19 45z\" fill=\"#fff\"/></svg>\n    ";
        var svgSortAsc = "\n    <?xml version=\"1.0\" encoding=\"utf-8\"?>\n    <svg height=\"100%\" width=\"100%\" viewBox=\"0 0 1792 1792\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M1395 736q0 13-10 23l-466 466q-10 10-23 10t-23-10l-466-466q-10-10-10-23t10-23l50-50q10-10 23-10t23 10l393 393 393-393q10-10 23-10t23 10l50 50q10 10 10 23z\" fill=\"#fff\"/></svg>\n    ";
        var svgSortDesc = "\n    <?xml version=\"1.0\" encoding=\"utf-8\"?>\n    <svg height=\"100%\" width=\"100%\" viewBox=\"0 0 1792 1792\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M1395 1184q0 13-10 23l-50 50q-10 10-23 10t-23-10l-393-393-393 393q-10 10-23 10t-23-10l-50-50q-10-10-10-23t10-23l466-466q10-10 23-10t23 10l466 466q10 10 10 23z\" fill=\"#fff\"/></svg>\n    ";
        cs.app.directive('csDatatable', ['$sce', 'pagingService', 'sortingService', function ($sce, pagingService, sortingService) { return new DatatableDirective($sce, pagingService, sortingService); }]);
    })(directives = cs.directives || (cs.directives = {}));
})(cs || (cs = {}));
//# sourceMappingURL=cs-angular.js.map