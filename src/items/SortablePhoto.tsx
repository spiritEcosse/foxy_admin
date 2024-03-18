import React from 'react';
import {useSortable} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';

import Media from './Media';
import {ItemType, MediaType} from "../types";

type SortablePhotoProps = {
    media: MediaType;
    setRecordPresent: React.Dispatch<React.SetStateAction<ItemType>>;
    recordPresent: ItemType;
    setRecord: React.Dispatch<React.SetStateAction<ItemType>>;
    setRecordsToDelete: React.Dispatch<React.SetStateAction<MediaType[]>>;
    index: number;
    faded?: boolean;
    style?: React.CSSProperties;
};

export const SortablePhoto = ({setRecord, setRecordPresent, recordPresent, setRecordsToDelete, ...props}: SortablePhotoProps) => {
    const sortable = useSortable({id: props.media.src});
    const {
        attributes,
        listeners,
        isDragging,
        setNodeRef,
        transform,
        transition,
    } = sortable;

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <Media
            setRecordsToDelete={setRecordsToDelete}
            setRecordPresent={setRecordPresent}
            recordPresent={recordPresent}
            setRecord={setRecord}
            ref={setNodeRef}
            style={style}
            {...props}
            {...attributes}
            {...listeners}
        />
    );
};
