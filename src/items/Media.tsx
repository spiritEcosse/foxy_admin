import React, { forwardRef, useEffect, useState } from 'react'
import { Card, CardActions, CardContent, CardMedia } from '@mui/material'
import { Button, useNotify } from 'react-admin'
import DeleteIcon from '@mui/icons-material/Delete'
import { MediaType, MediaTypeEnum } from '../types'
import { useFormContext } from 'react-hook-form'
import {HeadObjectCommand} from "@aws-sdk/client-s3";
import { s3Client } from '../clients/s3Client'

interface MediaProps {
    media: MediaType
    style?: React.CSSProperties
}

const formatFileSize = (size: number) => {
    const i = Math.floor(Math.log(size) / Math.log(1024))
    return (
        (size / Math.pow(1024, i)).toFixed(2) +
        ' ' +
        ['B', 'KB', 'MB', 'GB', 'TB'][i]
    )
}

const Media = forwardRef<HTMLDivElement, MediaProps>(
    ({ media, style, ...props }, ref) => {
        const inlineStyles = {
            transformOrigin: '0 0',
            height: 200,
            width: 200,
            gridRowStart: null,
            gridColumnStart: null,
            backgroundImage: `url("${media.src}")`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundColor: 'white',
            display: 'flex',
            justifyContent: 'center', // Centers content horizontally
            alignItems: 'center',
            boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.2)',
            ...style,
        }
        const { getValues, setValue } = useFormContext()
        const [fileSize, setFileSize] = useState<string | null>(null)
        const mediaSrc = media.src.startsWith('https://')
            ? `https://${
                  import.meta.env.VITE_APP_BUCKET_NAME
              }.s3.amazonaws.com${media.src.replace(/https?:\/\/[^/]+/, '')}`
            : media.src
        const notify = useNotify()

        useEffect(() => {
            const fetchFileSize = async () => {
                if (media.rawFile) {
                    setFileSize(formatFileSize(media.rawFile.size))
                } else {
                    try {
                        const headObjectCommand = new HeadObjectCommand({
                            Bucket: import.meta.env.VITE_APP_BUCKET_NAME as string,
                            Key: mediaSrc.replace(/https?:\/\/[^/]+\/?/, '')
                        });

                        const response = await s3Client.send(headObjectCommand);
                        if (response.ContentLength) {
                            setFileSize(formatFileSize(response.ContentLength));
                        }
                    } catch (error) {
                        console.error('Error fetching file size:', error);
                        notify('Error fetching file size', { type: 'warning' });
                    }
                }
            }

            fetchFileSize()
        }, [media, mediaSrc, notify])

        const handleDelete = () => {
            const newMedia = getValues().media.filter(
                (obj: MediaType) => obj.src !== media.src,
            )
            setValue('media', newMedia, {
                shouldValidate: true,
                shouldDirty: true,
            })
        }

        return (
            <div>
                <Card ref={ref} style={inlineStyles} {...props}>
                    {media.type === MediaTypeEnum.VIDEO ? (
                        <CardMedia
                            component="video"
                            image={mediaSrc}
                            title={media.src}
                            controls
                        />
                    ) : (
                        <CardMedia
                            component="img"
                            image={media.src}
                            title={media.src}
                        />
                    )}
                </Card>
                <CardContent>
                    {fileSize && <div>Size: {fileSize}</div>}
                </CardContent>
                <CardActions>
                    <Button onClick={handleDelete}>
                        <DeleteIcon />
                    </Button>
                </CardActions>
            </div>
        )
    },
)

Media.displayName = 'Media'
export default Media
