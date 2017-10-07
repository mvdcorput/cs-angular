/// <reference types="angular" />
declare namespace cs {
    const app: angular.IModule;
}
declare namespace cs.directives {
}
declare namespace cs.directives {
    /** SVG image for datatable header column neutral sort icon  */
    const svgSort: string;
    /** SVG image for datatable header column ascending sort icon  */
    const svgSortAsc: string;
    /** SVG image for datatable header column descending sort icon  */
    const svgSortDesc: string;
    /**
     * Type enum for data type
     */
    enum DataTableColumnType {
        /** String/Text */
        string = 1,
        /** Number */
        number = 2,
        /** True/False */
        boolean = 3,
        /** Javascript Date */
        date = 4,
        /** String/Text that contains a date */
        dateString = 5,
    }
    /**
     * Datatable column configuration
     */
    interface IDatatableColumn {
        /** CSS class names for root element */
        cssClass: string;
        /** Data type for column content */
        dataType: DataTableColumnType;
        /** Optional custom convert date string to javascript Date */
        onDateStringConvert?: (value: string) => Date;
        /** Optional custom draw contents for data cell (TD) */
        onDraw?: (event: IDatatableColumnOnDrawEvent) => string;
        /** Colum name (identifier) */
        name: string;
        /** Enables/Disables sort icon in column header */
        sortable: boolean;
        /** Display title for column header */
        title: string;
    }
    /**
     * Event that fires when a data column is drawn
     */
    interface IDatatableColumnOnDrawEvent {
        /** Data value of column that is being drawed */
        value: any;
        /** Data object of row */
        model: any;
    }
    /**
     * Options for datatable directive: cs-datatable
     */
    interface IDatatableOptions {
        columns: Array<IDatatableColumn>;
        data: Array<any>;
        filter?: string;
        sort?: IDatatableSort;
        sortSecondare?: IDatatableSort;
    }
    /**
     * Options for datatable paging
     */
    interface IDatatablePagingOptions {
        /** Number of items to show per page */
        pageSize: number;
    }
    /**
     * Datatable sort configuration
     */
    interface IDatatableSort {
        /** Datatable column name (identifier) */
        columnName: string;
        /** Sort direction (asc or desc) */
        direction: 'asc' | 'desc';
    }
}
declare namespace cs.directives {
}
declare namespace cs.directives {
    /** SVG image for datatable pagination backward navigation */
    const svgPagerBackward: string;
    /** SVG image for datatable pagination forward navigation */
    const svgPagerForward: string;
    /** SVG image for datatable pagination jump to last page navigation */
    const svgPagerToEnd: string;
    /** SVG image for datatable pagination jump to first page navigation */
    const svgPagerToStart: string;
    /**
     * Options for pagination directive: cs-pagination
     */
    interface IPaginationOptions {
        gap: number;
        page?: number;
        pageSize: number;
        refresh?: () => void;
        total: number;
    }
}
declare namespace cs.services {
    import IDatatableOptions = cs.directives.IDatatableOptions;
    /**
     * Datatable sorting service
     */
    interface IDatatableSortService {
        sortData: (
            /** Array of objects */
            data: Array<any>, 
            /** Datatable options */
            options: IDatatableOptions) => void;
    }
}
