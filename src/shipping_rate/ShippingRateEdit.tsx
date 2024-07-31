import { ShippingRateEditDetails } from "./ShippingRateEditDetails";
import { Edit, EditProps, SimpleForm } from "react-admin";

const ShippingRateEdit = (props: EditProps) => (
  <Edit {...props}>
    <SimpleForm>
      <ShippingRateEditDetails />
    </SimpleForm>
  </Edit>
);

export default ShippingRateEdit;
