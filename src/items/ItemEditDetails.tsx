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
    SimpleFormIterator,
    ArrayInput,
} from 'react-admin'
import { Grid, InputAdornment } from '@mui/material'
import { useFormContext } from 'react-hook-form'
import { slugify, validatePositive } from '../utils'
import { SocialMediaTypeEnum } from '../types'
import AnalyzeImage from './AnalyzeImage.tsx'

const socialMediaChoices = Object.values(SocialMediaTypeEnum).map((value) => ({
    id: value,
    name: value,
}))

export const ItemEditDetails = () => {
    const { setValue } = useFormContext()

    const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const slugTitle = slugify(event.target.value)
        setValue('slug', slugTitle)
    }

    return (
        <Grid container columnSpacing={2}>
            <Grid item xs={12}>
                <AnalyzeImage />
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
                <ArrayInput source="tags" label="Tags">
                    <SimpleFormIterator>
                        <TextInput source="title" label="Title" />
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
