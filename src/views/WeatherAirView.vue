<script setup>
import { ref, onMounted, watch } from 'vue'
import { useAirPollution } from '@/composables/useAirPollution'
import CitySelector from '../components/common/CitySelector.vue'
import StatusAlert from '../components/common/StatusAlert.vue'
import SvgIcon from '../components/common/SvgIcon.vue'

const selectedCityKey = ref('seoul')
const { isLoading, errorMessage, airData, getAqiStatus, fetchAirPollution } = useAirPollution()

const cityOptions = [
  { label: '서울', value: 'seoul' },
  { label: '수원', value: 'suwon' },
  { label: '부산', value: 'busan' },
]

onMounted(() => {
  fetchAirPollution(selectedCityKey.value)
})

watch(selectedCityKey, (newKey) => {
  fetchAirPollution(newKey)
})
</script>

<template>
  <div class="toss-air-container">
    <div class="page-title-box">
      <h2 class="page-title">대기질 분석</h2>
      <p class="page-desc">통합 대기 오염 지수(AQI) 및 미세먼지 성분 농도입니다.</p>
    </div>

    <!-- 공통 도시 선택 컴포넌트 -->
    <CitySelector
      v-model="selectedCityKey"
      :options="cityOptions"
      label="관측 지역"
    />

    <div v-if="isLoading" class="skeleton-box">
      <el-skeleton :rows="5" animated />
    </div>

    <template v-else>
      <StatusAlert :message="errorMessage" type="error" />

      <div v-if="airData" class="air-body">
        <!-- Toss AQI Summary Card -->
        <div class="toss-aqi-card">
          <div class="aqi-left">
            <div class="header-tag-row">
              <SvgIcon name="air" size="18" color="#3182f6" />
              <span class="location-name">{{ airData.cityName }} 대기 환경</span>
            </div>

            <div class="aqi-badge-wrap">
              <span class="toss-badge">
                {{ getAqiStatus(airData.aqi).label.replace(/[🟢🔵🟡🟠🔴]/g, '').trim() }}
              </span>
              <span class="aqi-score">지수 레벨 {{ airData.aqi }} / 5</span>
            </div>
          </div>

          <div class="aqi-right">
            <el-progress
              type="circle"
              :percentage="getAqiStatus(airData.aqi).percent"
              :color="getAqiStatus(airData.aqi).color"
              :width="90"
            />
          </div>
        </div>

        <!-- Air Pollutants Grid Cards -->
        <div class="air-grid">
          <div class="air-item-card highlighted">
            <div class="card-icon-title">
              <SvgIcon name="droplet" size="15" color="#3182f6" />
              <span class="item-name">초미세먼지 (PM2.5)</span>
            </div>
            <span class="item-val">{{ airData.pm2_5 }} <small>µg/m³</small></span>
          </div>

          <div class="air-item-card highlighted">
            <div class="card-icon-title">
              <SvgIcon name="cloud" size="15" color="#3182f6" />
              <span class="item-name">미세먼지 (PM10)</span>
            </div>
            <span class="item-val">{{ airData.pm10 }} <small>µg/m³</small></span>
          </div>

          <div class="air-item-card">
            <span class="item-name">이산화질소 (NO2)</span>
            <span class="item-val">{{ airData.no2 }} <small>µg/m³</small></span>
          </div>

          <div class="air-item-card">
            <span class="item-name">오존 (O3)</span>
            <span class="item-val">{{ airData.o3 }} <small>µg/m³</small></span>
          </div>

          <div class="air-item-card">
            <span class="item-name">일산화탄소 (CO)</span>
            <span class="item-val">{{ airData.co }} <small>µg/m³</small></span>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.toss-air-container {
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

.toss-aqi-card {
  background: var(--toss-canvas);
  border: 1px solid var(--toss-border);
  border-radius: 16px;
  padding: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.header-tag-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.location-name {
  font-size: 18px;
  font-weight: 700;
  color: var(--toss-foreground);
}

.aqi-badge-wrap {
  display: flex;
  align-items: center;
  gap: 10px;
}

.aqi-score {
  font-size: 14px;
  color: var(--toss-muted);
  font-weight: 600;
}

.air-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(170px, 1fr));
  gap: 12px;
}

.air-item-card {
  background: var(--toss-canvas);
  border: 1px solid var(--toss-border);
  border-radius: 14px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.air-item-card.highlighted {
  border-color: #b0c4de;
  background: #f4f8ff;
}

.card-icon-title {
  display: flex;
  align-items: center;
  gap: 6px;
}

.item-name {
  font-size: 13px;
  color: var(--toss-muted);
  font-weight: 600;
}

.item-val {
  font-size: 20px;
  font-weight: 700;
  color: var(--toss-foreground);
}

.item-val small {
  font-size: 12px;
  font-weight: 500;
  color: var(--toss-muted);
}
</style>
