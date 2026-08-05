<script setup>
import { onMounted, watch, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'

import BaseDashboardCard from '../components/exercise/BaseDashboardCard.vue'
import WeatherCard from '../components/exercise/WeatherCard.vue'
import { useWeatherSearch } from '@/composables/useWeatherSearch'

const route = useRoute()
const router = useRouter()

// Composable 상태 구조분해 할당 (Destructuring)
const { weatherList, searchQuery, selectedCityInfo, filteredWeatherList, updateQuery, selectCity } =
  useWeatherSearch()

const isLoading = ref(false)
const errorMessage = ref('')

// 환경 변수 활용 API 키와 기본 엔드포인트 주소
const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather'

/**
 * 주요 3개 도시(서울, 수원, 부산)의 실시간 날씨 정보를 비동기로 조회합니다.
 */
const fetchRealTimeWeather = async () => {
  isLoading.value = true
  errorMessage.value = ''

  try {
    // Promise.all로 병렬 통신 수행
    const [seoulRes, suwonRes, busanRes] = await Promise.all([
      axios.get(`${BASE_URL}?q=Seoul&appid=${API_KEY}&units=metric&lang=kr`),
      axios.get(`${BASE_URL}?q=Suwon&appid=${API_KEY}&units=metric&lang=kr`),
      axios.get(`${BASE_URL}?q=Busan&appid=${API_KEY}&units=metric&lang=kr`),
    ])

    // ES6+ 구조분해 할당 및 옵셔널 체이닝 적용하여 데이터 정제
    const parseCityData = (id, name, res) => {
      const { main, weather } = res?.data ?? {}
      const [firstWeather] = weather ?? []
      return {
        id,
        name,
        temp: main?.temp ?? 0,
        status: firstWeather?.description ?? '정보 없음',
      }
    }

    const realTimeWeather = [
      parseCityData('city_01', '서울', seoulRes),
      parseCityData('city_02', '수원', suwonRes),
      parseCityData('city_03', '부산', busanRes),
    ]

    // 라우터 쿼리 스트링 동기화 및 렌더링 목록 업데이트 (전개 연산자 활용 복사)
    const initialQuery = route.query?.search
    searchQuery.value = typeof initialQuery === 'string' ? initialQuery : searchQuery.value
    weatherList.value = [...realTimeWeather]
  } catch (error) {
    console.error('날씨 API 통신 오류 발생:', error)
    errorMessage.value = '실시간 날씨 데이터를 불러오지 못했습니다. API 키 및 네트워크 상태를 확인하세요.'
    weatherList.value = []
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  const query = route.query?.search
  searchQuery.value = typeof query === 'string' ? query : ''
  fetchRealTimeWeather()
})

// 라우터 쿼리 변화 감지
watch(
  () => route.query?.search,
  (nextQuery) => {
    const normalizedQuery = typeof nextQuery === 'string' ? nextQuery : ''
    if (normalizedQuery !== searchQuery.value) {
      searchQuery.value = normalizedQuery
    }
  },
)

// 검색어 입력 시 URL 쿼리 파라미터 업데이트
watch(searchQuery, (nextQuery) => {
  router.replace({
    path: route.path,
    query: nextQuery ? { search: nextQuery } : {},
  })
})

const handleDetailJump = (cityId) => {
  router.push(`/weather/${cityId}`)
}
</script>

<template>
  <div class="dashboard-page">
    <!-- 도시 검색 영역 (Element Plus input 적용) -->
    <el-card class="box-card search-card" shadow="hover">
      <template #header>
        <div class="card-header">
          <span>🔍 도시 검색</span>
          <el-tag type="info" size="small" effect="plain">실시간 필터링</el-tag>
        </div>
      </template>

      <el-input
        v-model="searchQuery"
        placeholder="검색할 도시명을 입력하세요 (예: 서울, 수원, 부산)"
        clearable
        size="large"
        @input="updateQuery"
      >
        <template #prefix>
          <el-icon><i-ep-search /></el-icon>
        </template>
      </el-input>
    </el-card>

    <!-- 날씨 현황 영역 -->
    <BaseDashboardCard style="margin-top: 16px;">
      <template #header>
        <div class="header-title-bar">
          <h3>🏙️ 지역별 날씨 현황 (OpenWeatherMap API)</h3>
          <el-button type="primary" link @click="fetchRealTimeWeather">
            🔄 새로고침
          </el-button>
        </div>
      </template>

      <!-- Element Plus Skeleton 로딩 효과 -->
      <div v-if="isLoading" class="skeleton-container">
        <el-skeleton :rows="4" animated />
      </div>

      <template v-else>
        <el-alert
          v-if="errorMessage"
          :title="errorMessage"
          type="error"
          show-icon
          :closable="false"
          style="margin-bottom: 16px;"
        />

        <template v-else>
          <div class="weather-card-grid">
            <WeatherCard
              v-for="item in filteredWeatherList"
              :key="item.id"
              :city-item="item"
              @select-card="selectCity"
              @click-detail="handleDetailJump"
            >
              <template #actions="{ handleDetail }">
                <el-button type="primary" size="small" @click.stop="handleDetail">
                  상세보기 →
                </el-button>
              </template>
            </WeatherCard>
          </div>

          <!-- 검색 결과 없음 (Element Plus Empty UI) -->
          <el-empty
            v-if="filteredWeatherList.length === 0"
            description="검색 결과와 일치하는 도시가 없습니다."
            :image-size="80"
          />
        </template>
      </template>

      <template #footer>
        <div class="status-bar">
          💡 {{ selectedCityInfo }}
        </div>
      </template>
    </BaseDashboardCard>
  </div>
</template>

<style scoped>
.dashboard-page {
  width: 100%;
}

.search-card {
  border-radius: 8px;
}

.card-header,
.header-title-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-title-bar h3 {
  margin: 0;
  font-size: 1.1rem;
}

.weather-card-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.skeleton-container {
  padding: 16px 0;
}

.status-bar {
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  padding: 10px 14px;
  text-align: center;
  color: #166534;
  font-weight: 600;
  border-radius: 8px;
  font-size: 0.9rem;
}
</style>
