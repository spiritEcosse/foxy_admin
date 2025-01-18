import React, { useState } from 'react'
import { OpenAI } from 'openai'
import { useNotify, useTranslate } from 'react-admin'
import { Button, CircularProgress } from '@mui/material'
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh'
import { useFormContext } from 'react-hook-form'
import { downloadMedia } from '../clients/storage'
import { SocialMediaTypeEnum } from '../types.ts'
import { slugify } from '../utils'

interface TagGptType {
    title: string
    social_media: SocialMediaTypeEnum[]
}

interface ItemGptType {
    title: string
    description: string
    meta_description: string
    tags: TagGptType[]
}

const openai = new OpenAI({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true,
})

const AnalyzeImage: React.FC = () => {
    const notify = useNotify()
    const translate = useTranslate()
    const { setValue, getValues } = useFormContext()
    const [isAnalyzing, setIsAnalyzing] = useState(false)

    const toBase64 = (file: File) =>
        new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.readAsDataURL(file)
            reader.onload = () => resolve(reader.result)
            reader.onerror = reject
        })

    const handleAnalyze = async () => {
        if (isAnalyzing) return
        setIsAnalyzing(true)

        const media = getValues().media
        if (!media?.length) {
            notify('resources.items.notifications.media_is_empty', {
                type: 'error',
            })
            return
        }

        try {
            let file: File = media[0].rawFile
            if (!file) {
                file = await downloadMedia(notify, media[0])
            }

            // Check file size
            if (file.size > 20 * 1024 * 1024) {
                notify('resources.items.notifications.image_too_large', {
                    type: 'error',
                })
                return
            }

            // Check file type
            const allowedTypes = ['image/png', 'image/jpeg']
            if (!allowedTypes.includes(file.type)) {
                notify(
                    'resources.items.notifications.unsupported_image_format',
                    { type: 'error' },
                )
                return
            }
            const base64Image = await toBase64(file)

            const messages = [
                {
                    role: 'system',
                    content: `You are an AI trained to analyze images and provide detailed, platform-specific tags and categories. Your response must be in a specific JSON format.

Consider the following when analyzing:
Instagram: You can use up to 30 hashtags per post. Mixing popular and niche tags is an effective strategy for broader reach and engagement.
Facebook: Although there's no strict limit, using 5-10 relevant tags or categories is recommended to enhance content classification and discoverability. However, hashtags on Facebook generally don’t have the same impact as on Instagram or Twitter.
Pinterest: Adding 5-7 descriptive keywords is crucial for Pinterest's search functionality and discoverability.
Twitter: It’s best to use 3-5 concise hashtags that fit within the character limit (280 characters) and align with trending topics.
TikTok: Use 3-5 trending hashtags or challenges to maximize visibility and engagement on this platform.
YouTube: For optimal searchability, include 5-10 keywords/tags that are relevant to your video content and audience.
LinkedIn: Using 3-5 professional tags is ideal for LinkedIn’s business-oriented audience, helping connect with industry-specific content.
Snapchat: While Snapchat doesn’t rely heavily on hashtags, adding fun and engaging filters with a few relevant tags can enhance user interaction.
Quora: Include 3-5 relevant tags to categorize your content and make it more discoverable to users searching for specific topics.

Your response must be a valid JSON object with the following structure:
{
  "title": "A concise title describing the image",
  "description": "A detailed description of the image content",
  "meta_description": "A brief summary suitable for SEO purposes",
  "tags": [
    {
      "title": "ExampleTag",
      "social_media": ["Instagram", "Facebook", "Pinterest", "Twitter", "TikTok", "YouTube", "LinkedIn", "Snapchat", "Quora"]
    },
    // ... more tags
  ]
}

Ensure that each tag is associated with the appropriate social media platforms where it would be most effective. Some tags may be suitable for multiple platforms.`,
                },
                {
                    role: 'user',
                    content: [
                        {
                            type: 'text',
                            text: `Analyze this image and provide a comprehensive set of tags and categories with associated social media platforms, along with a title, description, and meta description.`,
                        },
                        {
                            type: 'image_url',
                            image_url: base64Image,
                        },
                    ],
                },
            ]

            const completion = await openai.chat.completions.create({
                model: 'chatgpt-4o-latest',
                messages: messages,
                max_tokens: 1000,
                response_format: { type: 'json_object' },
            })

            let jsonResponse = completion.choices[0].message.content

            if (jsonResponse) {
                console.log('OpenAI response:', jsonResponse)
                const itemGpt = JSON.parse(jsonResponse) as ItemGptType
                setValue('title', itemGpt.title, {
                    shouldValidate: true,
                    shouldDirty: true,
                })
                setValue('description', itemGpt.description, {
                    shouldValidate: true,
                    shouldDirty: true,
                })
                setValue('meta_description', itemGpt.meta_description, {
                    shouldValidate: true,
                    shouldDirty: true,
                })
                setValue('tags', itemGpt.tags, {
                    shouldValidate: true,
                    shouldDirty: true,
                })
                setValue('slug', slugify(itemGpt.title), {
                    shouldValidate: true,
                    shouldDirty: true,
                })
                notify('resources.items.notifications.image_analyzed', {
                    type: 'info',
                })
            } else {
                notify('No content in the OpenAI response', { type: 'error' })
            }
            setIsAnalyzing(false)
        } catch (error) {
            console.error('Error:', error)
            setIsAnalyzing(false)
            notify('resources.items.notifications.failed_to_analyze_image', {
                type: 'error',
            })
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
