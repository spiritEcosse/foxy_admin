import {
  List,
  Datagrid,
  TextField,
  DateField,
  NumberField,
  BooleanField,
} from "react-admin";

const PageList = () => (
  <List perPage={25} sort={{ field: "updated_at", order: "DESC" }}>
    <Datagrid
      rowClick="edit"
      sx={{
        "& .column-customer_id": {
          display: { xs: "none", md: "table-cell" },
        },
        "& .column-total_ex_taxes": {
          display: { xs: "none", md: "table-cell" },
        },
        "& .column-delivery_fees": {
          display: { xs: "none", md: "table-cell" },
        },
        "& .column-taxes": {
          display: { xs: "none", md: "table-cell" },
        },
      }}
    >
      <NumberField source="id" />
      <TextField source="title" />
      <TextField source="slug" />
      <BooleanField source="enabled" />
      <TextField source="canonical_url" />
      <DateField source="created_at" />
      <DateField source="updated_at" />
    </Datagrid>
  </List>
);

export default PageList;
