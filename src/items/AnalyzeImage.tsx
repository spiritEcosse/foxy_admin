import React, { useState } from 'react'
import { useNotify, useTranslate } from 'react-admin'
import { Button, CircularProgress } from '@mui/material'
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh'
import { useFormContext } from 'react-hook-form'
import { downloadMedia } from '../clients/storage'
import { SocialMediaTypeEnum } from '../types.ts'
import { slugify } from '../utils'

interface TagClaudeType {
    title: string
    social_media: SocialMediaTypeEnum[]
}

interface ItemClaudeType {
    title: string
    description: string
    meta_description: string
    tags: TagClaudeType[]
}

const toRawBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => {
            const result = reader.result as string
            resolve(result.split(',')[1])
        }
        reader.onerror = reject
    })

const AnalyzeImage: React.FC = () => {
    const notify = useNotify()
    const translate = useTranslate()
    const { setValue, getValues } = useFormContext()
    const [isAnalyzing, setIsAnalyzing] = useState(false)

    const abort = (key: string) => {
        notify(key, { type: 'error' })
        setIsAnalyzing(false)
    }

    const handleAnalyze = async () => {
        if (isAnalyzing) return
        setIsAnalyzing(true)

        const media = getValues().media
        if (!media?.length) {
            abort('resources.items.notifications.media_is_empty')
            return
        }

        try {
            let file: File = media[0].rawFile
            if (!file) {
                file = await downloadMedia(notify, media[0])
            }

            if (file.size > 20 * 1024 * 1024) {
                abort('resources.items.notifications.image_too_large')
                return
            }

            const allowedTypes = ['image/png', 'image/jpeg']
            if (!allowedTypes.includes(file.type)) {
                abort('resources.items.notifications.unsupported_image_format')
                return
            }

            const image = await toRawBase64(file)

            const {
                title_size,
                description_size,
                meta_description_size,
                extra_prompt,
            } = getValues()

            const body: Record<string, unknown> = {
                image,
                mimeType: file.type,
            }
            if (title_size != null && title_size !== '')
                body.title_size = title_size
            if (description_size != null && description_size !== '')
                body.description_size = description_size
            if (meta_description_size != null && meta_description_size !== '')
                body.meta_description_size = meta_description_size
            if (extra_prompt) body.extra_prompt = extra_prompt

            const response = await fetch(
                `${import.meta.env.VITE_JSON_SERVER_URL}/api/v1/aianalyzeimage/admin`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('auth')}`,
                    },
                    body: JSON.stringify(body),
                },
            )

            if (!response.ok) {
                throw new Error(`Server error: ${response.status}`)
            }

            const itemClaude = (await response.json()) as ItemClaudeType

            setValue('title', itemClaude.title, {
                shouldValidate: true,
                shouldDirty: true,
            })
            setValue('description', itemClaude.description, {
                shouldValidate: true,
                shouldDirty: true,
            })
            setValue('meta_description', itemClaude.meta_description, {
                shouldValidate: true,
                shouldDirty: true,
            })
            setValue('tags', itemClaude.tags, {
                shouldValidate: true,
                shouldDirty: true,
            })
            setValue('slug', slugify(itemClaude.title), {
                shouldValidate: true,
                shouldDirty: true,
            })
            notify('resources.items.notifications.image_analyzed', {
                type: 'info',
            })
        } catch (error) {
            console.error('Error:', error)
            notify('resources.items.notifications.failed_to_analyze_image', {
                type: 'error',
            })
        } finally {
            setIsAnalyzing(false)
        }
    }

    return (
        <Button
            onClick={handleAnalyze}
            startIcon={<AutoFixHighIcon />}
            variant="contained"
            color="primary"
            disabled={isAnalyzing}
        >
            {translate('resources.items.actions.analyze_image')}
            {isAnalyzing && (
                <CircularProgress size={20} thickness={2.5} sx={{ ml: 1 }} />
            )}
        </Button>
    )
}

export default AnalyzeImage
