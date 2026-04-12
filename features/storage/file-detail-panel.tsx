'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { FolderIcon, GlobeIcon, LockIcon, XIcon } from '@phosphor-icons/react'
import type { FC } from 'react'
import { getItemName, isImageAsset } from '@entities/drive/util'
import { useUpdateAsset } from '@entities/drive/query'
import { API_BASE_URL, DRIVE_API_PATH } from '@shared/constant/api'
import { useT } from '@shared/provider/i18n-provider'
import { getFileIcon } from '@shared/util/file-icon-map'
import { formatFileSize } from '@shared/util/format-file-size'
import { Button } from '@shared/ui/button'
import { Separator } from '@shared/ui/separator'
import { ScrollArea } from '@shared/ui/scroll-area'
import { Sheet, SheetContent } from '@shared/ui/sheet'
import { useMediaQuery } from '@shared/hook/use-media-query'
import { useStorageStore } from '@shared/store/storage-store'
import { DetailRow } from '@/features/storage/detail-row'

type FileDetailPanelProps = {
    userId: string
}

const FileDetailPanel: FC<FileDetailPanelProps> = ({ userId }) => {
    const { detailItem, setDetailItem } = useStorageStore()
    const { t, locale } = useT()
    const updateAssetMutation = useUpdateAsset(userId)
    const isMobile = useMediaQuery('(max-width: 768px)')

    const detailAssetId = detailItem?.kind === 'asset' ? detailItem.data.id : null
    const isImage = detailItem ? isImageAsset(detailItem) : false
    const [fullImage, setFullImage] = useState<{ id: number; url: string } | null>(null)

    useEffect(() => {
        if (!detailAssetId || !isImage) return

        const controller = new AbortController()
        fetch(`${API_BASE_URL}${DRIVE_API_PATH.ASSET(detailAssetId)}`, { credentials: 'include', signal: controller.signal })
            .then((res) => res.json())
            .then((json: { success: boolean; data: { url: string } }) => {
                if (json.success) setFullImage({ id: detailAssetId, url: json.data.url })
            })
            .catch(() => {})

        return () => controller.abort()
    }, [detailAssetId, isImage])

    const fullImageUrl = fullImage?.id === detailAssetId ? fullImage.url : null

    if (!detailItem) return null

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

    const handleTogglePublic = () => {
        if (detailItem.kind !== 'asset') return
        const newIsPublic = !detailItem.data.isPublic
        updateAssetMutation.mutate(
            { assetId: detailItem.data.id, input: { isPublic: newIsPublic } },
            { onSuccess: () => setDetailItem({ kind: 'asset', data: { ...detailItem.data, isPublic: newIsPublic } }) },
        )
    }

    const panelContent = (
        <ScrollArea className='h-full'>
            <div className='flex flex-col gap-4 p-4'>
                <div className='flex items-center justify-between'>
                    <h3 className='text-sm font-semibold'>{t.detailTitle}</h3>
                    <Button variant='ghost' size='icon-xs' onClick={() => setDetailItem(null)}>
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
                            <Button variant='ghost' size='icon-xs' onClick={handleTogglePublic}>
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
            <Sheet open={!!detailItem} onOpenChange={(open) => !open && setDetailItem(null)}>
                <SheetContent side='right' className='w-72 p-0'>
                    {panelContent}
                </SheetContent>
            </Sheet>
        )
    }

    return (
        <aside className='hidden w-72 shrink-0 border-l md:block'>
            {panelContent}
        </aside>
    )
}

export { FileDetailPanel }
