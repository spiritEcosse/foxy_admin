import { Identifier, RaRecord } from 'react-admin'

export type ThemeName = 'light' | 'dark'

export interface Category extends RaRecord {
    name: string
}

export interface PageType extends RaRecord {
    title: string
    slug: string
    description: string
    meta_description: string
    canonical_url: string
    created_at: Date
    updated_at: Date
}

export interface CountryType extends RaRecord {
    title: string
    code: string
    created_at: Date
    updated_at: Date
}

export interface ShippingProfileType extends RaRecord {
    title: string
    country_id: Identifier
    postal_code: string
    processing_time: number
    shipping_upgrade_cost: number
    created_at: Date
    updated_at: Date
}

export interface ShippingRateType extends RaRecord {
    country_id: Identifier
    shipping_profile_id: Identifier
    delivery_days_min: number
    delivery_days_max: number
    created_at: Date
    updated_at: Date
}

export interface ItemType extends RaRecord {
    title: string
    meta_description: string
    description: string
    media: MediaType[]
    created_at: Date
    enabled: boolean
    slug: string
    updated_at: Date
    price: number
    shipping_profile_id: Identifier
}

export enum MediaTypeEnum {
    IMAGE = 'image',
    VIDEO = 'video',
}

export interface MediaType extends RaRecord {
    item_id: number
    type: MediaTypeEnum
    src: string
    sort: number
    created_at: Date
    updated_at: Date
}

export interface User extends RaRecord {
    password: string
    first_name: string
    last_name: string
    birthday: Date
    total_spent: number
    email: string
    first_seen: Date
    last_seen: string
    has_ordered: boolean
    latest_purchase: string
    has_newsletter: boolean
    created_at: Date
    updated_at: Date
}

export interface Address extends RaRecord {
    address: string
    city: string
    zipcode: string
    country: CountryType
    user_id: number
    created_at: Date
    updated_at: Date
}

export type OrderStatus = 'Ordered' | 'Delivered' | 'Cancelled'

export interface Order extends RaRecord {
    status: OrderStatus
    count_items: number
    date: Date
    total: number
    total_ex_taxes: number
    tax_rate: number
    taxes: number
    user_id: Identifier
    reference: string
    created_at: Date
    updated_at: Date
    basket_id: number
    address_id: number
    items: ItemType
}

export interface SocialMediaType extends RaRecord {
    title: string
    external_id: string
    social_url: string
    item_id: Identifier
    created_at: Date
    updated_at: Date
}

export interface FinancialDetails extends RaRecord {
    tax_rate: number
    gateway: string
    gateway_merchant_id: string
    merchant_id: string
    merchant_name: string
    created_at: Date
    updated_at: Date
}

export type BasketItem = {
    id: Identifier
    item_id: Identifier
    quantity: number
    basket_id: number
    price: number
    created_at: Date
    updated_at: Date
}

export interface Invoice extends RaRecord {
    date: Date
}

export type ReviewStatus = 'accepted' | 'pending' | 'rejected'

export interface Review extends RaRecord {
    status: ReviewStatus
    user_id: Identifier
    item_id: Identifier
    comment: string
    created_at: Date
    updated_at: Date
}
