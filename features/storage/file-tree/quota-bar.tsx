import type { FC } from 'react'
import type { DriveQuota } from '@entities/drive/type'
import { formatFileSize } from '@shared/util/format-file-size'

type QuotaBarProps = {
    quota: DriveQuota
}

const QuotaBar: FC<QuotaBarProps> = ({ quota }) => {
    const pct = Math.min(Math.round((quota.used / quota.total) * 100), 100)
    const isWarning = pct >= 80
    const isCritical = pct >= 95

    return (
        <div className='flex flex-col gap-1 px-1'>
            <div className='h-1.5 w-full overflow-hidden bg-muted'>
                <div
                    className={`h-full transition-all ${isCritical ? 'bg-destructive' : isWarning ? 'bg-orange-500' : 'bg-primary'}`}
                    style={{ width: `${pct}%` }}
                />
            </div>
            <span className='text-[10px] text-muted-foreground'>
                {formatFileSize(quota.used)} / {formatFileSize(quota.total)} ({pct}%)
            </span>
        </div>
    )
}

export { QuotaBar }
