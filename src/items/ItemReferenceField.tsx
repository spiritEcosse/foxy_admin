import React from 'react';
import {Button, Grid} from '@mui/material';
import {useRecordContext, useRedirect} from 'react-admin';

interface Props {
    source: string;
    basePath?: string; // Optional: Include if you want to customize the base path of the link
}

const ItemReferenceField: React.FC<Props> = ({basePath = 'api/v1/item/admin'}) => {
    const record = useRecordContext();
    const redirect = useRedirect();

    return (
        <Grid>
            <Button
                onClick={() => redirect(`/${basePath}/${record.item_id}`)}
                variant="contained"
            >
                View Item
            </Button>
        </Grid>
    );
};

export default ItemReferenceField;
