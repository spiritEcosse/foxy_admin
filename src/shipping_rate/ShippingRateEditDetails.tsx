import {
  TextInput,
  DateTimeInput,
  required,
  ReferenceInput,
  SelectInput,
  NumberInput,
} from "react-admin";
import { Grid } from "@mui/material";
import { validatePositive } from "../utils";

export const ShippingRateEditDetails = () => {
  return (
    <Grid container columnSpacing={2}>
      <Grid item xs={12} sm={4}>
        <TextInput disabled source="id" />
      </Grid>
      <Grid item xs={12} sm={4}>
        <ReferenceInput
          label="Country"
          source="country_id"
          reference="api/v1/country/admin"
        >
          <SelectInput optionText="title" />
        </ReferenceInput>
      </Grid>
      <Grid item xs={12} sm={4}>
        <ReferenceInput
          label="Shipping Profile"
          source="shipping_profile_id"
          reference="api/v1/shippingprofile/admin"
        >
          <SelectInput optionText="title" validate={required()} />
        </ReferenceInput>
      </Grid>
      <Grid item xs={12} sm={4}>
        <NumberInput
          source="delivery_days_min"
          validate={[required(), validatePositive]}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <NumberInput
          source="delivery_days_max"
          validate={[required(), validatePositive]}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <DateTimeInput source="created_at" />
      </Grid>
      <Grid item xs={12} sm={4}>
        <DateTimeInput source="updated_at" />
      </Grid>
    </Grid>
  );
};
