import { TextInput, DateTimeInput, required, PasswordInput } from "react-admin";
import { Grid } from "@mui/material";

export const UserEditDetails = () => {
  return (
    <Grid container columnSpacing={2}>
      <Grid item xs={12}>
        <TextInput disabled source="id" />
        <TextInput
          type="email"
          source="email"
          fullWidth
          validate={required()}
        />
        <PasswordInput source="password" fullWidth validate={required()} />
        <DateTimeInput source="created_at" />
        <DateTimeInput source="updated_at" />
      </Grid>
    </Grid>
  );
};
