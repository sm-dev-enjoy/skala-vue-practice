<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useConfigStore } from '@/stores/configStore'
import { useWeatherApi } from '@/composables/useWeatherApi'
import StatusAlert from '../components/common/StatusAlert.vue'

const route = useRoute()
const router = useRouter()
const configStore = useConfigStore()

const cityData = ref(null)
const { isLoading, errorMessage, fetchCityDetail, formatTemperature } = useWeatherApi()

const loadDetailData = async () => {
  const cityId = route.params?.cityId
  cityData.value = await fetchCityDetail(cityId)
}

watch(
  () => route.params?.cityId,
  () => {
    loadDetailData()
  },
  { immediate: true },
)

const displayTemp = computed(() => formatTemperature(cityData.value?.temp))
const displayFeelsLike = computed(() => formatTemperature(cityData.value?.feelsLike))
</script>

<template>
  <el-card class="detail-card glass-panel" shadow="never">
    <template #header>
      <div class="detail-header">
        <div>
          <h3>📊 지역별 상세 기상 관측 센터</h3>
          <p class="sub-desc">지정 관측소의 정밀 기상 및 대기 환경 분석 데이터입니다.</p>
        </div>
        <el-tag type="success" effect="dark">Station Live</el-tag>
      </div>
    </template>

    <div v-if="isLoading" class="skeleton-block">
      <el-skeleton :rows="5" animated />
    </div>

    <template v-else>
      <StatusAlert :message="errorMessage" type="warning" />

      <div v-if="cityData" class="detail-content-wrapper">
        <!-- City Header Banner -->
        <div class="station-banner-card">
          <div class="banner-left">
            <h2 class="st-name">📍 {{ cityData.name }}</h2>
            <span class="st-eng">OpenWeather ID: {{ cityData.englishName }} | Country: {{ cityData.country }}</span>
          </div>

          <div class="banner-temp">
            <span class="big-temp">{{ displayTemp }}</span>
            <span class="big-unit">{{ configStore.unitSymbol }}</span>
          </div>
        </div>

        <!-- Metric Grid Cards -->
        <div class="metrics-grid">
          <div class="m-card">
            <span class="m-label">🌡️ 실시간 기온</span>
            <span class="m-val">{{ displayTemp }}{{ configStore.unitSymbol }}</span>
          </div>

          <div class="m-card">
            <span class="m-label">🤒 체감 온도</span>
            <span class="m-val">{{ displayFeelsLike }}{{ configStore.unitSymbol }}</span>
          </div>

          <div class="m-card">
            <span class="m-label">☁️ 기상 현황</span>
            <span class="m-val">{{ cityData.status }}</span>
          </div>

          <div class="m-card">
            <span class="m-label">💧 대기 습도</span>
            <span class="m-val">{{ cityData.humidity }}</span>
          </div>

          <div class="m-card">
            <span class="m-label">🍃 풍속</span>
            <span class="m-val">{{ cityData.windSpeed }}</span>
          </div>

          <div class="m-card">
            <span class="m-label">⏲️ 기압</span>
            <span class="m-val">{{ cityData.pressure }}</span>
          </div>
        </div>
      </div>
    </template>

    <div class="card-footer">
      <el-button type="info" plain size="large" @click="router.push('/')">
        ← 메인 대시보드로 돌아가기
      </el-button>
    </div>
  </el-card>
</template>

<style scoped>
.detail-card {
  border-radius: 16px;
  background: #ffffff;
}

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.detail-header h3 {
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

.skeleton-block {
  padding: 20px 0;
}

.station-banner-card {
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  color: #ffffff;
  padding: 24px 28px;
  border-radius: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.st-name {
  margin: 0 0 6px 0;
  font-size: 1.6rem;
  font-weight: 800;
}

.st-eng {
  font-size: 0.85rem;
  color: #94a3b8;
}

.banner-temp {
  display: flex;
  align-items: baseline;
}

.big-temp {
  font-size: 3.5rem;
  font-weight: 900;
  color: #38bdf8;
  line-height: 1;
}

.big-unit {
  font-size: 1.6rem;
  color: #cbd5e1;
  font-weight: 700;
  margin-left: 2px;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 12px;
  margin-bottom: 24px;
}

.m-card {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  padding: 16px;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.m-label {
  font-size: 0.8rem;
  color: #64748b;
  font-weight: 600;
}

.m-val {
  font-size: 1.3rem;
  font-weight: 800;
  color: #0f172a;
}

.card-footer {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>
