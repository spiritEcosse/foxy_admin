import { FinancialDetailsEditDetails } from './FinancialDetailsEditDetails'
import { Create, SimpleForm, EditProps } from 'react-admin'

const FinancialDetailsCreate = (props: EditProps) => (
    <Create {...props}>
        <SimpleForm>
            <FinancialDetailsEditDetails />
        </SimpleForm>
    </Create>
)

export default FinancialDetailsCreate
