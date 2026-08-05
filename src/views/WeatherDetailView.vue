<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useConfigStore } from '@/stores/configStore'
import { useWeatherApi } from '@/composables/useWeatherApi'
import StatusAlert from '../components/common/StatusAlert.vue'
import SvgIcon from '../components/common/SvgIcon.vue'

const route = useRoute()
const router = useRouter()
const configStore = useConfigStore()

const cityData = ref(null)
const { isLoading, errorMessage, fetchCityDetail, formatTemperature } = useWeatherApi()

const currentCityId = computed(() => route.params?.cityId ?? 'city_01')

// 다른 관측소 바로 보기 옵션
const stationOptions = [
  { label: '서울 관측소', value: 'city_01' },
  { label: '수원 관측소', value: 'city_02' },
  { label: '부산 관측소', value: 'city_03' },
]

const loadDetailData = async () => {
  cityData.value = await fetchCityDetail(currentCityId.value)
}

watch(
  currentCityId,
  () => {
    loadDetailData()
  },
  { immediate: true },
)

const handleSwitchStation = (targetId) => {
  if (targetId !== currentCityId.value) {
    router.push(`/weather/${targetId}`)
  }
}

const displayTemp = computed(() => formatTemperature(cityData.value?.temp))
const displayFeelsLike = computed(() => formatTemperature(cityData.value?.feelsLike))
</script>

<template>
  <div class="toss-detail-container">
    <div class="page-title-box">
      <h2 class="page-title">관측소 상세 정보</h2>
      <p class="page-desc">해당 지역의 상세 기상 분석 결과입니다.</p>
    </div>

    <!-- 퀵 관측소 전환 바 (메인 이동 없이 1초 만에 전환) -->
    <div class="quick-station-bar">
      <span class="bar-label">관측소 바로가기</span>
      <div class="station-chips">
        <button
          v-for="st in stationOptions"
          :key="st.value"
          class="st-chip"
          :class="{ active: currentCityId === st.value }"
          @click="handleSwitchStation(st.value)"
        >
          {{ st.label }}
        </button>
      </div>
    </div>

    <div v-if="isLoading" class="skeleton-box">
      <el-skeleton :rows="5" animated />
    </div>

    <template v-else>
      <StatusAlert :message="errorMessage" type="warning" />

      <div v-if="cityData" class="detail-body">
        <!-- Toss Banner Card -->
        <div class="banner-card">
          <div class="banner-info">
            <div class="banner-title-row">
              <SvgIcon name="map-pin" size="22" color="#3182f6" />
              <h3 class="city-name">{{ cityData.name }}</h3>
            </div>
            <span class="sub-info">OpenWeather ID: {{ cityData.englishName }} | 국가: {{ cityData.country }}</span>
          </div>

          <div class="banner-temp">
            <span class="temp-val">{{ displayTemp }}</span>
            <span class="temp-unit">{{ configStore.unitSymbol }}</span>
          </div>
        </div>

        <!-- Detail Metrics Grid -->
        <div class="metrics-grid">
          <div class="metric-card">
            <div class="m-title-row">
              <SvgIcon name="thermometer" size="16" color="#3182f6" />
              <span class="m-title">실시간 기온</span>
            </div>
            <span class="m-value">{{ displayTemp }}{{ configStore.unitSymbol }}</span>
          </div>

          <div class="metric-card">
            <div class="m-title-row">
              <SvgIcon name="sun" size="16" color="#3182f6" />
              <span class="m-title">체감 온도</span>
            </div>
            <span class="m-value">{{ displayFeelsLike }}{{ configStore.unitSymbol }}</span>
          </div>

          <div class="metric-card">
            <div class="m-title-row">
              <SvgIcon name="cloud" size="16" color="#3182f6" />
              <span class="m-title">기상 현황</span>
            </div>
            <span class="m-value">{{ cityData.status }}</span>
          </div>

          <div class="metric-card">
            <div class="m-title-row">
              <SvgIcon name="droplet" size="16" color="#3182f6" />
              <span class="m-title">대기 습도</span>
            </div>
            <span class="m-value">{{ cityData.humidity }}</span>
          </div>

          <div class="metric-card">
            <div class="m-title-row">
              <SvgIcon name="wind" size="16" color="#3182f6" />
              <span class="m-title">풍속</span>
            </div>
            <span class="m-value">{{ cityData.windSpeed }}</span>
          </div>

          <div class="metric-card">
            <div class="m-title-row">
              <SvgIcon name="gauge" size="16" color="#3182f6" />
              <span class="m-title">기압</span>
            </div>
            <span class="m-value">{{ cityData.pressure }}</span>
          </div>
        </div>
      </div>
    </template>

    <div class="footer-action">
      <el-button type="primary" size="large" @click="router.push('/')">
        메인 대시보드로 돌아가기
      </el-button>
    </div>
  </div>
</template>

<style scoped>
.toss-detail-container {
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

/* 퀵 관측소 전환 바 */
.quick-station-bar {
  display: flex;
  align-items: center;
  gap: 12px;
  background: var(--toss-canvas);
  border: 1px solid var(--toss-border);
  border-radius: 14px;
  padding: 10px 16px;
}

.bar-label {
  font-size: 13px;
  font-weight: 600;
  color: var(--toss-body);
}

.station-chips {
  display: flex;
  gap: 8px;
}

.st-chip {
  background: var(--toss-surface);
  color: var(--toss-body);
  border: none;
  padding: 6px 14px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
}

.st-chip.active {
  background: var(--toss-weak-bg);
  color: var(--toss-weak-fg);
}

.banner-card {
  background: var(--toss-canvas);
  border: 1px solid var(--toss-border);
  border-radius: 16px;
  padding: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.banner-title-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.city-name {
  margin: 0;
  font-size: 24px;
  font-weight: 700;
  color: var(--toss-foreground);
}

.sub-info {
  font-size: 13px;
  color: var(--toss-muted);
}

.banner-temp {
  display: flex;
  align-items: baseline;
}

.temp-val {
  font-size: 42px;
  font-weight: 700;
  color: var(--toss-blue);
  line-height: 1;
}

.temp-unit {
  font-size: 20px;
  font-weight: 600;
  color: var(--toss-muted);
  margin-left: 2px;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 12px;
}

.metric-card {
  background: var(--toss-canvas);
  border: 1px solid var(--toss-border);
  border-radius: 14px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.m-title-row {
  display: flex;
  align-items: center;
  gap: 6px;
}

.m-title {
  font-size: 13px;
  color: var(--toss-muted);
  font-weight: 600;
}

.m-value {
  font-size: 18px;
  font-weight: 700;
  color: var(--toss-foreground);
}

.footer-action {
  margin-top: 12px;
  display: flex;
  justify-content: flex-end;
}
</style>
