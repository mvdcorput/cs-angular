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

                self.initializeIcons($scope);
                self.initializePages($scope);

                $scope.initialized = true;
            }
        }

        private initializeIcons($scope: IPaginationScope) {
            const self: PaginationDirective = this;
            
            $scope.svgPagerBackward = self.$sce.trustAsHtml(svgPagerBackward);
            $scope.svgPagerForward = self.$sce.trustAsHtml(svgPagerForward);
            $scope.svgPagerToEnd = self.$sce.trustAsHtml(svgPagerToEnd);
            $scope.svgPagerToStart = self.$sce.trustAsHtml(svgPagerToStart);

            if ($scope.options.paginationIcons)
            {
                $scope.svgPagerBackward = self.$sce.trustAsHtml($scope.options.paginationIcons.svgPagerBackward ? $scope.options.paginationIcons.svgPagerBackward: svgPagerBackward);
                $scope.svgPagerForward = self.$sce.trustAsHtml($scope.options.paginationIcons.svgPagerForward ? $scope.options.paginationIcons.svgPagerForward: svgPagerForward);
                $scope.svgPagerToEnd = self.$sce.trustAsHtml($scope.options.paginationIcons.svgPagerToEnd ? $scope.options.paginationIcons.svgPagerToEnd: svgPagerToEnd);
                $scope.svgPagerToStart = self.$sce.trustAsHtml($scope.options.paginationIcons.svgPagerToStart ? $scope.options.paginationIcons.svgPagerToStart: svgPagerToStart);
            }
        }
        
        private initializePages($scope: IPaginationScope): void {
            const self: PaginationDirective = this;

            if ($scope.options.total == 0) {
                $scope.pages = [];
            } else {
                $scope.pages = self.range(1, Math.ceil( $scope.options.total/ $scope.options.pageSize));
            }

            $scope.options.page = $scope.options.page ? $scope.options.page : 1;
            $scope.startPage = 1;
        }

        private range(start: number, end: number): Array<number> {
            const result = [];

            for (var i = start; i <= end; i++) {
                result.push(i);
            }

            return result;
        }
    }

    interface IPaginationScope extends ng.IScope{
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

    if (cs.app) {
        cs.app.directive('csPagination', ['$sce', ($sce) => new PaginationDirective($sce)]);
    }
}