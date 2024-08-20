import { ReferenceField, ReferenceFieldProps } from 'react-admin'

import FullNameField from '../users/FullNameField'

const UserReferenceField = (
    props: Omit<ReferenceFieldProps, 'reference' | 'children' | 'source'> & {
        source?: string
    },
) => (
    <ReferenceField source="user_id" reference="api/v1/user/admin" {...props}>
        <FullNameField />
    </ReferenceField>
)

UserReferenceField.defaultProps = {
    source: 'user_id',
}

export default UserReferenceField
