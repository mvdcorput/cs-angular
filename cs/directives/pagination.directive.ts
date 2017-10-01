namespace cs.directives
{
    'use-strict';

    class PaginationDirective implements ng.IDirective
    {
        public link;
        public restrict = 'EA';
        public scope = {
            options: '=csOptions'
        };

        public template = 
        `
        ${cssStyle}
        <ul>
            <li ng-if="pages.length>options.gap">
                <a href="" ng-click="firstPage()" class="first" ng-bind-html="svgPagerToStart" ng-class="{disabled: options.page == 1}"></a>
            </li>
            <li ng-if="pages.length>0">
                <a href="" ng-click="prevPage()" class="prev" ng-bind-html="svgPagerBackward" ng-class="{disabled: options.page == 1}"></a>
            </li>
            <li ng-repeat="page in pages | startFrom: startPage | limitTo: options.gap"
                ng-class="{active: page === options.page}">
                <a href="" ng-click="setPage(page)" class="page">{{page}}</a>
            </li>
            <li ng-if="pages.length>0">
                <a href="" ng-click="nextPage()" class="next" ng-bind-html="svgPagerForward" ng-class="{disabled: options.page == pages.length}"></a>
            </li>
            <li ng-if="pages.length>options.gap">
                <a href="" ng-click="lastPage()" class="last" ng-bind-html="svgPagerToEnd" ng-class="{disabled: options.page == pages.length}"></a>
            </li>
        </ul>
        `;

        constructor(public $sce: ng.ISCEService) {
            const self: PaginationDirective = this;
            
            self.link = self.unboundLink.bind(self);
        }
            
        private unboundLink($scope: IPaginationScope, $element: ng.IAugmentedJQuery, attrs: ng.IAttributes): void {
            const self: PaginationDirective = this;

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

            function setPage(page: number) {
                $scope.options.page = page;

                setStartPage();
            }

            function setStartPage() {
                const page = Math.ceil($scope.options.page / $scope.options.gap);

                $scope.startPage = page == 1 ? 1 : ((page - 1) * $scope.options.gap) + 1;
            }
        }

        private initialize($scope: IPaginationScope, $element: ng.IAugmentedJQuery): void {
            const self: PaginationDirective = this;
            
            $element.addClass('cs-pagination');

            if ($scope.options !== undefined && $scope.options !== null) {
                $scope.svgPagerBackward = self.$sce.trustAsHtml(svgPagerBackward);
                $scope.svgPagerForward = self.$sce.trustAsHtml(svgPagerForward);
                $scope.svgPagerToEnd = self.$sce.trustAsHtml(svgPagerToEnd);
                $scope.svgPagerToStart = self.$sce.trustAsHtml(svgPagerToStart);

                self.setPages($scope);

                $scope.options.page = $scope.options.page ? $scope.options.page : 1;
                $scope.startPage = 1;

                $scope.initialized = true;
            }
        }

        private range(start: number, end: number): Array<number> {
            const result = [];

            for (var i = start; i <= end; i++) {
                result.push(i);
            }

            return result;
        }

        private setPages($scope: IPaginationScope): void {
            const self: PaginationDirective = this;

            if ($scope.options.total == 0) {
                $scope.pages = [];
            } else {
                $scope.pages = self.range(1, Math.ceil( $scope.options.total/ $scope.options.pageSize));
            }
        }
    }
    
    export interface IPaginationOptions {
        gap: number;
        page?: number;
        pageSize: number;
        refresh?: () => void;
        total: number;
    }

    export interface IDatatableSort {
        columnName: string;
        direction: 'asc' | 'desc';
    }

    export interface IPaginationScope extends ng.IScope{
        initialized: boolean;
        firstPage: () => void;
        lastPage: () => void;
        nextPage: () => void;
        options: IPaginationOptions;
        pages: Array<number>;
        prevPage: () => void;
        setPage: (page: number) => void;
        startPage: number;
        svgPagerBackward: string;
        svgPagerForward: string;
        svgPagerToEnd: string;
        svgPagerToStart: string;
    }

    const cssStyle: string =
    `
        <style>
            .cs-pagination {
                color: #000;
            }

            .cs-pagination ul {
                display: inline-block;
                list-style: none;
                margin: 0;
                padding: 0;
            }

            .cs-pagination ul li {
                display: inline-block;
            }

            .cs-pagination a.first,
            .cs-pagination a.last,
            .cs-pagination a.next,
            .cs-pagination a.prev {
                display: inline-block;
                float: left;
                height: 1em;
                padding: 5px;
                width: 1em;
            }

            .cs-pagination a.first {
                padding-left: 0;
            }

            .cs-pagination a.last {
                padding-right: 0;
            }

            .cs-pagination a.page {
                display: inline-block;
                float: left;
                height: 1em;
                padding: 5px;
            }

            .cs-pagination .active {
                font-weight: bold;
            }

            .cs-pagination svg path {
                fill: #000;
            }

            .cs-pagination a.disabled {
                cursor: default;
            }

            .cs-pagination a.disabled svg path {
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

    cs.app.directive('csPagination', ['$sce', ($sce) => new PaginationDirective($sce)])
}