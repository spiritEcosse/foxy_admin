import React from 'react';
import {
    Edit,
    required,
    TabbedForm,
    useRecordContext,
    Toolbar,
    SaveButton,
    DeleteButton, useRedirect,
} from 'react-admin';
import { ItemEditDetails } from './ItemEditDetails';
import { ItemType, MediaType } from '../types';
import ItemMediaList from "./ItemMediaList";
import { useState} from "react";
import {HandleSubmit} from "./HandleSubmit";
import {useDataProvider, useNotify, useUpdate} from 'react-admin';

const RichTextInput = React.lazy(() =>
    import('ra-input-rich-text').then(module => ({
        default: module.RichTextInput,
    }))
);

const ProductTitle = () => {
    const record = useRecordContext<ItemType>();
    return record ? <span>Poster {record.title}</span> : null;
};

const CustomToolbar = props => (
    <Toolbar {...props} >
        <SaveButton alwaysEnable />
        <DeleteButton />
    </Toolbar>
);

const ItemEdit = () => {
    const initialRecord = useRecordContext<ItemType>();
    const [record, setRecord] = useState<ItemType>(initialRecord);
    const [recordsToDelete, setRecordsToDelete] = useState<MediaType[]>([]);
    const [updateItem] = useUpdate();
    const notify = useNotify();
    const dataProvider = useDataProvider();
    const redirect = useRedirect();

    const onSubmit = async (data: any) => {
        await HandleSubmit(
            data,
            record,
            setRecord,
            recordsToDelete,
            setRecordsToDelete,
            updateItem,
            notify,
            dataProvider,
            redirect
            );
    };

    return (
        <Edit title={<ProductTitle/>}>
            <TabbedForm onSubmit={onSubmit} toolbar={<CustomToolbar />}>
                <TabbedForm.Tab
                    label="resources.items.tabs.images"
                >
                    <ItemMediaList
                        setRecord={setRecord}
                        setRecordsToDelete={setRecordsToDelete}
                    />
                </TabbedForm.Tab>
                <TabbedForm.Tab
                    label="resources.items.tabs.details"
                    path="details"
                >
                    <ItemEditDetails/>
                </TabbedForm.Tab>
                <TabbedForm.Tab
                    label="resources.items.tabs.description"
                    path="description"
                >
                    <RichTextInput source="description" label="" validate={req}/>
                </TabbedForm.Tab>
            </TabbedForm>
        </Edit>
    );
};

const req = [required()];

export default ItemEdit;
