import { ShippingProfileEditDetails } from './ShippingProfileEditDetails'
import { Edit, EditProps, SimpleForm } from 'react-admin'

const ShippingProfileEdit = (props: EditProps) => (
  <Edit {...props}>
    <SimpleForm>
      <ShippingProfileEditDetails />
    </SimpleForm>
  </Edit>
)

export default ShippingProfileEdit
