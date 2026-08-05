import { nextTick } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { cityById } from '@/constants/cities'

const routes = [
  {
    path: '/',
    name: 'WeatherHome',
    meta: { title: '실시간 날씨 | 날씨 인사이트' },
    component: () => import('../views/WeatherHomeView.vue'),
  },
  {
    path: '/forecast',
    name: 'WeatherForecast',
    meta: { title: '5일 기상 예보 | 날씨 인사이트' },
    component: () => import('../views/WeatherForecastView.vue'),
  },
  {
    path: '/air',
    name: 'WeatherAir',
    meta: { title: '대기질 분석 | 날씨 인사이트' },
    component: () => import('../views/WeatherAirView.vue'),
  },
  {
    path: '/about',
    name: 'WeatherAbout',
    meta: { title: '서비스 소개 | 날씨 인사이트' },
    component: () => import('../views/WeatherAboutView.vue'),
  },
  {
    path: '/weather/:cityId',
    name: 'WeatherDetail',
    meta: { title: '관측소 상세 정보 | 날씨 인사이트' },
    component: () => import('../views/WeatherDetailView.vue'),
  },
  {
    path: '/not-found',
    name: 'NotFound',
    meta: { title: '페이지를 찾을 수 없음 | 날씨 인사이트' },
    component: () => import('../views/NotFoundView.vue'),
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: { name: 'NotFound' },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(_to, _from, savedPosition) {
    return savedPosition ?? { top: 0 }
  },
})

router.beforeEach((to) => {
  if (to.name === 'WeatherDetail' && !cityById[to.params.cityId]) {
    return { name: 'NotFound', replace: true }
  }
})

// 각 페이지 이동 시 브라우저 탭 타이틀을 동적으로 변경
router.afterEach((to) => {
  document.title = to.meta?.title ?? '날씨 인사이트 | Weather Insight'
  nextTick(() => {
    document.getElementById('main-content')?.focus({ preventScroll: true })
  })
})

export default router
