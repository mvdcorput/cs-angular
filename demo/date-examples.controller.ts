namespace cs.demo {
    'use-strict';

    class DateExamplesController {

        constructor(public $scope: DateExamplesScope) {
            const self: DateExamplesController = this;

            self.setup();
        }

        private setup() {
            const self: DateExamplesController = this;

            // Normal date example
            self.$scope.datatableOptions1 = self.setupDatatable({
                cssClass: '',
                dataType: 4,
                name: 'birthdate',
                sortable: true,
                title: 'Geboortedatum'
            }, self.cloneArray(DemoData));    
            
            // Date formatting example
            self.$scope.datatableOptions2 = self.setupDatatable({
                cssClass: '',
                dataType: 4,
                name: 'birthdate',
                onDraw: onBirthdateDraw,
                sortable: true,
                title: 'Geboortedatum'
            }, self.cloneArray(DemoData)); 

            function onBirthdateDraw(event: cs.directives.IDatatableColumnOnDrawEvent): string {
                var date = event.value as Date;
                var year = date.getFullYear(); 
                var month = date.getMonth() + 1;
                var day = date.getDate();
                
                return `${pad(day, 2)}-${pad(month, 2)}-${year}`;

                function pad(value: number | string, length: number) {
                    return (value.toString().length < length) ? pad('0' + value.toString(), length):value;
                }
            }

            // Date as string example
            self.$scope.datatableOptions3 = self.setupDatatable({
                cssClass: '',
                dataType: 5,
                name: 'birthdate',
                sortable: true,
                title: 'Geboortedatum'
            }, self.cloneArray(DemoData, true)); 
        }

        private setupDatatable(dateColumn: cs.directives.IDatatableColumn, data : Array<any>): cs.directives.IDatatableOptions {
            const self: DateExamplesController = this;

            // Set datatable options
            return {
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
                    dateColumn
                ],
                data: data,
                sort: { columnName: 'id', direction: 'asc' }
            };

            function onBirthdateDraw(event: cs.directives.IDatatableColumnOnDrawEvent): string {
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

        private cloneArray(source: Array<any>, stringify?: boolean): Array<any> {
            return stringify === true ? JSON.parse(JSON.stringify(source.slice(0))) : source.slice(0);
        }
    }

    interface DateExamplesScope extends ng.IScope {
        datatableOptions1: cs.directives.IDatatableOptions;
        datatableOptions2: cs.directives.IDatatableOptions;
        datatableOptions3: cs.directives.IDatatableOptions;
    }

    const DemoData: Array<any> = [
        { id: 1, name: 'Martijn van der Corput', street: 'Gouddonk 18', zipcode: '4824 SX', birthdate: new Date(1979,6,1), city: 'Breda'},
        { id: 2, name: 'Hans van der Beuken', street: 'Bellenbos 45', zipcode: '4850 GF', birthdate: new Date(1984,4,6), city: 'Ulvenhout'},
        { id: 3, name: 'Winod Soekarnsingh', street: 'Andersdonk 12', zipcode: '4824 DH', birthdate: new Date(1984,5,5), city: 'Breda'},
        { id: 4, name: 'Kim van de Brug', street: 'Oostendestraat 2', zipcode: '4813 AC', birthdate: new Date(1982,10,24), city: 'Breda'},
        { id: 5, name: 'Aart Staartjes', street: 'Barensdonk 86', zipcode: '4824 DG', birthdate: new Date(1956,3,12), city: 'Breda'},
        { id: 11, name: 'Denzel Washington', street: 'Gouddonk 23', zipcode: '4824 SX', birthdate: new Date(1975,4,12), city: 'Breda'},
        { id: 12, name: 'Piet Schraven', street: 'Bellenbos 45', zipcode: '4850 GF', birthdate: new Date(1984,4,6), city: 'Ulvenhout'},
        { id: 13, name: 'Jesse Pinksterman', street: 'Andersdonk 12', zipcode: '4824 DH', birthdate: new Date(1962,1,15), city: 'Breda'},
        { id: 14, name: 'Aghmed Bazouizzi', street: 'Oostendestraat 2', zipcode: '4813 AC', birthdate: new Date(1974,3,24), city: 'Breda'},
        { id: 15, name: 'Petra Moelens', street: 'Barensdonk 86', zipcode: '4824 DG', birthdate: new Date(1982,11,3), city: 'Breda'},
        { id: 21, name: 'Jan van Schaperen', street: 'Gouddonk 6', zipcode: '4824 SX', birthdate: new Date(1956,11, 3), city: 'Breda'},
        { id: 22, name: 'Willem de Vondst', street: 'Bellenbos 45', zipcode: '4850 GF', birthdate: new Date(1984,4,6), city: 'Ulvenhout'},
        { id: 23, name: 'Tineke Schoutemaker', street: 'Andersdonk 12', zipcode: '4824 DH', birthdate: new Date(1984,5,5), city: 'Breda'},
        { id: 24, name: 'Benny van der Kolk', street: 'Oostendestraat 2', zipcode: '4813 AC', birthdate: new Date(1976,5,2), city: 'Breda'},
        { id: 25, name: 'Theodoor Spraakmaker', street: 'Barensdonk 86', zipcode: '4824 DG', birthdate: new Date(1956,3,12), city: 'Breda'}
    ];

    cs.demo.csAngularDemo.controller('DateExamplesController', ['$scope', ($scope) => new DateExamplesController($scope)])
}