import React from 'react'
import { Button, Grid } from '@mui/material'
import { useRecordContext, useRedirect } from 'react-admin'

interface Props {
    basePath: string
}

const ItemReferenceField: React.FC<Props> = ({
    basePath = 'api/v1/item/admin',
}) => {
    const record = useRecordContext()
    const redirect = useRedirect()

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
