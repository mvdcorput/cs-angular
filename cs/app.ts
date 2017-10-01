namespace cs
{
    export const app = angular.module('csAngular', []);

    app.filter('startFrom', function() {
        return function(input: Array<any>, start: number) {
            if (input) {
                return input.slice(start-1);
            }

            return [];
        }
    });
}