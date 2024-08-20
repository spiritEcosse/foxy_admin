import * as React from 'react'
import { DateTimeInput, required, TextInput } from 'react-admin'
import { Grid } from '@mui/material'
import ProductReferenceField from '../items/ItemReferenceField'

export const SocialMediaEditDetails = () => {
    return (
        <Grid container columnSpacing={2}>
            <Grid item xs={12}>
                <TextInput disabled source="id" />
                <TextInput source="title" validate={required()} fullWidth />
                <TextInput
                    source="social_url"
                    fullWidth
                    validate={required()}
                />
                <TextInput
                    source="external_id"
                    fullWidth
                    validate={required()}
                />
                <ProductReferenceField />
                <DateTimeInput source="created_at" />
                <DateTimeInput source="updated_at" />
            </Grid>
        </Grid>
    )
}
