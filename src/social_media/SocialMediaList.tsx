import {Datagrid, DateField, List, NumberField, TextField, UrlField, useNotify,} from 'react-admin'
import {Button} from "@mui/material";
import {dataProvider} from "../dataProvider";

const SocialMediaList = () => {
    const notify = useNotify();

    const handlePublish = async () => {
        try {
            const data = await dataProvider.publishToSocialMedia();
            notify(`Publishing started : ${data.data.result}`, {type: 'success'});
        } catch (error) {
            notify(`Error publishing, error : ${error}`, {type: 'error'});
        }
    };

    return (
        <div>
            <Button onClick={handlePublish} variant="contained">
                <i className="fab fa-twitter"></i>
                Publish all items on Twitter
            </Button>
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
