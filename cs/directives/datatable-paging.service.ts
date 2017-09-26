namespace cs.services
{
    'use-strict';
    
    export class PagingService {
        public currentPage: number;
        public pagesGap: number;
        public groupedItems: Array<any>;
        public pagedItems: Array<any>;

        constructor() {
            const self: PagingService = this;

            self.pagesGap = 5;
            self.currentPage = 0;
            self.groupedItems = [];
            self.pagedItems = [];
        }

        public firstPage() {
            const self: PagingService = this;

            if (self.currentPage > 0) {
                self.currentPage = 0;
            }
        };

        public lastPage() {
            const self: PagingService = this;

            if (self.currentPage < self.pagedItems.length - 1) {
                self.currentPage = self.pagedItems.length - 1;
            }
        };

        public nextPage() {
            const self: PagingService = this;

            if (self.currentPage < self.pagedItems.length - 1) {
                self.currentPage++;
            }
        };

        public prevPage() {
            const self: PagingService = this;

            if (self.currentPage > 0) {
                self.currentPage--;
            }
        };

        public range(size: number, start: number, end: number): Array<number> {
            const self: PagingService = this;
            const ret = [];        
                          
            if (size < end) {
                end = size;
                start = size - self.pagesGap;

                if (start < 0) {
                    start = 0;
                }
            }

            for (var i = start; i < end; i++) {
                ret.push(i);
            }        

            return ret;
        };
        
        public setPages(data: Array<any>, pageSize: number) {
            const self: PagingService = this;

            self.pagedItems = [];
            
            for (var i = 0; i < data.length; i++) {
                if (i % pageSize === 0) {
                    self.pagedItems[Math.floor(i / pageSize)] = [ data[i] ];
                } else {
                    self.pagedItems[Math.floor(i / pageSize)].push(data[i]);
                }
            }
        }
    }

    cs.app.service("pagingService", [() => new PagingService()]);
}