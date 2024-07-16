import {Box, Card, CardContent, CardHeader, Typography} from '@mui/material'
import {
    BooleanField,
    DateField,
    EditButton,
    NumberField,
    RecordContextProvider,
    TextField,
    useListContext,
    useTranslate,
} from 'react-admin'

import UserReferenceField from '../visitors/UserReferenceField'
import {Order} from '../types'

const MobileGrid = () => {
    const {data, isLoading} = useListContext<Order>()
    const translate = useTranslate()
    if (isLoading || data.length === 0) {
        return null
    }
    return (
        <Box margin="0.5em">
            {data.map((record) => (
                <RecordContextProvider key={record.id} value={record}>
                    <Card sx={{margin: '0.5rem 0'}}>
                        <CardHeader
                            title={
                                <>
                                    {translate('resources.sales.name', 1)} #
                                    <TextField source="reference" variant="body1"/>
                                </>
                            }
                            titleTypographyProps={{variant: 'body1'}}
                            action={<EditButton/>}
                        />
                        <CardContent sx={{pt: 0}}>
                            <UserReferenceField sx={{display: 'block', mb: 1}}/>
                            <Typography variant="body2" gutterBottom>
                                {translate('resources.reviews.fields.date')}
                                :&nbsp;
                                <DateField source="date" showTime/>
                            </Typography>
                            <Typography variant="body2" gutterBottom>
                                {translate('resources.sales.fields.basket.total')}
                                :&nbsp;
                                <NumberField
                                    source="total"
                                    options={{
                                        style: 'currency',
                                        currency: 'EUR',
                                    }}
                                />
                            </Typography>
                            <Typography variant="body2" gutterBottom>
                                {translate('resources.sales.fields.status')}
                                :&nbsp;
                                <TextField source="status"/>
                            </Typography>
                            <Typography variant="body2">
                                {translate('resources.sales.fields.returned')}
                                :&nbsp;
                                <BooleanField source="returned"/>
                            </Typography>
                        </CardContent>
                    </Card>
                </RecordContextProvider>
            ))}
        </Box>
    )
}

MobileGrid.defaultProps = {
    data: {},
    ids: [],
}

export default MobileGrid
