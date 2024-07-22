import {Datagrid, DateField, List, NumberField, TextField, UrlField,} from 'react-admin'

const SocialMediaList = () => {
    return (
        <div>
            <List perPage={25} sort={{field: 'updated_at', order: 'DESC'}}>
                <Datagrid
                    rowClick="edit"
                    sx={{
                        '& .column-customer_id': {
                            display: {xs: 'none', md: 'table-cell'},
                        },
                        '& .column-total_ex_taxes': {
                            display: {xs: 'none', md: 'table-cell'},
                        },
                        '& .column-taxes': {
                            display: {xs: 'none', md: 'table-cell'},
                        },
                    }}
                >
                    <NumberField source="id"/>
                    <TextField source="title"/>
                    <UrlField source="social_url"/>
                    <TextField source="external_id"/>
                    <NumberField source="item_id"/>
                    <DateField source="created_at"/>
                    <DateField source="updated_at"/>
                </Datagrid>
            </List>
        </div>
    );
};

export default SocialMediaList
