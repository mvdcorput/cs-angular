/// <reference types="angular" />
declare namespace cs {
    const app: angular.IModule;
}
declare namespace cs.directives {
    class DatatableSortModel {
        sortData(data: Array<any>, options: cs.directives.IDatatableOptions): void;
        sortDataDynamic(type: 'asc' | 'desc', column: cs.directives.IDatatableColumn): (a: any, b: any) => number;
        sortDataMultipleDynamic(sortType: 'asc' | 'desc', ...columns: cs.directives.IDatatableColumn[]): (obj1: any, obj2: any) => number;
    }
}
declare namespace cs.directives {
    enum DataTableColumnType {
        string = 1,
        number = 2,
        boolean = 3,
        date = 4,
        dateJson = 5,
    }
    interface IDatatableColumn {
        cssClass: string;
        dataType: DataTableColumnType;
        name: string;
        sortable: boolean;
        title: string;
    }
    interface IDatatableOptions {
        columns: Array<IDatatableColumn>;
        data: Array<any>;
        sort?: IDatatableSort;
        sortSecondare?: IDatatableSort;
    }
    interface IDatatablePagingOptions {
        pageSize: number;
    }
    interface IDatatableSort {
        columnName: string;
        direction: 'asc' | 'desc';
    }
    interface IDatatableScope extends ng.IScope {
        initialized: boolean;
        options: IDatatableOptions;
        paginationOptions: IPaginationOptions;
        sort: (column: IDatatableColumn, direction: 'asc' | 'desc') => void;
        sorting: DatatableSortModel;
        svgSort: string;
        svgSortAsc: string;
        svgSortDesc: string;
    }
}
declare namespace cs.directives {
    interface IPaginationOptions {
        gap: number;
        page?: number;
        pageSize: number;
        total: number;
    }
    interface IDatatableSort {
        columnName: string;
        direction: 'asc' | 'desc';
    }
    interface IPaginationScope extends ng.IScope {
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
}
