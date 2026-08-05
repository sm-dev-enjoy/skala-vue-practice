import { createRouter, createWebHistory } from 'vue-router'

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
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    meta: { title: '페이지를 찾을 수 없음 | 날씨 인사이트' },
    component: () => import('../views/NotFoundView.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// 각 페이지 이동 시 브라우저 탭 타이틀을 동적으로 변경
router.afterEach((to) => {
  document.title = to.meta?.title ?? '날씨 인사이트 | Weather Insight'
})

export default router
