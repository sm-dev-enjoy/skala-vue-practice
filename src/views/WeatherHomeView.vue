<script setup>
import { onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import BaseDashboardCard from '../components/exercise/BaseDashboardCard.vue'
import WeatherCard from '../components/exercise/WeatherCard.vue'
import StatusAlert from '../components/common/StatusAlert.vue'
import { useWeatherSearch } from '@/composables/useWeatherSearch'
import { useWeatherApi } from '@/composables/useWeatherApi'

const route = useRoute()
const router = useRouter()

// UI 상태 검색 Composable
const { weatherList, searchQuery, selectedCityInfo, filteredWeatherList, updateQuery, selectCity } =
  useWeatherSearch()

// API 및 비즈니스 로직 Composable
const { isLoading, errorMessage, fetchRealTimeWeatherList } = useWeatherApi()

const loadWeatherData = async () => {
  const data = await fetchRealTimeWeatherList()
  weatherList.value = [...data]
}

onMounted(() => {
  const query = route.query?.search
  searchQuery.value = typeof query === 'string' ? query : ''
  loadWeatherData()
})

// 라우터 쿼리 동기화
watch(
  () => route.query?.search,
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
    <!-- 도시 검색 영역 -->
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

    <!-- 날씨 현황 대시보드 -->
    <BaseDashboardCard style="margin-top: 16px;">
      <template #header>
        <div class="header-title-bar">
          <h3>🏙️ 지역별 날씨 현황 (OpenWeatherMap API)</h3>
          <el-button type="primary" link @click="loadWeatherData">
            🔄 새로고침
          </el-button>
        </div>
      </template>

      <!-- Skeleton 로딩 UI -->
      <div v-if="isLoading" class="skeleton-container">
        <el-skeleton :rows="4" animated />
      </div>

      <template v-else>
        <!-- 공통 StatusAlert 컴포넌트 -->
        <StatusAlert :message="errorMessage" type="error" />

        <template v-if="!errorMessage">
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

          <!-- Empty UI -->
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
