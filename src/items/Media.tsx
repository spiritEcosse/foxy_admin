import React, { forwardRef } from 'react'
import { Card, CardMedia, CardActions } from '@mui/material'
import { Button } from 'react-admin'
import DeleteIcon from '@mui/icons-material/Delete'
import { MediaType } from '../types'
import { ItemType } from '../types'

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
      backgroundColor: 'grey',
      ...style,
    }

    const handleDelete = () => {
      if (media.id) {
        setRecordsToDelete((prevRecord) => [...prevRecord, media])
      }
      const newRecords = recordPresent.media.filter((obj) => obj !== media)

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
          <CardMedia image={media.src} />
        </Card>
        <CardActions>
          <Button onClick={handleDelete}>
            <DeleteIcon />
          </Button>
        </CardActions>
      </div>
    )
  },
)

export default Media
