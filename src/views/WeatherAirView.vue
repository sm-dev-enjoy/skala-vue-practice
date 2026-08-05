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
        <el-tag type="success">Air Pollution API</el-tag>
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
        <el-card shadow="hover" class="aqi-summary-card" style="margin-bottom: 20px">
          <div class="aqi-flex-box">
            <div class="aqi-left">
              <h4>{{ airData.cityName }} 통합 대기 환경 지수 (AQI)</h4>
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
                :width="110"
              >
                <template #default>
                  <span class="progress-inner-text">AQI {{ airData.aqi }}</span>
                </template>
              </el-progress>
            </div>
          </div>
        </el-card>

        <!-- 미세먼지 및 가스 상세 농도 표 -->
        <el-descriptions title="🧪 대기 구성 물질 상세 농도 수치 (µg/m³)" :column="2" border size="large">
          <el-descriptions-item label="초미세먼지 (PM2.5)">
            <span class="stat-highlight">{{ airData.pm2_5 }} µg/m³</span>
          </el-descriptions-item>

          <el-descriptions-item label="미세먼지 (PM10)">
            <span class="stat-highlight">{{ airData.pm10 }} µg/m³</span>
          </el-descriptions-item>

          <el-descriptions-item label="이산화질소 (NO2)">
            {{ airData.no2 }} µg/m³
          </el-descriptions-item>

          <el-descriptions-item label="오존 (O3)">
            {{ airData.o3 }} µg/m³
          </el-descriptions-item>

          <el-descriptions-item label="일산화탄소 (CO)">
            {{ airData.co }} µg/m³
          </el-descriptions-item>
        </el-descriptions>
      </div>
    </template>
  </el-card>
</template>

<style scoped>
.air-card {
  border-radius: 8px;
}

.air-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.air-header h3 {
  margin: 0 0 4px 0;
  font-size: 1.15rem;
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
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border-radius: 8px;
}

.aqi-flex-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.aqi-left h4 {
  margin: 0 0 12px 0;
  font-size: 1rem;
  color: #334155;
}

.aqi-status-text {
  display: flex;
  align-items: center;
  gap: 12px;
}

.aqi-level-num {
  font-size: 0.9rem;
  color: #64748b;
  font-weight: 500;
}

.progress-inner-text {
  font-weight: 700;
  font-size: 0.95rem;
  color: #1e293b;
}

.stat-highlight {
  font-weight: 700;
  color: #0284c7;
}
</style>
