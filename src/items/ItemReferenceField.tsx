import { ReferenceField, ReferenceFieldProps, TextField } from 'react-admin';

interface Props {
    source?: string;
}

const ItemReferenceField = (
    props: Props &
        Omit<ReferenceFieldProps, 'source' | 'reference' | 'children'>
) => (
    <ReferenceField
        label="Item"
        source="item_id"
        reference="items"
        {...props}
    >
        <TextField source="reference" />
    </ReferenceField>
);

ItemReferenceField.defaultProps = {
    source: 'product_id',
};

export default ItemReferenceField;
