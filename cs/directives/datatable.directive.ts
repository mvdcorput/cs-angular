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
                <tr ng-repeat="item in options.data | startFrom: paginationOptions.page == 1 ? 1 : ((paginationOptions.page - 1) * paginationOptions.pageSize) + 1 | limitTo: paginationOptions.pageSize track by $index"
                    ng-class-even="'even'">
                    <td ng-repeat="column in options.columns">{{item[column.name]}}</td>
                </tr>
            </tbody>
            <tfoot>
                <tr>
                    <td colspan="{{options.columns.length}}">
                        <div cs-pagination cs-options="paginationOptions">
                    </td>
                </tr>
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
                const column = $scope.options.columns.filter((column) => { return column.name === $scope.options.sort.columnName; })[0];

                sort(column, $scope.options.sort.direction);
            } 

            function sort(column: IDatatableColumn, direction: 'asc' | 'desc'): void {
                $scope.options.sort = { columnName: column.name, direction: direction };

                $scope.sorting.sortData($scope.options.data, $scope.options);

                self.scopeApply($scope);
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
    
                $scope.svgSort = self.$sce.trustAsHtml(svgSort);
                $scope.svgSortAsc = self.$sce.trustAsHtml(svgSortAsc);
                $scope.svgSortDesc = self.$sce.trustAsHtml(svgSortDesc);
                
                $scope.paginationOptions = {
                    gap: 5,
                    pageSize: 5,
                    total: $scope.options.data.length
                }

                $scope.sorting = new DatatableSortModel();

                $scope.initialized = true;
            }
        }

        private scopeApply($scope: ng.IScope): boolean {
            if ($scope == undefined && $scope == null) { return; }
            let result = false;
    
            const phase = $scope.$root.$$phase;
            if (phase !== '$apply' && phase !== '$digest') {
                $scope.$apply();
                result = true;
            }
    
            return result;
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

    export interface IDatatableScope extends ng.IScope {
        initialized: boolean;
        options: IDatatableOptions;
        paginationOptions: IPaginationOptions;
        sort: (column: IDatatableColumn, direction: 'asc' | 'desc') => void;
        sorting: DatatableSortModel;
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
        </style>
    `;

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