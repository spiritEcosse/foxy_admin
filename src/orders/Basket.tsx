import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
} from '@mui/material';
import { Link, useTranslate, useGetMany, useRecordContext } from 'react-admin';

import { Order, ItemType } from '../types';
import { TableCellRight } from './TableCellRight';

const Basket = () => {
    const record = useRecordContext<Order>();
    const translate = useTranslate();

    const itemIds = record ? record.basket.map(item => item.item_id) : [];

    const { isLoading, data: items } = useGetMany<ItemType>(
        'items',
        { ids: itemIds },
        { enabled: !!record }
    );
    const itemsById = items
        ? items.reduce((acc, item) => {
              acc[item.id] = item;
              return acc;
          }, {} as any)
        : {};

    if (isLoading || !record || !items) return null;

    return (
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell>
                        {translate(
                            'resources.commands.fields.basket.reference'
                        )}
                    </TableCell>
                    <TableCellRight>
                        {translate(
                            'resources.commands.fields.basket.unit_price'
                        )}
                    </TableCellRight>
                    <TableCellRight>
                        {translate('resources.commands.fields.basket.quantity')}
                    </TableCellRight>
                    <TableCellRight>
                        {translate('resources.commands.fields.basket.total')}
                    </TableCellRight>
                </TableRow>
            </TableHead>
            <TableBody>
                {record.basket.map((item: any) => (
                    <TableRow key={item.item_id}>
                        <TableCell>
                            <Link to={`/items/${item.item_id}`}>
                                {itemsById[item.item_id].reference}
                            </Link>
                        </TableCell>
                        <TableCellRight>
                            {itemsById[item.item_id].price.toLocaleString(
                                undefined,
                                {
                                    style: 'currency',
                                    currency: 'USD',
                                }
                            )}
                        </TableCellRight>
                        <TableCellRight>{item.quantity}</TableCellRight>
                        <TableCellRight>
                            {(
                                itemsById[item.item_id].price *
                                item.quantity
                            ).toLocaleString(undefined, {
                                style: 'currency',
                                currency: 'USD',
                            })}
                        </TableCellRight>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};

export default Basket;
