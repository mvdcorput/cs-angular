namespace cs.demo {
    'use-strict';

    import IDatatableOptions = cs.directives.IDatatableOptions;
    
    class StylingExamplesController {

        constructor(public $scope: FilterExamplesScope) {
            const self: StylingExamplesController = this;

            self.setup();
        }

        private setup() {
            const self: StylingExamplesController = this;

            // Blue styling example (datatable-blue.css)
            const blueDatatableOptions = self.setupDatatable(self.cloneArray(DemoData, true)); 

            blueDatatableOptions.cssClass = 'blue';

            self.$scope.blueDatatableOptions = blueDatatableOptions; 
            
            // Custom SVG icons example
            const customIconsOptions = self.setupDatatable(self.cloneArray(DemoData, true));

            customIconsOptions.sortingIcons = {
                svgSort: `
                <?xml version="1.0" encoding="utf-8"?>
                <svg height="100%" width="100%" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M1216 320q0 26-19 45t-45 19h-128v1024h128q26 0 45 19t19 45-19 45l-256 256q-19 19-45 19t-45-19l-256-256q-19-19-19-45t19-45 45-19h128v-1024h-128q-26 0-45-19t-19-45 19-45l256-256q19-19 45-19t45 19l256 256q19 19 19 45z" fill="#fff"/></svg>
                `,
                svgSortAsc: `
                <?xml version="1.0" encoding="utf-8"?>
                <svg height="100%" width="100%" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M1277 1299q8 19-5 35l-350 384q-10 10-23 10-14 0-24-10l-355-384q-13-16-5-35 9-19 29-19h224v-1248q0-14 9-23t23-9h192q14 0 23 9t9 23v1248h224q21 0 29 19z" fill="#fff"/></svg>
                `,
                svgSortDesc: `
                <?xml version="1.0" encoding="utf-8"?>
                <svg height="100%" width="100%" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M1277 493q-9 19-29 19h-224v1248q0 14-9 23t-23 9h-192q-14 0-23-9t-9-23v-1248h-224q-21 0-29-19t5-35l350-384q10-10 23-10 14 0 24 10l355 384q13 16 5 35z" fill="#fff"/></svg>  
                `
            };

            self.$scope.customIconsDatatableOptions = customIconsOptions;
        }

        private setupDatatable(data : Array<any>): IDatatableOptions {
            const self: StylingExamplesController = this;

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
                        title: 'Naam', 
                        style: { width: '200px' }
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
                        cssClass: 'birthdate',
                        dataType: 5,
                        name: 'birthdate',
                        sortable: true,
                        title: 'Geboortedatum'
                    }
                ],
                data: data,
                sort: { columnName: 'id', direction: 'asc' }
            };
        }

        private cloneArray(source: Array<any>, stringify?: boolean): Array<any> {
            return stringify === true ? JSON.parse(JSON.stringify(source.slice(0))) : source.slice(0);
        }
    }

    interface FilterExamplesScope extends ng.IScope {
        blueDatatableOptions: IDatatableOptions;
        customIconsDatatableOptions: IDatatableOptions;
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

    cs.demo.csAngularDemo.controller('StylingExamplesController', ['$scope', ($scope) => new StylingExamplesController($scope)])
}