'use client'

import Image from 'next/image'
import { FolderIcon, GlobeIcon, LockIcon, XIcon } from '@phosphor-icons/react'
import type { FC } from 'react'
import type { DriveItem } from '@entities/drive/type'
import { getItemName } from '@entities/drive/util'
import { useT } from '@shared/provider/i18n-provider'
import { getFileIcon } from '@shared/util/file-icon-map'
import { formatFileSize } from '@shared/util/format-file-size'
import { Button } from '@shared/ui/button'
import { Separator } from '@shared/ui/separator'
import { ScrollArea } from '@shared/ui/scroll-area'
import { Sheet, SheetContent } from '@shared/ui/sheet'
import { useMediaQuery } from '@shared/hook/use-media-query'
import { DetailRow } from '@/features/storage/detail-row'

type FileDetailPanelProps = {
    detailItem: DriveItem
    fullImageUrl: string | null
    onClose: () => void
    onTogglePublic: () => void
}

const FileDetailPanel: FC<FileDetailPanelProps> = ({ detailItem, fullImageUrl, onClose, onTogglePublic }) => {
    const { t, locale } = useT()
    const isMobile = useMediaQuery('(max-width: 768px)')

    const isFolder = detailItem.kind === 'folder'
    const name = getItemName(detailItem)
    const { icon: FileTypeIcon } = getFileIcon(name)
    const ext = name.split('.').pop()?.toUpperCase() ?? ''
    const thumbnail = detailItem.kind === 'asset' ? detailItem.data.thumbnail : null
    const previewSrc = fullImageUrl ?? thumbnail

    const dateLocale = locale === 'jp' ? 'ja-JP' : locale === 'en' ? 'en-US' : 'ko-KR'
    const dateOpts: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }
    const createdDate = new Date(detailItem.data.createdAt).toLocaleDateString(dateLocale, dateOpts)
    const updatedDate = new Date(detailItem.data.updatedAt).toLocaleDateString(dateLocale, dateOpts)

    const panelContent = (
        <ScrollArea className='h-full'>
            <div className='flex flex-col gap-4 p-4'>
                <div className='flex items-center justify-between'>
                    <h3 className='text-sm font-semibold'>{t.detailTitle}</h3>
                    <Button variant='ghost' size='icon-xs' onClick={onClose}>
                        <XIcon className='size-4' />
                    </Button>
                </div>

                <Separator />

                <div className='flex flex-col items-center gap-3'>
                    {previewSrc ? (
                        <div className='relative aspect-video w-full overflow-hidden border'>
                            <Image src={previewSrc} alt={name} fill className='object-cover' sizes='288px' unoptimized={!!fullImageUrl} />
                        </div>
                    ) : isFolder ? (
                        <FolderIcon className='size-16 text-primary' weight='duotone' />
                    ) : (
                        <FileTypeIcon className='size-16 text-muted-foreground' weight='duotone' />
                    )}
                    <p className='w-full break-all text-center text-sm font-medium'>{name}</p>
                </div>

                <Separator />

                <div className='flex flex-col gap-3'>
                    {isFolder ? (
                        <DetailRow label={t.detailType} value={t.detailFolder} />
                    ) : (
                        <DetailRow label={t.detailType} value={ext ? t.detailFileType(ext) : t.detailType} />
                    )}
                    {detailItem.kind === 'asset' && <DetailRow label={t.detailSize} value={formatFileSize(detailItem.data.sizeBytes)} />}
                    {detailItem.kind === 'asset' && detailItem.data.mimeType && <DetailRow label='MIME' value={detailItem.data.mimeType} />}
                    {detailItem.kind === 'asset' && (
                        <div className='flex items-center justify-between'>
                            <span className='text-[10px] font-medium text-muted-foreground'>{t.togglePublic}</span>
                            <Button variant='ghost' size='icon-xs' onClick={onTogglePublic}>
                                {detailItem.data.isPublic ? (
                                    <GlobeIcon className='size-4 text-green-500' />
                                ) : (
                                    <LockIcon className='size-4 text-muted-foreground' />
                                )}
                            </Button>
                        </div>
                    )}
                    <DetailRow label={t.detailCreated} value={createdDate} />
                    <DetailRow label={t.detailModified} value={updatedDate} />
                    <DetailRow label='ID' value={String(detailItem.data.id)} />
                </div>
            </div>
        </ScrollArea>
    )

    if (isMobile) {
        return (
            <Sheet open onOpenChange={(open) => !open && onClose()}>
                <SheetContent side='right' className='w-72 p-0'>
                    {panelContent}
                </SheetContent>
            </Sheet>
        )
    }

    return <aside className='hidden w-72 shrink-0 border-l md:block'>{panelContent}</aside>
}

export { FileDetailPanel }
