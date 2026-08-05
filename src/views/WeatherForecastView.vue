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
  { label: '서울', value: 'Seoul' },
  { label: '수원', value: 'Suwon' },
  { label: '부산', value: 'Busan' },
]

onMounted(() => {
  fetchForecast(selectedCity.value)
})

watch(selectedCity, (newCity) => {
  fetchForecast(newCity)
})
</script>

<template>
  <div class="toss-forecast-container">
    <div class="page-title-box">
      <h2 class="page-title">5일 기상 예보</h2>
      <p class="page-desc">3시간 단위의 단기 기상 예측 데이터입니다.</p>
    </div>

    <!-- 공통 도시 선택 컴포넌트 -->
    <CitySelector
      v-model="selectedCity"
      :options="cityOptions"
      label="관측 지역"
    />

    <div v-if="isLoading" class="skeleton-box">
      <el-skeleton :rows="6" animated />
    </div>

    <template v-else>
      <StatusAlert :message="errorMessage" type="error" />

      <div v-if="forecastList.length > 0" class="forecast-list">
        <div
          v-for="(item, index) in forecastList"
          :key="index"
          class="toss-forecast-card"
        >
          <div class="item-left">
            <span class="time-text">{{ item.time }}</span>
            <span class="desc-text">{{ item.description }}</span>
          </div>

          <div class="item-right">
            <div class="mini-metrics">
              <span>습도 {{ item.humidity }}%</span>
              <span>풍속 {{ item.windSpeed }}m/s</span>
            </div>
            <div class="temp-text">
              {{ formatTemperature(item.temp) }}{{ configStore.unitSymbol }}
            </div>
          </div>
        </div>
      </div>
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
  margin-bottom: 8px;
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

.forecast-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.toss-forecast-card {
  background: var(--toss-canvas);
  border: 1px solid var(--toss-border);
  border-radius: 14px;
  padding: 18px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.item-left {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.time-text {
  font-size: 14px;
  font-weight: 600;
  color: var(--toss-body);
}

.desc-text {
  font-size: 15px;
  font-weight: 700;
  color: var(--toss-foreground);
}

.item-right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.mini-metrics {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  font-size: 13px;
  color: var(--toss-muted);
  gap: 2px;
}

.temp-text {
  font-size: 24px;
  font-weight: 700;
  color: var(--toss-blue);
}
</style>
