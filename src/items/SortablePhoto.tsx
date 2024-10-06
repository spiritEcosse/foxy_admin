import React from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

import Media from './Media'
import { MediaType } from '../types'

type SortablePhotoProps = {
    media: MediaType
    style?: React.CSSProperties
}

export const SortablePhoto = ({ ...props }: SortablePhotoProps) => {
    const sortable = useSortable({ id: props.media.src })
    const { attributes, listeners, setNodeRef, transform, transition } =
        sortable

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    }

    return (
        <Media
            ref={setNodeRef}
            style={style}
            {...props}
            {...attributes}
            {...listeners}
        />
    )
}
