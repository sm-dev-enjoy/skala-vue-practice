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
  <div class="toss-detail-container">
    <div class="page-title-box">
      <h2 class="page-title">관측소 상세 정보</h2>
      <p class="page-desc">해당 지역의 상세 기상 분석 결과입니다.</p>
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
            <h3 class="city-name">{{ cityData.name }}</h3>
            <span class="sub-info">{{ cityData.englishName }} | {{ cityData.country }}</span>
          </div>

          <div class="banner-temp">
            <span class="temp-val">{{ displayTemp }}</span>
            <span class="temp-unit">{{ configStore.unitSymbol }}</span>
          </div>
        </div>

        <!-- Detail Metrics Grid -->
        <div class="metrics-grid">
          <div class="metric-card">
            <span class="m-title">실시간 기온</span>
            <span class="m-value">{{ displayTemp }}{{ configStore.unitSymbol }}</span>
          </div>

          <div class="metric-card">
            <span class="m-title">체감 온도</span>
            <span class="m-value">{{ displayFeelsLike }}{{ configStore.unitSymbol }}</span>
          </div>

          <div class="metric-card">
            <span class="m-title">기상 현황</span>
            <span class="m-value">{{ cityData.status }}</span>
          </div>

          <div class="metric-card">
            <span class="m-title">대기 습도</span>
            <span class="m-value">{{ cityData.humidity }}</span>
          </div>

          <div class="metric-card">
            <span class="m-title">풍속</span>
            <span class="m-value">{{ cityData.windSpeed }}</span>
          </div>

          <div class="metric-card">
            <span class="m-title">기압</span>
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

.city-name {
  margin: 0 0 4px 0;
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
