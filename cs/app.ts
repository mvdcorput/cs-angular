namespace cs
{
    export const app = angular ? angular.module('csAngular', []) : null;

    if (app) {
        app.filter('startFrom', function() {
            return function(input: Array<any>, start: number) {
                if (input) {
                   return input.slice(start-1);
                }  

                return [];
            }
        });         
    }
}