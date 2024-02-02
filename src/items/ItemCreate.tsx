import * as React from 'react';
import { Create, TabbedForm, TextInput, required } from 'react-admin';
import { ItemEditDetails } from './ItemEditDetails';
const RichTextInput = React.lazy(() =>
    import('ra-input-rich-text').then(module => ({
        default: module.RichTextInput,
    }))
);

const ItemCreate = () => (
    <Create>
        <TabbedForm defaultValues={{ sales: 0 }}>
            <TabbedForm.Tab
                label="image"
                sx={{ maxWidth: '40em' }}
            >
                <TextInput
                    autoFocus
                    source="image"
                    fullWidth
                    validate={required()}
                />
                <TextInput source="thumbnail" fullWidth validate={required()} />
            </TabbedForm.Tab>
            <TabbedForm.Tab
                label="details"
                path="details"
                sx={{ maxWidth: '40em' }}
            >
                <ItemEditDetails />
            </TabbedForm.Tab>
            <TabbedForm.Tab
                label="description"
                path="description"
            >
                <RichTextInput source="description" label="" />
            </TabbedForm.Tab>
        </TabbedForm>
    </Create>
);

export default ItemCreate;
