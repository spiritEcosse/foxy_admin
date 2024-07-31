import { UserEditDetails } from "./UserEditDetails";
import { Edit, EditProps, SimpleForm } from "react-admin";

const UserEdit = (props: EditProps) => (
  <Edit {...props}>
    <SimpleForm>
      <UserEditDetails />
    </SimpleForm>
  </Edit>
);

export default UserEdit;
