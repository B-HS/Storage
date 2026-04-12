'use client'

import { Fragment, type FC, useRef, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { DndContext, DragOverlay, type DragEndEvent, type DragStartEvent, MouseSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core'
import { ListIcon } from '@phosphor-icons/react'
import type { DriveItem } from '@entities/drive/type'
import { getItemId, getItemName } from '@entities/drive/util'
import { getDriveErrorMessage } from '@entities/drive/error'
import {
    DRIVE_QUERY_KEY,
    useFolderList,
    useFolderDetail,
    useAssetList,
    useCreateFolder,
    useQuota,
    useMoveAsset,
    useMoveFolder,
} from '@entities/drive/query'
import { uploadFileWithProgress, validateBeforeUpload } from '@entities/drive/upload'
import { useKeyboardShortcut } from '@shared/hook/use-keyboard-shortcut'
import { useT } from '@shared/provider/i18n-provider'
import { Button } from '@shared/ui/button'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@shared/ui/breadcrumb'
import { Sheet, SheetContent, SheetTrigger } from '@shared/ui/sheet'
import { TooltipProvider } from '@shared/ui/tooltip'
import { useStorageStore } from '@shared/store/storage-store'
import { FileTree } from '@/features/storage/file-tree/file-tree'
import { FileGrid } from '@/features/storage/file-grid/file-grid'
import { FileList } from '@/features/storage/file-grid/file-list'
import { ActionBar } from '@/features/storage/action-bar'
import { ViewToggle } from '@/features/storage/view-toggle'
import { ImagePreview } from '@/features/storage/image-preview'
import { DeleteConfirmDialog } from '@/features/storage/delete-confirm-dialog'
import { RenameDialog } from '@/features/storage/rename-dialog'
import { DropZone } from '@/features/storage/drop-zone'
import { FileDetailPanel } from '@/features/storage/file-detail-panel'
import { CreateFolderDialog } from '@/features/storage/create-folder-dialog'
import { UploadToast } from '@widgets/storage/upload-toast'
import { toast } from 'sonner'

type StorageLayoutProps = {
    userId: string
}

const StorageLayout: FC<StorageLayoutProps> = ({ userId }) => {
    const store = useStorageStore()
    const {
        currentFolderId,
        viewMode,
        selectedIds,
        selectAll,
        clearSelection,
        setCurrentFolderId,
        setDeleteTarget,
        setRenameTarget,
        sortField,
        sortOrder,
        mimeFilter,
        page,
    } = store
    const { t } = useT()
    const queryClient = useQueryClient()
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [createFolderOpen, setCreateFolderOpen] = useState(false)
    const [dragItem, setDragItem] = useState<DriveItem | null>(null)

    const sensors = useSensors(
        useSensor(MouseSensor, { activationConstraint: { distance: 8 } }),
        useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 5 } }),
    )
    const moveAssetMutation = useMoveAsset(userId)
    const moveFolderMutation = useMoveFolder(userId)

    const handleDragStart = (event: DragStartEvent) => {
        const item = event.active.data.current?.item as DriveItem | undefined
        if (item) setDragItem(item)
    }

    const handleDragEnd = (event: DragEndEvent) => {
        setDragItem(null)
        const { active, over } = event
        if (!over || active.id === over.id) return

        const draggedItem = active.data.current?.item as DriveItem | undefined
        if (!draggedItem) return

        const targetFolderId = over.data.current?.folderId as string | null | undefined
        if (targetFolderId === undefined) return

        if (draggedItem.kind === 'asset') {
            moveAssetMutation.mutate({ assetId: draggedItem.data.id, folderId: targetFolderId })
        } else {
            moveFolderMutation.mutate({ folderId: draggedItem.data.id, parentId: targetFolderId })
        }
    }

    const { data: treeFolders = [] } = useFolderList(userId)
    const { data: treeAssets } = useAssetList(userId, { folderId: 'root', page: 1, limit: 100, sort: 'name', order: 'asc' })

    const { data: contentFolders = [] } = useFolderList(userId, currentFolderId ?? undefined)
    const { data: contentAssetResult } = useAssetList(userId, {
        folderId: currentFolderId ?? 'root',
        page,
        limit: 20,
        sort: sortField,
        order: sortOrder,
        ...(mimeFilter ? { mimeType: mimeFilter } : {}),
    })
    const { data: folderDetail } = useFolderDetail(userId, currentFolderId)
    const { data: quota } = useQuota(userId)

    const breadcrumb = folderDetail?.breadcrumb ?? []
    const contentAssets = contentAssetResult?.data ?? []
    const pagination = contentAssetResult?.pagination

    const items: DriveItem[] = [
        ...contentFolders.map((f) => ({ kind: 'folder' as const, data: f })),
        ...contentAssets.map((a) => ({ kind: 'asset' as const, data: a })),
    ]

    const allIds = items.map(getItemId)
    const selectedItems = items.filter((item) => selectedIds.has(getItemId(item)))

    const createFolderMutation = useCreateFolder(userId)

    const handleNavigateFolder = (folderId: string) => setCurrentFolderId(folderId)
    const handleNavigateRoot = () => setCurrentFolderId(null)
    const handleNavigateBreadcrumb = (folderId: string) => setCurrentFolderId(folderId)

    const handleUpload = (files: File[]) => {
        files.forEach((file) => {
            const validationError = validateBeforeUpload(file)
            if (validationError) {
                const errorKey =
                    validationError === 'DRIVE_FILE_TOO_LARGE'
                        ? t.errorFileTooLarge
                        : validationError === 'DRIVE_FILE_EMPTY'
                          ? t.errorFileEmpty
                          : t.errorBlockedExtension
                toast.error(errorKey)
                return
            }

            const uploadId = crypto.randomUUID()
            store.addUpload({ id: uploadId, fileName: file.name, progress: 0, status: 'uploading' })

            uploadFileWithProgress(file, currentFolderId, (pct) => {
                store.updateUploadProgress(uploadId, pct)
            })
                .then(() => {
                    store.updateUploadStatus(uploadId, 'done')
                    toast.success(t.uploadSuccess)
                    queryClient.invalidateQueries({ queryKey: DRIVE_QUERY_KEY.assets(userId) })
                    queryClient.invalidateQueries({ queryKey: DRIVE_QUERY_KEY.quota(userId) })
                })
                .catch((error) => {
                    store.updateUploadStatus(uploadId, 'error')
                    toast.error(getDriveErrorMessage(error, t))
                    queryClient.invalidateQueries({ queryKey: DRIVE_QUERY_KEY.assets(userId) })
                })
        })
    }

    const handleUploadClick = () => fileInputRef.current?.click()

    const handleCreateFolder = (name: string) => {
        createFolderMutation.mutate({ name, parentId: currentFolderId })
    }

    const handleKeyDelete = () => {
        if (selectedItems.length > 0) setDeleteTarget(selectedItems)
    }
    const handleKeyRename = () => {
        if (selectedItems.length === 1) setRenameTarget(selectedItems[0])
    }
    const handleSelectAll = () => selectAll(allIds)

    useKeyboardShortcut([
        { key: 'Delete', handler: handleKeyDelete },
        { key: 'Backspace', handler: handleKeyDelete },
        { key: 'F2', handler: handleKeyRename },
        { key: 'a', ctrl: true, handler: handleSelectAll },
        { key: 'Escape', handler: clearSelection },
    ])

    const treeContent = (
        <FileTree
            userId={userId}
            folders={treeFolders}
            assets={treeAssets?.data ?? []}
            quota={quota}
            onCreateFolder={() => setCreateFolderOpen(true)}
        />
    )

    return (
        <TooltipProvider>
            <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
                <div className='flex h-[calc(100svh-2.25rem)]'>
                    <aside className='hidden w-64 shrink-0 overflow-hidden border-r md:block'>{treeContent}</aside>

                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant='ghost' size='icon' className='fixed bottom-4 left-4 z-40 border bg-background md:hidden'>
                                <ListIcon className='size-5' />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side='left' className='w-72 p-0'>
                            {treeContent}
                        </SheetContent>
                    </Sheet>

                    <div className='flex min-w-0 flex-1 flex-col'>
                        <div className='flex items-stretch justify-between border-b'>
                            <Breadcrumb className='flex items-center px-1.5'>
                                <BreadcrumbList>
                                    <BreadcrumbItem>
                                        {breadcrumb.length > 0 ? (
                                            <BreadcrumbLink className='cursor-pointer text-xs' onClick={handleNavigateRoot}>
                                                {t.home}
                                            </BreadcrumbLink>
                                        ) : (
                                            <BreadcrumbPage className='text-xs'>{t.home}</BreadcrumbPage>
                                        )}
                                    </BreadcrumbItem>
                                    {breadcrumb.map((crumb, i) => (
                                        <Fragment key={crumb.id}>
                                            <BreadcrumbSeparator />
                                            <BreadcrumbItem>
                                                {i < breadcrumb.length - 1 ? (
                                                    <BreadcrumbLink
                                                        className='cursor-pointer text-xs'
                                                        onClick={() => handleNavigateBreadcrumb(crumb.id)}>
                                                        {crumb.name}
                                                    </BreadcrumbLink>
                                                ) : (
                                                    <BreadcrumbPage className='text-xs'>{crumb.name}</BreadcrumbPage>
                                                )}
                                            </BreadcrumbItem>
                                        </Fragment>
                                    ))}
                                </BreadcrumbList>
                            </Breadcrumb>
                            <div className='flex items-stretch'>
                                <ActionBar items={items} userId={userId} />
                                <ViewToggle onUploadClick={handleUploadClick} />
                            </div>
                        </div>

                        <DropZone onDrop={handleUpload}>
                            {viewMode === 'grid' ? (
                                <FileGrid items={items} onNavigateFolder={handleNavigateFolder} pagination={pagination} />
                            ) : (
                                <FileList items={items} onNavigateFolder={handleNavigateFolder} pagination={pagination} />
                            )}
                        </DropZone>
                    </div>

                    <FileDetailPanel userId={userId} />

                    <ImagePreview />
                    <DeleteConfirmDialog userId={userId} />
                    <RenameDialog userId={userId} />
                    <CreateFolderDialog open={createFolderOpen} onOpenChange={setCreateFolderOpen} onConfirm={handleCreateFolder} isPending={createFolderMutation.isPending} />

                    <UploadToast />

                    <input
                        ref={fileInputRef}
                        type='file'
                        multiple
                        className='hidden'
                        onChange={(e) => {
                            const files = Array.from(e.target.files ?? [])
                            if (files.length > 0) handleUpload(files)
                            e.target.value = ''
                        }}
                    />
                </div>

                <DragOverlay>
                    {dragItem && <div className='border bg-background px-3 py-1.5 text-xs shadow-lg'>{getItemName(dragItem)}</div>}
                </DragOverlay>
            </DndContext>
        </TooltipProvider>
    )
}

export { StorageLayout }
