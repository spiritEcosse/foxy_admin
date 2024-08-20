import jsonServerProvider from 'ra-data-json-server'
import {fetchUtils, GetListParams} from 'react-admin'

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
        if (
            error instanceof Error &&
            (error.message === 'Unauthorized' ||
                error.message === 'Failed to fetch')
        ) {
            localStorage.removeItem('auth')
            window.dispatchEvent(new Event('storage'))
            return Promise.reject(new Error('Authentication failed'))
        }
        return Promise.reject(error instanceof Error ? error : new Error(String(error)))
    }
}
const dataProviderBase = jsonServerProvider(
    import.meta.env.VITE_JSON_SERVER_URL,
    httpClient,
)

export const dataProvider = {
    ...dataProviderBase,
    getUrl(resource: string): string {
        const baseUrl = import.meta.env.VITE_JSON_SERVER_URL
        return `${baseUrl}/${resource}`
    },
    publishToSocialMedia: async () => {
        const url = `${dataProvider.getUrl('api/v1/socialmedia/admin/publish')}`
        const options = {
            method: 'POST',
            headers: new Headers({
                'Content-Type': 'application/json',
            }),
        }
        const {json} = await httpClient(url, options)
        return {data: json}
    },
    getList: async (resource: string, params: GetListParams) => {
        const {page, perPage} = params.pagination
        const {field, order} = params.sort
        const query = {
            ...fetchUtils.flattenObject(params.filter),
            sort: field,
            order: order,
            page: page,
            limit: perPage,
        }
        const url = `${dataProvider.getUrl(
            resource,
        )}?${fetchUtils.queryParameters(query)}`

        const {json} = await httpClient(url)
        return json
    },
    getMany: async (resource: string, params: GetListParams) => {
        const query = {
            ...fetchUtils.flattenObject(params.filter),
        }
        const url = `${dataProvider.getUrl(
            resource,
        )}?${fetchUtils.queryParameters(query)}`
        const {json} = await httpClient(url)
        if (json.error) {
            throw new Error(json.error)
        }
        return json
    },
    getOne: async (resource: string, params: { id: string | number }) => {
        if (resource === 'api/v1/item/admin') {
            // Custom handling for /api/v1/item/admin
            const url = `${dataProvider.getUrl(resource)}/${params.id}`
            const {json} = await httpClient(url)
            if (json.error) {
                throw new Error(json.error)
            }
            let item = json['_item']
            item.media = json['_media']
            return {data: item}
        } else if (resource === 'api/v1/order/admin') {
            // Custom handling for /api/v1/item/admin
            const url = `${dataProvider.getUrl(resource)}/${params.id}`
            const {json} = await httpClient(url)
            if (json.error) {
                throw new Error(json.error)
            }
            let item = json['_order']
            item.items = json['_items']
            item.address = json['_address']
            item.user = json['_user']
            return {data: item}
        } else {
            // Fallback to the default getOne method for other resources
            return dataProviderBase.getOne(resource, params)
        }
    },
    multiUpdate: async (
        resource: string,
        params: { ids: Array<string | number>; data: any },
    ) => {
        const url = `${dataProvider.getUrl(resource)}`
        const options = {
            method: 'PUT',
            body: JSON.stringify(params),
            headers: new Headers({'Content-Type': 'application/json'}),
        }
        const {json} = await httpClient(url, options)
        return {data: json}
    },
    updateItem: async (
        resource: string,
        params: { id: string | number; data: any },
    ) => {
        const url = `${dataProvider.getUrl(resource)}/${params.id}`
        const options = {
            method: 'PUT',
            body: JSON.stringify(params.data),
            headers: new Headers({'Content-Type': 'application/json'}),
        }
        const {json} = await httpClient(url, options)
        return {data: json}
    },
    multiCreate: async (
        resource: string,
        params: { ids: Array<string | number>; data: any },
    ) => {
        const url = `${dataProvider.getUrl(resource)}`
        const options = {
            method: 'POST',
            body: JSON.stringify(params),
            headers: new Headers({'Content-Type': 'application/json'}),
        }
        const {json} = await httpClient(url, options)
        return {data: json}
    },
    multiDelete: async (
        resource: string,
        params: { items: Array<string | number> },
    ) => {
        const url = `${dataProvider.getUrl(resource)}`
        const options = {
            method: 'DELETE',
            body: JSON.stringify(params),
            headers: new Headers({'Content-Type': 'application/json'}),
        }
        const {json} = await httpClient(url, options)
        return {data: json}
    },
}
