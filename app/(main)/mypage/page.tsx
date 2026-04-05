import { Suspense } from 'react'
import { MyPageLoading } from '@/features/mypage/mypage-loading'
import { MyPageLayout } from '@widgets/mypage/mypage-layout'

const MyPage = () => (
    <Suspense fallback={<MyPageLoading />}>
        <MyPageLayout />
    </Suspense>
)

export default MyPage
