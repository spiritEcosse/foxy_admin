import {useState, useEffect} from 'react';
import * as React from 'react';
import { FileInput, FileField } from 'react-admin';
import {
    DndContext,
    closestCenter,
    MouseSensor,
    TouchSensor,
    DragOverlay,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    rectSortingStrategy,
} from '@dnd-kit/sortable';
import {Grid} from './Grid';
import {SortablePhoto} from './SortablePhoto';
import Media from './Media';
import {useRecordContext} from "react-admin";
import {ItemType, MediaType} from "../types";

interface MediaListProps {
    setRecord: React.Dispatch<React.SetStateAction<ItemType>>;
    setRecordsToDelete: React.Dispatch<React.SetStateAction<MediaType[]>>;
    recordsToDelete: MediaType[];
}

const ItemMediaList: React.FC<MediaListProps> = ({setRecord, setRecordsToDelete, recordsToDelete }) => {
    const [activeMediaSrc, setActiveMediaSrc] = useState<string | null>(null);
    const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));
    const initialRecord = useRecordContext<ItemType>();
    const [recordPresent, setRecordPresent] = useState<ItemType>(initialRecord);
    const mediaObject = recordPresent?.media ? recordPresent.media.find((media: MediaType) => media.src === activeMediaSrc) : null;
    function handleDragStart(event: any) {
        setActiveMediaSrc(event.active.id);
    }

    useEffect(() => {
        setRecordPresent(initialRecord);
    }, [initialRecord]); // This effect runs whenever `recordPresent` changes

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target && event.target.files) {
            for (let i = 0; i < event.target.files.length; i++) {
                const file = event.target.files[i];
                const newMedia: MediaType = {
                    id: 0,
                    file: file,
                    src: URL.createObjectURL(file), // temporary URL for the uploaded file
                    sort: recordPresent?.media?.length ? recordPresent.media.length + 1 : i + 1, // add other necessary properties here
                    item_id: recordPresent ? Number(recordPresent.id) : 0,
                    created_at: "",
                    updated_at: "",
                };
                setRecordPresent(prevRecord => ({
                    ...prevRecord,
                    media: [...prevRecord?.media || [], newMedia],
                }));
                setRecord(prevRecord => ({
                    ...prevRecord,
                    media: [...(prevRecord?.media || []), newMedia],
                }));
            }
        }
    };

    function handleDragEnd(event: any) {
        const {active, over} = event;

        if (active.id !== over.id) {
            const oldIndex = recordPresent.media.map((media: MediaType) => media.src).indexOf(active.id);
            const newIndex = recordPresent.media.map((media: MediaType) => media.src).indexOf(over.id);
            let newMedia = arrayMove(recordPresent.media, oldIndex, newIndex);

            newMedia = newMedia.map((item, index) => {
                if (item && typeof item === 'object') {
                    return {
                        ...item,
                        sort: index + 1
                    };
                }
                return item;
            });
            setRecordPresent({
                ...recordPresent,
                media: newMedia
            });
            setRecord({
                ...recordPresent,
                media: newMedia
            });
        }
        setActiveMediaSrc(null);
    }

    function handleDragCancel() {
        setActiveMediaSrc(null);
    }

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragCancel={handleDragCancel}
        >
            <SortableContext items={recordPresent?.media ? recordPresent.media.map((media: MediaType) => media.src) : []} strategy={rectSortingStrategy}>
                <Grid columns={4}>
                    {recordPresent?.media ? recordPresent.media.map((media: MediaType, index: number) => (
                        <SortablePhoto
                            setRecordPresent={setRecordPresent}
                            recordPresent={recordPresent}
                            setRecord={setRecord}
                            media={media}
                            index={index}
                            setRecordsToDelete={setRecordsToDelete}
                            key={media.src}
                        />
                    )) : null}
                </Grid>
            </SortableContext>

            <FileInput source="files" name="files" label="Related files" multiple type="file" onChange={handleFileUpload} >
                <FileField source="src" title="title" />
            </FileInput>

            <DragOverlay adjustScale={true}>
                {activeMediaSrc && mediaObject ? (
                    <Media media={mediaObject}
                           setRecordPresent={setRecordPresent}
                           record={recordPresent}
                           setRecord={setRecord}
                           index={recordPresent?.media.map((media: MediaType) => media.src).indexOf(activeMediaSrc)}
                           key={mediaObject.src}
                           setRecordsToDelete={setRecordsToDelete}
                    />
                ) : null}
            </DragOverlay>
        </DndContext>
    );
};

export default ItemMediaList;
