namespace cs.directives
{
    'use-strict';

    class DatatableDirective implements ng.IDirective
    {
        public link;
        public restrict = 'EA';
        public scope = {
            options: '=csOptions'
        };

        public template = 
        `
        ${cssStyle}
        <table ng-if="initialized === true">
            <thead>
                <tr>
                    <th ng-repeat="column in options.columns">
                        <span>{{column.title}}</span>
                        <div class="icon-sort" 
                            ng-bind-html="svgSort"
                            ng-click="sort(column, 'asc')"
                            ng-if="column.sortable && options.sort.columnName!==column.name"> 
                        </div>
                        <div class="icon-sort" 
                            ng-bind-html="svgSortAsc"
                            ng-click="sort(column, 'desc')"
                            ng-if="column.sortable && options.sort.columnName===column.name && options.sort.direction==='asc'"> 
                        </div>
                        <div class="icon-sort" 
                            ng-bind-html="svgSortDesc"
                            ng-click="sort(column, 'asc')"
                            ng-if="column.sortable && options.sort.columnName===column.name && options.sort.direction==='desc'"> 
                        </div>
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr ng-repeat="item in paging.pagedItems[paging.currentPage]"
                    ng-class-even="'even'">
                    <td ng-repeat="column in options.columns">{{item[column.name]}}</td>
                </tr>
            </tbody>
            </tr>
            </thead>
            <tfoot>
                <td colspan="{{options.columns.length}}">
                    <div class="pagination">
                        <ul>
                            <li ng-if="paging.pagedItems.length<paging.pagesGap">
                                <a href ng-click="paging.firstPage()" class="first" ng-bind-html="svgPagerToStart" ng-class="{disabled: paging.currentPage == 0}"></a>
                            </li>
                            <li>
                                <a href ng-click="paging.prevPage()" class="prev" ng-bind-html="svgPagerBackward" ng-class="{disabled: paging.currentPage == 0}"></a>
                            </li>
                            <li ng-repeat="n in paging.range(paging.pagedItems.length, paging.currentPage, paging.currentPage + paging.pagesGap) "
                                ng-class="{active: n == paging.currentPage}"
                                ng-click="setPage()">
                                <a href ng-bind="n + 1" class="page">1</a>
                            </li>
                            <li>
                                <a href ng-click="paging.nextPage()" class="next" ng-bind-html="svgPagerForward" ng-class="{disabled: paging.currentPage == paging.pagedItems.length - 1}"></a>
                            </li>
                            <li ng-if="paging.pagedItems.length<paging.pagesGap">
                                <a href ng-click="paging.lastPage()" class="last" ng-bind-html="svgPagerToEnd" ng-class="{disabled: paging.currentPage == paging.pagedItems.length - 1}"></a>
                            </li>
                        </ul>
                    </div>
                </td>
            </tfoot>                     
        </table>
        `;

        constructor(public $sce: ng.ISCEService) {
            const self: DatatableDirective = this;
            
            self.link = self.unboundLink.bind(self);
        }
            
        private unboundLink($scope: IDatatableScope, $element: ng.IAugmentedJQuery, attrs: ng.IAttributes): void {
            const self: DatatableDirective = this;

            self.initialize($scope, $element);

            $scope.sort = sort;

            if ($scope.options.sort !== undefined && $scope.options.sort !== null) {
                const column = $scope.options.columns.filter((column) => { column.name === $scope.options.sort.columnName })[0];

                sort(column, $scope.options.sort.direction);
            } else {
                $scope.paging.setPages($scope.options.data, $scope.options.paging.pageSize);
            }

            function sort(column: IDatatableColumn, direction: 'asc' | 'desc'): void {
                $scope.options.sort = { columnName: column.name, direction: direction };

                $scope.sorting.sortData($scope.options.data, $scope.options);

                $scope.paging.setPages($scope.options.data, $scope.options.paging.pageSize);
            }
        }

        private initialize($scope: IDatatableScope, $element: ng.IAugmentedJQuery): void {
            const self: DatatableDirective = this;
            
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
                

                $scope.paging = new DatatablePageModel();
                $scope.sorting = new DatatableSortModel();

                $scope.options.paging.pageSize = 5;   
                
                $scope.setPage = function () {
                    $scope.paging.currentPage = this.n;
                };

                $scope.initialized = true;
            }
        }
    }

    export enum DataTableColumnType {
        string = 1,
        number = 2,
        boolean = 3,
        date = 4,
        dateJson = 5
    }

    export interface IDatatableColumn {
        cssClass: string;
        dataType: DataTableColumnType;
        name: string;
        sortable: boolean;
        title: string;
    }
    
    export interface IDatatableOptions {
        columns: Array<IDatatableColumn>;
        data: Array<any>;
        paging?: IDatatablePagingOptions;
        sort?: IDatatableSort;
        sortSecondare?: IDatatableSort;
    }
    
    export interface IDatatablePagingOptions {
        pageSize: number;
    }

    export interface IDatatableSort {
        columnName: string;
        direction: 'asc' | 'desc';
    }
    export interface IDatatableScope {
        initialized: boolean;
        options: IDatatableOptions;
        paging: DatatablePageModel;
        setPage: () => void;
        sort: (column: IDatatableColumn, direction: 'asc' | 'desc') => void;
        sorting: DatatableSortModel;
        svgPagerBackward: string;
        svgPagerForward: string;
        svgPagerToEnd: string;
        svgPagerToStart: string;
        svgSort: string;
        svgSortAsc: string;
        svgSortDesc: string;
    }

    const cssStyle: string =
    `
        <style>
            .cs-datatable table {
                border-collapse: collapse;
            }

            .cs-datatable table thead {
                background-color: #000;
                color: white;
            }

            .cs-datatable table td,
            .cs-datatable table th {
                padding: 5px;
            }

            .cs-datatable table th span {
                display:inline-block;
            }

            .cs-datatable table th .icon-sort {
                cursor: pointer;
                display:inline-block;
                float: right;
                height: 1em;
                width: 1em;
            }

            .cs-datatable .pagination ul {
                display: inline-block;
                list-style: none;
                margin: 0;
                padding: 0;
            }

            .cs-datatable .pagination ul li {
                display: inline-block;
            }

            .cs-datatable .pagination a.first,
            .cs-datatable .pagination a.last,
            .cs-datatable .pagination a.next,
            .cs-datatable .pagination a.prev {
                display: inline-block;
                float: left;
                height: 1em;
                padding: 5px;
                width: 1em;
            }

            .cs-datatable .pagination a.first{
                padding-left: 0;
            }

            .cs-datatable .pagination a.last{
                padding-right: 0;
            }

            .cs-datatable .pagination a.page {
                display: inline-block;
                float: left;
                padding: 5px;
            }

            .cs-datatable .pagination .active {
                font-weight: bold;
            }

            .cs-datatable .pagination svg path {
                fill: #000;
            }

            .cs-datatable .pagination a.disabled {
                cursor: default;
            }

            .cs-datatable .pagination a.disabled svg path {
                fill: #aaa;
            }
        </style>
    `;

    const svgPagerBackward: string = 
    `
    <?xml version="1.0" encoding="utf-8"?>
    <svg height="100%" width="100%" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M1683 141q19-19 32-13t13 32v1472q0 26-13 32t-32-13l-710-710q-9-9-13-19v710q0 26-13 32t-32-13l-710-710q-19-19-19-45t19-45l710-710q19-19 32-13t13 32v710q4-10 13-19z" fill="#fff"/></svg>
    `
    ;

    const svgPagerForward: string = 
    `
    <?xml version="1.0" encoding="utf-8"?>
    <svg height="100%" width="100%" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M109 1651q-19 19-32 13t-13-32v-1472q0-26 13-32t32 13l710 710q9 9 13 19v-710q0-26 13-32t32 13l710 710q19 19 19 45t-19 45l-710 710q-19 19-32 13t-13-32v-710q-4 10-13 19z" fill="#fff"/></svg>
    `
    ;

    const svgPagerToEnd: string = 
    `
    <?xml version="1.0" encoding="utf-8"?>
    <svg height="100%" width="100%" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M45 1651q-19 19-32 13t-13-32v-1472q0-26 13-32t32 13l710 710q9 9 13 19v-710q0-26 13-32t32 13l710 710q9 9 13 19v-678q0-26 19-45t45-19h128q26 0 45 19t19 45v1408q0 26-19 45t-45 19h-128q-26 0-45-19t-19-45v-678q-4 10-13 19l-710 710q-19 19-32 13t-13-32v-710q-4 10-13 19z" fill="#fff"/></svg>
    `
    ;

    const svgPagerToStart: string = 
    `
    <?xml version="1.0" encoding="utf-8"?>
    <svg height="100%" width="100%" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M1747 141q19-19 32-13t13 32v1472q0 26-13 32t-32-13l-710-710q-9-9-13-19v710q0 26-13 32t-32-13l-710-710q-9-9-13-19v678q0 26-19 45t-45 19h-128q-26 0-45-19t-19-45v-1408q0-26 19-45t45-19h128q26 0 45 19t19 45v678q4-10 13-19l710-710q19-19 32-13t13 32v710q4-10 13-19z" fill="#fff"/></svg>
    `
    ;


    const svgSort: string = 
    `
    <?xml version="1.0" encoding="utf-8"?>
    <svg height="100%" width="100%" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M1408 1088q0 26-19 45l-448 448q-19 19-45 19t-45-19l-448-448q-19-19-19-45t19-45 45-19h896q26 0 45 19t19 45zm0-384q0 26-19 45t-45 19h-896q-26 0-45-19t-19-45 19-45l448-448q19-19 45-19t45 19l448 448q19 19 19 45z" fill="#fff"/></svg>
    `
    ;

    const svgSortAsc: string = 
    `
    <?xml version="1.0" encoding="utf-8"?>
    <svg height="100%" width="100%" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M1395 736q0 13-10 23l-466 466q-10 10-23 10t-23-10l-466-466q-10-10-10-23t10-23l50-50q10-10 23-10t23 10l393 393 393-393q10-10 23-10t23 10l50 50q10 10 10 23z" fill="#fff"/></svg>
    `
    ;

    const svgSortDesc: string = 
    `
    <?xml version="1.0" encoding="utf-8"?>
    <svg height="100%" width="100%" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M1395 1184q0 13-10 23l-50 50q-10 10-23 10t-23-10l-393-393-393 393q-10 10-23 10t-23-10l-50-50q-10-10-10-23t10-23l466-466q10-10 23-10t23 10l466 466q10 10 10 23z" fill="#fff"/></svg>
    `
    ;

    cs.app.directive('csDatatable', ['$sce', ($sce) => new DatatableDirective($sce)])
}