import { FileIcon, FileArchiveIcon, FileCodeIcon, FileTextIcon, ImageSquareIcon, MusicNoteIcon, VideoCameraIcon } from '@phosphor-icons/react'
import type { Icon } from '@phosphor-icons/react'

type FileIconInfo = {
    icon: Icon
    isImage: boolean
}

const EXTENSION_MAP: Record<string, FileIconInfo> = {
    'jpg': { icon: ImageSquareIcon, isImage: true },
    'jpeg': { icon: ImageSquareIcon, isImage: true },
    'png': { icon: ImageSquareIcon, isImage: true },
    'gif': { icon: ImageSquareIcon, isImage: true },
    'webp': { icon: ImageSquareIcon, isImage: true },
    'svg': { icon: ImageSquareIcon, isImage: true },
    'bmp': { icon: ImageSquareIcon, isImage: true },
    'ico': { icon: ImageSquareIcon, isImage: true },

    'pdf': { icon: FileTextIcon, isImage: false },
    'doc': { icon: FileTextIcon, isImage: false },
    'docx': { icon: FileTextIcon, isImage: false },
    'txt': { icon: FileTextIcon, isImage: false },
    'md': { icon: FileTextIcon, isImage: false },
    'rtf': { icon: FileTextIcon, isImage: false },

    'ts': { icon: FileCodeIcon, isImage: false },
    'tsx': { icon: FileCodeIcon, isImage: false },
    'js': { icon: FileCodeIcon, isImage: false },
    'jsx': { icon: FileCodeIcon, isImage: false },
    'json': { icon: FileCodeIcon, isImage: false },
    'html': { icon: FileCodeIcon, isImage: false },
    'css': { icon: FileCodeIcon, isImage: false },
    'py': { icon: FileCodeIcon, isImage: false },
    'go': { icon: FileCodeIcon, isImage: false },
    'rs': { icon: FileCodeIcon, isImage: false },

    'zip': { icon: FileArchiveIcon, isImage: false },
    'rar': { icon: FileArchiveIcon, isImage: false },
    '7z': { icon: FileArchiveIcon, isImage: false },
    'tar': { icon: FileArchiveIcon, isImage: false },
    'gz': { icon: FileArchiveIcon, isImage: false },

    'mp4': { icon: VideoCameraIcon, isImage: false },
    'mov': { icon: VideoCameraIcon, isImage: false },
    'avi': { icon: VideoCameraIcon, isImage: false },
    'mkv': { icon: VideoCameraIcon, isImage: false },
    'webm': { icon: VideoCameraIcon, isImage: false },

    'mp3': { icon: MusicNoteIcon, isImage: false },
    'wav': { icon: MusicNoteIcon, isImage: false },
    'flac': { icon: MusicNoteIcon, isImage: false },
    'ogg': { icon: MusicNoteIcon, isImage: false },
    'aac': { icon: MusicNoteIcon, isImage: false },
}

const DEFAULT_ICON: FileIconInfo = { icon: FileIcon, isImage: false }

export const getFileIcon = (filename: string) => {
    const ext = filename.split('.').pop()?.toLowerCase() ?? ''
    return EXTENSION_MAP[ext] ?? DEFAULT_ICON
}

export const isImageFile = (filename: string) => {
    return getFileIcon(filename).isImage
}
