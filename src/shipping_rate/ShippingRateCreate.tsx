import {ShippingRateEditDetails} from "./ShippingRateEditDetails";
import { Create, SimpleForm, EditProps } from 'react-admin';

const ShippingRateEdit = (props: EditProps) => (
    <Create {...props}>
        <SimpleForm>
            <ShippingRateEditDetails/>
        </SimpleForm>
    </Create>
);

export default ShippingRateEdit;
