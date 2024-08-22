import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material'
import { Link, useRecordContext, useTranslate } from 'react-admin'

import { ItemType, Order } from '../types'
import { TableCellRight } from './TableCellRight'

const Basket = () => {
    const record = useRecordContext<Order>()
    const translate = useTranslate()

    if (!record?.items) return null

    return (
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell>
                        {translate('resources.sales.fields.basket.reference')}
                    </TableCell>
                    <TableCellRight>
                        {translate('resources.sales.fields.basket.unit_price')}
                    </TableCellRight>
                    <TableCellRight>
                        {translate('resources.sales.fields.basket.quantity')}
                    </TableCellRight>
                    <TableCellRight>
                        {translate('resources.sales.fields.basket.total')}
                    </TableCellRight>
                </TableRow>
            </TableHead>
            <TableBody>
                {record.items.map((item: ItemType) => (
                    <TableRow key={item.id}>
                        <TableCell>
                            <Link to={`/api/v1/item/admin/${item.id}`}>
                                {item.title}
                            </Link>
                        </TableCell>
                        <TableCellRight>
                            {item.price.toLocaleString(undefined, {
                                style: 'currency',
                                currency: 'EUR',
                            })}
                        </TableCellRight>
                        <TableCellRight>{item.quantity}</TableCellRight>
                        <TableCellRight>
                            {(item.price * item.quantity).toLocaleString(
                                undefined,
                                {
                                    style: 'currency',
                                    currency: 'EUR',
                                },
                            )}
                        </TableCellRight>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}

export default Basket
