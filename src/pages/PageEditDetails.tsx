import * as React from 'react'
import { TextInput, DateTimeInput, required, BooleanInput } from 'react-admin'
import { slugify } from '../utils'
import { useFormContext } from 'react-hook-form'
import { Grid } from '@mui/material'

const RichTextInput = React.lazy(() =>
  import('ra-input-rich-text').then((module) => ({
    default: module.RichTextInput,
  })),
)

export const PageEditDetails = () => {
  const formContext = useFormContext()

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const slugTitle = slugify(event.target.value)
    formContext.setValue('slug', slugTitle)
  }

  return (
    <Grid container columnSpacing={2}>
      <Grid item xs={12}>
        <TextInput disabled source="id" />
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
        <TextInput source="canonical_url" fullWidth validate={required()} />
        <BooleanInput source="enabled" />
        <RichTextInput source="description" validate={required()} label="" />
        <DateTimeInput source="created_at" />
        <DateTimeInput source="updated_at" />
      </Grid>
    </Grid>
  )
}
