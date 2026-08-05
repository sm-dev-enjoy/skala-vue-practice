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

const emit = defineEmits(['select-card', 'click-detail'])
const configStore = useConfigStore()
const { formatTemperature } = useWeatherApi()

const displayTemp = computed(() => formatTemperature(props.cityItem?.temp))

const weatherIconName = computed(() => {
  const status = props.cityItem?.status ?? ''
  if (status.includes('맑음') || status.includes('Clear') || status.includes('Sun')) return 'sun'
  if (status.includes('비') || status.includes('Rain') || status.includes('소나기')) return 'rain'
  return 'cloud'
})

// 카드 전체 클릭 시 상세 페이지 이동 및 부모 통지
const handleCardClick = () => {
  emit('select-card', `${props.cityItem.name} 관측소로 이동합니다.`)
  emit('click-detail', props.cityItem.id, props.cityItem.name, props.cityItem.status)
}
</script>

<template>
  <div
    class="toss-weather-card"
    @click="handleCardClick"
  >
    <div class="card-top-row">
      <div class="status-icon-box">
        <SvgIcon :name="weatherIconName" size="22" color="#3182f6" />
        <span class="status-label">{{ cityItem.status }}</span>
      </div>

      <span v-if="cityItem.temp >= 28" class="toss-badge danger">고온 경보</span>
      <span v-else-if="cityItem.temp >= 20" class="toss-badge">적정 기온</span>
      <span v-else class="toss-badge">저온</span>
    </div>

    <div class="card-middle-row">
      <div class="city-box">
        <h4 class="city-name">{{ cityItem.name }}</h4>
        <span class="city-sub">실시간 기상 관측</span>
      </div>

      <div class="right-temp">
        <span class="temp-number">{{ displayTemp }}</span>
        <span class="temp-unit">{{ configStore.unitSymbol }}</span>
      </div>
    </div>

    <div class="card-bottom">
      <div class="toss-btn-text">
        <span>상세 페이지 보기</span>
        <SvgIcon name="arrow-right" size="14" color="#3182f6" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.toss-weather-card {
  background: var(--toss-canvas);
  border: 1px solid var(--toss-border);
  border-radius: 16px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.15s ease-in-out;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  user-select: none;
}

.toss-weather-card:hover {
  border-color: #3182f6;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(49, 130, 246, 0.08);
}

.toss-weather-card:active {
  transform: scale(0.985);
  background: #f8fafc;
}

.card-top-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 14px;
}

.status-icon-box {
  display: flex;
  align-items: center;
  gap: 6px;
}

.status-label {
  font-size: 13px;
  font-weight: 600;
  color: var(--toss-body);
}

.card-middle-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 16px;
}

.city-name {
  margin: 0;
  font-size: 20px;
  font-weight: 700;
  color: var(--toss-foreground);
}

.city-sub {
  font-size: 12px;
  color: var(--toss-muted);
}

.right-temp {
  display: flex;
  align-items: baseline;
}

.temp-number {
  font-size: 32px;
  font-weight: 700;
  color: var(--toss-blue);
  letter-spacing: -1px;
}

.temp-unit {
  font-size: 16px;
  font-weight: 600;
  color: var(--toss-muted);
  margin-left: 2px;
}

.card-bottom {
  display: flex;
  justify-content: flex-end;
  border-top: 1px solid var(--toss-border);
  padding-top: 12px;
}

.toss-btn-text {
  color: var(--toss-blue);
  font-size: 14px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 4px;
}
</style>
