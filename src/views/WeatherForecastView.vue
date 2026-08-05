<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { forecastCityOptions } from '@/constants/cities'
import { useConfigStore } from '@/stores/configStore'
import { useForecast } from '@/composables/useForecast'
import { useWeatherApi } from '@/composables/useWeatherApi'
import CitySelector from '../components/common/CitySelector.vue'
import StatusAlert from '../components/common/StatusAlert.vue'
import SvgIcon from '../components/common/SvgIcon.vue'

const route = useRoute()
const router = useRouter()
const configStore = useConfigStore()
const validCityValues = new Set(forecastCityOptions.map((city) => city.value))

const initialCity = validCityValues.has(route.query.city) ? route.query.city : 'Seoul'
const selectedCity = ref(initialCity)
const selectedDateFilter = ref(typeof route.query.date === 'string' ? route.query.date : '')

const { isLoading, errorMessage, forecastList, observedAt, fetchForecast } = useForecast()
const { formatTemperature } = useWeatherApi()

let loadRequestId = 0

const datePartsFormatter = new Intl.DateTimeFormat('ko-KR', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  timeZone: 'Asia/Seoul',
})

const getDateKey = (timestamp) => {
  if (!Number.isFinite(timestamp)) return ''

  const parts = Object.fromEntries(
    datePartsFormatter
      .formatToParts(new Date(timestamp * 1000))
      .filter((part) => part.type !== 'literal')
      .map((part) => [part.type, part.value]),
  )

  return `${parts.year}-${parts.month}-${parts.day}`
}

const availableDates = computed(() => {
  const dates = new Map()

  forecastList.value.forEach((item) => {
    const key = getDateKey(item.timestamp)
    if (key && !dates.has(key)) dates.set(key, item.timestamp)
  })

  return Array.from(dates, ([key, timestamp]) => ({ key, timestamp }))
})

const filteredForecastList = computed(() => {
  if (!selectedDateFilter.value) return forecastList.value
  return forecastList.value.filter(
    (item) => getDateKey(item.timestamp) === selectedDateFilter.value,
  )
})

const selectedCityLabel = computed(
  () =>
    forecastCityOptions.find((city) => city.value === selectedCity.value)?.label ?? '선택한 도시',
)

const selectedDateLabel = computed(() => {
  if (!selectedDateFilter.value) return '전체 예보'
  const selectedDate = availableDates.value.find((date) => date.key === selectedDateFilter.value)
  return selectedDate ? formatDateLabel(selectedDate.timestamp) : '선택한 날짜'
})

const formattedLastUpdated = computed(() => {
  if (!observedAt.value) return ''

  return new Intl.DateTimeFormat('ko-KR', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Asia/Seoul',
  }).format(observedAt.value)
})

const formatDateLabel = (timestamp) => {
  if (!Number.isFinite(timestamp)) return '날짜 정보 없음'

  return new Intl.DateTimeFormat('ko-KR', {
    month: 'long',
    day: 'numeric',
    weekday: 'short',
    timeZone: 'Asia/Seoul',
  }).format(new Date(timestamp * 1000))
}

const formatTimeOnly = (timestamp) => {
  if (!Number.isFinite(timestamp)) return '시간 정보 없음'

  return new Intl.DateTimeFormat('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'Asia/Seoul',
  }).format(new Date(timestamp * 1000))
}

const getWeatherStateTheme = (description) => {
  const desc = description ?? ''

  if (desc.includes('맑음') || desc.includes('Clear') || desc.includes('Sun')) {
    return { icon: 'sun', className: 'sunny' }
  }
  if (
    desc.includes('비') ||
    desc.includes('Rain') ||
    desc.includes('소나기') ||
    desc.includes('Drizzle')
  ) {
    return { icon: 'rain', className: 'rainy' }
  }
  return { icon: 'cloud', className: 'cloudy' }
}

const syncQuery = () => {
  const query = {}
  if (selectedCity.value !== 'Seoul') query.city = selectedCity.value
  if (selectedDateFilter.value) query.date = selectedDateFilter.value

  router.replace({ path: '/forecast', query })
}

const loadForecast = async () => {
  const requestId = ++loadRequestId
  const list = await fetchForecast(selectedCity.value)

  if (requestId !== loadRequestId || list.length === 0) return

  const availableKeys = new Set(list.map((item) => getDateKey(item.timestamp)))
  if (!availableKeys.has(selectedDateFilter.value)) {
    selectedDateFilter.value = getDateKey(list[0]?.timestamp)
  }
}

onMounted(loadForecast)

watch(selectedCity, () => {
  loadForecast()
  syncQuery()
})

watch(selectedDateFilter, syncQuery)

watch(
  () => route.query,
  (query) => {
    const routeCity = validCityValues.has(query.city) ? query.city : 'Seoul'
    const routeDate = typeof query.date === 'string' ? query.date : ''

    if (routeCity !== selectedCity.value) selectedCity.value = routeCity
    if (routeDate !== selectedDateFilter.value) selectedDateFilter.value = routeDate
  },
)
</script>

<template>
  <div class="forecast-container">
    <header class="page-title-box">
      <h1 class="page-title">5일 기상 예보</h1>
      <p class="page-desc">
        도시와 날짜를 고르면 3시간 단위 예보를 한국 표준시로 확인할 수 있습니다.
      </p>
    </header>

    <CitySelector v-model="selectedCity" :options="forecastCityOptions" label="예보 지역" />

    <section v-if="availableDates.length" class="date-filter-bar" aria-label="예보 날짜 선택">
      <span class="filter-label">날짜</span>
      <div class="date-chips" role="group" aria-label="예보 날짜">
        <button
          type="button"
          class="date-chip"
          :class="{ active: !selectedDateFilter }"
          :aria-pressed="!selectedDateFilter"
          @click="selectedDateFilter = ''"
        >
          전체 예보
        </button>
        <button
          v-for="date in availableDates"
          :key="date.key"
          type="button"
          class="date-chip"
          :class="{ active: selectedDateFilter === date.key }"
          :aria-pressed="selectedDateFilter === date.key"
          @click="selectedDateFilter = date.key"
        >
          {{ formatDateLabel(date.timestamp) }}
        </button>
      </div>
    </section>

    <section
      class="forecast-results"
      :aria-busy="isLoading"
      aria-labelledby="forecast-results-title"
    >
      <div class="results-heading">
        <div>
          <h2 id="forecast-results-title">{{ selectedCityLabel }} · {{ selectedDateLabel }}</h2>
          <p v-if="formattedLastUpdated">마지막으로 불러온 시각 · {{ formattedLastUpdated }}</p>
        </div>
        <span v-if="filteredForecastList.length" class="results-count">
          {{ filteredForecastList.length }}개 시간대
        </span>
      </div>

      <StatusAlert
        :message="errorMessage"
        type="error"
        retryable
        :is-retrying="isLoading"
        @retry="loadForecast"
      />

      <div v-if="isLoading" class="skeleton-box" aria-label="기상 예보를 불러오는 중">
        <el-skeleton :rows="6" animated />
      </div>

      <div v-else-if="filteredForecastList.length" class="forecast-list" aria-live="polite">
        <article v-for="item in filteredForecastList" :key="item.timestamp" class="forecast-card">
          <div class="item-left">
            <time
              class="time-text"
              :datetime="
                Number.isFinite(item.timestamp)
                  ? new Date(item.timestamp * 1000).toISOString()
                  : undefined
              "
            >
              {{ formatTimeOnly(item.timestamp) }}
            </time>
            <div
              class="weather-state-chip"
              :class="getWeatherStateTheme(item.description).className"
            >
              <SvgIcon
                :name="getWeatherStateTheme(item.description).icon"
                size="16"
                color="currentColor"
                aria-hidden="true"
              />
              <span>{{ item.description }}</span>
            </div>
          </div>

          <div class="item-right">
            <dl class="mini-metrics">
              <div>
                <dt>
                  <SvgIcon name="droplet" size="14" color="currentColor" aria-hidden="true" /> 습도
                </dt>
                <dd>
                  {{ item.humidity ?? '—' }}<template v-if="item.humidity !== null">%</template>
                </dd>
              </div>
              <div>
                <dt>
                  <SvgIcon name="wind" size="14" color="currentColor" aria-hidden="true" /> 풍속
                </dt>
                <dd>
                  {{ item.windSpeed ?? '—' }}<template v-if="item.windSpeed !== null">m/s</template>
                </dd>
              </div>
              <div v-if="item.precipitationProbability !== null">
                <dt>강수 확률</dt>
                <dd>{{ Math.round(item.precipitationProbability * 100) }}%</dd>
              </div>
            </dl>
            <div class="temp-text">
              {{ formatTemperature(item.temp) ?? '—'
              }}<span v-if="formatTemperature(item.temp) !== null">{{
                configStore.unitSymbol
              }}</span>
            </div>
          </div>
        </article>
      </div>

      <el-empty
        v-else-if="!errorMessage"
        description="해당 날짜의 예보 정보가 없습니다. 다른 날짜를 선택해 보세요."
        :image-size="80"
      />
    </section>
  </div>
</template>

<style scoped>
.forecast-container,
.forecast-results {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.page-title {
  margin: 0 0 4px;
  color: var(--toss-foreground);
  font-size: 24px;
  font-weight: 800;
  letter-spacing: -0.4px;
}

.page-desc,
.results-heading p {
  margin: 0;
  color: var(--toss-muted);
  font-size: 14px;
  font-weight: 600;
}

.date-filter-bar {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  border: 1px solid var(--toss-border);
  border-radius: 14px;
  background: var(--toss-canvas);
  padding: 12px 16px;
}

.filter-label {
  min-height: 40px;
  display: inline-flex;
  align-items: center;
  color: var(--toss-body);
  font-size: 14px;
  font-weight: 800;
}

.date-chips {
  display: flex;
  flex: 1;
  flex-wrap: wrap;
  gap: 8px;
}

.date-chip {
  min-height: 40px;
  border: 1px solid transparent;
  border-radius: 9px;
  background: var(--toss-surface);
  color: var(--toss-body);
  cursor: pointer;
  font-size: 14px;
  font-weight: 700;
  padding: 0 12px;
}

.date-chip:hover,
.date-chip.active {
  border-color: #8dbcf1;
  background: var(--toss-weak-bg);
  color: var(--toss-weak-fg);
}

.results-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.results-heading h2 {
  margin: 0 0 3px;
  color: var(--toss-foreground);
  font-size: 19px;
  font-weight: 800;
}

.results-count {
  flex: 0 0 auto;
  border-radius: 999px;
  background: var(--toss-surface);
  color: var(--toss-body);
  font-size: 13px;
  font-weight: 800;
  padding: 7px 10px;
}

.forecast-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.forecast-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  border: 1px solid var(--toss-border);
  border-radius: 16px;
  background: var(--toss-canvas);
  padding: 16px 20px;
}

.item-left,
.item-right,
.weather-state-chip,
.mini-metrics dt {
  display: flex;
  align-items: center;
}

.item-left {
  min-width: 150px;
  flex: 1;
  gap: 12px;
}

.time-text {
  color: var(--toss-body);
  font-size: 15px;
  font-weight: 800;
  white-space: nowrap;
}

.weather-state-chip {
  gap: 6px;
  border: 1px solid transparent;
  border-radius: 9px;
  font-size: 14px;
  font-weight: 800;
  padding: 6px 10px;
}

.weather-state-chip.sunny {
  border-color: #fed7aa;
  background: #fff7ed;
  color: #a64409;
}

.weather-state-chip.rainy {
  border-color: #a5d8f6;
  background: #eff8ff;
  color: #086697;
}

.weather-state-chip.cloudy {
  border-color: #d5dce5;
  background: #f1f5f9;
  color: #475569;
}

.item-right {
  justify-content: flex-end;
  gap: 22px;
}

.mini-metrics {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin: 0;
}

.mini-metrics div {
  color: var(--toss-muted);
  font-size: 12px;
  font-weight: 700;
}

.mini-metrics dt {
  gap: 3px;
}

.mini-metrics dd {
  margin: 2px 0 0;
  color: var(--toss-body);
  font-size: 13px;
  font-weight: 800;
}

.temp-text {
  color: var(--toss-blue);
  font-size: 28px;
  font-weight: 800;
  letter-spacing: -0.7px;
  white-space: nowrap;
}

.temp-text span {
  margin-left: 2px;
  color: var(--toss-muted);
  font-size: 15px;
}

@media (max-width: 640px) {
  .date-filter-bar {
    flex-direction: column;
    gap: 8px;
    padding: 12px 14px;
  }

  .results-heading {
    align-items: flex-start;
    flex-direction: column;
  }

  .forecast-card,
  .item-left,
  .item-right {
    align-items: flex-start;
    flex-direction: column;
  }

  .forecast-card {
    gap: 14px;
    padding: 16px;
  }

  .item-left,
  .item-right {
    width: 100%;
  }

  .item-right {
    align-items: stretch;
    gap: 10px;
  }

  .mini-metrics {
    justify-content: flex-start;
    flex-wrap: wrap;
  }

  .temp-text {
    font-size: 26px;
  }
}
</style>
