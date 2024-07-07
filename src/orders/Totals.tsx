import { Table, TableBody, TableCell, TableRow } from '@mui/material';
import { useRecordContext, useTranslate } from 'react-admin';

import { Order } from '../types';
import { TableCellRight } from './TableCellRight';

const Totals = () => {
    const record = useRecordContext<Order>();
    const translate = useTranslate();

    return (
        <Table sx={{ minWidth: '35em' }}>
            <TableBody>
                <TableRow>
                    <TableCell>
                        {translate('resources.sales.fields.basket.sum')}
                    </TableCell>
                    <TableCellRight>
                        {record?.total_ex_taxes.toLocaleString(undefined, {
                            style: 'currency',
                            currency: 'EUR',
                        })}
                    </TableCellRight>
                </TableRow>
                <TableRow>
                    <TableCell>
                        {translate('resources.sales.fields.basket.delivery')}
                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableCell>
                        {translate('resources.sales.fields.basket.taxes')} (
                        {record?.tax_rate.toLocaleString(undefined, {
                            style: 'percent',
                        })}
                        )
                    </TableCell>
                    <TableCellRight>
                        {record?.taxes.toLocaleString(undefined, {
                            style: 'currency',
                            currency: 'EUR',
                        })}
                    </TableCellRight>
                </TableRow>
                <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>
                        {translate('resources.sales.fields.basket.total')}
                    </TableCell>
                    <TableCellRight sx={{ fontWeight: 'bold' }}>
                        {record?.total.toLocaleString(undefined, {
                            style: 'currency',
                            currency: 'EUR',
                        })}
                    </TableCellRight>
                </TableRow>
            </TableBody>
        </Table>
    );
};

export default Totals;
