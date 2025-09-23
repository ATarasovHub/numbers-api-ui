interface AccountDetailsResponse {
    content: any[];
    last: boolean;
}

export const customerTableService = {
    fetchAccountDetails: async (
        customerName: string,
        techAccountId: number,
        pageNum: number,
        searchNumber?: string
    ): Promise<AccountDetailsResponse> => {
        let url = `http://localhost:8080/customer/overview/${encodeURIComponent(customerName)}/${techAccountId}?page=${pageNum}&size=10`;
        if (searchNumber) {
            url += `&number=${encodeURIComponent(searchNumber)}`;
        }

        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        return response.json();
    },
};