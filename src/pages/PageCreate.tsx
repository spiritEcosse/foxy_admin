import {PageEditDetails} from "./PageEditDetails";
import { Create, SimpleForm, EditProps } from 'react-admin';

const PageEdit = (props: EditProps) => (
    <Create {...props}>
        <SimpleForm>
            <PageEditDetails/>
        </SimpleForm>
    </Create>
);

export default PageEdit;
