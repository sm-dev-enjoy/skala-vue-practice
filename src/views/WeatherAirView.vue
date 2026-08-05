<script setup>
import { ref, onMounted, watch } from 'vue'
import { useAirPollution } from '@/composables/useAirPollution'
import CitySelector from '../components/common/CitySelector.vue'
import StatusAlert from '../components/common/StatusAlert.vue'

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
  <el-card class="air-card" shadow="never">
    <template #header>
      <div class="air-header">
        <div>
          <h3>🍃 실시간 대기질 및 미세먼지 관측</h3>
          <p class="sub-desc">대기 오염 지수(AQI) 및 미세먼지/가스 성분 농도를 분석합니다.</p>
        </div>
        <el-tag type="success" effect="dark">Air Quality Index</el-tag>
      </div>
    </template>

    <!-- 공통 도시 선택 컴포넌트 -->
    <CitySelector
      v-model="selectedCityKey"
      :options="cityOptions"
      label="대기질 관측 지역"
    />

    <!-- 로딩 스켈레톤 -->
    <div v-if="isLoading" class="skeleton-wrapper">
      <el-skeleton :rows="5" animated />
    </div>

    <template v-else>
      <StatusAlert :message="errorMessage" type="error" />

      <div v-if="airData" class="air-content-body">
        <!-- AQI 수치 프로그레스 카드 -->
        <el-card shadow="hover" class="aqi-summary-card">
          <div class="aqi-flex-box">
            <div class="aqi-left">
              <h4>📍 {{ airData.cityName }} 통합 대기 환경 지수</h4>
              <div class="aqi-status-text">
                <el-tag :type="getAqiStatus(airData.aqi).type" size="large" effect="dark">
                  {{ getAqiStatus(airData.aqi).label }}
                </el-tag>
                <span class="aqi-level-num">지수 레벨: {{ airData.aqi }} / 5</span>
              </div>
            </div>

            <div class="aqi-right">
              <el-progress
                type="dashboard"
                :percentage="getAqiStatus(airData.aqi).percent"
                :color="getAqiStatus(airData.aqi).color"
                :width="120"
              >
                <template #default>
                  <span class="progress-inner-text">AQI {{ airData.aqi }}</span>
                </template>
              </el-progress>
            </div>
          </div>
        </el-card>

        <!-- 미세먼지 및 가스 상세 농도 Grid 카드 -->
        <div class="pollutants-grid">
          <div class="pollutant-card highlighted">
            <span class="p-title">초미세먼지 (PM2.5)</span>
            <span class="p-value">{{ airData.pm2_5 }} <small>µg/m³</small></span>
          </div>

          <div class="pollutant-card highlighted">
            <span class="p-title">미세먼지 (PM10)</span>
            <span class="p-value">{{ airData.pm10 }} <small>µg/m³</small></span>
          </div>

          <div class="pollutant-card">
            <span class="p-title">이산화질소 (NO2)</span>
            <span class="p-value">{{ airData.no2 }} <small>µg/m³</small></span>
          </div>

          <div class="pollutant-card">
            <span class="p-title">오존 (O3)</span>
            <span class="p-value">{{ airData.o3 }} <small>µg/m³</small></span>
          </div>

          <div class="pollutant-card">
            <span class="p-title">일산화탄소 (CO)</span>
            <span class="p-value">{{ airData.co }} <small>µg/m³</small></span>
          </div>
        </div>
      </div>
    </template>
  </el-card>
</template>

<style scoped>
.air-card {
  border-radius: 16px;
  background: #ffffff;
}

.air-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.air-header h3 {
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

.aqi-summary-card {
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  color: #ffffff;
  border-radius: 16px;
  margin-bottom: 20px;
  border: none;
}

.aqi-flex-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.aqi-left h4 {
  margin: 0 0 14px 0;
  font-size: 1.1rem;
  color: #f8fafc;
}

.aqi-status-text {
  display: flex;
  align-items: center;
  gap: 12px;
}

.aqi-level-num {
  font-size: 0.9rem;
  color: #cbd5e1;
  font-weight: 600;
}

.progress-inner-text {
  font-weight: 800;
  font-size: 1.1rem;
  color: #ffffff;
}

.pollutants-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 12px;
}

.pollutant-card {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  padding: 16px;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.pollutant-card.highlighted {
  border-color: #38bdf8;
  background: #f0f9ff;
}

.p-title {
  font-size: 0.8rem;
  color: #64748b;
  font-weight: 600;
}

.p-value {
  font-size: 1.3rem;
  font-weight: 800;
  color: #0f172a;
}

.p-value small {
  font-size: 0.75rem;
  font-weight: 500;
  color: #64748b;
}
</style>
