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
        <table ng-if="initialized === true">
            <thead>
                <tr>
                    <th ng-repeat="column in options.columns" 
                        ng-class="column.cssClass"
                        ng-if="column.hide !== true">
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
                <tr ng-repeat="item in filteredData | startFrom: paginationOptions.page == 1 ? 1 : ((paginationOptions.page - 1) * paginationOptions.pageSize) + 1 | limitTo: paginationOptions.pageSize track by $index"
                    ng-class-even="'even'">
                    <td ng-repeat="column in options.columns"
                        ng-class="column.cssClass">
                        {{drawColumn(column, item[column.name], item)}}
                    </td>
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

        constructor(public $sce: ng.ISCEService, 
                    public sorting: cs.services.IDatatableSortService) {
            const self: DatatableDirective = this;
            
            self.link = self.unboundLink.bind(self);
        }
        
        private unboundLink($scope: IDatatableScope, $element: ng.IAugmentedJQuery, attrs: ng.IAttributes): void {
            const self: DatatableDirective = this;
            
            $scope.drawColumn = drawColumn; 
            $scope.filter = filter;
            $scope.renderDateColumn = self.renderDateColumn.bind(self);
            $scope.renderDateStringColumn = self.renderDateStringColumn.bind(self);
            $scope.sort = sort;
            
            self.initialize($scope, $element);
            
            if ($scope.options && $scope.options.sort !== undefined && $scope.options.sort !== null) {
                const column = $scope.options.columns.filter((column) => { return column.name === $scope.options.sort.columnName; })[0];

                if (column) {
                    sort(column, $scope.options.sort.direction);
                }
            } 

            function drawColumn(column: IDatatableColumn, value: any, model: any): string {
                let result = '';
     
                if (column.onDraw) {
                    result = column.onDraw({ value: value, model: model });
                } else {
                    switch (column.dataType)
                    {
                        case DataTableColumnType.date: 
                            result = $scope.renderDateColumn(value);
                            break;
                        case DataTableColumnType.dateString: 
                            result = $scope.renderDateStringColumn(value);
                            break;
                        default: 
                            result = value;
                            break;
                    }
                }
    
                return result;
            }

            function filter() {
                if ($scope.options && ($scope.options.filter !== undefined && $scope.options.filter !== null && $scope.options.filter !== ''))
                {
                    $scope.filteredData = $scope.options.data.filter(function (item: any, index, data) {
                        const columnLength = $scope.options.columns.length;
                        let match: boolean = false;
    
                        for (let i = 0; i < columnLength; i++) {
                            var column = $scope.options.columns[i];
    
                            if (item[column.name]) {
                                switch (column.dataType) {
                                    case DataTableColumnType.string:
                                        if (item[column.name].toLowerCase().indexOf($scope.options.filter.toLowerCase()) > -1) {
                                            match = true;
                                        }
                                        break;
                                    case DataTableColumnType.number:
                                        if (item[column.name].toString().toLowerCase().indexOf($scope.options.filter.toLowerCase()) > -1) {
                                            match = true;
                                        }
                                        break;
                                    case DataTableColumnType.dateString:
                                        const date = column.onDateStringConvert ? column.onDateStringConvert(item[column.name]) : new Date(item[column.name]);
                                        const matchDateStrimg = column.onDraw ? column.onDraw({ model: item, value: item[column.name]}) : self.renderDateColumn(new Date(item[column.name]));
                                        
                                        if (matchDateStrimg.indexOf($scope.options.filter) > -1) {
                                            match = true;
                                        }

                                        break;
                                    case DataTableColumnType.date:
                                        const matchDate = column.onDraw ? column.onDraw({ model: item, value: item[column.name]}) : self.renderDateColumn(new Date(item[column.name]));
    
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
                else 
                {
                    $scope.filteredData = $scope.options.data;
                }

                // Sort
                const column = $scope.options.columns.filter((column) => { return column.name === $scope.options.sort.columnName; })[0];
                
                if (column) {
                    sort(column, $scope.options.sort.direction);
                }

                // Set pagination
                if ($scope.paginationOptions.refresh) {
                    $scope.paginationOptions.total = $scope.filteredData ? $scope.filteredData.length : 1; 
                    $scope.paginationOptions.refresh();
                }
            }

            function sort(column: IDatatableColumn, direction: 'asc' | 'desc'): void {
                $scope.options.sort = { columnName: column.name, direction: direction };

                $scope.sorting.sortData($scope.filteredData, $scope.options);

                self.scopeApply($scope);
            }
        }

        private initialize($scope: IDatatableScope, $element: ng.IAugmentedJQuery): void {
            const self: DatatableDirective = this;
            
            $element.addClass('cs-datatable');

            if ($scope.options.cssClass) {
                $element.addClass($scope.options.cssClass);
            }

            if ($scope.options !== undefined && $scope.options !== null) {
                if ($scope.options.columns === undefined || $scope.options.columns === null) {
                    $scope.options.columns = [];
                }

                if ($scope.options.data === undefined || $scope.options.data === null) {
                    $scope.options.data = [];
                    $scope.filteredData = $scope.options.data.slice(0);
                }
    
                $scope.sorting = self.sorting;

                $scope.$watch('options.filter', function() {
                    $scope.filter();
                });

                self.initializeIcons($scope);

                $scope.paginationOptions = {
                    gap: 5,
                    pageSize: 5,
                    total: $scope.filteredData ? $scope.filteredData.length : 1
                }

                $scope.filter();

                $scope.initialized = true;
            }
        }

        private initializeIcons($scope: IDatatableScope) {
            const self: DatatableDirective = this;
            
            $scope.svgSort = self.$sce.trustAsHtml(svgSort);
            $scope.svgSortAsc = self.$sce.trustAsHtml(svgSortAsc);
            $scope.svgSortDesc = self.$sce.trustAsHtml(svgSortDesc);

            if ($scope.options.sortingIcons)
            {
                $scope.svgSort = self.$sce.trustAsHtml($scope.options.sortingIcons.svgSort ? $scope.options.sortingIcons.svgSort : svgSort);
                $scope.svgSortAsc = self.$sce.trustAsHtml($scope.options.sortingIcons.svgSortAsc ? $scope.options.sortingIcons.svgSortAsc : svgSortAsc);
                $scope.svgSortDesc = self.$sce.trustAsHtml($scope.options.sortingIcons.svgSortDesc ? $scope.options.sortingIcons.svgSortDesc : svgSortDesc);
            }
        }

        private renderDateColumn(value: Date): string {
            var year = value.getFullYear(); 
            var month = value.getMonth() + 1;
            var day = value.getDate();
            
            return `${pad(month, 2)}/${pad(day, 2)}/${year}`;

            function pad(value: number | string, length: number) {
                return (value.toString().length < length) ? pad("0" + value.toString(), length):value;
            }
        }

        private renderDateStringColumn(value: string, dateConverter?: (value: string) => Date): string {
            const self: DatatableDirective = this;
            
            if (dateConverter) {
                return self.renderDateColumn(dateConverter(value));
            } else {
                return self.renderDateColumn(new Date(value));
            }
        }

        private scopeApply($scope: ng.IScope): boolean {
            if ($scope == undefined && $scope == null) { return; }

            const phase = $scope.$root.$$phase;
            let result = false;
    
            if (phase !== '$apply' && phase !== '$digest') {
                $scope.$apply();

                result = true;
            }
    
            return result;
        }
    }

    interface IDatatableScope extends ng.IScope {
        drawColumn: (column: IDatatableColumn, value: any, model: any) => string;
        filter: () => void;
        filteredData: Array<any>;        
        initialized: boolean;
        options: IDatatableOptions;
        paginationOptions: IPaginationOptions;
        renderDateColumn: (value: Date) => string;
        renderDateStringColumn: (value: string, dateConverter?: (value: string) => Date) => string;
        sort: (column: IDatatableColumn, direction: 'asc' | 'desc') => void;
        sorting: cs.services.IDatatableSortService;
        svgSort: string;
        svgSortAsc: string;
        svgSortDesc: string;
    }

    if (cs.app) {
        cs.app.directive('csDatatable', ['$sce', 'datatableSortService',  ($sce, datatableSortService) => new DatatableDirective($sce, datatableSortService)])
    }
}