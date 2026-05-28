import { S3Client } from '@aws-sdk/client-s3'

export const s3Client = new S3Client({
    region: 'us-east-1',
    credentials: {
        accessKeyId: import.meta.env.VITE_APP_ACCESS_KEY_ID as string,
        secretAccessKey: import.meta.env.VITE_APP_SECRET_ACCESS_KEY as string,
    },
})
