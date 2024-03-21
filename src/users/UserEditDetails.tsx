import {TextInput, DateInput, required, PasswordInput} from 'react-admin';
import { Grid } from '@mui/material';

export const UserEditDetails = () => {
    return (
        <Grid container columnSpacing={2}>
            <Grid item xs={12}>
                <TextInput disabled source="id" />
                <TextInput type="email" source="email" fullWidth validate={required()}/>
                <PasswordInput source="password" fullWidth validate={required()}/>
                <DateInput source="created_at" />
                <DateInput source="updated_at" />
            </Grid>
        </Grid>
    );
};

