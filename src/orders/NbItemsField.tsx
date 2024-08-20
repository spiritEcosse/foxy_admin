import { FunctionField } from 'react-admin'
import { Order } from '../types'

const render = (record: Order) => record.count_items

const NbItemsField = () => <FunctionField<Order> render={render} />

NbItemsField.defaultProps = {
    label: 'resources.sales.fields.nb_items',
    textAlign: 'right',
}

export default NbItemsField
