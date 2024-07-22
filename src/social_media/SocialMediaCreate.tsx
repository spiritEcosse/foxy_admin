import {SocialMediaEditDetails} from './SocialMediaEditDetails'
import {Create, EditProps, SimpleForm} from 'react-admin'

const PageEdit = (props: EditProps) => (
    <Create {...props}>
        <SimpleForm>
            <SocialMediaEditDetails/>
        </SimpleForm>
    </Create>
)

export default PageEdit
