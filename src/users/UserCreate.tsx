import {UserEditDetails} from "./UserEditDetails";
import { Create, SimpleForm, EditProps } from 'react-admin';

const UserEdit = (props: EditProps) => (
    <Create {...props}>
        <SimpleForm>
            <UserEditDetails/>
        </SimpleForm>
    </Create>
);

export default UserEdit;
