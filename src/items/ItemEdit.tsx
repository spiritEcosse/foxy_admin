import { Edit, useRecordContext } from 'react-admin'
import { ItemType } from '../types'
import ItemForm from './ItemForm.tsx'

const ProductTitle = () => {
    const record = useRecordContext<ItemType>()
    return record ? <span>Poster {record.title}</span> : null
}

const ItemEdit = () => {
    return (
        <Edit title={<ProductTitle />}>
            <ItemForm/>
        </Edit>
    )
}

export default ItemEdit
