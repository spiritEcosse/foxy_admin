import * as React from 'react';
import { Link } from 'react-router-dom';
import { Link as MuiLink } from '@mui/material';
import { useRecordContext } from 'react-admin';
import { Item } from '../types';

const ItemRefField = () => {
    const record = useRecordContext<Item>();
    return record ? (
        <MuiLink
            component={Link}
            to={`/items/${record.id}`}
            underline="none"
        >
            {record.reference}
        </MuiLink>
    ) : null;
};

ItemRefField.defaultProps = {
    source: 'id',
    label: 'Reference',
};

export default ItemRefField;
