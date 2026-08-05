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

const selectedHeroIndex = ref(0)

const heroCity = computed(() => {
  if (weatherList.value.length === 0) return null
  return weatherList.value[selectedHeroIndex.value] ?? weatherList.value[0]
})

const heroTemp = computed(() => formatTemperature(heroCity.value?.temp))

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
  selectCity(`${name} 관측소 선택됨`)
}

const handleDetailJump = (cityId) => {
  router.push(`/weather/${cityId}`)
}
</script>

<template>
  <div class="toss-home-container">
    <!-- Toss Primary Hero Card -->
    <div v-if="heroCity" class="toss-hero-card">
      <div class="hero-top">
        <span class="toss-badge">실시간 관측</span>
        <button class="refresh-link" @click="loadWeatherData">새로고침</button>
      </div>

      <div class="hero-content">
        <div class="hero-city-group">
          <h2 class="city-title">{{ heroCity.name }}</h2>
          <p class="status-title">{{ heroCity.status }}</p>
        </div>

        <div class="hero-temp-group">
          <span class="big-temp">{{ heroTemp }}</span>
          <span class="big-unit">{{ configStore.unitSymbol }}</span>
        </div>
      </div>

      <!-- Quick City Selector Buttons -->
      <div class="hero-city-chips">
        <span class="chips-title">관측 지역</span>
        <div class="chips-wrap">
          <button
            v-for="city in quickCities"
            :key="city.key"
            class="city-chip-btn"
            :class="{ active: selectedHeroIndex === city.index }"
            @click="handleSelectHeroCity(city.index, city.name)"
          >
            {{ city.name }}
          </button>
        </div>
      </div>
    </div>

    <!-- Search Input Bar -->
    <div class="toss-search-box">
      <el-input
        v-model="searchQuery"
        placeholder="검색할 도시명을 입력하세요 (예: 서울, 수원, 부산)"
        clearable
        size="large"
        class="toss-input"
        @input="updateQuery"
      >
        <template #prefix>
          <el-icon><i-ep-search /></el-icon>
        </template>
      </el-input>
    </div>

    <!-- Weather Cards Section -->
    <div class="toss-section">
      <div class="section-header">
        <h3 class="section-title">주요 관측소 날씨</h3>
        <span class="section-count">총 {{ filteredWeatherList.length }}개</span>
      </div>

      <div v-if="isLoading" class="skeleton-box">
        <el-skeleton :rows="3" animated />
      </div>

      <template v-else>
        <StatusAlert :message="errorMessage" type="error" />

        <template v-if="!errorMessage">
          <div class="cards-grid">
            <WeatherCard
              v-for="item in filteredWeatherList"
              :key="item.id"
              :city-item="item"
              @select-card="selectCity"
              @click-detail="handleDetailJump"
            />
          </div>

          <el-empty
            v-if="filteredWeatherList.length === 0"
            description="검색 조건에 맞는 도시가 없습니다."
            :image-size="80"
          />
        </template>
      </template>

      <!-- Status Footer Bar -->
      <div class="status-banner">
        안내: {{ selectedCityInfo }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.toss-home-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* Toss Hero Card */
.toss-hero-card {
  background: var(--toss-canvas);
  border: 1px solid var(--toss-border);
  border-radius: 20px;
  padding: 28px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
}

.hero-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.refresh-link {
  background: transparent;
  border: none;
  color: var(--toss-muted);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
}

.refresh-link:hover {
  color: var(--toss-blue);
}

.hero-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 24px;
}

.city-title {
  margin: 0 0 4px 0;
  font-size: 30px;
  font-weight: 700;
  color: var(--toss-foreground);
  letter-spacing: -0.5px;
}

.status-title {
  margin: 0;
  font-size: 16px;
  color: var(--toss-body);
}

.hero-temp-group {
  display: flex;
  align-items: baseline;
}

.big-temp {
  font-size: 54px;
  font-weight: 700;
  color: var(--toss-blue);
  line-height: 1;
  letter-spacing: -1.5px;
}

.big-unit {
  font-size: 24px;
  font-weight: 600;
  color: var(--toss-muted);
  margin-left: 2px;
}

.hero-city-chips {
  border-top: 1px solid var(--toss-border);
  padding-top: 20px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.chips-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--toss-body);
}

.chips-wrap {
  display: flex;
  gap: 8px;
}

.city-chip-btn {
  background: var(--toss-surface);
  color: var(--toss-body);
  border: none;
  padding: 8px 16px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
}

.city-chip-btn.active {
  background: var(--toss-weak-bg);
  color: var(--toss-weak-fg);
}

/* Search Box */
.toss-search-box :deep(.el-input__wrapper) {
  border-radius: 14px !important;
  box-shadow: none !important;
  border: 1px solid var(--toss-border) !important;
  padding: 8px 16px !important;
}

.toss-search-box :deep(.el-input__wrapper.is-focus) {
  border-color: var(--toss-blue) !important;
}

/* Cards Section */
.toss-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.section-title {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: var(--toss-foreground);
}

.section-count {
  font-size: 14px;
  color: var(--toss-muted);
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}

.status-banner {
  background: var(--toss-surface);
  border: 1px solid var(--toss-border);
  padding: 12px 16px;
  text-align: center;
  color: var(--toss-body);
  font-weight: 600;
  border-radius: 12px;
  font-size: 14px;
}
</style>
