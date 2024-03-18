import * as React from 'react';
import {
    required,
    TextInput,
} from 'react-admin';
import { Grid } from '@mui/material';
import { useFormContext } from 'react-hook-form';

function slugify(text: string) {
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')           // Replace spaces with -
        .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
        .replace(/\-\-+/g, '-')         // Replace multiple - with single -
        .replace(/^-+/, '')             // Trim - from start of text
        .replace(/-+$/, '');            // Trim - from end of text
}

export const ItemEditDetails = () => {
    const formContext = useFormContext();

    const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const slugTitle = slugify(event.target.value);
        formContext.setValue('slug', slugTitle);
    };

    return (
        <Grid container columnSpacing={2}>
            <Grid item xs={12}>
                <TextInput source="title" validate={required()} fullWidth onChange={handleTitleChange} />
                <TextInput source="slug" validate={required()} fullWidth />
                <TextInput source="meta_description" validate={required()} fullWidth multiline />
            </Grid>
        </Grid>
    );
};

