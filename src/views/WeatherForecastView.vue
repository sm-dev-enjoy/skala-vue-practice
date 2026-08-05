<script setup>
import { ref, onMounted, watch } from 'vue'
import axios from 'axios'
import { useConfigStore } from '@/stores/configStore'

const configStore = useConfigStore()

const selectedCity = ref('Seoul')
const isLoading = ref(false)
const errorMessage = ref('')
const forecastList = ref([])

const cityOptions = [
  { label: '서울 (Seoul)', value: 'Seoul' },
  { label: '수원 (Suwon)', value: 'Suwon' },
  { label: '부산 (Busan)', value: 'Busan' },
]

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY
const FORECAST_URL = 'https://api.openweathermap.org/data/2.5/forecast'

/**
 * 선택한 도시의 5일 / 3시간 단위 일기 예보 데이터를 비동기로 불러옵니다.
 */
const fetchForecast = async () => {
  isLoading.value = true
  errorMessage.value = ''

  try {
    const response = await axios.get(
      `${FORECAST_URL}?q=${selectedCity.value}&appid=${API_KEY}&units=metric&lang=kr`,
    )

    // ES6+ 구조분해 및 옵셔널 체이닝으로 3시간 단위 목록 정제
    const { list } = response?.data ?? {}
    
    forecastList.value = (list ?? []).slice(0, 12).map((item) => {
      const { dt_txt, main, weather, wind } = item ?? {}
      const [firstWeather] = weather ?? []
      
      return {
        time: dt_txt ?? '',
        temp: main?.temp ?? 0,
        feelsLike: main?.feels_like ?? 0,
        humidity: main?.humidity ?? 0,
        description: firstWeather?.description ?? '정보 없음',
        icon: firstWeather?.icon ?? '01d',
        windSpeed: wind?.speed ?? 0,
      }
    })
  } catch (error) {
    console.error('5일 일기예보 API 호출 중 오류 발생:', error)
    errorMessage.value = '일기예보 정보를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.'
    forecastList.value = []
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchForecast()
})

watch(selectedCity, () => {
  fetchForecast()
})

// 온습도 단위 변환 헬퍼
const formatTemp = (celsiusTemp) => {
  if (configStore.unit === 'fahrenheit') {
    return `${Math.round((celsiusTemp * 9) / 5 + 32)}${configStore.unitSymbol}`
  }
  return `${Math.round(celsiusTemp * 10) / 10}${configStore.unitSymbol}`
}
</script>

<template>
  <el-card class="forecast-card" shadow="never">
    <template #header>
      <div class="forecast-header">
        <div>
          <h3>📅 5일 / 3시간 단위 기상 예보</h3>
          <p class="sub-desc">주요 도시의 단기 기상 예측 데이터를 실시간으로 확인합니다.</p>
        </div>
        <el-tag type="primary">OpenWeather Forecast API</el-tag>
      </div>
    </template>

    <!-- 도시 선택 조율바 -->
    <div class="city-selector-bar">
      <span class="selector-label">도시 선택:</span>
      <el-radio-group v-model="selectedCity" size="default">
        <el-radio-button
          v-for="city in cityOptions"
          :key="city.value"
          :value="city.value"
        >
          {{ city.label }}
        </el-radio-button>
      </el-radio-group>
    </div>

    <!-- 로딩 스켈레톤 -->
    <div v-if="isLoading" class="skeleton-wrapper">
      <el-skeleton :rows="6" animated />
    </div>

    <template v-else>
      <el-alert
        v-if="errorMessage"
        :title="errorMessage"
        type="error"
        show-icon
        :closable="false"
        style="margin-bottom: 20px"
      />

      <!-- 예보 타임라인 카드 리스트 -->
      <div v-if="forecastList.length > 0" class="forecast-grid">
        <el-row :gutter="16">
          <el-col
            v-for="(item, index) in forecastList"
            :key="index"
            :xs="24"
            :sm="12"
            :md="8"
            style="margin-bottom: 16px"
          >
            <el-card shadow="hover" class="time-item-card">
              <div class="time-badge">
                <el-tag type="info" size="small">{{ item.time }}</el-tag>
              </div>

              <div class="weather-info-box">
                <img
                  :src="`https://openweathermap.org/img/wn/${item.icon}@2x.png`"
                  :alt="item.description"
                  class="weather-icon"
                />
                <div class="temp-group">
                  <span class="main-temp">{{ formatTemp(item.temp) }}</span>
                  <span class="desc-text">{{ item.description }}</span>
                </div>
              </div>

              <el-divider style="margin: 12px 0" />

              <div class="detail-mini-stats">
                <span>💧 습도: {{ item.humidity }}%</span>
                <span>🍃 풍속: {{ item.windSpeed }}m/s</span>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </template>
  </el-card>
</template>

<style scoped>
.forecast-card {
  border-radius: 8px;
}

.forecast-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.forecast-header h3 {
  margin: 0 0 4px 0;
  font-size: 1.15rem;
}

.sub-desc {
  margin: 0;
  font-size: 0.85rem;
  color: #64748b;
}

.city-selector-bar {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
  background: #f8fafc;
  padding: 12px 16px;
  border-radius: 8px;
}

.selector-label {
  font-weight: 600;
  font-size: 0.9rem;
  color: #334155;
}

.skeleton-wrapper {
  padding: 20px 0;
}

.time-item-card {
  border-radius: 8px;
}

.time-badge {
  margin-bottom: 8px;
}

.weather-info-box {
  display: flex;
  align-items: center;
  gap: 12px;
}

.weather-icon {
  width: 50px;
  height: 50px;
}

.temp-group {
  display: flex;
  flex-direction: column;
}

.main-temp {
  font-size: 1.3rem;
  font-weight: 700;
  color: #0284c7;
}

.desc-text {
  font-size: 0.85rem;
  color: #475569;
}

.detail-mini-stats {
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  color: #64748b;
}
</style>
