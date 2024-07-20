import {Datagrid, DateField, List, NumberField, TextField, UrlField, useNotify,} from 'react-admin'
import {Button} from "@mui/material";
import {dataProvider} from "../dataProvider";
import {useEffect, useState} from 'react';

const SocialMediaList = () => {
    const notify = useNotify();
    const [isDisabled, setIsDisabled] = useState(false);
    const [countdown, setCountdown] = useState('');

    useEffect(() => {
        const interval = setInterval(() => {
            const storedTime = localStorage.getItem('publishTime');
            if (storedTime) {
                const timeLeft = 24 * 60 * 60 * 1000 - (new Date().getTime() - new Date(storedTime).getTime());
                if (timeLeft > 0) {
                    setIsDisabled(true);
                    const hours = Math.floor((timeLeft / (1000 * 60 * 60)) % 24);
                    const minutes = Math.floor((timeLeft / 1000 / 60) % 60);
                    const seconds = Math.floor((timeLeft / 1000) % 60);
                    setCountdown(`${hours}h ${minutes}m ${seconds}s`);
                } else {
                    setIsDisabled(false);
                    clearInterval(interval);
                }
            }
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const handlePublish = async () => {
        try {
            const data = await dataProvider.publishToSocialMedia();
            notify(`Publishing started : ${data.data.result}`, {type: 'success'});
            localStorage.setItem('publishTime', new Date().toISOString());
            setIsDisabled(true);
        } catch (error) {
            notify(`Error publishing, error : ${error}`, {type: 'error'});
        }
    };

    return (
        <div>
            <Button onClick={handlePublish} variant="contained" disabled={isDisabled}>
                {isDisabled ? `Wait ${countdown}` : 'Publish all items on Twitter'}
            </Button>
            <List perPage={25} sort={{field: 'updated_at', order: 'DESC'}}>
                <Datagrid
                    rowClick="edit"
                    sx={{
                        '& .column-customer_id': {
                            display: {xs: 'none', md: 'table-cell'},
                        },
                        '& .column-total_ex_taxes': {
                            display: {xs: 'none', md: 'table-cell'},
                        },
                        '& .column-taxes': {
                            display: {xs: 'none', md: 'table-cell'},
                        },
                    }}
                >
                    <NumberField source="id"/>
                    <TextField source="title"/>
                    <UrlField source="social_url"/>
                    <TextField source="external_id"/>
                    <NumberField source="item_id"/>
                    <DateField source="created_at"/>
                    <DateField source="updated_at"/>
                </Datagrid>
            </List>
        </div>
    );
};

export default SocialMediaList
