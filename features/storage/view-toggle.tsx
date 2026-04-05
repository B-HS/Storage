'use client'

import type { FC } from 'react'
import {
    ArrowsDownUpIcon,
    FunnelIcon,
    ListIcon,
    MagnifyingGlassMinusIcon,
    MagnifyingGlassPlusIcon,
    SortAscendingIcon,
    SortDescendingIcon,
    SquaresFourIcon,
    UploadSimpleIcon,
} from '@phosphor-icons/react'

import type { DriveSortField } from '@entities/drive/type'
import { useT } from '@shared/provider/i18n-provider'
import { Button } from '@shared/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@shared/ui/dropdown-menu'
import { Separator } from '@shared/ui/separator'
import { Tooltip, TooltipContent, TooltipTrigger } from '@shared/ui/tooltip'
import { useStorageStore, type ZoomLevel } from '@shared/store/storage-store'

type ViewToggleProps = {
    onUploadClick?: () => void
}

const MIME_FILTERS = [
    { key: null, labelKey: 'filterAll' as const },
    { key: 'image/', labelKey: 'filterImages' as const },
    { key: 'application/', labelKey: 'filterDocuments' as const },
    { key: 'video/', labelKey: 'filterVideo' as const },
    { key: 'audio/', labelKey: 'filterAudio' as const },
] as const

const ViewToggle: FC<ViewToggleProps> = ({ onUploadClick }) => {
    const { viewMode, setViewMode, zoomLevel, setZoomLevel, sortField, sortOrder, setSortField, setSortOrder, mimeFilter, setMimeFilter } =
        useStorageStore()
    const { t } = useT()

    const isMinZoom = zoomLevel <= 1
    const isMaxZoom = zoomLevel >= 5

    const handleZoomIn = () => {
        if (!isMaxZoom) setZoomLevel((zoomLevel + 1) as ZoomLevel)
    }
    const handleZoomOut = () => {
        if (!isMinZoom) setZoomLevel((zoomLevel - 1) as ZoomLevel)
    }

    const sortLabels: Record<DriveSortField, string> = { name: t.sortByName, created: t.sortByDate, size: t.sortBySize }

    return (
        <div className='flex items-stretch'>
            <Button variant={viewMode === 'grid' ? 'secondary' : 'ghost'} size='icon-xs' onClick={() => setViewMode('grid')}>
                <SquaresFourIcon className='size-4' />
            </Button>
            <Button variant={viewMode === 'list' ? 'secondary' : 'ghost'} size='icon-xs' onClick={() => setViewMode('list')}>
                <ListIcon className='size-4' />
            </Button>

            {viewMode === 'grid' && (
                <>
                    <Separator orientation='vertical' />
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant='ghost' size='icon-xs' onClick={handleZoomOut} disabled={isMinZoom}>
                                <MagnifyingGlassMinusIcon className='size-4' />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>{t.zoomOut}</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant='ghost' size='icon-xs' onClick={handleZoomIn} disabled={isMaxZoom}>
                                <MagnifyingGlassPlusIcon className='size-4' />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>{t.zoomIn}</TooltipContent>
                    </Tooltip>
                </>
            )}

            <Separator orientation='vertical' />

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant='ghost' size='icon-xs'>
                        <ArrowsDownUpIcon className='size-4' />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end'>
                    {(['name', 'created', 'size'] as DriveSortField[]).map((field) => (
                        <DropdownMenuItem key={field} onClick={() => setSortField(field)} className={sortField === field ? 'bg-muted' : ''}>
                            {sortLabels[field]}
                        </DropdownMenuItem>
                    ))}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setSortOrder('asc')} className={sortOrder === 'asc' ? 'bg-muted' : ''}>
                        <SortAscendingIcon className='mr-2 size-4' />
                        {t.ascending}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortOrder('desc')} className={sortOrder === 'desc' ? 'bg-muted' : ''}>
                        <SortDescendingIcon className='mr-2 size-4' />
                        {t.descending}
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant={mimeFilter ? 'secondary' : 'ghost'} size='icon-xs'>
                        <FunnelIcon className='size-4' />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end'>
                    {MIME_FILTERS.map((filter) => (
                        <DropdownMenuItem
                            key={filter.labelKey}
                            onClick={() => setMimeFilter(filter.key)}
                            className={mimeFilter === filter.key ? 'bg-muted' : ''}>
                            {t[filter.labelKey]}
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>

            <Separator orientation='vertical' />
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button variant='ghost' size='icon-xs' onClick={onUploadClick}>
                        <UploadSimpleIcon className='size-4' />
                    </Button>
                </TooltipTrigger>
                <TooltipContent>{t.upload}</TooltipContent>
            </Tooltip>
        </div>
    )
}

export { ViewToggle }
