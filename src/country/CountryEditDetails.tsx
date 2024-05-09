import {TextInput, DateTimeInput, required} from 'react-admin';
import { Grid } from '@mui/material';

export const CountryEditDetails = () => {
    return (
        <Grid container columnSpacing={2}>
            <Grid item xs={12}>
                <TextInput disabled source="id" />
                <TextInput source="title" validate={required()} fullWidth />
                <DateTimeInput source="created_at" />
                <DateTimeInput source="updated_at" />
            </Grid>
        </Grid>
    );
};

