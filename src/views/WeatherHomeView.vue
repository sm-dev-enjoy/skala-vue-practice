<script setup>
import { onMounted, watch, ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import WeatherCard from '../components/exercise/WeatherCard.vue'
import StatusAlert from '../components/common/StatusAlert.vue'
import { useWeatherSearch } from '@/composables/useWeatherSearch'
import { useWeatherApi } from '@/composables/useWeatherApi'
import { useConfigStore } from '@/stores/configStore'

const route = useRoute()
const router = useRouter()
const configStore = useConfigStore()

const { weatherList, searchQuery, selectedCityInfo, filteredWeatherList, updateQuery, selectCity } =
  useWeatherSearch()

const { isLoading, errorMessage, fetchRealTimeWeatherList, formatTemperature } = useWeatherApi()

// 메인 Hero 배너에 띄울 선택 도시
const selectedHeroIndex = ref(0)

const heroCity = computed(() => {
  if (weatherList.value.length === 0) return null
  return weatherList.value[selectedHeroIndex.value] ?? weatherList.value[0]
})

const heroTemp = computed(() => formatTemperature(heroCity.value?.temp))

// 퀵 도시 칩 목록
const quickCities = [
  { name: '서울', key: 'Seoul', index: 0 },
  { name: '수원', key: 'Suwon', index: 1 },
  { name: '부산', key: 'Busan', index: 2 },
]

const loadWeatherData = async () => {
  const data = await fetchRealTimeWeatherList()
  weatherList.value = [...data]
}

onMounted(() => {
  const query = route.query?.search
  searchQuery.value = typeof query === 'string' ? query : ''
  loadWeatherData()
})

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

const handleSelectHeroCity = (index, name) => {
  selectedHeroIndex.value = index
  selectCity(`${name} 관측소가 선택되어 메인 하이라이트에 렌더링되었습니다.`)
}

const handleDetailJump = (cityId) => {
  router.push(`/weather/${cityId}`)
}
</script>

<template>
  <div class="dashboard-page-container">
    <!-- Hero Highlight Section (Apple Weather Style) -->
    <div v-if="heroCity" class="hero-weather-banner glass-panel">
      <div class="hero-header-row">
        <div class="hero-badge">
          <span class="live-dot"></span> LIVE METRICS
        </div>
        <el-button type="primary" link class="refresh-btn" @click="loadWeatherData">
          🔄 데이터 동기화
        </el-button>
      </div>

      <div class="hero-body-grid">
        <div class="hero-left-info">
          <h2 class="hero-city-name">{{ heroCity.name }}</h2>
          <span class="hero-status-desc">{{ heroCity.status }}</span>
          
          <div class="hero-temp-box">
            <span class="hero-temp-num">{{ heroTemp }}</span>
            <span class="hero-temp-unit">{{ configStore.unitSymbol }}</span>
          </div>
        </div>

        <div class="hero-right-metrics">
          <div class="metric-chip">
            <span class="metric-label">관측 상태</span>
            <span class="metric-val">{{ heroCity.status }}</span>
          </div>
          <div class="metric-chip">
            <span class="metric-label">체감 기온</span>
            <span class="metric-val">{{ heroTemp }}{{ configStore.unitSymbol }}</span>
          </div>
          <div class="metric-chip">
            <span class="metric-label">업데이트</span>
            <span class="metric-val">실시간 동기화</span>
          </div>
        </div>
      </div>

      <!-- Quick City Selection Chips -->
      <div class="hero-quick-chips">
        <span class="chip-label">퀵 지역 선택:</span>
        <button
          v-for="city in quickCities"
          :key="city.key"
          class="quick-chip-btn"
          :class="{ active: selectedHeroIndex === city.index }"
          @click="handleSelectHeroCity(city.index, city.name)"
        >
          📍 {{ city.name }}
        </button>
      </div>
    </div>

    <!-- Search & Filter Card Bar -->
    <el-card class="search-filter-card" shadow="never">
      <div class="search-flex-row">
        <div class="search-input-wrapper">
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
        </div>
      </div>
    </el-card>

    <!-- Weather Cards Grid Area -->
    <div class="grid-section">
      <div class="section-title-bar">
        <h3>🏙️ 대한민국 주요 지역 관측소 현황</h3>
        <span class="count-tag">총 {{ filteredWeatherList.length }}개 지역</span>
      </div>

      <!-- Skeleton Loading -->
      <div v-if="isLoading" class="skeleton-grid">
        <el-skeleton :rows="3" animated />
      </div>

      <template v-else>
        <StatusAlert :message="errorMessage" type="error" />

        <template v-if="!errorMessage">
          <div class="cards-layout-grid">
            <WeatherCard
              v-for="item in filteredWeatherList"
              :key="item.id"
              :city-item="item"
              @select-card="selectCity"
              @click-detail="handleDetailJump"
            >
              <template #actions="{ handleDetail }">
                <el-button type="primary" size="small" @click.stop="handleDetail">
                  상세 관측소 →
                </el-button>
              </template>
            </WeatherCard>
          </div>

          <el-empty
            v-if="filteredWeatherList.length === 0"
            description="검색 결과와 일치하는 도시가 없습니다."
            :image-size="90"
          />
        </template>
      </template>

      <!-- Status Footer Bar -->
      <div class="status-footer-banner">
        💡 {{ selectedCityInfo }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.dashboard-page-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* Hero Weather Banner */
.hero-weather-banner {
  background: linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 41, 59, 0.95) 100%);
  color: #ffffff;
  padding: 28px 32px;
  border-radius: 20px;
  box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.12);
}

.hero-header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 1px;
  color: #38bdf8;
  background: rgba(56, 189, 248, 0.1);
  padding: 4px 10px;
  border-radius: 20px;
}

.live-dot {
  width: 8px;
  height: 8px;
  background-color: #38bdf8;
  border-radius: 50%;
  box-shadow: 0 0 8px #38bdf8;
}

.refresh-btn {
  color: #94a3b8;
}
.refresh-btn:hover {
  color: #38bdf8;
}

.hero-body-grid {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 24px;
  margin-bottom: 24px;
}

.hero-city-name {
  margin: 0 0 4px 0;
  font-size: 2.2rem;
  font-weight: 800;
  color: #f8fafc;
}

.hero-status-desc {
  font-size: 1.1rem;
  color: #cbd5e1;
}

.hero-temp-box {
  display: flex;
  align-items: baseline;
  margin-top: 12px;
}

.hero-temp-num {
  font-size: 4rem;
  font-weight: 900;
  color: #38bdf8;
  line-height: 1;
  letter-spacing: -2px;
}

.hero-temp-unit {
  font-size: 2rem;
  font-weight: 700;
  color: #94a3b8;
  margin-left: 4px;
}

.hero-right-metrics {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.metric-chip {
  background: rgba(255, 255, 255, 0.06);
  padding: 12px 16px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  min-width: 110px;
}

.metric-label {
  display: block;
  font-size: 0.75rem;
  color: #94a3b8;
  margin-bottom: 4px;
}

.metric-val {
  font-size: 0.95rem;
  font-weight: 700;
  color: #f8fafc;
}

.hero-quick-chips {
  display: flex;
  align-items: center;
  gap: 10px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 18px;
}

.chip-label {
  font-size: 0.85rem;
  color: #94a3b8;
  font-weight: 600;
}

.quick-chip-btn {
  background: rgba(255, 255, 255, 0.1);
  color: #cbd5e1;
  border: none;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.quick-chip-btn:hover,
.quick-chip-btn.active {
  background: #38bdf8;
  color: #0f172a;
}

/* Search Card */
.search-filter-card {
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  background: #ffffff;
}

.section-title-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.section-title-bar h3 {
  margin: 0;
  font-size: 1.2rem;
  font-weight: 700;
  color: #0f172a;
}

.count-tag {
  font-size: 0.85rem;
  color: #64748b;
  font-weight: 600;
}

.cards-layout-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
}

.status-footer-banner {
  margin-top: 20px;
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  padding: 12px 18px;
  text-align: center;
  color: #166534;
  font-weight: 700;
  border-radius: 12px;
  font-size: 0.9rem;
}
</style>
