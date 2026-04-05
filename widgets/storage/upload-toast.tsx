'use client'

import { CheckCircleIcon, XCircleIcon, XIcon } from '@phosphor-icons/react'
import { useT } from '@shared/provider/i18n-provider'
import { Button } from '@shared/ui/button'
import { useStorageStore } from '@shared/store/storage-store'

const UploadToast = () => {
    const { uploadQueue, removeUpload, clearCompletedUploads } = useStorageStore()
    const { t } = useT()

    if (uploadQueue.length === 0) return null

    const hasCompleted = uploadQueue.some((u) => u.status === 'done')

    return (
        <div className='fixed bottom-4 right-4 z-50 flex w-80 flex-col gap-2 border bg-background p-3 shadow-lg'>
            <div className='flex items-center justify-between'>
                <span className='text-xs font-medium'>{t.upload}</span>
                {hasCompleted && (
                    <Button variant='ghost' size='icon-xs' onClick={clearCompletedUploads}>
                        <XIcon className='size-3' />
                    </Button>
                )}
            </div>
            {uploadQueue.map((item) => (
                <div key={item.id} className='flex flex-col gap-1'>
                    <div className='flex items-center gap-2'>
                        {item.status === 'done' && <CheckCircleIcon className='size-3.5 shrink-0 text-green-500' />}
                        {item.status === 'error' && <XCircleIcon className='size-3.5 shrink-0 text-destructive' />}
                        <span className='min-w-0 flex-1 truncate text-xs'>{item.fileName}</span>
                        {(item.status === 'done' || item.status === 'error') && (
                            <Button variant='ghost' size='icon-xs' onClick={() => removeUpload(item.id)}>
                                <XIcon className='size-3' />
                            </Button>
                        )}
                    </div>
                    {item.status === 'uploading' && (
                        <div className='h-1 w-full overflow-hidden bg-muted'>
                            <div className='h-full bg-primary transition-all duration-200' style={{ width: `${item.progress}%` }} />
                        </div>
                    )}
                </div>
            ))}
        </div>
    )
}

export { UploadToast }
