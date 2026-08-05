<script setup>
import { ref, onMounted, watch } from 'vue'
import { useConfigStore } from '@/stores/configStore'
import { useForecast } from '@/composables/useForecast'
import { useWeatherApi } from '@/composables/useWeatherApi'
import CitySelector from '../components/common/CitySelector.vue'
import StatusAlert from '../components/common/StatusAlert.vue'

const configStore = useConfigStore()
const selectedCity = ref('Seoul')

const { isLoading, errorMessage, forecastList, fetchForecast } = useForecast()
const { formatTemperature } = useWeatherApi()

const cityOptions = [
  { label: '서울 (Seoul)', value: 'Seoul' },
  { label: '수원 (Suwon)', value: 'Suwon' },
  { label: '부산 (Busan)', value: 'Busan' },
]

onMounted(() => {
  fetchForecast(selectedCity.value)
})

watch(selectedCity, (newCity) => {
  fetchForecast(newCity)
})
</script>

<template>
  <el-card class="forecast-card glass-panel" shadow="never">
    <template #header>
      <div class="forecast-header">
        <div>
          <h3>📅 5일 / 3시간 단위 기상 예보</h3>
          <p class="sub-desc">주요 도시의 단기 기상 예측 데이터를 실시간으로 확인합니다.</p>
        </div>
        <el-tag type="primary" effect="dark">Forecast Studio</el-tag>
      </div>
    </template>

    <!-- 공통 도시 선택 컴포넌트 -->
    <CitySelector
      v-model="selectedCity"
      :options="cityOptions"
      label="예보 관측 도시"
    />

    <!-- 로딩 스켈레톤 -->
    <div v-if="isLoading" class="skeleton-wrapper">
      <el-skeleton :rows="6" animated />
    </div>

    <template v-else>
      <StatusAlert :message="errorMessage" type="error" />

      <!-- 예보 카드리스트 -->
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
                <el-tag type="info" size="small" effect="plain">⏱️ {{ item.time }}</el-tag>
              </div>

              <div class="weather-info-box">
                <img
                  :src="`https://openweathermap.org/img/wn/${item.icon}@2x.png`"
                  :alt="item.description"
                  class="weather-icon"
                />
                <div class="temp-group">
                  <span class="main-temp">
                    {{ formatTemperature(item.temp) }}{{ configStore.unitSymbol }}
                  </span>
                  <span class="desc-text">{{ item.description }}</span>
                </div>
              </div>

              <el-divider style="margin: 12px 0" />

              <div class="detail-mini-stats">
                <span>💧 습도 {{ item.humidity }}%</span>
                <span>🍃 풍속 {{ item.windSpeed }}m/s</span>
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
  border-radius: 16px;
  background: #ffffff;
}

.forecast-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.forecast-header h3 {
  margin: 0 0 4px 0;
  font-size: 1.2rem;
  font-weight: 800;
  color: #0f172a;
}

.sub-desc {
  margin: 0;
  font-size: 0.85rem;
  color: #64748b;
}

.skeleton-wrapper {
  padding: 20px 0;
}

.time-item-card {
  border-radius: 14px;
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;
}

.time-item-card:hover {
  transform: translateY(-2px);
  border-color: #38bdf8;
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
  width: 54px;
  height: 54px;
}

.temp-group {
  display: flex;
  flex-direction: column;
}

.main-temp {
  font-size: 1.4rem;
  font-weight: 800;
  color: #0284c7;
}

.desc-text {
  font-size: 0.85rem;
  color: #475569;
  font-weight: 600;
}

.detail-mini-stats {
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  color: #64748b;
  font-weight: 500;
}
</style>
