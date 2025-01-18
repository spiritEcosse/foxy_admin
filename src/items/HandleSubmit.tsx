import { ItemType, MediaType, MediaTypeEnum, TagType } from '../types'
import { deleteMedia, uploadMedia } from '../clients/storage'

const processMedia = (notify: any, data: any, item?: ItemType) => {
    let mediaToUpdate: MediaType[] = []
    let mediaToCreate: MediaType[] = []
    let mediaToDelete: MediaType[] = []

    item?.media?.forEach((media) => {
        if (!data.media.find((m: MediaType) => m.id === media.id)) {
            mediaToDelete.push(media)
        }
    })

    data.media.forEach((media: MediaType) => {
        if (media.rawFile) {
            media.type = media.rawFile.type.startsWith('video/')
                ? MediaTypeEnum.VIDEO
                : MediaTypeEnum.IMAGE
            media.content_type = media.rawFile.type
        }
        media.sort = data.media.indexOf(media) + 1
        media.item_id = data.id

        if (media.id) {
            media.src = `items${media.src.split('items')[1].split('?')[0]}`
            mediaToUpdate.push(media)
        } else {
            if (!media.rawFile) {
                notify('no_file_to_upload', { type: 'warning' })
                return
            }

            media.src = `items/${data.id}/${media.src
                .split('/')
                .pop()}.${media.rawFile.name.split('.').pop()}`
            mediaToCreate.push(media)
        }
    })

    return { mediaToUpdate, mediaToCreate, mediaToDelete }
}

const processTags = (data: any, item?: ItemType) => {
    let tagUpdate: TagType[] = []
    let tagCreate: TagType[] = []
    let tagIdsToDelete: number[] = []

    item?.tags?.forEach((tag) => {
        if (!data.tags.find((t: TagType) => t.id === tag.id)) {
            tagIdsToDelete.push(Number(tag.id))
        }
    })

    data.tags.forEach((tag: TagType) => {
        tag.item_id = data.id

        if (tag.id) {
            tagUpdate.push(tag)
        } else {
            tagCreate.push(tag)
        }
    })

    return { tagUpdate, tagCreate, tagIdsToDelete }
}

const handleItem = async (data: any, dataProvider: any) => {
    const itemEndpoint = 'api/v1/item/admin'

    if (data.id === undefined) {
        const response = await dataProvider.create(itemEndpoint, { data })
        return response.data.id
    } else {
        await dataProvider.updateItem(itemEndpoint, { id: data.id, data })
        return data.id
    }
}

const handleTags = async (
    tagUpdate: TagType[],
    tagCreate: TagType[],
    tagIdsToDelete: number[],
    dataProvider: any,
) => {
    const tagEndpoint = 'api/v1/tag/admin/items'

    if (tagUpdate.length)
        await dataProvider.multiUpdate(tagEndpoint, { items: tagUpdate })
    if (tagCreate.length)
        await dataProvider.multiCreate(tagEndpoint, { items: tagCreate })
    if (tagIdsToDelete.length)
        await dataProvider.multiDelete(tagEndpoint, { items: tagIdsToDelete })
}

const handleMedia = async (
    mediaToUpdate: MediaType[],
    mediaToCreate: MediaType[],
    mediaToDelete: MediaType[],
    dataProvider: any,
    notify: any,
) => {
    const mediaEndpoint = 'api/v1/media/admin/items'

    if (mediaToUpdate.length)
        await dataProvider.multiUpdate(mediaEndpoint, { items: mediaToUpdate })

    if (mediaToCreate.length) {
        for (const media of mediaToCreate) {
            await uploadMedia(notify, media)
        }
        await dataProvider.multiCreate(mediaEndpoint, { items: mediaToCreate })
    }

    if (mediaToDelete.length) {
        for (const media of mediaToDelete) {
            await deleteMedia(notify, media)
        }
        await dataProvider.multiDelete(mediaEndpoint, {
            items: mediaToDelete.map((media: MediaType) => media.id),
        })
    }
}

export const HandleSubmit = async (
    data: any,
    item: ItemType | undefined,
    notify: any,
    dataProvider: any,
    redirect: any,
    refresh: any,
) => {
    try {
        const create = data.id === undefined
        data.id = await handleItem(data, dataProvider)

        const { mediaToUpdate, mediaToCreate, mediaToDelete } = processMedia(
            notify,
            data,
            item,
        )
        const { tagUpdate, tagCreate, tagIdsToDelete } = processTags(data, item)

        await handleTags(tagUpdate, tagCreate, tagIdsToDelete, dataProvider)
        await handleMedia(
            mediaToUpdate,
            mediaToCreate,
            mediaToDelete,
            dataProvider,
            notify,
        )

        if (create) {
            redirect(`/api/v1/item/admin/${data.id}`)
            notify('item_created', { type: 'info' })
        } else {
            refresh()
            notify('item_updated', { type: 'info' })
        }
    } catch (error) {
        console.error('Error: could not update item or media', error)
        notify('could_not_update_object', { type: 'error' })
    }
}
