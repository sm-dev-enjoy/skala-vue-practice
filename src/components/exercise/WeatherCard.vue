<script setup>
import { computed } from 'vue'
import { useConfigStore } from '@/stores/configStore'
import { useWeatherApi } from '@/composables/useWeatherApi'

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

const handleDetailClick = () => {
  emit('click-detail', props.cityItem.id, props.cityItem.name, props.cityItem.status)
}
</script>

<template>
  <div
    class="toss-weather-card"
    @click="emit('select-card', `${cityItem.name} 관측소를 선택했습니다.`)"
  >
    <div class="card-main">
      <div class="left-box">
        <h4 class="city-name">{{ cityItem.name }}</h4>
        <span class="status-label">{{ cityItem.status }}</span>

        <div class="badge-group">
          <span v-if="cityItem.temp >= 28" class="toss-badge danger">고온 경보</span>
          <span v-else-if="cityItem.temp >= 20" class="toss-badge">적정 기온</span>
          <span v-else class="toss-badge">저온</span>
        </div>
      </div>

      <div class="right-temp">
        <span class="temp-number">{{ displayTemp }}</span>
        <span class="temp-unit">{{ configStore.unitSymbol }}</span>
      </div>
    </div>

    <div class="card-bottom">
      <slot name="actions" :city-item="cityItem" :handle-detail="handleDetailClick">
        <button class="toss-btn-text" @click.stop="handleDetailClick">
          상세 정보 보기
        </button>
      </slot>
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
  transition: all 0.15s ease;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.toss-weather-card:hover {
  border-color: #b0c4de;
  transform: translateY(-1px);
}

.card-main {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.city-name {
  margin: 0 0 2px 0;
  font-size: 18px;
  font-weight: 700;
  color: var(--toss-foreground);
}

.status-label {
  font-size: 14px;
  color: var(--toss-body);
  display: block;
  margin-bottom: 8px;
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
  background: transparent;
  border: none;
  color: var(--toss-blue);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  padding: 0;
}

.toss-btn-text:hover {
  color: var(--toss-blue-hover);
  text-decoration: underline;
}
</style>
