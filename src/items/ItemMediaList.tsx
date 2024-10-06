import * as React from 'react'
import { FileField, FileInput } from 'react-admin'
import {
    closestCenter,
    DndContext,
    DragOverlay,
    MouseSensor,
    TouchSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core'
import {
    arrayMove,
    rectSortingStrategy,
    SortableContext,
} from '@dnd-kit/sortable'
import { Grid } from './Grid'
import { SortablePhoto } from './SortablePhoto'
import Media from './Media'
import { MediaType } from '../types'
import { useFormContext } from 'react-hook-form'
import { useState } from 'react'

interface MediaListProps {}

const ItemMediaList: React.FC<MediaListProps> = () => {
    const { getValues, setValue } = useFormContext()
    const [selectedMediaSrc, setSelectedMediaSrc] = useState<string | null>(
        null,
    )
    const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor))
    const selectedMedia = getValues().media?.find(
        (media: MediaType) => media.src === selectedMediaSrc,
    )
    function handleDragStart(event: any) {
        setSelectedMediaSrc(event.active.id)
    }

    function handleDragEnd(event: any) {
        const { active, over } = event

        if (active.id !== over.id) {
            const oldIndex = getValues()
                .media.map((media: MediaType) => media.src)
                .indexOf(active.id)
            const newIndex = getValues()
                .media.map((media: MediaType) => media.src)
                .indexOf(over.id)
            let newMedia = arrayMove(getValues().media, oldIndex, newIndex)

            newMedia = newMedia.map((item, index) => {
                if (item && typeof item === 'object') {
                    return {
                        ...item,
                        sort: index + 1,
                    }
                }
                return item
            })
            setValue('media', newMedia, { shouldValidate: true, shouldDirty: true })
        }
        setSelectedMediaSrc(null)
    }

    function handleDragCancel() {
        setSelectedMediaSrc(null)
    }

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragCancel={handleDragCancel}
        >
            <SortableContext
                items={
                    getValues().media?.map((media: MediaType) => media.src) ||
                    []
                }
                strategy={rectSortingStrategy}
            >
                <Grid columns={5}>
                    {getValues().media?.map((media: MediaType) => (
                        <SortablePhoto key={media.src} media={media} />
                    ))}
                </Grid>
            </SortableContext>

            <FileInput
                source="media"
                name="media"
                label="Related files"
                multiple
                type="file"
            >
                <FileField source="src" title="src" />
            </FileInput>

            {selectedMedia && (
                <DragOverlay adjustScale={true}>
                    <Media key={selectedMedia.src} media={selectedMedia} />
                </DragOverlay>
            )}
        </DndContext>
    )
}

export default ItemMediaList
