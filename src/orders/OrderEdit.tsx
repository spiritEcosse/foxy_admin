import {
    BooleanInput,
    DateField,
    Edit,
    Form,
    Labeled,
    PrevNextButtons,
    SelectInput,
    TextField,
    Toolbar,
    useRecordContext,
    useTranslate,
} from 'react-admin'
import { Link as RouterLink } from 'react-router-dom'
import { Box, Card, CardContent, Grid, Link, Typography } from '@mui/material'
import { Address, Order, User } from '../types'
import Basket from './Basket'
import Totals from './Totals'

const OrderEdit = () => (
    <Edit title={<OrderTitle />} component="div">
        <OrderForm />
    </Edit>
)

const OrderTitle = () => {
    const translate = useTranslate()
    const record = useRecordContext<Order>()
    return record ? (
        <span>
            {translate('resources.sales.title', {
                reference: record.reference,
            })}
        </span>
    ) : null
}

const UserDetails = ({ record }: { record: User }) => {
    return (
        <div>
            <Typography
                component={RouterLink}
                color="primary"
                to={`/api/v1/user/admin/${record?.id}`}
                style={{ textDecoration: 'none' }}
            >
                {record?.first_name} {record?.last_name}
            </Typography>
            <br />
            <Typography
                component={Link}
                color="primary"
                href={`mailto:${record?.email}`}
                style={{ textDecoration: 'none' }}
            >
                {record?.email}
            </Typography>
        </div>
    )
}

const UserAddress = ({ record }: { record: Address }) => {
    return (
        <div>
            <Typography>{record?.country.title}</Typography>
            <Typography>
                {record?.city}, {record?.zipcode}
            </Typography>
        </div>
    )
}

const Spacer = () => <Box mb={1}>&nbsp;</Box>

const OrderForm = () => {
    const translate = useTranslate()
    const record = useRecordContext<Order>()

    return (
        <Form>
            <Box maxWidth="50em">
                <PrevNextButtons
                    filterDefaultValues={{ status: 'Ordered' }}
                    sort={{ field: 'date', order: 'DESC' }}
                />
                <Card>
                    <CardContent>
                        <Grid container spacing={1}>
                            <Grid item xs={12} sm={12} md={8}>
                                <Typography variant="h6" gutterBottom>
                                    {translate('resources.sales.section.order')}
                                </Typography>
                                <Grid container>
                                    <Grid item xs={12} sm={12} md={6}>
                                        <Labeled source="date">
                                            <DateField source="date" />
                                        </Labeled>
                                    </Grid>
                                    <Grid item xs={12} sm={12} md={6}>
                                        <Labeled source="reference">
                                            <TextField source="reference" />
                                        </Labeled>
                                    </Grid>
                                </Grid>
                                <Grid container>
                                    <Grid item xs={12} sm={12} md={6}>
                                        <SelectInput
                                            source="status"
                                            choices={[
                                                {
                                                    id: 'Delivered',
                                                    name: 'Delivered',
                                                },
                                                {
                                                    id: 'Ordered',
                                                    name: 'Ordered',
                                                },
                                                {
                                                    id: 'Cancelled',
                                                    name: 'Cancelled',
                                                },
                                                {
                                                    id: 'unknown',
                                                    name: 'unknown',
                                                    disabled: true,
                                                },
                                            ]}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={12} md={6}>
                                        <Box mt={2}>
                                            <BooleanInput
                                                row={true}
                                                source="returned"
                                            />
                                        </Box>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={12} sm={12} md={4}>
                                <Typography variant="h6" gutterBottom>
                                    {translate('resources.sales.section.user')}
                                </Typography>
                                <UserDetails record={record.user} />
                                <Spacer />

                                <Typography variant="h6" gutterBottom>
                                    {translate(
                                        'resources.sales.section.shipping_address',
                                    )}
                                </Typography>
                                <UserAddress record={record.address} />
                            </Grid>
                        </Grid>
                        <Spacer />

                        <Typography variant="h6" gutterBottom>
                            {translate('resources.sales.section.items')}
                        </Typography>
                        <div>
                            <Basket />
                        </div>
                        <Spacer />

                        <Typography variant="h6" gutterBottom>
                            {translate('resources.sales.section.total')}
                        </Typography>
                        <div>
                            <Totals />
                        </div>
                    </CardContent>
                    <Toolbar />
                </Card>
            </Box>
        </Form>
    )
}

export default OrderEdit
