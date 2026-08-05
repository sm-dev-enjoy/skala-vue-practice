<script setup>
import { ref, onMounted, watch } from 'vue'
import axios from 'axios'

const selectedCityKey = ref('seoul')
const isLoading = ref(false)
const errorMessage = ref('')
const airData = ref(null)

const cityCoords = {
  seoul: { name: '서울특별시', lat: 37.5665, lon: 126.9780 },
  suwon: { name: '수원시', lat: 37.2636, lon: 127.0286 },
  busan: { name: '부산광역시', lat: 35.1796, lon: 129.0756 },
}

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY
const AIR_API_URL = 'https://api.openweathermap.org/data/2.5/air_pollution'

// AQI 등급 상태 매핑 헬퍼
const getAqiStatus = (aqi) => {
  const statusMap = {
    1: { label: '매우 좋음 🟢', type: 'success', color: '#10b981', percent: 20 },
    2: { label: '좋음 🔵', type: 'primary', color: '#3b82f6', percent: 40 },
    3: { label: '보통 🟡', type: 'warning', color: '#f59e0b', percent: 60 },
    4: { label: '나쁨 🟠', type: 'warning', color: '#f97316', percent: 80 },
    5: { label: '매우 나쁨 🔴', type: 'danger', color: '#ef4444', percent: 100 },
  }
  return statusMap[aqi] ?? { label: '측정 불가', type: 'info', color: '#94a3b8', percent: 0 }
}

/**
 * 지정 도시의 위/경도 기반으로 대기질(Air Pollution) 데이터를 조회합니다.
 */
const fetchAirPollution = async () => {
  isLoading.value = true
  errorMessage.value = ''

  try {
    const currentCity = cityCoords[selectedCityKey.value] ?? cityCoords.seoul
    const { lat, lon, name } = currentCity

    const response = await axios.get(
      `${AIR_API_URL}?lat=${lat}&lon=${lon}&appid=${API_KEY}`,
    )

    // ES6+ 구조분해 및 옵셔널 체이닝 파싱
    const { list } = response?.data ?? {}
    const [firstItem] = list ?? []
    const { main, components } = firstItem ?? {}

    airData.value = {
      cityName: name,
      aqi: main?.aqi ?? 1,
      co: components?.co ?? 0,
      no2: components?.no2 ?? 0,
      o3: components?.o3 ?? 0,
      pm2_5: components?.pm2_5 ?? 0,
      pm10: components?.pm10 ?? 0,
    }
  } catch (error) {
    console.error('대기질 API 조회 실패:', error)
    errorMessage.value = '대기질 측정 데이터를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.'
    airData.value = null
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchAirPollution()
})

watch(selectedCityKey, () => {
  fetchAirPollution()
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

    <!-- 도시 선택 라디오 바 -->
    <div class="city-selector-bar">
      <span class="selector-label">관측 지역:</span>
      <el-radio-group v-model="selectedCityKey" size="default">
        <el-radio-button value="seoul">서울</el-radio-button>
        <el-radio-button value="suwon">수원</el-radio-button>
        <el-radio-button value="busan">부산</el-radio-button>
      </el-radio-group>
    </div>

    <!-- 로딩 스켈레톤 -->
    <div v-if="isLoading" class="skeleton-wrapper">
      <el-skeleton :rows="5" animated />
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

.city-selector-bar {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
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
