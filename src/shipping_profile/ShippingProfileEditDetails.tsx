import {TextInput, DateTimeInput, required, NumberInput, ReferenceInput, SelectInput} from 'react-admin';
import {Grid} from '@mui/material';
import { validatePositive } from '../utils';

export const ShippingProfileEditDetails = () => {
    return (
        <Grid container columnSpacing={2}>
            <Grid item xs={12} sm={4}>
                <TextInput disabled source="id"/>
            </Grid>
            <Grid item xs={12} sm={4}>
                <TextInput source="title" validate={required()} fullWidth/>
            </Grid>
            <Grid item xs={12} sm={4}>
                <ReferenceInput label="Country" source="country_id" reference="api/v1/country/admin">
                    <SelectInput optionText="title" validate={required()}/>
                </ReferenceInput>
            </Grid>
            <Grid item xs={12} sm={4}>
                <NumberInput source="shipping_upgrade_cost"/>
            </Grid>
            <Grid item xs={12} sm={4}>
                <NumberInput source="processing_time" validate={[required(), validatePositive]}/>
            </Grid>
            <Grid item xs={12} sm={4}>
                <TextInput source="postal_code" validate={[required(), validatePositive]}/>
            </Grid>
            <Grid item xs={12} sm={4}>
                <DateTimeInput source="created_at"/>
            </Grid>
            <Grid item xs={12} sm={4}>
                <DateTimeInput source="updated_at"/>
            </Grid>
        </Grid>
    );
};
