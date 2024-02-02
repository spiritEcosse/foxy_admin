import * as React from 'react';
import {
    NumberInput,
    ReferenceInput,
    required,
    SelectInput,
    TextInput,
} from 'react-admin';
import { InputAdornment, Grid } from '@mui/material';

export const ItemEditDetails = () => (
    <Grid container columnSpacing={2}>
        <Grid item xs={12}>
            <TextInput source="title" validate={req} fullWidth />
            <TextInput source="meta_description" validate={req} fullWidth multiline />
        </Grid>
    </Grid>
);

const req = [required()];
