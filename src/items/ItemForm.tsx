import React from 'react'
import {
    required,
    TabbedForm,
    useDataProvider,
    useNotify,
    useRecordContext,
    useRedirect,
    useRefresh,
} from 'react-admin'
import ItemMediaList from './ItemMediaList.tsx'
import { ItemEditDetails } from './ItemEditDetails.tsx'
import { ItemType } from '../types'
import { HandleSubmit } from './HandleSubmit'

const RichTextInput = React.lazy(() =>
    import('ra-input-rich-text').then((module) => ({
        default: module.RichTextInput,
    })),
)

const ItemForm = () => {
    const item = useRecordContext<ItemType>()
    const notify = useNotify()
    const dataProvider = useDataProvider()
    const refresh = useRefresh();
    const redirect = useRedirect()

    const onSubmit = async (data: any) => {
        await HandleSubmit(data, item, notify, dataProvider, redirect, refresh)
    }

    return (
        <TabbedForm onSubmit={onSubmit}>
            <TabbedForm.Tab label="resources.items.tabs.images" path="">
                <ItemMediaList />
            </TabbedForm.Tab>
            <TabbedForm.Tab
                label="resources.items.tabs.details"
                path="details"
            >
                <ItemEditDetails />
            </TabbedForm.Tab>
            <TabbedForm.Tab
                label="resources.items.tabs.description"
                path="description"
            >
                <RichTextInput
                    source="description"
                    label="description"
                    validate={req}
                />
            </TabbedForm.Tab>
        </TabbedForm>
    );
}
const req = [required()]

export default ItemForm

