<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { useConfigStore } from '@/stores/configStore'
import { useForecast } from '@/composables/useForecast'
import { useWeatherApi } from '@/composables/useWeatherApi'
import CitySelector from '../components/common/CitySelector.vue'
import StatusAlert from '../components/common/StatusAlert.vue'
import SvgIcon from '../components/common/SvgIcon.vue'

const configStore = useConfigStore()
const selectedCity = ref('Seoul')

const { isLoading, errorMessage, forecastList, fetchForecast } = useForecast()
const { formatTemperature } = useWeatherApi()

const selectedDateFilter = ref('all')

const cityOptions = [
  { label: '서울', value: 'Seoul' },
  { label: '수원', value: 'Suwon' },
  { label: '부산', value: 'Busan' },
]

// 추출된 예보 날짜 추출 및 필터링
const filteredForecastList = computed(() => {
  if (selectedDateFilter.value === 'all') return forecastList.value
  return forecastList.value.filter((item) => item.time.startsWith(selectedDateFilter.value))
})

// 예보 목록에 포함된 날짜목록 구하기 (중복 제거)
const availableDates = computed(() => {
  const dates = new Set()
  forecastList.value.forEach((item) => {
    const datePart = item.time.split(' ')[0]
    if (datePart) dates.add(datePart)
  })
  return Array.from(dates)
})

const getWeatherStateTheme = (description) => {
  const desc = description ?? ''
  
  if (desc.includes('맑음') || desc.includes('Clear') || desc.includes('Sun')) {
    return {
      label: desc,
      icon: 'sun',
      bg: '#fff7ed',
      color: '#c2410c',
      border: '#ffedd5',
      iconColor: '#ea580c',
    }
  }
  if (desc.includes('비') || desc.includes('Rain') || desc.includes('소나기') || desc.includes('Drizzle')) {
    return {
      label: desc,
      icon: 'rain',
      bg: '#f0f9ff',
      color: '#0284c7',
      border: '#bae6fd',
      iconColor: '#0284c7',
    }
  }
  return {
    label: desc,
    icon: 'cloud',
    bg: '#f1f5f9',
    color: '#475569',
    border: '#e2e8f0',
    iconColor: '#64748b',
  }
}

onMounted(() => {
  fetchForecast(selectedCity.value)
})

watch(selectedCity, (newCity) => {
  selectedDateFilter.value = 'all'
  fetchForecast(newCity)
})
</script>

<template>
  <div class="toss-forecast-container">
    <div class="page-title-box">
      <h2 class="page-title">5일 기상 예보</h2>
      <p class="page-desc">3시간 단위의 단기 기상 예측 데이터입니다.</p>
    </div>

    <!-- 관측 지역 선택 -->
    <CitySelector
      v-model="selectedCity"
      :options="cityOptions"
      label="관측 지역"
    />

    <!-- 날짜별 필터 탭 (날짜 탐색 UX 대폭 향상) -->
    <div v-if="availableDates.length > 0" class="date-filter-bar">
      <span class="filter-label">날짜 선택:</span>
      <div class="date-chips">
        <button
          class="date-chip"
          :class="{ active: selectedDateFilter === 'all' }"
          @click="selectedDateFilter = 'all'"
        >
          전체
        </button>
        <button
          v-for="d in availableDates"
          :key="d"
          class="date-chip"
          :class="{ active: selectedDateFilter === d }"
          @click="selectedDateFilter = d"
        >
          {{ d }}
        </button>
      </div>
    </div>

    <div v-if="isLoading" class="skeleton-box">
      <el-skeleton :rows="6" animated />
    </div>

    <template v-else>
      <StatusAlert :message="errorMessage" type="error" />

      <div v-if="filteredForecastList.length > 0" class="forecast-list">
        <div
          v-for="(item, index) in filteredForecastList"
          :key="index"
          class="toss-forecast-card"
        >
          <div class="item-left">
            <span class="time-text">{{ item.time }}</span>

            <!-- 직관적인 날씨 상태 뱃지 칩 -->
            <div
              class="weather-state-chip"
              :style="{
                backgroundColor: getWeatherStateTheme(item.description).bg,
                color: getWeatherStateTheme(item.description).color,
                borderColor: getWeatherStateTheme(item.description).border,
              }"
            >
              <SvgIcon
                :name="getWeatherStateTheme(item.description).icon"
                size="15"
                :color="getWeatherStateTheme(item.description).iconColor"
              />
              <span class="chip-label">{{ getWeatherStateTheme(item.description).label }}</span>
            </div>
          </div>

          <div class="item-right">
            <div class="mini-metrics">
              <span class="m-item">
                <SvgIcon name="droplet" size="13" color="#8b95a1" />
                {{ item.humidity }}%
              </span>
              <span class="m-item">
                <SvgIcon name="wind" size="13" color="#8b95a1" />
                {{ item.windSpeed }}m/s
              </span>
            </div>
            <div class="temp-text">
              {{ formatTemperature(item.temp) }}{{ configStore.unitSymbol }}
            </div>
          </div>
        </div>
      </div>

      <el-empty
        v-else-if="!errorMessage"
        description="해당 날짜의 예보 정보가 없습니다."
        :image-size="80"
      />
    </template>
  </div>
</template>

<style scoped>
.toss-forecast-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.page-title-box {
  margin-bottom: 4px;
}

.page-title {
  margin: 0 0 4px 0;
  font-size: 22px;
  font-weight: 700;
  color: var(--toss-foreground);
}

.page-desc {
  margin: 0;
  font-size: 14px;
  color: var(--toss-muted);
}

/* 날짜 필터 바 */
.date-filter-bar {
  display: flex;
  align-items: center;
  gap: 12px;
  background: var(--toss-canvas);
  border: 1px solid var(--toss-border);
  border-radius: 14px;
  padding: 10px 16px;
  overflow-x: auto;
}

.filter-label {
  font-size: 13px;
  font-weight: 600;
  color: var(--toss-body);
  white-space: nowrap;
}

.date-chips {
  display: flex;
  gap: 8px;
}

.date-chip {
  background: var(--toss-surface);
  color: var(--toss-body);
  border: none;
  padding: 6px 14px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.15s ease;
}

.date-chip.active {
  background: var(--toss-weak-bg);
  color: var(--toss-weak-fg);
}

.forecast-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.toss-forecast-card {
  background: var(--toss-canvas);
  border: 1px solid var(--toss-border);
  border-radius: 16px;
  padding: 18px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.15s ease;
}

.toss-forecast-card:hover {
  border-color: #b0c4de;
  transform: translateY(-1px);
}

.item-left {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 6px;
}

.time-text {
  font-size: 13px;
  font-weight: 600;
  color: var(--toss-muted);
}

.weather-state-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 12px;
  border-radius: 10px;
  border: 1px solid transparent;
  font-size: 14px;
  font-weight: 700;
  line-height: 1.2;
}

.chip-label {
  font-size: 14px;
}

.item-right {
  display: flex;
  align-items: center;
  gap: 24px;
}

.mini-metrics {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  font-size: 13px;
  color: var(--toss-muted);
  gap: 4px;
  font-weight: 500;
}

.m-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.temp-text {
  font-size: 26px;
  font-weight: 700;
  color: var(--toss-blue);
  letter-spacing: -0.5px;
}
</style>
