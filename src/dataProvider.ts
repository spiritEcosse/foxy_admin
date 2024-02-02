import jsonServerProvider from 'ra-data-json-server';
import { GetListParams, fetchUtils} from 'react-admin';

const httpClient = async (url: string, options: fetchUtils.Options = {}) => {
    const customHeaders = (options.headers ||
        new Headers({
            Accept: 'application/json',
        })) as Headers;
    customHeaders.set('Authorization', `Bearer ${localStorage.getItem('auth')}`);
    options.headers = customHeaders;
    try {
        return await fetchUtils.fetchJson(url, options);
    } catch (error) {
        if (error instanceof Error && (error.message === 'Unauthorized' || error.message === 'Failed to fetch')) {
            localStorage.removeItem('auth');
            return Promise.reject();
        }
        return Promise.reject(error);
    }
};

const dataProviderBase = jsonServerProvider(
    import.meta.env.VITE_JSON_SERVER_URL, httpClient
);

function getUrl(resource: string): string {
    const baseUrl = import.meta.env.VITE_JSON_SERVER_URL;
    return `${baseUrl}/${resource}`;
}
export const dataProvider = {
    ...dataProviderBase,
    getList: async (resource: string, params: GetListParams) => {
        const { page, perPage } = params.pagination;
        const { field, order } = params.sort;
        const query = {
            ...fetchUtils.flattenObject(params.filter),
            _sort: field,
            _order: order,
            page: page,
            limit: perPage,
        };
        const url = `${getUrl(resource)}?${fetchUtils.queryParameters(query)}`;

        const { json } = await httpClient(url);
        return {
            data: json.items,
            total: json.count,
        };
    },
};
