import {FinancialDetailsEditDetails} from "./FinancialDetailsEditDetails";
import {Edit, EditProps, SimpleForm} from "react-admin";

const FinancialDetailsEdit = (props: EditProps) => (
    <Edit {...props}>
        <SimpleForm>
            <FinancialDetailsEditDetails/>
        </SimpleForm>
    </Edit>
);

export default FinancialDetailsEdit;
