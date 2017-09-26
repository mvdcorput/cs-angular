namespace cs.demo {
    const moduleName: string = 'cs-angular-demo';

    export const csAngularDemo = angular.module(moduleName, ['csAngular']);

    angular.element(document).ready(function () {
        angular.bootstrap(document, [moduleName]);
    });
}