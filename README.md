# cs-angular

## Angular directives

- Datatable
- Pagination

## How to get started

### 1. Install npm package

```bash
npm install cs-angular --save 
```

### 2. Usage

You need to include at least ``cs-angular.js.min`` and  ``cs-angular.css.min`` (as minimal setup) into your project and then you can use the directives in your angular application. You can locate the files in the ``.\node_modules\cs-angular\dist`` folder of your website.

For use in TypeScript applications, a ``cs-angular.d.ts`` file is present at ``.\node_modules\cs-angular\dist``.

The API documentation is located at ``.\node_modules\cs-angular\dist\docs\index.html``

A fully working demo is located at ``.\node_modules\cs-angular\demo\index.html``

#### HTML

```html
<html ng-app="demo">
...
<body ng-controller="ExampleController">
    <cs-datatable cs-options="demoOptions"></cs-datatable>
</body>
...
</html>
```

#### Javascript

```javascript
var app = angular.module('demo', ['csAngular']);

app.controller('ExampleController', function ($scope) {
	var data = [
        { name : 'Teddy', rank: 1, birthdate: new Date(1945, 10 ,2) },
        { name : 'Donna', rank: 2, birthdate: new Date(1976, 3 , 15) },
        { name : 'Jack', rank: 3, birthdate: new Date(1960, 5 , 6) },
        { name : 'Stella', rank: 4, birthdate: new Date(1970, 2 ,27) }
    ];

    $scope.demoOptions = {
        columns: [
                {
                    cssClass: '',
                    dataType: 1,
                    name: 'name',
                    sortable: true,
                    title: 'Naam'
                },
                {
                    cssClass: '',
                    dataType: 2,
                    name: 'rank',
                    sortable: true,
                    title: 'Ranking'
                },
                {
                    cssClass: '',
                    dataType: 4,
                    name: 'birthdate',
                    onDraw: onBirthdateDraw,
                    sortable: true,
                    title: 'Birthdate'
                }
            ],
        data: data,
        sort: { columnName: 'rank', direction: 'asc' }
    };
});

```