import { MediaType } from '../types.ts'
import {
    DeleteObjectCommand,
    GetObjectCommand,
    PutObjectCommand,
    S3Client,
} from '@aws-sdk/client-s3'
import { getMimeType, getFileExtension } from '../utils'

const s3Client = new S3Client({
    region: import.meta.env.VITE_APP_AWS_REGION as string,
    credentials: {
        accessKeyId: import.meta.env.VITE_APP_ACCESS_KEY_ID as string,
        secretAccessKey: import.meta.env.VITE_APP_SECRET_ACCESS_KEY as string,
    },
})

export const uploadMedia = async (notify: any, media: MediaType) => {
    if (!media.rawFile) {
        notify('no_file_to_upload', { type: 'warning' })
        return
    }
    const uploadParams = {
        Bucket: import.meta.env.VITE_APP_BUCKET_NAME as string,
        Key: media.src,
        Body: media.rawFile,
    }

    try {
        const command = new PutObjectCommand(uploadParams)
        await s3Client.send(command)
        notify('file_uploaded_successfully', { type: 'info' })
    } catch (err) {
        console.error('Error uploading file: ', err)
        notify('error_uploading_file', { type: 'error' })
    }
}

export const deleteMedia = async (notify: any, media: MediaType) => {
    const deleteParams = {
        Bucket: import.meta.env.VITE_APP_BUCKET_NAME as string,
        Key: `items${media.src.split('items')[1].split('?')[0]}`,
    }

    try {
        const command = new DeleteObjectCommand(deleteParams)
        await s3Client.send(command)
        notify('file_deleted_successfully', { type: 'info' })
    } catch (err) {
        console.error('Error deleting file: ', err)
        notify('error_deleting_file', { type: 'error' })
    }
}

export const downloadMedia = async (
    notify: any,
    media: MediaType,
): Promise<File> => {
    if (!media.src) {
        notify('no_file_to_download', { type: 'error' })
        throw new Error('No media source')
    }

    const key = media.src.split('items/')[1]
    if (!key) {
        throw new Error('Invalid media source')
    }

    const params = new GetObjectCommand({
        Bucket: import.meta.env.VITE_APP_BUCKET_NAME as string,
        Key: key,
    })

    const response = await s3Client.send(params)

    if (!response.Body) {
        throw new Error('No body in response')
    }

    const arrayBuffer = await response.Body.transformToByteArray()
    const blob = new Blob([arrayBuffer], { type: response.ContentType })
    const filename = key.split('/').pop() ?? 'file'
    return new File([blob], filename, {
        type: getMimeType(getFileExtension(filename)),
    })
}
