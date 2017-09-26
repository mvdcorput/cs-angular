/// <reference types="angular" />
declare namespace cs {
    const app: angular.IModule;
}
declare namespace cs.services {
    class SortingService {
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
        paging?: IDatatablePagingOptions;
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
    interface IDatatableScope {
        currentPage: number;
        pagesGap: number;
        groupedItems: Array<any>;
        initialized: boolean;
        nextPage: () => void;
        options: IDatatableOptions;
        pagedItems: Array<any>;
        prevPage: () => void;
        range: (size, start, end) => Array<any>;
        setPage: () => void;
        sort: (column: IDatatableColumn, direction: 'asc' | 'desc') => void;
        svgPagerBackward: string;
        svgPagerForward: string;
        svgPagerToEnd: string;
        svgPagerToStart: string;
        svgSort: string;
        svgSortAsc: string;
        svgSortDesc: string;
    }
}