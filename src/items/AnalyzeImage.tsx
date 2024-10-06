import React, { useState } from 'react'
import { OpenAI } from 'openai'
import { useNotify, useTranslate } from 'react-admin'
import { Button } from '@mui/material'
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh'
import { useFormContext } from 'react-hook-form'

interface ItemGptType {
    title: string
    description: string
    meta_description: string
    social_media: string[]
}

const openai = new OpenAI({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true,
})

const AnalyzeImage: React.FC = () => {
    const notify = useNotify()
    const translate = useTranslate()
    const { getValues } = useFormContext()
    const [itemGpt, setItemGpt] = useState<ItemGptType>()

    const convertFileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.readAsDataURL(file)
            reader.onload = () => resolve(reader.result as string)
            reader.onerror = (error) => reject(error)
        })
    }

    const handleAnalyze = async () => {
        const media = getValues('media')
        if (!media || media.length === 0) {
            notify('No image available in the record', { type: 'warning' })
            return
        }

        const file = media[0].file // Use the file from the first media item
        if (!file) {
            notify('File not available', { type: 'warning' })
            return
        }

        try {
            const base64Image = await convertFileToBase64(file)

            const messages = [
                {
                    role: 'system',
                    content: `You are an AI trained to analyze images and provide detailed, platform-specific tags and categories. Your response should be in a specific JSON format.

                    Consider the following when analyzing:
                    1. Instagram: Provide up to 30 relevant hashtags, including a mix of popular and niche tags.
                    2. Facebook: Suggest 5-10 relevant categories or tags that align with Facebook's content classification.
                    3. Pinterest: Include 5-7 descriptive keywords and categories that work well for Pinterest's search and discovery features.
                    4. Twitter: Suggest 3-5 concise hashtags that fit Twitter's character limit and trending topics.
                    5. TikTok: Propose 3-5 trending hashtags or challenges related to the image content.

                    For each tag or category, list the social media platforms where it would be most effective. Some tags may be suitable for multiple platforms.

                    Always respond with a valid JSON object containing 'title', 'description', 'meta_description', and 'social_media' (list of relevant platforms) fields.`,
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
            })

            let jsonResponse = completion.choices[0].message.content

            if (jsonResponse) {
                if (jsonResponse.startsWith('json')) {
                    jsonResponse = jsonResponse.slice(4)
                }

                console.log(jsonResponse)
                const parsedResponse = JSON.parse(jsonResponse)
                console.log(parsedResponse)
                setItemGpt(parsedResponse)
            } else {
                notify('No content in the OpenAI response', { type: 'error' })
            }
        } catch (error) {
            console.error('Error:', error)
            notify('Failed to analyze image', { type: 'error' })
        }
    }

    return (
        <Button
            onClick={handleAnalyze}
            startIcon={<AutoFixHighIcon />}
            variant="contained"
            color="primary"
        >
            {translate('resources.items.actions.analyze_image')}
        </Button>
    )
}

export default AnalyzeImage
