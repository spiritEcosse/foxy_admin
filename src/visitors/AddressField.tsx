import { useRecordContext } from 'react-admin'
import { Address } from '../types'

const AddressField = () => {
    const record = useRecordContext<Address>()

    return record ? (
        <span>
            {record.country.title}, {record.address}, {record.city},{' '}
            {record.zipcode}
        </span>
    ) : null
}

export default AddressField
