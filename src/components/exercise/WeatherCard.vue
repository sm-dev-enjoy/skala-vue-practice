<script setup>
import { computed } from 'vue'
import { useConfigStore } from '@/stores/configStore'
import { useWeatherApi } from '@/composables/useWeatherApi'
import SvgIcon from '../common/SvgIcon.vue'

const props = defineProps({
  cityItem: {
    type: Object,
    required: true,
  },
})

const configStore = useConfigStore()
const { formatTemperature } = useWeatherApi()

const displayTemp = computed(() => formatTemperature(props.cityItem?.temp))

const weatherIconName = computed(() => {
  const status = props.cityItem?.status ?? ''
  if (status.includes('맑음') || status.includes('Clear') || status.includes('Sun')) return 'sun'
  if (status.includes('비') || status.includes('Rain') || status.includes('소나기')) return 'rain'
  return 'cloud'
})

const temperatureLabel = computed(() => {
  const temperature = props.cityItem?.temp
  if (!Number.isFinite(temperature)) return '온도 정보 없음'
  if (temperature >= 28) return '더움'
  if (temperature >= 20) return '온화함'
  return '선선함'
})
</script>

<template>
  <RouterLink
    class="weather-card"
    :to="`/weather/${cityItem.id}`"
    :aria-label="`${cityItem.name} 현재 날씨 상세 보기`"
  >
    <div class="card-top-row">
      <div class="status-icon-box">
        <SvgIcon :name="weatherIconName" size="22" color="#1469d8" aria-hidden="true" />
        <span class="status-label">{{ cityItem.status }}</span>
      </div>

      <span class="weather-badge">{{ temperatureLabel }}</span>
    </div>

    <div class="card-middle-row">
      <div class="city-box">
        <h3 class="city-name">{{ cityItem.name }}</h3>
        <span class="city-sub">{{ cityItem.fullName }}</span>
      </div>

      <div
        class="right-temp"
        :aria-label="`현재 기온 ${displayTemp ?? '정보 없음'}${configStore.unitSymbol}`"
      >
        <span class="temp-number">{{ displayTemp ?? '—' }}</span>
        <span v-if="displayTemp !== null" class="temp-unit">{{ configStore.unitSymbol }}</span>
      </div>
    </div>

    <div class="card-bottom">
      <span class="card-link-text">
        상세 날씨 보기
        <SvgIcon name="arrow-right" size="15" color="#1469d8" aria-hidden="true" />
      </span>
    </div>
  </RouterLink>
</template>

<style scoped>
.weather-card {
  display: flex;
  min-height: 176px;
  flex-direction: column;
  justify-content: space-between;
  border: 1px solid var(--toss-border);
  border-radius: 16px;
  background: var(--toss-canvas);
  color: inherit;
  padding: 20px;
  transition:
    border-color 0.15s ease-in-out,
    box-shadow 0.15s ease-in-out,
    transform 0.15s ease-in-out;
}

.weather-card:hover {
  border-color: #6ba5e8;
  box-shadow: 0 6px 20px rgba(20, 105, 216, 0.1);
  transform: translateY(-2px);
}

.weather-card:active {
  transform: scale(0.99);
}

.card-top-row,
.card-middle-row,
.card-bottom,
.status-icon-box,
.right-temp,
.card-link-text {
  display: flex;
  align-items: center;
}

.card-top-row,
.card-middle-row {
  justify-content: space-between;
}

.card-top-row {
  margin-bottom: 14px;
}

.status-icon-box {
  gap: 6px;
  min-width: 0;
}

.status-label {
  overflow: hidden;
  color: var(--toss-body);
  font-size: 13px;
  font-weight: 700;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.weather-badge {
  flex: 0 0 auto;
  border-radius: 8px;
  background: var(--toss-weak-bg);
  color: var(--toss-weak-fg);
  font-size: 12px;
  font-weight: 800;
  padding: 4px 8px;
}

.card-middle-row {
  align-items: flex-end;
  gap: 12px;
  margin-bottom: 16px;
}

.city-name {
  margin: 0;
  color: var(--toss-foreground);
  font-size: 20px;
  font-weight: 800;
}

.city-sub {
  display: block;
  margin-top: 2px;
  color: var(--toss-muted);
  font-size: 12px;
  font-weight: 600;
}

.right-temp {
  flex: 0 0 auto;
  align-items: baseline;
}

.temp-number {
  color: var(--toss-blue);
  font-size: 32px;
  font-weight: 800;
  letter-spacing: -1px;
}

.temp-unit {
  margin-left: 2px;
  color: var(--toss-muted);
  font-size: 15px;
  font-weight: 700;
}

.card-bottom {
  justify-content: flex-end;
  border-top: 1px solid var(--toss-border);
  padding-top: 12px;
}

.card-link-text {
  gap: 4px;
  color: var(--toss-blue);
  font-size: 14px;
  font-weight: 800;
}
</style>
