
namespace cs.demo {
    'use-strict';

    class IndexController {

        constructor(public $scope: IndexScope) {
            const self: IndexController = this;

            self.setupDatatable();
        }

        setupDatatable() {
            const self: IndexController = this;
            
            self.$scope.datatableOptions = {
                columns: [
                    {
                        cssClass: '',
                        dataType: 2,
                        name: 'id',
                        sortable: true,
                        title: 'Id'
                    },
                    {
                        cssClass: '',
                        dataType: 1,
                        name: 'name',
                        sortable: true,
                        title: 'Naam'
                    },
                    {
                        cssClass: '',
                        dataType: 1,
                        name: 'street',
                        sortable: false,
                        title: 'Straat'
                    },
                    {
                        cssClass: '',
                        dataType: 1,
                        name: 'zipcode',
                        sortable: true,
                        title: 'Postcode'
                    },
                    {
                        cssClass: '',
                        dataType: 2,
                        name: 'city',
                        sortable: true,
                        title: 'Stad'
                    }
                ],
                data: DemoData,
                paging: {
                    pageSize: 10
                }
            };
        }
    }

    interface IndexScope extends ng.IScope {
        datatableOptions: cs.directives.IDatatableOptions;
    }

    const DemoData: Array<any> = [
        { id: 1, name: 'Martijn van der Corput', street: 'Padakker 21', zipcode: '4824 SV', city: 'Breda'},
        { id: 2, name: 'Hans van der Beuken', street: 'Bellenbos 45', zipcode: '4850 GF', city: 'Breda'},
        { id: 3, name: 'Winod Soekarnsingh', street: 'Andersdonk 12', zipcode: '4824 DH', city: 'Breda'},
        { id: 4, name: 'Benny van der Kolk', street: 'Oostendestraat 2', zipcode: '4813 AC', city: 'Breda'},
        { id: 5, name: 'Aart Staartjes', street: 'Barensdonk 86', zipcode: '4824 DG', city: 'Breda'},
        { id: 11, name: 'Martijn van der Corput', street: 'Padakker 21', zipcode: '4824 SV', city: 'Breda'},
        { id: 12, name: 'Hans van der Beuken', street: 'Bellenbos 45', zipcode: '4850 GF', city: 'Breda'},
        { id: 13, name: 'Winod Soekarnsingh', street: 'Andersdonk 12', zipcode: '4824 DH', city: 'Breda'},
        { id: 14, name: 'Benny van der Kolk', street: 'Oostendestraat 2', zipcode: '4813 AC', city: 'Breda'},
        { id: 15, name: 'Aart Staartjes', street: 'Barensdonk 86', zipcode: '4824 DG', city: 'Breda'},
        { id: 21, name: 'Martijn van der Corput', street: 'Padakker 21', zipcode: '4824 SV', city: 'Breda'},
        { id: 22, name: 'Hans van der Beuken', street: 'Bellenbos 45', zipcode: '4850 GF', city: 'Breda'},
        { id: 23, name: 'Winod Soekarnsingh', street: 'Andersdonk 12', zipcode: '4824 DH', city: 'Breda'},
        { id: 24, name: 'Benny van der Kolk', street: 'Oostendestraat 2', zipcode: '4813 AC', city: 'Breda'},
        { id: 25, name: 'Aart Staartjes', street: 'Barensdonk 86', zipcode: '4824 DG', city: 'Breda'}
    ];

    cs.demo.csAngularDemo.controller('IndexController', ['$scope', ($scope) => new IndexController($scope)])
}