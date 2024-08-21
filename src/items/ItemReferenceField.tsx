import React from 'react'
import { Button, Grid } from '@mui/material'
import { useRecordContext, useRedirect } from 'react-admin'

const ItemReferenceField: React.FC = () => {
    const record = useRecordContext()
    const redirect = useRedirect()
    const basePath = 'api/v1/item/admin'

    return (
        <Grid>
            <Button
                onClick={() => redirect(`/${basePath}/${record.item_id}`)}
                variant="contained"
            >
                View Item
            </Button>
        </Grid>
    )
}

export default ItemReferenceField
