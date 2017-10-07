namespace cs.directives
{
    'use-strict';

    /** SVG image for datatable pagination backward navigation */
    export const svgPagerBackward: string = 
    `
    <?xml version="1.0" encoding="utf-8"?>
    <svg height="100%" width="100%" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M1683 141q19-19 32-13t13 32v1472q0 26-13 32t-32-13l-710-710q-9-9-13-19v710q0 26-13 32t-32-13l-710-710q-19-19-19-45t19-45l710-710q19-19 32-13t13 32v710q4-10 13-19z" fill="#fff"/></svg>
    `
    ;

    /** SVG image for datatable pagination forward navigation */
    export const svgPagerForward: string = 
    `
    <?xml version="1.0" encoding="utf-8"?>
    <svg height="100%" width="100%" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M109 1651q-19 19-32 13t-13-32v-1472q0-26 13-32t32 13l710 710q9 9 13 19v-710q0-26 13-32t32 13l710 710q19 19 19 45t-19 45l-710 710q-19 19-32 13t-13-32v-710q-4 10-13 19z" fill="#fff"/></svg>
    `
    ;

    /** SVG image for datatable pagination jump to last page */
    export const svgPagerToEnd: string = 
    `
    <?xml version="1.0" encoding="utf-8"?>
    <svg height="100%" width="100%" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M45 1651q-19 19-32 13t-13-32v-1472q0-26 13-32t32 13l710 710q9 9 13 19v-710q0-26 13-32t32 13l710 710q9 9 13 19v-678q0-26 19-45t45-19h128q26 0 45 19t19 45v1408q0 26-19 45t-45 19h-128q-26 0-45-19t-19-45v-678q-4 10-13 19l-710 710q-19 19-32 13t-13-32v-710q-4 10-13 19z" fill="#fff"/></svg>
    `
    ;

    /** SVG image for datatable pagination jump to first pages */
    export const svgPagerToStart: string = 
    `
    <?xml version="1.0" encoding="utf-8"?>
    <svg height="100%" width="100%" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M1747 141q19-19 32-13t13 32v1472q0 26-13 32t-32-13l-710-710q-9-9-13-19v710q0 26-13 32t-32-13l-710-710q-9-9-13-19v678q0 26-19 45t-45 19h-128q-26 0-45-19t-19-45v-1408q0-26 19-45t45-19h128q26 0 45 19t19 45v678q4-10 13-19l710-710q19-19 32-13t13 32v710q4-10 13-19z" fill="#fff"/></svg>
    `
    ;

    /**
     * Options for pagination directive: cs-pagination
     */
    export interface IPaginationOptions {
        /** Size of gap between navigation buttons (number of directly selectable items) */ 
        gap: number;
        /** Number of current page that is being displayed */ 
        page?: number;
        /** Number of items in page */ 
        pageSize: number;
        /* Custom svg icons */
        paginationIcons?: IPaginationIcons,
        /** Function that refreshes the datatable. Is bound at datatable initialisation */ 
        refresh?: () => void;
        /** Total number of items */ 
        total: number;
    }

    /**
     * Custom icons for pagination buttons
     */
    export interface IPaginationIcons {
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