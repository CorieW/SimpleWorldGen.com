export type SearchParams = {
    search: string;
}

export type GetWorldsRequest = {
    page: number;
    limit: number;
    search: SearchParams;
}

// function getWorlds(request: GetWorldsRequest): Promise<World[]> {
//     return fetch(`/api/worlds?page=${request.page}&limit=${request.limit}&search=${request.search.search}`)
//         .then(response => response.json())
//         .then(data => data as World[]);
// }