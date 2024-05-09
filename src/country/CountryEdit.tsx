import {CountryEditDetails} from "./CountryEditDetails";
import {Edit, EditProps, SimpleForm} from "react-admin";

const CountryEdit = (props: EditProps) => (
    <Edit {...props}>
        <SimpleForm>
            <CountryEditDetails/>
        </SimpleForm>
    </Edit>
);

export default CountryEdit;
