import * as React from 'react';
import {ItemType, MediaType} from "../types";
import {DeleteObjectCommand, PutObjectCommand, S3Client} from "@aws-sdk/client-s3";


const s3Client = new S3Client({
    region: import.meta.env.VITE_APP_AWS_REGION as string,
    credentials: {
        accessKeyId: import.meta.env.VITE_APP_ACCESS_KEY_ID as string,
        secretAccessKey: import.meta.env.VITE_APP_SECRET_ACCESS_KEY as string,
    },
});
const uploadFile = async (record: ItemType, media: MediaType, file: File) => {
    const src = `items/${record.id}/${media.src.split('/').pop()}.${media.file.name.split('.').pop()}`;
    const uploadParams = {
        Bucket: import.meta.env.VITE_APP_BUCKET_NAME as string,
        Key: src,
        Body: file,
    };

    try {
        const command = new PutObjectCommand(uploadParams);
        await s3Client.send(command);
        media.src = `https://${import.meta.env.VITE_APP_BUCKET_NAME}.twic.pics/${src}?twic=v1`;

        console.log(`File uploaded successfully.`);
    } catch (err) {
        console.error("Error uploading file: ", err);
    }
};

const DeleteMedia = async (media: MediaType) => {
    const deleteParams = {
        Bucket: import.meta.env.VITE_APP_BUCKET_NAME as string,
        Key: "items" + media.src.split('items')[1].split('?')[0],
    };

    try {
        const command = new DeleteObjectCommand(deleteParams);
        await s3Client.send(command);
        console.log(`File deleted successfully.`);
    } catch (err) {
        console.error("Error deleting file: ", err);
    }
}

export const HandleSubmit = async (
    data: any,
    record: ItemType | undefined,
    setRecord: React.Dispatch<React.SetStateAction<ItemType | undefined>>,
    recordsToDelete: MediaType[],
    setRecordsToDelete: React.Dispatch<React.SetStateAction<MediaType[]>>,
    updateItem: any,
    notify: any,
    dataProvider: any,
    redirect: any
) => {
    let newMedia: MediaType[] = [];
    let newMediaUpload: MediaType[] = [];

    if (record !== undefined) {
        for (let i = 0; i < record.media.length; i++) {
            let media: MediaType = {...record.media[i]};
            if (media.id) {
                media.src = "items" + media.src.split('items')[1].split('?')[0];
                newMedia.push(media);
            }
        }
        for (let i = 0; i < record.media.length; i++) {
            let media: MediaType = record.media[i];
            if (media.id == 0) {
                newMediaUpload.push(media);
            }
        }
    }

    try {
        let {id} = data;
        let create = false;
        if (data.id !== undefined) {
            delete data.media;
            await dataProvider.updateItem('api/v1/item/admin', { id: data.id, data: data});
        } else {
            const response = await dataProvider.create('api/v1/item/admin', { data: data });
            id = response.data.id;
            create = true;
        }

        if (newMedia.length !== 0) {
            await dataProvider.multiUpdate('api/v1/media/admin/items', { items: newMedia });
        }
        if (newMediaUpload.length !== 0) {
            let uploadPromises = newMediaUpload.map(async (mediaUpload) => {
                data.id = id;
                await uploadFile(data, mediaUpload, mediaUpload.file);
                let media: MediaType = {...mediaUpload};
                media.src = "items" + media.src.split('items')[1].split('?')[0];
                media.item_id = id;
                return media;
            });

            let newMediaCreate = await Promise.all(uploadPromises);
            await dataProvider.multiCreate('api/v1/media/admin/items', { items: newMediaCreate });
        }
        if (recordsToDelete.length !== 0) {
            recordsToDelete.map(async (media) => {
                await DeleteMedia(media);
            });
            setRecordsToDelete([]);
            await dataProvider.multiDelete('api/v1/media/admin/items', { items: recordsToDelete.map((media: MediaType) => media.id) });
        }
        setRecord({...record, media: []});
        notify('item_updated', {type: 'info'});
        if (create) {
            redirect(`/api/v1/item/admin/${id}`);
        }
    } catch (error) {
        console.error('Error: could not update item or media', error);
        notify('Error: could not update item or media', {type: 'warning'});
    }
};
