// eslint-disable-next-line
import { UserLayout, BasicLayout, RouteView, BlankLayout, PageView } from '@/layouts'

export const testersRouterMap = [

  {
    path: '/testers',
    name: 'testers',
    component: PageView,
    redirect: '/testers',
    meta: { title: '测试人员管理', icon: 'setting' },
    children: [
      {
        path: '/testers',
        name: 'testers',
        component: () => import('@/views/testers/List'),
        meta: { title: '测试人员管理', icon: 'user' }
      },
      {
        path: '/testers/detail',
        name: 'testersDetail',
        hidden: true,
        component: () => import('@/views/testers/Detail'),
        meta: { title: '导入试题' }
      }
    ]
  }
]
