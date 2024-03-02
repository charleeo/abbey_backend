
export class PaginationDto<T> {
    data: T[];          // Array of paginated data
    total: number;      // Total count of items
    currentPage: number;  // Current page number
    pageSize: number;     // Page size (number of items per page)
    totalPages: number;   // Total number of pages

    constructor(data: T[], total: number, currentPage: number, pageSize: number, totalPages: number) {
        this.data = data;
        this.total = total;
        this.currentPage = currentPage;
        this.pageSize = pageSize;
        this.totalPages = totalPages;
    }
}
