import type { FC } from 'react'

type DetailRowProps = {
    label: string
    value: string
}

const DetailRow: FC<DetailRowProps> = ({ label, value }) => {
    return (
        <div className='flex flex-col gap-0.5'>
            <span className='text-[10px] font-medium text-muted-foreground'>{label}</span>
            <span className='break-all text-xs'>{value}</span>
        </div>
    )
}

export { DetailRow }
