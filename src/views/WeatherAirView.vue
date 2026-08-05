<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { airCityOptions } from '@/constants/cities'
import { useAirPollution } from '@/composables/useAirPollution'
import CitySelector from '../components/common/CitySelector.vue'
import StatusAlert from '../components/common/StatusAlert.vue'
import SvgIcon from '../components/common/SvgIcon.vue'

const route = useRoute()
const router = useRouter()
const validCityKeys = new Set(airCityOptions.map((city) => city.value))
const selectedCityKey = ref(validCityKeys.has(route.query.city) ? route.query.city : 'seoul')
const { isLoading, errorMessage, airData, getAqiStatus, fetchAirPollution } = useAirPollution()

const healthAdvice = computed(() => {
  const aqi = airData.value?.aqi
  const adviceByLevel = {
    1: {
      title: '대체로 쾌적한 상태입니다',
      mask: '개인 상태에 따라 선택',
      ventilation: '평소처럼 환기 가능',
      outdoor: '일상적인 야외 활동 가능',
    },
    2: {
      title: '대체로 양호한 상태입니다',
      mask: '민감군은 상태를 살펴보세요',
      ventilation: '짧게 환기해 보세요',
      outdoor: '무리하지 않는 활동 권장',
    },
    3: {
      title: '민감군은 주의가 필요할 수 있습니다',
      mask: '호흡기 증상이 있으면 고려',
      ventilation: '교통량이 적은 시간에 짧게',
      outdoor: '장시간·격렬한 활동은 줄이기',
    },
    4: {
      title: '야외 활동 전 상태를 한 번 더 확인하세요',
      mask: '민감군은 보건용 마스크를 고려',
      ventilation: '필요할 때 짧게 환기',
      outdoor: '장시간 야외 활동 줄이기',
    },
    5: {
      title: '민감군은 공식 안내를 우선 확인하세요',
      mask: '개인 건강 상태에 맞춰 대비',
      ventilation: '실외 공기 상태를 확인한 뒤 판단',
      outdoor: '불필요한 장시간 활동 미루기',
    },
  }

  return adviceByLevel[aqi] ?? null
})

const formattedMeasuredAt = computed(() => {
  if (!Number.isFinite(airData.value?.observedAt)) return '측정 시각 정보 없음'

  return new Intl.DateTimeFormat('ko-KR', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Asia/Seoul',
  }).format(new Date(airData.value.observedAt * 1000))
})

const selectedCityLabel = computed(
  () => airCityOptions.find((city) => city.value === selectedCityKey.value)?.label ?? '선택한 도시',
)

const formatPollutant = (value) => {
  if (!Number.isFinite(value)) return '—'
  return Math.round(value * 10) / 10
}

const syncQuery = () => {
  router.replace({
    path: '/air',
    query: selectedCityKey.value === 'seoul' ? {} : { city: selectedCityKey.value },
  })
}

const loadAirPollution = () => fetchAirPollution(selectedCityKey.value)

onMounted(loadAirPollution)

watch(selectedCityKey, () => {
  loadAirPollution()
  syncQuery()
})

watch(
  () => route.query.city,
  (routeCity) => {
    const nextCity = validCityKeys.has(routeCity) ? routeCity : 'seoul'
    if (nextCity !== selectedCityKey.value) selectedCityKey.value = nextCity
  },
)
</script>

<template>
  <div class="air-container">
    <header class="page-title-box">
      <h1 class="page-title">대기질 정보</h1>
      <p class="page-desc">
        OpenWeather의 1~5단계 대기질 정보와 오염 물질 수치를 확인할 수 있습니다.
      </p>
    </header>

    <CitySelector v-model="selectedCityKey" :options="airCityOptions" label="확인할 지역" />

    <section class="air-results" :aria-busy="isLoading" aria-label="대기질 결과">
      <StatusAlert
        :message="errorMessage"
        type="error"
        retryable
        :is-retrying="isLoading"
        @retry="loadAirPollution"
      />

      <div v-if="isLoading" class="skeleton-box" aria-label="대기질 정보를 불러오는 중">
        <el-skeleton :rows="6" animated />
      </div>

      <template v-else-if="airData">
        <section class="aqi-card" aria-labelledby="air-results-title">
          <div class="aqi-summary">
            <div class="header-tag-row">
              <SvgIcon name="air" size="19" color="#1469d8" aria-hidden="true" />
              <h2 id="air-results-title">{{ airData.cityName }} 대기질</h2>
            </div>
            <p class="measured-at">측정 시각 · {{ formattedMeasuredAt }}</p>
            <div class="aqi-badge-wrap">
              <span class="aqi-badge" :style="{ color: getAqiStatus(airData.aqi).color }">
                {{ getAqiStatus(airData.aqi).label }}
              </span>
              <span class="aqi-score">OpenWeather 단계 {{ airData.aqi }} / 5</span>
            </div>
          </div>

          <ol
            class="aqi-scale"
            :aria-label="`대기질 단계 ${airData.aqi} / 5, ${getAqiStatus(airData.aqi).label}`"
          >
            <li
              v-for="level in 5"
              :key="level"
              :class="{ current: level === airData.aqi, passed: level < airData.aqi }"
              :aria-current="level === airData.aqi ? 'step' : undefined"
            >
              <span>{{ level }}</span>
            </li>
          </ol>
        </section>

        <section v-if="healthAdvice" class="health-guide-card" aria-labelledby="health-guide-title">
          <div class="guide-header">
            <SvgIcon name="sparkles" size="18" color="#1469d8" aria-hidden="true" />
            <h2 id="health-guide-title">일상 참고 안내</h2>
          </div>
          <p class="guide-summary-title">{{ healthAdvice.title }}</p>

          <dl class="guide-items-grid">
            <div>
              <dt>마스크</dt>
              <dd>{{ healthAdvice.mask }}</dd>
            </div>
            <div>
              <dt>실내 환기</dt>
              <dd>{{ healthAdvice.ventilation }}</dd>
            </div>
            <div>
              <dt>야외 활동</dt>
              <dd>{{ healthAdvice.outdoor }}</dd>
            </div>
          </dl>
        </section>

        <section class="pollutants-section" aria-labelledby="pollutants-title">
          <div class="pollutants-heading">
            <h2 id="pollutants-title">오염 물질 수치</h2>
            <span>단위 · µg/m³</span>
          </div>
          <div class="air-grid">
            <article class="air-item-card highlighted">
              <div class="card-icon-title">
                <SvgIcon name="droplet" size="16" color="#1469d8" aria-hidden="true" />
                <h3>초미세먼지 <small>PM2.5</small></h3>
              </div>
              <p>{{ formatPollutant(airData.pm2_5) }}</p>
            </article>
            <article class="air-item-card highlighted">
              <div class="card-icon-title">
                <SvgIcon name="cloud" size="16" color="#1469d8" aria-hidden="true" />
                <h3>미세먼지 <small>PM10</small></h3>
              </div>
              <p>{{ formatPollutant(airData.pm10) }}</p>
            </article>
            <article class="air-item-card">
              <h3>이산화질소 <small>NO₂</small></h3>
              <p>{{ formatPollutant(airData.no2) }}</p>
            </article>
            <article class="air-item-card">
              <h3>오존 <small>O₃</small></h3>
              <p>{{ formatPollutant(airData.o3) }}</p>
            </article>
            <article class="air-item-card">
              <h3>일산화탄소 <small>CO</small></h3>
              <p>{{ formatPollutant(airData.co) }}</p>
            </article>
          </div>
        </section>

        <p class="reference-note">
          이 정보는 OpenWeather 데이터에 따른 참고용 안내입니다. 건강 관련 판단이나 재난 상황에서는
          공공기관의 공식 안내를 우선해 주세요.
        </p>
      </template>

      <el-empty
        v-else-if="!errorMessage"
        :description="`${selectedCityLabel}의 대기질 정보가 없습니다.`"
        :image-size="80"
      />
    </section>
  </div>
</template>

<style scoped>
.air-container,
.air-results {
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
.measured-at,
.reference-note {
  margin: 0;
  color: var(--toss-muted);
  font-size: 14px;
  font-weight: 600;
}

.aqi-card,
.health-guide-card,
.pollutants-section {
  border: 1px solid var(--toss-border);
  border-radius: 16px;
  background: var(--toss-canvas);
}

.aqi-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  padding: 24px;
}

.header-tag-row,
.aqi-badge-wrap,
.guide-header,
.card-icon-title,
.pollutants-heading {
  display: flex;
  align-items: center;
}

.header-tag-row,
.guide-header,
.card-icon-title {
  gap: 8px;
}

.header-tag-row h2,
.guide-header h2,
.pollutants-heading h2 {
  margin: 0;
  color: var(--toss-foreground);
  font-size: 18px;
  font-weight: 800;
}

.measured-at {
  margin-top: 6px;
}

.aqi-badge-wrap {
  gap: 10px;
  margin-top: 16px;
}

.aqi-badge {
  border-radius: 999px;
  background: var(--toss-surface);
  font-size: 14px;
  font-weight: 800;
  padding: 7px 10px;
}

.aqi-score {
  color: var(--toss-body);
  font-size: 14px;
  font-weight: 700;
}

.aqi-scale {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 6px;
  width: min(300px, 42vw);
  margin: 0;
  padding: 0;
  list-style: none;
}

.aqi-scale li {
  display: flex;
  aspect-ratio: 1;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--toss-border);
  border-radius: 10px;
  background: var(--toss-surface);
  color: var(--toss-muted);
  font-size: 14px;
  font-weight: 800;
}

.aqi-scale li.passed {
  border-color: #b9d4f4;
  background: #eef6ff;
  color: var(--toss-weak-fg);
}

.aqi-scale li.current {
  border-color: var(--toss-blue);
  background: var(--toss-blue);
  color: #ffffff;
}

.health-guide-card,
.pollutants-section {
  padding: 20px 24px;
}

.guide-summary-title {
  margin: 10px 0 16px;
  color: var(--toss-foreground);
  font-size: 16px;
  font-weight: 800;
}

.guide-items-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin: 0;
}

.guide-items-grid div {
  border-radius: 12px;
  background: var(--toss-surface);
  padding: 12px 14px;
}

.guide-items-grid dt {
  color: var(--toss-muted);
  font-size: 12px;
  font-weight: 700;
}

.guide-items-grid dd {
  margin: 4px 0 0;
  color: var(--toss-foreground);
  font-size: 14px;
  font-weight: 800;
}

.pollutants-heading {
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 14px;
}

.pollutants-heading span {
  color: var(--toss-muted);
  font-size: 13px;
  font-weight: 700;
}

.air-grid {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 10px;
}

.air-item-card {
  min-width: 0;
  border: 1px solid var(--toss-border);
  border-radius: 12px;
  background: #ffffff;
  padding: 14px;
}

.air-item-card.highlighted {
  border-color: #b9d4f4;
  background: #f4f8ff;
}

.air-item-card h3 {
  margin: 0;
  color: var(--toss-body);
  font-size: 13px;
  font-weight: 800;
}

.air-item-card h3 small {
  color: var(--toss-muted);
  font-size: 11px;
}

.air-item-card p {
  margin: 10px 0 0;
  color: var(--toss-foreground);
  font-size: 22px;
  font-weight: 800;
  letter-spacing: -0.5px;
}

.reference-note {
  line-height: 1.6;
  padding: 0 4px;
}

@media (max-width: 760px) {
  .aqi-card {
    align-items: stretch;
    flex-direction: column;
    padding: 20px;
  }

  .aqi-scale {
    width: 100%;
  }

  .guide-items-grid {
    grid-template-columns: 1fr;
  }

  .air-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .health-guide-card,
  .pollutants-section {
    padding: 18px;
  }
}

@media (max-width: 400px) {
  .aqi-badge-wrap,
  .pollutants-heading {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>
