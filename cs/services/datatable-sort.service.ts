namespace cs.services
{
    'use-strict';
    
    import DataTableColumnType = cs.directives.DataTableColumnType;
    import IDatatableColumn = cs.directives.IDatatableColumn;
    import IDatatableOptions = cs.directives.IDatatableOptions;

    class DatatableSortService implements IDatatableSortService {
        public sortData(data: Array<any>, options: IDatatableOptions ): void {
            const self: DatatableSortService = this;

            const column = options.columns.filter((column) => { return column.name === options.sort.columnName })[0];

            if (options.sortSecondare !== undefined && options.sortSecondare !== null) {
                const secondColumn = options.columns.filter((column) => { return column.name === options.sortSecondare.columnName })[0];
                data.sort(self.sortDataMultipleDynamic(options.sort.direction, column, secondColumn));
            } else {
                data.sort(self.sortDataDynamic(options.sort.direction, column));
            }
        }

        private sortDataDynamic(type: 'asc' | 'desc', column: IDatatableColumn) {
            const self: DatatableSortService = this;

            if (column.dataType === DataTableColumnType.number) {
                return function (a, b) {
                    const propA = a[column.name] as number;
                    const propB = b[column.name] as number;

                    if (propA === propB) return 0;
                    else if (propA === null) return 1;
                    else if (propB === null) return -1;

                    return type === 'asc' ? propA - propB : propB - propA;
                }
            }

            if (column.dataType === DataTableColumnType.string) {
                return function (a, b) {
                    let propA = a[column.name] as string;
                    let propB = b[column.name] as string;

                    if (propA === propB) return 0;
                    else if (propA === null) return 1;
                    else if (propB === null) return -1;

                    propA = propA.toLowerCase();
                    propB = propB.toLowerCase();

                    if (propA < propB) return type === 'asc' ? -1 : 1;
                    if (propA > propB) return type === 'asc' ? 1 : -1;

                    return 0;
                }
            }

            if (column.dataType === DataTableColumnType.date) {
                return function (a, b) {
                    const propA = a[column.name];
                    const propB = b[column.name];
                    const dateA = new Date(propA)
                    const dateB = new Date(propB);

                    if (propA === propB) { return 0 }
                    else if (propA === null) { return 1 }
                    else if (propB === null) { return -1 };

                    return type === 'asc' ? dateA.getTime() - dateB.getTime() : dateB.getTime() - dateA.getTime();
                }
            }

            if (column.dataType === DataTableColumnType.dateString) {
                return function (a, b) {
                    const propA = a[column.name];
                    const propB = b[column.name];
                    const dateA = column.onDateStringConvert ? column.onDateStringConvert(propA) : new Date(propA);
                    const dateB = column.onDateStringConvert ? column.onDateStringConvert(propB) : new Date(propB);

                    if (propA === propB) { return 0 }
                    else if (propA === null) { return 1 }
                    else if (propB === null) { return -1 };

                    return type === 'asc' ? dateA.getTime() - dateB.getTime() : dateB.getTime() - dateA.getTime();
                }
            }
        }

        private sortDataMultipleDynamic(sortType: 'asc' | 'desc', ...columns: IDatatableColumn[]){
            const self: DatatableSortService = this;
            /*
            * save the arguments object as it will be overwritten
            * note that arguments object is an array-like object
            * consisting of the names of the properties to sort by
            */
            return function (obj1, obj2) {
                    var i = 0, result = 0, numberOfProperties = columns.length;
                    /* try getting a different result from 0 (equal)
                     * as long as we have extra properties to compare
                     */
                    while (result === 0 && i < numberOfProperties) {
                        if (i === 0) {
                            result = self.sortDataDynamic(sortType, columns[i])(obj1, obj2);
                        } else {
                            result = self.sortDataDynamic('asc', columns[i])(obj1, obj2);
                    }
    
                    i++;
                }

                return result;
            }
        }
    }

    /**
     * Datatable sorting service
     */
    export interface IDatatableSortService
    {
        /**
         * Sorts data in a dataset based on datatable options
         */
        sortData: (data: Array<any>, options: IDatatableOptions ) => void;
    }

    if (cs.app) {
        cs.app.service('datatableSortService', [() => new DatatableSortService()]);
    }
}