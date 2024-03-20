import * as React from 'react';
import {
    required,
    TextInput,
    DateTimeInput, BooleanInput,
} from 'react-admin';
import { Grid } from '@mui/material';
import { useFormContext } from 'react-hook-form';
import { slugify } from '../utils';

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
                <BooleanInput source="enabled" />
                <DateTimeInput source="created_at" />
                <DateTimeInput source="updated_at" />
            </Grid>
        </Grid>
    );
};

