export function slugify(text: string) {
    return text
        .toString()
        .toLowerCase()
        .replace(/\s+/g, '-') // Replace spaces with -
        .replace(/[^\w-]+/g, '') // Remove all non-word chars
        .replace(/--+/g, '-') // Replace multiple - with single -
        .replace(/^-+/, '') // Trim - from start of text
        .replace(/-+$/, '') // Trim - from end of text
}

export function validatePositive(value: any) {
    return value <= 0 ? 'Price must be a positive number' : undefined
}

export function getFileExtension (filename: string) {
    const parts = filename.split('.');
    return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : '';
}


export function getMimeType (extension: string): string | undefined  {
    switch (extension) {
        case 'png':
            return 'image/png';
        case 'jpg':
        case 'jpeg':
            return 'image/jpeg';
        case 'gif':
            return 'image/gif';
        case 'webp':
            return 'image/webp';
        case 'mp4':
            return 'video/mp4';
        case 'mov':
            return 'video/quicktime';
        case 'avi':
            return 'video/x-msvideo';
        case 'wmv':
            return 'video/x-ms-wmv';
        default:
            return;
    }
}
