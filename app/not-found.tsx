import Link from 'next/link'
import { Button } from '@shared/ui/button'

const NotFound = () => (
    <div className='flex min-h-svh flex-col items-center justify-center gap-4'>
        <h1 className='text-6xl font-bold'>404</h1>
        <p className='text-sm text-muted-foreground'>페이지를 찾을 수 없습니다</p>
        <Button asChild>
            <Link href='/'>홈으로</Link>
        </Button>
    </div>
)

export default NotFound
