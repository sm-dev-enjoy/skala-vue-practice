<script setup>
import { onMounted, watch, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'

import BaseDashboardCard from '../components/exercise/BaseDashboardCard.vue'
import SearchBar from '../components/exercise/SearchBar.vue'
import WeatherCard from '../components/exercise/WeatherCard.vue'
import { useWeatherSearch } from '@/composables/useWeatherSearch'

const route = useRoute()
const router = useRouter()

const { weatherList, searchQuery, selectedCityInfo, filteredWeatherList, updateQuery, selectCity } =
  useWeatherSearch()

const isLoading = ref(false)
const errorMessage = ref('')

const API_KEY = '8964edc63b366d27b5b728b7976570b7'
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather'

const fetchRealTimeWeather = async () => {
  isLoading.value = true
  errorMessage.value = ''

  try {
    const [seoulRes, suwonRes, busanRes] = await Promise.all([
      axios.get(`${BASE_URL}?q=Seoul&appid=${API_KEY}&units=metric&lang=kr`),
      axios.get(`${BASE_URL}?q=Suwon&appid=${API_KEY}&units=metric&lang=kr`),
      axios.get(`${BASE_URL}?q=Busan&appid=${API_KEY}&units=metric&lang=kr`),
    ])

    const realTimeWeather = [
      {
        id: 'city_01',
        name: '서울',
        temp: seoulRes.data.main.temp,
        status: seoulRes.data.weather[0].description,
      },
      {
        id: 'city_02',
        name: '수원',
        temp: suwonRes.data.main.temp,
        status: suwonRes.data.weather[0].description,
      },
      {
        id: 'city_03',
        name: '부산',
        temp: busanRes.data.main.temp,
        status: busanRes.data.weather[0].description,
      },
    ]

    searchQuery.value = typeof route.query.search === 'string' ? route.query.search : searchQuery.value
    weatherList.value = realTimeWeather
  } catch (error) {
    console.error('🔴 날씨 API 연동 실패:', error)
    errorMessage.value = '실시간 날씨 데이터를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.'
    weatherList.value = []
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  const query = route.query.search
  searchQuery.value = typeof query === 'string' ? query : ''
  fetchRealTimeWeather()
})

watch(
  () => route.query.search,
  (nextQuery) => {
    const normalizedQuery = typeof nextQuery === 'string' ? nextQuery : ''
    if (normalizedQuery !== searchQuery.value) {
      searchQuery.value = normalizedQuery
    }
  },
)

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
    <BaseDashboardCard>
      <template #header>
        <h3>🔍 도시 검색</h3>
      </template>

      <SearchBar :current-query="searchQuery" @update-query="updateQuery" />
    </BaseDashboardCard>

    <BaseDashboardCard>
      <template #header>
        <h3>🏙️ 지역별 날씨 현황 (실시간 OpenWeatherMap)</h3>
      </template>

      <p v-if="isLoading" class="loading-message">🔄 글로벌 기상 위성으로부터 실시간 데이터를 수신 중입니다...</p>

      <template v-else>
        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>

        <template v-else>
          <WeatherCard
            v-for="item in filteredWeatherList"
            :key="item.id"
            :city-item="item"
            @select-card="selectCity"
            @click-detail="handleDetailJump"
          >
            <template #actions="{ handleDetail }">
              <button class="btn-detail" @click.stop="handleDetail">상세보기</button>
            </template>
          </WeatherCard>

          <p v-if="filteredWeatherList.length === 0" class="empty-result">
            😭 검색 결과와 일치하는 도시가 없습니다.
          </p>
        </template>
      </template>

      <template #footer>
        <div class="status-bar">
          {{ selectedCityInfo }}
        </div>
      </template>
    </BaseDashboardCard>
  </div>
</template>

<style scoped>
.dashboard-page {
  width: 100%;
}

.btn-detail {
  padding: 6px 10px;
  cursor: pointer;
}

.loading-message,
.error-message {
  text-align: center;
  font-weight: 600;
  padding: 16px 0;
  margin: 0;
}

.loading-message {
  color: #3498db;
}

.error-message {
  color: #d63031;
}

.empty-result {
  text-align: center;
  color: #e74c3c;
  padding: 10px 0 0;
  margin: 0;
}

.status-bar {
  background: #e8f5e9;
  padding: 10px;
  text-align: center;
  color: #2e7d32;
  font-weight: bold;
  border-radius: 6px;
}
</style>
