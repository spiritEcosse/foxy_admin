import { Avatar, SxProps } from '@mui/material'
import { FieldProps, useRecordContext } from 'react-admin'
import { User } from '../types'

interface Props extends FieldProps<User> {
  sx?: SxProps
  size?: string
}

const AvatarField = ({ size = '25', sx }: Props) => {
  const record = useRecordContext<User>()
  if (!record) return null
  return (
    <Avatar
      src={`${record.avatar}?size=${size}x${size}`}
      style={{ width: parseInt(size, 10), height: parseInt(size, 10) }}
      sx={sx}
      alt={`${record.first_name} ${record.last_name}`}
    />
  )
}

export default AvatarField
