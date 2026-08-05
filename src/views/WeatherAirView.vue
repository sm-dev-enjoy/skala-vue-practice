<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { useAirPollution } from '@/composables/useAirPollution'
import CitySelector from '../components/common/CitySelector.vue'
import StatusAlert from '../components/common/StatusAlert.vue'
import SvgIcon from '../components/common/SvgIcon.vue'

const selectedCityKey = ref('seoul')
const { isLoading, errorMessage, airData, getAqiStatus, fetchAirPollution } = useAirPollution()

// 대한민국 14개 주요 도시 대기질 옵션
const cityOptions = [
  { label: '서울', value: 'seoul' },
  { label: '부산', value: 'busan' },
  { label: '인천', value: 'incheon' },
  { label: '대구', value: 'daegu' },
  { label: '대전', value: 'daejeon' },
  { label: '광주', value: 'gwangju' },
  { label: '울산', value: 'ulsan' },
  { label: '수원', value: 'suwon' },
  { label: '제주', value: 'jeju' },
  { label: '춘천', value: 'chuncheon' },
  { label: '강릉', value: 'gangneung' },
  { label: '전주', value: 'jeonju' },
  { label: '청주', value: 'cheongju' },
  { label: '창원', value: 'changwon' },
]

const healthAdvice = computed(() => {
  const aqi = airData.value?.aqi ?? 1
  switch (aqi) {
    case 1:
      return {
        title: '대기 환경이 매우 쾌적합니다',
        mask: '마스크 미착용 가능',
        ventilation: '실내 환기 적극 추천',
        outdoor: '야외 활동 및 조깅 최적',
      }
    case 2:
      return {
        title: '대기 상태가 무난하고 양호합니다',
        mask: '마스크 필요 없음',
        ventilation: '자유로운 환기 가능',
        outdoor: '일상적인 야외 활동 가능',
      }
    case 3:
      return {
        title: '민감군의 경우 주의가 필요합니다',
        mask: '호흡기 질환자 마스크 지참',
        ventilation: '짧은 시간 환기 권장',
        outdoor: '격렬한 야외 운동 자제',
      }
    case 4:
      return {
        title: '대기 오염도가 높아 유의해야 합니다',
        mask: 'KF94/80 마스크 필수 착용',
        ventilation: '실내 환기 자제',
        outdoor: '야외 활동 최소화',
      }
    case 5:
    default:
      return {
        title: '대기 환경이 매우 나쁨 수준입니다',
        mask: '보건용 마스크 반드시 착용',
        ventilation: '창문 닫기 및 공기청정기 가동',
        outdoor: '외출 금지 및 실내 상주',
      }
  }
})

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
      <p class="page-desc">전국 14개 주요 도시의 통합 대기 오염 지수(AQI) 및 미세먼지 측정 데이터입니다.</p>
    </div>

    <!-- 14개 도시 선택 컴포넌트 -->
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
                {{ getAqiStatus(airData.aqi).label }}
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

        <!-- 실생활 행동 수칙 가이드 카드 -->
        <div class="health-guide-card">
          <div class="guide-header">
            <SvgIcon name="sparkles" size="18" color="#3182f6" />
            <h4>오늘의 실생활 맞춤 행동 가이드</h4>
          </div>
          <p class="guide-summary-title">{{ healthAdvice.title }}</p>

          <div class="guide-items-grid">
            <div class="g-item">
              <span class="g-label">마스크 착용</span>
              <span class="g-val">{{ healthAdvice.mask }}</span>
            </div>
            <div class="g-item">
              <span class="g-label">실내 환기</span>
              <span class="g-val">{{ healthAdvice.ventilation }}</span>
            </div>
            <div class="g-item">
              <span class="g-label">야외 활동</span>
              <span class="g-val">{{ healthAdvice.outdoor }}</span>
            </div>
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

.health-guide-card {
  background: var(--toss-canvas);
  border: 1px solid var(--toss-border);
  border-radius: 16px;
  padding: 20px 24px;
  margin-bottom: 16px;
}

.guide-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.guide-header h4 {
  margin: 0;
  font-size: 15px;
  font-weight: 700;
  color: var(--toss-foreground);
}

.guide-summary-title {
  margin: 0 0 16px 0;
  font-size: 16px;
  font-weight: 700;
  color: var(--toss-blue);
}

.guide-items-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 12px;
}

.g-item {
  background: var(--toss-surface);
  padding: 12px 14px;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.g-label {
  font-size: 12px;
  color: var(--toss-muted);
  font-weight: 600;
}

.g-val {
  font-size: 14px;
  font-weight: 700;
  color: var(--toss-foreground);
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
