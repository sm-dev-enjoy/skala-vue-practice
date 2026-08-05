<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { stationOptions } from '@/constants/cities'
import { useConfigStore } from '@/stores/configStore'
import { useWeatherApi } from '@/composables/useWeatherApi'
import CitySelector from '../components/common/CitySelector.vue'
import StatusAlert from '../components/common/StatusAlert.vue'
import SvgIcon from '../components/common/SvgIcon.vue'

const route = useRoute()
const router = useRouter()
const configStore = useConfigStore()
const cityData = ref(null)
const { isLoading, errorMessage, fetchCityDetail, formatTemperature } = useWeatherApi()

let loadRequestId = 0

const currentCityId = computed(() => route.params?.cityId ?? 'city_01')
const selectedStationId = computed({
  get: () => currentCityId.value,
  set: (targetId) => {
    if (targetId !== currentCityId.value) router.push(`/weather/${targetId}`)
  },
})

const displayTemp = computed(() => formatTemperature(cityData.value?.temp))
const displayFeelsLike = computed(() => formatTemperature(cityData.value?.feelsLike))

const weatherIconName = computed(() => {
  const status = cityData.value?.status ?? ''
  if (status.includes('맑음') || status.includes('Clear') || status.includes('Sun')) return 'sun'
  if (status.includes('비') || status.includes('Rain') || status.includes('소나기')) return 'rain'
  return 'cloud'
})

const formattedObservedAt = computed(() => {
  if (!Number.isFinite(cityData.value?.observedAt)) return '관측 시각 정보 없음'

  return new Intl.DateTimeFormat('ko-KR', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Asia/Seoul',
  }).format(new Date(cityData.value.observedAt * 1000))
})

const formatMetric = (value, suffix = '') => {
  if (!Number.isFinite(value)) return '—'
  return `${value}${suffix}`
}

const loadDetailData = async () => {
  const requestId = ++loadRequestId
  const data = await fetchCityDetail(currentCityId.value)

  if (requestId === loadRequestId) cityData.value = data
}

watch(currentCityId, loadDetailData, { immediate: true })
</script>

<template>
  <div class="detail-container">
    <header class="page-title-box">
      <h1 class="page-title">도시별 상세 날씨</h1>
      <p class="page-desc">원하는 도시를 선택하면 현재 관측값을 자세히 볼 수 있습니다.</p>
    </header>

    <CitySelector v-model="selectedStationId" :options="stationOptions" label="확인할 지역" />

    <section class="detail-results" :aria-busy="isLoading" aria-label="상세 날씨 결과">
      <StatusAlert
        :message="errorMessage"
        type="error"
        retryable
        :is-retrying="isLoading"
        @retry="loadDetailData"
      />

      <div v-if="isLoading" class="skeleton-box" aria-label="상세 날씨를 불러오는 중">
        <el-skeleton :rows="5" animated />
      </div>

      <template v-else-if="cityData">
        <section class="banner-card" aria-labelledby="detail-results-title">
          <div class="banner-info">
            <div class="banner-title-row">
              <SvgIcon name="map-pin" size="22" color="#1469d8" aria-hidden="true" />
              <h2 id="detail-results-title">{{ cityData.name }}</h2>
            </div>
            <p class="sub-info">{{ cityData.fullName }} · {{ cityData.country }}</p>
            <p class="observed-at">관측 시각 · {{ formattedObservedAt }}</p>
          </div>

          <div
            class="banner-weather"
            :aria-label="`현재 날씨 ${cityData.status}, 기온 ${displayTemp ?? '정보 없음'}${configStore.unitSymbol}`"
          >
            <SvgIcon :name="weatherIconName" size="38" color="#1469d8" aria-hidden="true" />
            <div class="banner-temp">
              <span class="temp-val">{{ displayTemp ?? '—' }}</span>
              <span v-if="displayTemp !== null" class="temp-unit">{{
                configStore.unitSymbol
              }}</span>
            </div>
          </div>
        </section>

        <section class="metrics-grid" aria-label="상세 관측값">
          <article class="metric-card">
            <div class="metric-title">
              <SvgIcon name="thermometer" size="16" color="#1469d8" aria-hidden="true" />
              <h3>현재 기온</h3>
            </div>
            <p>
              {{ displayTemp ?? '—'
              }}<span v-if="displayTemp !== null">{{ configStore.unitSymbol }}</span>
            </p>
          </article>
          <article class="metric-card">
            <div class="metric-title">
              <SvgIcon name="sun" size="16" color="#1469d8" aria-hidden="true" />
              <h3>체감 온도</h3>
            </div>
            <p>
              {{ displayFeelsLike ?? '—'
              }}<span v-if="displayFeelsLike !== null">{{ configStore.unitSymbol }}</span>
            </p>
          </article>
          <article class="metric-card">
            <div class="metric-title">
              <SvgIcon name="cloud" size="16" color="#1469d8" aria-hidden="true" />
              <h3>날씨 상태</h3>
            </div>
            <p>{{ cityData.status }}</p>
          </article>
          <article class="metric-card">
            <div class="metric-title">
              <SvgIcon name="droplet" size="16" color="#1469d8" aria-hidden="true" />
              <h3>습도</h3>
            </div>
            <p>{{ formatMetric(cityData.humidity, '%') }}</p>
          </article>
          <article class="metric-card">
            <div class="metric-title">
              <SvgIcon name="wind" size="16" color="#1469d8" aria-hidden="true" />
              <h3>풍속</h3>
            </div>
            <p>{{ formatMetric(cityData.windSpeed, ' m/s') }}</p>
          </article>
          <article class="metric-card">
            <div class="metric-title">
              <SvgIcon name="gauge" size="16" color="#1469d8" aria-hidden="true" />
              <h3>기압</h3>
            </div>
            <p>{{ formatMetric(cityData.pressure, ' hPa') }}</p>
          </article>
        </section>
      </template>
    </section>

    <div class="footer-action">
      <RouterLink class="back-link" to="/">
        전체 도시 날씨로 돌아가기
        <SvgIcon name="arrow-right" size="16" color="currentColor" aria-hidden="true" />
      </RouterLink>
    </div>
  </div>
</template>

<style scoped>
.detail-container,
.detail-results {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.page-title {
  margin: 0 0 4px;
  color: var(--toss-foreground);
  font-size: 24px;
  font-weight: 800;
  letter-spacing: -0.4px;
}

.page-desc,
.sub-info,
.observed-at {
  margin: 0;
  color: var(--toss-muted);
  font-size: 14px;
  font-weight: 600;
}

.banner-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  border: 1px solid var(--toss-border);
  border-radius: 16px;
  background: var(--toss-canvas);
  padding: 24px;
}

.banner-title-row,
.banner-weather,
.banner-temp,
.metric-title,
.back-link {
  display: flex;
  align-items: center;
}

.banner-title-row,
.metric-title,
.back-link {
  gap: 8px;
}

.banner-title-row h2 {
  margin: 0;
  color: var(--toss-foreground);
  font-size: 26px;
  font-weight: 800;
}

.sub-info {
  margin-top: 5px;
}

.observed-at {
  margin-top: 3px;
}

.banner-weather {
  flex: 0 0 auto;
  gap: 14px;
}

.banner-temp {
  align-items: baseline;
}

.temp-val {
  color: var(--toss-blue);
  font-size: 46px;
  font-weight: 800;
  letter-spacing: -1.5px;
  line-height: 1;
}

.temp-unit {
  margin-left: 3px;
  color: var(--toss-muted);
  font-size: 18px;
  font-weight: 700;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}

.metric-card {
  border: 1px solid var(--toss-border);
  border-radius: 14px;
  background: var(--toss-canvas);
  padding: 16px;
}

.metric-title h3 {
  margin: 0;
  color: var(--toss-muted);
  font-size: 13px;
  font-weight: 800;
}

.metric-card p {
  margin: 10px 0 0;
  color: var(--toss-foreground);
  font-size: 20px;
  font-weight: 800;
  letter-spacing: -0.3px;
}

.metric-card p span {
  margin-left: 2px;
  color: var(--toss-muted);
  font-size: 14px;
}

.footer-action {
  display: flex;
  justify-content: flex-end;
  margin-top: 4px;
}

.back-link {
  min-height: 44px;
  border: 1px solid #a3c9f5;
  border-radius: 10px;
  background: #ffffff;
  color: var(--toss-blue);
  font-size: 14px;
  font-weight: 800;
  padding: 0 14px;
}

@media (max-width: 640px) {
  .banner-card {
    align-items: flex-start;
    flex-direction: column;
    padding: 20px;
  }

  .banner-weather {
    width: 100%;
    justify-content: space-between;
  }

  .metrics-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .footer-action,
  .back-link {
    width: 100%;
  }

  .back-link {
    justify-content: center;
  }
}
</style>
