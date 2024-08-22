import { TextInput, DateTimeInput, required, NumberInput } from 'react-admin'
import { Grid } from '@mui/material'

export const FinancialDetailsEditDetails = () => {
    return (
        <Grid container columnSpacing={2}>
            <Grid item xs={12}>
                <TextInput disabled source="id" />
                <NumberInput
                    source="tax_rate"
                    fullWidth
                    validate={required()}
                />
                <TextInput source="gateway" fullWidth validate={required()} />
                <TextInput
                    source="gateway_merchant_id"
                    fullWidth
                    validate={required()}
                />
                <TextInput
                    source="merchant_id"
                    fullWidth
                    validate={required()}
                />
                <TextInput
                    source="merchant_name"
                    fullWidth
                    validate={required()}
                />
                <DateTimeInput source="created_at" />
                <DateTimeInput source="updated_at" />
            </Grid>
        </Grid>
    )
}
