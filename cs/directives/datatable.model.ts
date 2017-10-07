namespace cs.directives
{
    'use-strict';

    /** SVG image for datatable header column neutral sort icon  */
    export const svgSort: string = 
    `
    <?xml version="1.0" encoding="utf-8"?>
    <svg height="100%" width="100%" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M1408 1088q0 26-19 45l-448 448q-19 19-45 19t-45-19l-448-448q-19-19-19-45t19-45 45-19h896q26 0 45 19t19 45zm0-384q0 26-19 45t-45 19h-896q-26 0-45-19t-19-45 19-45l448-448q19-19 45-19t45 19l448 448q19 19 19 45z" fill="#fff"/></svg>
    `
    ;

    /** SVG image for datatable header column ascending sort icon  */
    export const svgSortAsc: string = 
    `
    <?xml version="1.0" encoding="utf-8"?>
    <svg height="100%" width="100%" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M1395 736q0 13-10 23l-466 466q-10 10-23 10t-23-10l-466-466q-10-10-10-23t10-23l50-50q10-10 23-10t23 10l393 393 393-393q10-10 23-10t23 10l50 50q10 10 10 23z" fill="#fff"/></svg>
    `
    ;

    /** SVG image for datatable header column descending sort icon  */
    export const svgSortDesc: string = 
    `
    <?xml version="1.0" encoding="utf-8"?>
    <svg height="100%" width="100%" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M1395 1184q0 13-10 23l-50 50q-10 10-23 10t-23-10l-393-393-393 393q-10 10-23 10t-23-10l-50-50q-10-10-10-23t10-23l466-466q10-10 23-10t23 10l466 466q10 10 10 23z" fill="#fff"/></svg>
    `
    ;

    /**
     * Type enum for data type
     */
    export enum DataTableColumnType {
        /** String/Text */
        string = 1,
        /** Number */
        number = 2,
        /** True/False */
        boolean = 3,
        /** Javascript Date */
        date = 4,
        /** String/Text that contains a date */
        dateString = 5
    }

    /**
     * Datatable column configuration
     */
    export interface IDatatableColumn {
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
    export interface IDatatableColumnOnDrawEvent {
        /** Data value of column that is being drawed */
        value: any;
        /** Data object of row */
        model: any;
    }
    
    /**
     * Options for datatable directive: cs-datatable
     */
    export interface IDatatableOptions {
        columns: Array<IDatatableColumn>;
        data: Array<any>;
        filter?: string;
        sort?: IDatatableSort;
        sortSecondare?: IDatatableSort;
    }
    
    /**
     * Options for datatable paging
     */
    export interface IDatatablePagingOptions {
        /** Number of items to show per page */
        pageSize: number;
    }

    /**
     * Datatable sort configuration
     */
    export interface IDatatableSort {
        /** Datatable column name (identifier) */
        columnName: string;
        /** Sort direction (asc or desc) */
        direction: 'asc' | 'desc';
    }
}