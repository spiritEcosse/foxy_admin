import { PageEditDetails } from './PageEditDetails'
import { Edit, EditProps, SimpleForm } from 'react-admin'

const PageEdit = (props: EditProps) => (
  <Edit {...props}>
    <SimpleForm>
      <PageEditDetails />
    </SimpleForm>
  </Edit>
)

export default PageEdit
