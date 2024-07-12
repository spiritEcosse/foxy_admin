import { Card, CardMedia } from '@mui/material'
import { useRecordContext } from 'react-admin'
import { ItemType } from '../types'

const Poster = () => {
  const record = useRecordContext<ItemType>()
  if (!record) return null
  return (
    <Card sx={{ display: 'inline-block' }}>
      <CardMedia
        component="img"
        image={`${record.media[0].src}`}
        alt=""
        sx={{ maxWidth: '42em', maxHeight: '15em' }}
      />
    </Card>
  )
}

export default Poster
