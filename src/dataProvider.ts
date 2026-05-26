import jsonServerProvider from 'ra-data-json-server'
import { fetchUtils, GetListParams } from 'react-admin'

const httpClient = async (url: string, options: fetchUtils.Options = {}) => {
    const customHeaders = (options.headers ||
        new Headers({
            Accept: 'application/json',
        })) as Headers
    customHeaders.set('Authorization', `Bearer ${localStorage.getItem('auth')}`)
    options.headers = customHeaders
    try {
        return await fetchUtils.fetchJson(url, options)
    } catch (error) {
        if (error instanceof Error && error.message === 'Unauthorized') {
            localStorage.removeItem('auth')
            window.dispatchEvent(new Event('storage'))
            return Promise.reject(new Error('Authentication failed'))
        }
        return Promise.reject(
            error instanceof Error ? error : new Error(String(error)),
        )
    }
}
const url = (resource: string) =>
    `${import.meta.env.VITE_JSON_SERVER_URL}/${resource}`

const dataProviderBase = jsonServerProvider(
    import.meta.env.VITE_JSON_SERVER_URL,
    httpClient,
)

export const dataProvider = {
    ...dataProviderBase,
    getList: async (resource: string, params: GetListParams) => {
        const { page, perPage } = params.pagination
        const { field, order } = params.sort
        const query = {
            ...fetchUtils.flattenObject(params.filter),
            sort: field,
            order,
            page,
            limit: perPage,
        }
        const { json } = await httpClient(
            `${url(resource)}?${fetchUtils.queryParameters(query)}`,
        )
        return { data: json.data, total: json.total }
    },
    getMany: async (resource: string, params: GetListParams) => {
        const query = fetchUtils.flattenObject(params.filter)
        const { json } = await httpClient(
            `${url(resource)}?${fetchUtils.queryParameters(query)}`,
        )
        // TODO: only getMany checks this. Either move to httpClient if the
        // backend can return { error } with HTTP 200 on any endpoint, or
        // delete if this branch is dead.
        if (json.error) {
            throw new Error(json.error)
        }
        return { data: json.data }
    },
    multi: async (
        resource: string,
        method: 'POST' | 'PUT' | 'DELETE',
        params: { items: Array<any> },
    ) => {
        const { json } = await httpClient(url(resource), {
            method,
            body: JSON.stringify(params),
            headers: new Headers({ 'Content-Type': 'application/json' }),
        })
        return { data: json }
    },
}
