import { ShippingProfileEditDetails } from './ShippingProfileEditDetails'
import { Create, SimpleForm, EditProps } from 'react-admin'

const ShippingProfileEdit = (props: EditProps) => (
    <Create {...props}>
        <SimpleForm>
            <ShippingProfileEditDetails />
        </SimpleForm>
    </Create>
)

export default ShippingProfileEdit
