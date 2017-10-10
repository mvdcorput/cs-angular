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
        /** Optional CSS class names for root element */
        cssClass?: string;
        /** Data type for column content */
        dataType: DataTableColumnType;
        /** Optionally set display to none for column */
        hide?: boolean;
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
        /** Columns definition for datatable */
        columns: Array<IDatatableColumn>;
        /** Optional CSS class to add to directive root element */
        cssClass?: string;
        /** Dataset (array of objects) */
        data: Array<any>;
        /** Filter function, bound by directive on initialisation */
        filter?: string;
        /** Optional sort configuration */
        sort?: IDatatableSort;
        /** Optional secundary/fallback sort configuration */
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
    /** SVG image for datatable pagination jump to last page */
    const svgPagerToEnd: string;
    /** SVG image for datatable pagination jump to first pages */
    const svgPagerToStart: string;
    /**
     * Options for pagination directive: cs-pagination
     */
    interface IPaginationOptions {
        /** Size of gap between navigation buttons (number of directly selectable items) */
        gap: number;
        /** Number of current page that is being displayed */
        page?: number;
        /** Number of items in page */
        pageSize: number;
        paginationIcons?: IPaginationIcons;
        /** Function that refreshes the datatable. Is bound at datatable initialisation */
        refresh?: () => void;
        /** Total number of items */
        total: number;
    }
    /**
     * Custom icons for pagination buttons
     */
    interface IPaginationIcons {
        /** SVG image soure for datatable pagination backward navigation */
        svgPagerBackward?: string;
        /** SVG image soure for datatable pagination forward navigation */
        svgPagerForward?: string;
        /** SVG image soure for datatable pagination jump to last page */
        svgPagerToEnd?: string;
        /** SVG image soure for datatable pagination jump to first pages */
        svgPagerToStart?: string;
    }
}
declare namespace cs.services {
    import IDatatableOptions = cs.directives.IDatatableOptions;
    /**
     * Datatable sorting service
     */
    interface IDatatableSortService {
        /**
         * Sorts data in a dataset based on datatable options
         */
        sortData: (data: Array<any>, options: IDatatableOptions) => void;
    }
}
