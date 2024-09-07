import React, { forwardRef, useEffect, useState } from 'react'
import { Card, CardActions, CardContent, CardMedia } from '@mui/material'
import { Button } from 'react-admin'
import DeleteIcon from '@mui/icons-material/Delete'
import { ItemType, MediaType, MediaTypeEnum } from '../types'

interface MediaProps {
    setRecordPresent: React.Dispatch<React.SetStateAction<ItemType>>
    recordPresent: ItemType
    setRecord: React.Dispatch<React.SetStateAction<ItemType>>
    record: ItemType
    media: MediaType
    index: number
    setRecordsToDelete: React.Dispatch<React.SetStateAction<MediaType[]>>
    faded: boolean
    style: React.CSSProperties
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
    (
        {
            setRecord,
            setRecordPresent,
            recordPresent,
            media,
            index,
            setRecordsToDelete,
            faded,
            style,
            ...props
        },
        ref,
    ) => {
        const inlineStyles = {
            opacity: faded ? '0.2' : '1',
            transformOrigin: '0 0',
            height: 200,
            width: 200,
            gridRowStart: index === 0 ? 'span 2' : null,
            gridColumnStart: index === 0 ? 'span 2' : null,
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
        const [fileSize, setFileSize] = useState<string | null>(null)
        const mediaSrc= media.src.startsWith('https://')
            ? `https://${import.meta.env.VITE_APP_BUCKET_NAME}.s3.amazonaws.com${media.src.replace(/https?:\/\/[^/]+/, '')}`
            : media.src;

        useEffect(() => {
            const fetchFileSize = async () => {
                if (media.file) {
                    setFileSize(formatFileSize(media.file.size))
                } else {
                    try {
                        const response = await fetch(mediaSrc, {
                            method: 'HEAD',
                        })
                        const contentLength =
                            response.headers.get('content-length')
                        if (contentLength) {
                            const size = parseInt(contentLength, 10)
                            setFileSize(formatFileSize(size))
                        }
                    } catch (error) {
                        console.error('Error fetching file size:', error)
                    }
                }
            }

            fetchFileSize()
        }, [media.src])

        const handleDelete = () => {
            if (media.id) {
                setRecordsToDelete((prevRecord) => [...prevRecord, media])
            }
            const newRecords = recordPresent.media.filter(
                (obj) => obj !== media,
            )

            setRecordPresent((prevRecord) => ({
                ...prevRecord,
                media: newRecords,
            }))
            setRecord((prevRecord) => ({
                ...prevRecord,
                media: newRecords,
            }))
        }

        return (
            <div>
                <Card ref={ref} style={inlineStyles} {...props}>
                    {media.type === MediaTypeEnum.VIDEO ? (
                        <CardMedia
                            component="video"
                            image={mediaSrc}
                            title="title"
                            controls
                        />
                    ) : (
                        <CardMedia component="img" image={media.src} />
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
