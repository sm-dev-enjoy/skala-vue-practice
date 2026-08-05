<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import WeatherCard from '../components/exercise/WeatherCard.vue'
import CitySelector from '../components/common/CitySelector.vue'
import StatusAlert from '../components/common/StatusAlert.vue'
import SvgIcon from '../components/common/SvgIcon.vue'
import { stationOptions } from '@/constants/cities'
import { useWeatherSearch } from '@/composables/useWeatherSearch'
import { useWeatherApi } from '@/composables/useWeatherApi'
import { useConfigStore } from '@/stores/configStore'

const route = useRoute()
const router = useRouter()
const configStore = useConfigStore()

const { weatherList, searchQuery, filteredWeatherList } = useWeatherSearch()
const {
  isLoading,
  errorMessage,
  partialFailureMessage,
  fetchRealTimeWeatherList,
  formatTemperature,
} = useWeatherApi()

const selectedHeroId = ref('city_01')
const lastUpdatedAt = ref(null)
let loadRequestId = 0

const heroCity = computed(
  () =>
    weatherList.value.find((city) => city.id === selectedHeroId.value) ??
    weatherList.value[0] ??
    null,
)
const heroTemp = computed(() => formatTemperature(heroCity.value?.temp))
const unavailableCityIds = computed(() =>
  stationOptions
    .filter((city) => !weatherList.value.some((weather) => weather.id === city.value))
    .map((city) => city.value),
)

const heroWeatherIcon = computed(() => {
  const status = heroCity.value?.status ?? ''
  if (status.includes('맑음') || status.includes('Clear') || status.includes('Sun')) return 'sun'
  if (status.includes('비') || status.includes('Rain') || status.includes('소나기')) return 'rain'
  return 'cloud'
})

const formattedLastUpdated = computed(() => {
  if (!lastUpdatedAt.value) return '갱신 시각 정보 없음'

  return new Intl.DateTimeFormat('ko-KR', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Asia/Seoul',
  }).format(lastUpdatedAt.value)
})

const loadWeatherData = async () => {
  const requestId = ++loadRequestId
  const data = await fetchRealTimeWeatherList()

  if (requestId !== loadRequestId) return

  weatherList.value = data
  if (!data.some((city) => city.id === selectedHeroId.value)) {
    selectedHeroId.value = data[0]?.id ?? selectedHeroId.value
  }
  lastUpdatedAt.value = data.length > 0 ? new Date() : null
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
  const normalizedQuery = nextQuery.trim()
  const currentQuery = typeof route.query?.search === 'string' ? route.query.search : ''
  if (normalizedQuery === currentQuery) return

  const remainingQuery = Object.fromEntries(
    Object.entries(route.query).filter(([key]) => key !== 'search'),
  )

  router.replace({
    path: route.path,
    query: normalizedQuery ? { ...remainingQuery, search: normalizedQuery } : remainingQuery,
  })
})
</script>

<template>
  <div class="home-container">
    <h1 class="sr-only">전국 현재 날씨</h1>

    <!-- 로딩 중일 때 부드러운 스켈레톤 히어로 카드 -->
    <div v-if="isLoading && !heroCity" class="skeleton-box">
      <el-skeleton :rows="4" animated />
    </div>

    <section v-else-if="heroCity" class="hero-card" aria-labelledby="hero-city-title">
      <div class="hero-top">
        <div>
          <p class="eyebrow">전국 주요 도시 현재 날씨</p>
          <p class="update-time">마지막으로 불러온 시각 · {{ formattedLastUpdated }}</p>
        </div>
        <button
          type="button"
          class="refresh-button"
          :disabled="isLoading"
          :aria-label="isLoading ? '날씨 정보를 불러오는 중' : '현재 날씨 새로고침'"
          @click="loadWeatherData"
        >
          <SvgIcon name="refresh" size="16" color="currentColor" aria-hidden="true" />
          <span>{{ isLoading ? '불러오는 중' : '새로고침' }}</span>
        </button>
      </div>

      <div class="hero-content">
        <div class="hero-city-group">
          <div class="city-name-row">
            <SvgIcon name="map-pin" size="24" color="#1469d8" aria-hidden="true" />
            <h2 id="hero-city-title" class="city-title">{{ heroCity.name }}</h2>
          </div>
          <p class="status-title">{{ heroCity.status }}</p>
          <p class="city-full-name">{{ heroCity.fullName }}</p>
        </div>

        <div
          class="hero-right-visual"
          :aria-label="`현재 기온 ${heroTemp ?? '정보 없음'}${configStore.unitSymbol}`"
        >
          <SvgIcon :name="heroWeatherIcon" size="48" color="#1469d8" aria-hidden="true" />
          <div class="hero-temp-group">
            <span class="big-temp">{{ heroTemp ?? '—' }}</span>
            <span v-if="heroTemp !== null" class="big-unit">{{ configStore.unitSymbol }}</span>
          </div>
        </div>
      </div>

      <div class="hero-actions">
        <RouterLink class="detail-link" :to="`/weather/${heroCity.id}`">
          {{ heroCity.name }} 상세 날씨 보기
          <SvgIcon name="arrow-right" size="16" color="currentColor" aria-hidden="true" />
        </RouterLink>
      </div>

      <CitySelector
        v-model="selectedHeroId"
        label="한눈에 볼 지역"
        :options="stationOptions"
        :disabled-values="unavailableCityIds"
      />
    </section>

    <section v-else-if="!isLoading" class="unavailable-card" aria-labelledby="unavailable-title">
      <SvgIcon name="cloud" size="32" color="#1469d8" aria-hidden="true" />
      <div>
        <h2 id="unavailable-title">현재 날씨를 준비하지 못했습니다</h2>
        <p>네트워크 상태를 확인한 뒤 다시 불러와 주세요.</p>
      </div>
      <button type="button" class="primary-action" @click="loadWeatherData">다시 불러오기</button>
    </section>

    <section class="weather-section" aria-labelledby="weather-list-title" :aria-busy="isLoading">
      <div class="search-box">
        <label for="city-search" class="sr-only">도시 이름으로 현재 날씨 검색</label>
        <el-input
          id="city-search"
          v-model="searchQuery"
          placeholder="도시명으로 검색하세요 (예: 서울, 제주)"
          clearable
          size="large"
          class="weather-search-input"
        >
          <template #prefix>
            <SvgIcon name="search" size="18" color="#66717f" aria-hidden="true" />
          </template>
        </el-input>
      </div>

      <div class="section-header">
        <div>
          <h2 id="weather-list-title" class="section-title">도시별 현재 날씨</h2>
          <p class="section-description">
            카드를 선택하면 기온, 습도, 풍속 등 상세 정보를 볼 수 있습니다.
          </p>
        </div>
        <span class="section-count" aria-live="polite"
          >{{ filteredWeatherList.length }}개 표시</span
        >
      </div>

      <StatusAlert
        :message="errorMessage"
        type="error"
        retryable
        :is-retrying="isLoading"
        @retry="loadWeatherData"
      />
      <StatusAlert :message="partialFailureMessage" type="warning" />

      <div v-if="isLoading && weatherList.length === 0" class="skeleton-box" aria-label="현재 날씨를 불러오는 중">
        <el-skeleton :rows="4" animated />
      </div>

      <template v-else-if="!errorMessage">
        <div v-if="filteredWeatherList.length" class="cards-grid" aria-live="polite">
          <WeatherCard v-for="item in filteredWeatherList" :key="item.id" :city-item="item" />
        </div>

        <el-empty
          v-else
          description="일치하는 도시가 없습니다. 다른 도시명을 입력해 보세요."
          :image-size="80"
        />
      </template>
    </section>
  </div>
</template>

<style scoped>
.home-container,
.weather-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.hero-card,
.unavailable-card {
  border: 1px solid var(--toss-border);
  border-radius: 20px;
  background: var(--toss-canvas);
  box-shadow: 0 4px 20px rgba(25, 31, 40, 0.03);
}

.hero-card {
  padding: 28px;
}

.hero-top,
.hero-content,
.hero-actions,
.section-header,
.unavailable-card {
  display: flex;
  align-items: center;
}

.hero-top,
.hero-content,
.section-header {
  justify-content: space-between;
}

.hero-top {
  gap: 16px;
  margin-bottom: 24px;
}

.eyebrow {
  margin: 0 0 4px;
  color: var(--toss-weak-fg);
  font-size: 14px;
  font-weight: 800;
}

.update-time,
.city-full-name,
.section-description {
  margin: 0;
  color: var(--toss-muted);
  font-size: 13px;
  font-weight: 600;
}

.refresh-button,
.primary-action {
  display: inline-flex;
  min-height: 44px;
  align-items: center;
  justify-content: center;
  gap: 6px;
  border-radius: 10px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 800;
  padding: 0 14px;
}

.refresh-button {
  border: 1px solid var(--toss-border);
  background: #ffffff;
  color: var(--toss-body);
}

.refresh-button:hover {
  border-color: #a3c9f5;
  color: var(--toss-blue);
}

.refresh-button:disabled {
  cursor: wait;
  opacity: 0.6;
}

.hero-content {
  align-items: flex-end;
  gap: 20px;
  margin-bottom: 20px;
}

.city-name-row,
.hero-right-visual,
.hero-temp-group,
.detail-link {
  display: flex;
  align-items: center;
}

.city-name-row {
  gap: 8px;
}

.city-title {
  margin: 0;
  color: var(--toss-foreground);
  font-size: 32px;
  font-weight: 800;
  letter-spacing: -0.7px;
}

.status-title {
  margin: 8px 0 2px;
  color: var(--toss-body);
  font-size: 16px;
  font-weight: 700;
}

.hero-right-visual {
  flex: 0 0 auto;
  gap: 16px;
}

.hero-temp-group {
  align-items: baseline;
}

.big-temp {
  color: var(--toss-blue);
  font-size: 56px;
  font-weight: 800;
  letter-spacing: -2px;
  line-height: 1;
}

.big-unit {
  margin-left: 3px;
  color: var(--toss-muted);
  font-size: 22px;
  font-weight: 700;
}

.hero-actions {
  justify-content: flex-end;
  border-top: 1px solid var(--toss-border);
  margin: 0 0 18px;
  padding-top: 16px;
}

.detail-link {
  gap: 5px;
  color: var(--toss-blue);
  font-size: 14px;
  font-weight: 800;
}

.weather-search-input :deep(.el-input__wrapper) {
  min-height: 52px;
  border: 1px solid var(--toss-border);
  border-radius: 14px;
  box-shadow: none;
  padding: 6px 16px;
}

.weather-search-input :deep(.el-input__wrapper.is-focus) {
  border-color: var(--toss-blue);
  box-shadow: 0 0 0 3px rgba(20, 105, 216, 0.15);
}

.section-header {
  gap: 16px;
}

.section-title {
  margin: 0 0 3px;
  color: var(--toss-foreground);
  font-size: 20px;
  font-weight: 800;
}

.section-count {
  flex: 0 0 auto;
  border-radius: 999px;
  background: var(--toss-surface);
  color: var(--toss-body);
  font-size: 13px;
  font-weight: 800;
  padding: 7px 10px;
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 16px;
}

.unavailable-card {
  gap: 14px;
  padding: 24px;
}

.unavailable-card h2 {
  margin: 0 0 4px;
  color: var(--toss-foreground);
  font-size: 18px;
  font-weight: 800;
}

.unavailable-card p {
  margin: 0;
  color: var(--toss-body);
  font-size: 14px;
}

.primary-action {
  margin-left: auto;
  border: 1px solid var(--toss-blue);
  background: var(--toss-blue);
  color: #ffffff;
}

@media (max-width: 640px) {
  .home-container,
  .weather-section {
    gap: 16px;
  }

  .hero-card {
    border-radius: 16px;
    padding: 20px;
  }

  .hero-top,
  .hero-content {
    align-items: flex-start;
    flex-direction: column;
  }

  .hero-top {
    margin-bottom: 20px;
  }

  .refresh-button {
    width: 100%;
  }

  .hero-content {
    margin-bottom: 18px;
  }

  .hero-right-visual {
    width: 100%;
    justify-content: space-between;
  }

  .big-temp {
    font-size: 48px;
  }

  .section-header {
    align-items: flex-start;
    flex-direction: column;
    gap: 8px;
  }

  .unavailable-card {
    align-items: flex-start;
    flex-direction: column;
  }

  .primary-action {
    width: 100%;
    margin-left: 0;
  }
}
</style>
