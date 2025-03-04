export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
}
export interface PressRelease {
    id: string;
    tickers: string;
    title: string;
    url: string;
    created: Date;
    analysis: string;
    analysisReasoning: string;
}
export interface PressReleasesResponse {
    data: PressRelease[];
    page: number;
    total: number;
    totalPages: number;
    limit: number;
}
//# sourceMappingURL=index.d.ts.map