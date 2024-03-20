import { Identifier, RaRecord } from 'react-admin';

export type ThemeName = 'light' | 'dark';

export interface Category extends RaRecord {
    name: string;
}

export interface PageType extends RaRecord {
    title: string;
    slug: string;
    description: string;
    meta_description: string;
    canonical_url: string;
    created_at: string;
    updated_at: string;
}

export interface ItemType extends RaRecord {
    title: string;
    meta_description: string;
    description: string;
    media: MediaType[];
    created_at: string;
    enabled: boolean;
    slug: string;
    updated_at: string;
}

export interface MediaType extends RaRecord {
    item_id: number;
    thumb: string;
    src: string;
    sort: number;
    created_at: string;
    updated_at: string;
}

export interface Customer extends RaRecord {
    first_name: string;
    last_name: string;
    address: string;
    stateAbbr: string;
    city: string;
    zipcode: string;
    avatar: string;
    birthday: string;
    first_seen: string;
    last_seen: string;
    has_ordered: boolean;
    latest_purchase: string;
    has_newsletter: boolean;
    groups: string[];
    nb_commands: number;
    total_spent: number;
    email: string;
}

export type OrderStatus = 'ordered' | 'delivered' | 'cancelled';

export interface Order extends RaRecord {
    status: OrderStatus;
    basket: BasketItem[];
    date: Date;
    total: number;
    total_ex_taxes: number;
    delivery_fees: number;
    tax_rate: number;
    taxes: number;
    customer_id: Identifier;
    reference: string;
}

export type BasketItem = {
    product_id: Identifier;
    quantity: number;
};

export interface Invoice extends RaRecord {
    date: Date;
}

export type ReviewStatus = 'accepted' | 'pending' | 'rejected';

export interface Review extends RaRecord {
    date: Date;
    status: ReviewStatus;
    customer_id: Identifier;
    product_id: Identifier;
    comment: string;
}

declare global {
    interface Window {
        restServer: any;
    }
}
