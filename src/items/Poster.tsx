import * as React from 'react';
import { Card, CardMedia } from '@mui/material';
import { useRecordContext } from 'react-admin';
import { Item } from '../types';

const Poster = () => {
    const record = useRecordContext<Item>();
    if (!record) return null;
    return (
        <Card sx={{ display: 'inline-block' }}>
            <CardMedia
                component="img"
                image={record.image}
                alt=""
                sx={{ maxWidth: '42em', maxHeight: '15em' }}
            />
        </Card>
    );
};

export default Poster;
