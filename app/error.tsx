'use client'

import { Button } from '@shared/ui/button'

const GlobalError = ({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) => (
    <div className='flex min-h-[50svh] flex-col items-center justify-center gap-4'>
        <h2 className='text-lg font-semibold'>오류가 발생했습니다</h2>
        <p className='text-sm text-muted-foreground'>{error.message || '알 수 없는 오류'}</p>
        <Button onClick={reset}>다시 시도</Button>
    </div>
)

export default GlobalError
