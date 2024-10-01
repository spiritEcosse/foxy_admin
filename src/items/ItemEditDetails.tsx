import * as React from 'react'
import {
    BooleanInput,
    DateTimeInput,
    ReferenceInput,
    required,
    SelectInput,
    NumberInput,
    TextInput,
    SelectArrayInput,
    useRecordContext,
    SimpleFormIterator,
    ArrayInput,
    ButtonProps,
    useSimpleFormIteratorItem,
    useTranslate,
} from 'react-admin'
import { Grid, InputAdornment, Button } from '@mui/material'
import { useFormContext } from 'react-hook-form'
import { slugify, validatePositive } from '../utils'
import { ItemType, SocialMediaTypeEnum } from '../types'
import { useState } from 'react'
import DeleteIcon from '@mui/icons-material/Delete'

const socialMediaChoices = Object.values(SocialMediaTypeEnum).map((value) => ({
    id: value,
    name: value,
}))

interface ItemEditDetailsProps {
    setDeletedTagIds: React.Dispatch<React.SetStateAction<number[]>>
}

const TagRemoveButton = ({
    setDeletedTagIds,
    ...props
}: { setDeletedTagIds: React.Dispatch<React.SetStateAction<number[]>> } & Omit<
    ButtonProps,
    'onClick'
>) => {
    const { remove, index } = useSimpleFormIteratorItem() // Access remove function and index
    const { getValues } = useFormContext() // Access form methods
    const translate = useTranslate()

    // Handle click event
    const handleRemoveButtonClick = () => {
        console.log('onRemove', index)
        const id = getValues(`tag.${index}.id`) // Get the id of the item to remove

        if (id) {
            console.log('onRemove ID', index, id)
            setDeletedTagIds((prevDeletedTagIds: number[]) => [
                ...prevDeletedTagIds,
                id,
            ]) // Add the id to the list of deleted items
            remove()
        }
    }

    return (
        <Button
            onClick={() => handleRemoveButtonClick()} // Call the handler directly
            startIcon={<DeleteIcon />} // Adding an icon to the button
            variant="outlined" // Button variant
            color="secondary" // Button color
        >
            {translate(props.label ?? 'ra.action.remove')}
        </Button>
    )
}

export const ItemEditDetails: React.FC<ItemEditDetailsProps> = ({
    setDeletedTagIds,
}) => {
    const { setValue } = useFormContext()
    const initialRecord = useRecordContext<ItemType>()
    const [record] = useState<ItemType>(initialRecord)

    const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const slugTitle = slugify(event.target.value)
        setValue('slug', slugTitle)
    }

    return (
        <Grid container columnSpacing={2}>
            <Grid item xs={12}>
                <TextInput
                    source="title"
                    validate={required()}
                    fullWidth
                    onChange={handleTitleChange}
                />
                <TextInput source="slug" validate={required()} fullWidth />
                <TextInput
                    source="meta_description"
                    validate={required()}
                    fullWidth
                    multiline
                />
            </Grid>
            <Grid item xs={12} sm={4}>
                <BooleanInput source="enabled" />
            </Grid>
            <Grid item xs={12} sm={4}>
                <ReferenceInput
                    label="Shipping Profile"
                    source="shipping_profile_id"
                    reference="api/v1/shippingprofile/admin"
                >
                    <SelectInput optionText="title" validate={required()} />
                </ReferenceInput>
            </Grid>
            <Grid item xs={12} sm={4}>
                <NumberInput
                    source="price"
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">€</InputAdornment>
                        ),
                    }}
                    validate={[required(), validatePositive]}
                />
            </Grid>
            <Grid item xs={12} sm={4}>
                <DateTimeInput source="created_at" />
            </Grid>
            <Grid item xs={12} sm={4}>
                <DateTimeInput source="updated_at" />
            </Grid>

            <Grid item xs={12}>
                <ArrayInput source="tag" label="Tags">
                    <SimpleFormIterator
                        disableRemove={false}
                        removeButton={
                            <TagRemoveButton
                                setDeletedTagIds={setDeletedTagIds}
                            />
                        }
                    >
                        <TextInput source="title" label="Title" />
                        <NumberInput
                            source="item_id"
                            style={{ display: 'none' }}
                            defaultValue={record?.id}
                        />
                        <NumberInput source="id" style={{ display: 'none' }} />
                        <SelectArrayInput
                            source="social_media"
                            choices={socialMediaChoices}
                            label="Social Media"
                        />
                    </SimpleFormIterator>
                </ArrayInput>
            </Grid>
        </Grid>
    )
}
