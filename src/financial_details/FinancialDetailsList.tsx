import { List, Datagrid, TextField, DateField, NumberField } from 'react-admin'

const FinancialDetailsList = () => (
  <List perPage={25} sort={{ field: 'updated_at', order: 'DESC' }}>
    <Datagrid
      rowClick="edit"
      sx={{
        '& .column-tax_rate': {
          display: { xs: 'none', md: 'table-cell' },
        },
      }}
    >
      <NumberField source="id" />
      <TextField source="tax_rate" />
      <DateField source="created_at" />
      <DateField source="updated_at" />
    </Datagrid>
  </List>
)

export default FinancialDetailsList
