export const DOUBLE_CLICK_GAP_MS = 250
export const IMAGE_EXTENSIONS = new Set(['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp', 'ico'])
export const THUMBNAIL_EXTENSIONS = new Set(['jpg', 'jpeg', 'png', 'gif', 'webp'])

export const ZOOM_GRID_SIZES = {
    1: { minmax: '80px', icon: 'size-6', container: 'size-8', text: 'text-[9px]' },
    2: { minmax: '100px', icon: 'size-7', container: 'size-10', text: 'text-[10px]' },
    3: { minmax: '120px', icon: 'size-8', container: 'size-12', text: 'text-xs' },
    4: { minmax: '160px', icon: 'size-10', container: 'size-14', text: 'text-xs' },
    5: { minmax: '200px', icon: 'size-12', container: 'size-16', text: 'text-sm' },
} as const
