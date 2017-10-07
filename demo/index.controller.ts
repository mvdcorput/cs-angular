namespace cs.demo {
    'use-strict';
    
    import IDatatableColumnOnDrawEvent = cs.directives.IDatatableColumnOnDrawEvent;
    import IDatatableOptions = cs.directives.IDatatableOptions;
    

    class IndexController {

        constructor(public $scope: IndexScope) {
            const self: IndexController = this;

            self.setupDatatable();
        }

        setupDatatable() {
            const self: IndexController = this;
            
            // // Set demo data
            // const demoData = self.cloneArray(DemoData);
            // for (let i = 0; i < 50; i++) {
            //     demoData.push.apply(demoData, self.cloneArray(DemoData));
            // }
            // for (let j = 0, length = demoData.length; j < length; j++) {
            //     demoData[j].id = j + 1;
            // }
            const demoData = DemoData;

            // Set datatable options
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
                        sortable: true,
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
                        dataType: 1,
                        name: 'city',
                        sortable: true,
                        title: 'Stad'
                    },
                    {
                        cssClass: '',
                        dataType: 4,
                        name: 'birthdate',
                        onDraw: onBirthdateDraw,
                        sortable: true,
                        title: 'Geboortedatums'
                    }
                ],
                data: demoData,
                sort: { columnName: 'id', direction: 'asc' }
            };

            function onBirthdateDraw(event: IDatatableColumnOnDrawEvent): string {
                var date = event.value as Date;
                var year = date.getFullYear(); 
                var month = date.getMonth() + 1;
                var day = date.getDate();
                
                return `${pad(day, 2)}-${pad(month, 2)}-${year}`;
            }

            function pad(value: number | string, length: number) {
                return (value.toString().length < length) ? pad("0" + value.toString(), length):value;
            }
        }

        private cloneArray(source: Array<any>): Array<any> {
            return JSON.parse(JSON.stringify(source.slice(0)));
        }
    }

    interface IndexScope extends ng.IScope {
        datatableOptions: IDatatableOptions;
    }

    const DemoData: Array<any> = [
        { id: 1, name: 'Martijn van sder Corput', street: 'Gouddonk 18', zipcode: '4824 SX', birthdate: new Date(1979,1,1), city: 'Breda'},
        { id: 2, name: 'Hans van der Beuken', street: 'Bellenbos 45', zipcode: '4850 GF', birthdate: new Date(1984,4,6), city: 'Ulvenhout'},
        { id: 3, name: 'Winod Soekarnsingh', street: 'Andersdonk 12', zipcode: '4824 DH', birthdate: new Date(1984,5,5), city: 'Breda'},
        { id: 4, name: 'Benny van der Kolk', street: 'Oostendestraat 2', zipcode: '4813 AC', birthdate: new Date(1982,10,24), city: 'Breda'},
        { id: 5, name: 'Aart Staartjes', street: 'Barensdonk 86', zipcode: '4824 DG', birthdate: new Date(1956,3,12), city: 'Breda'},
        { id: 11, name: 'Martijn van der Corput', street: 'Gouddonk 18', zipcode: '4824 SX', birthdate: new Date(1979,1,1), city: 'Breda'},
        { id: 12, name: 'Hans van der Beuken', street: 'Bellenbos 45', zipcode: '4850 GF', birthdate: new Date(1984,4,6), city: 'Ulvenhout'},
        { id: 13, name: 'Winod Soekarnsingh', street: 'Andersdonk 12', zipcode: '4824 DH', birthdate: new Date(1984,5,5), city: 'Breda'},
        { id: 14, name: 'Benny van der Kolk', street: 'Oostendestraat 2', zipcode: '4813 AC', birthdate: new Date(1982,10,24), city: 'Breda'},
        { id: 15, name: 'Aart Staartjes', street: 'Barensdonk 86', zipcode: '4824 DG', birthdate: new Date(1956,3,12), city: 'Breda'},
        { id: 21, name: 'Martijn van der Corput', street: 'Gouddonk 18', zipcode: '4824 SX', birthdate: new Date(1982,10,24), city: 'Breda'},
        { id: 22, name: 'Hans van der Beuken', street: 'Bellenbos 45', zipcode: '4850 GF', birthdate: new Date(1984,4,6), city: 'Ulvenhout'},
        { id: 23, name: 'Winod Soekarnsingh', street: 'Andersdonk 12', zipcode: '4824 DH', birthdate: new Date(1984,5,5), city: 'Breda'},
        { id: 24, name: 'Benny van der Kolk', street: 'Oostendestraat 2', zipcode: '4813 AC', birthdate: new Date(1982,10,24), city: 'Breda'},
        { id: 25, name: 'Aart Staartjes', street: 'Barensdonk 86', zipcode: '4824 DG', birthdate: new Date(1956,3,12), city: 'Breda'}
    ];

    cs.demo.csAngularDemo.controller('IndexController', ['$scope', ($scope) => new IndexController($scope)])
}