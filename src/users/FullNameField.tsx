import { SxProps, Typography } from '@mui/material'
import { memo } from 'react'

import { FieldProps, useRecordContext } from 'react-admin'
import AvatarField from '../visitors/AvatarField'
import { User } from '../types'

interface Props extends FieldProps<User> {
    size?: string
    sx?: SxProps
}

const FullNameField = (props: Props) => {
    const { size } = props
    const record = useRecordContext<User>()
    return record ? (
        <Typography
            variant="body2"
            display="flex"
            flexWrap="nowrap"
            alignItems="center"
            component="div"
            sx={props.sx}
        >
            <AvatarField
                record={record}
                size={size}
                sx={{
                    mr: 1,
                    mt: -0.5,
                    mb: -0.5,
                }}
            />
            {record.first_name} {record.last_name}
        </Typography>
    ) : null
}

FullNameField.defaultProps = {
    source: 'last_name' as const,
    label: 'resources.customers.fields.name',
}

export default memo<Props>(FullNameField)
