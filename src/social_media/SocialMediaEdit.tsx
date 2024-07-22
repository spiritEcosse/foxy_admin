import {SocialMediaEditDetails} from './SocialMediaEditDetails'
import {Edit, EditProps, SimpleForm} from 'react-admin'

const SocialMediaEdit = (props: EditProps) => (
    <Edit {...props}>
        <SimpleForm>
            <SocialMediaEditDetails/>
        </SimpleForm>
    </Edit>
)

export default SocialMediaEdit
