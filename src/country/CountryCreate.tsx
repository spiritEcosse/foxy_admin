import { CountryEditDetails } from "./CountryEditDetails";
import { Create, SimpleForm, EditProps } from "react-admin";

const CountryEdit = (props: EditProps) => (
  <Create {...props}>
    <SimpleForm>
      <CountryEditDetails />
    </SimpleForm>
  </Create>
);

export default CountryEdit;
