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
  <el-card
    class="premium-weather-card"
    shadow="hover"
    @click="emit('select-card', `${cityItem.name} 관측소가 선택되었습니다.`)"
  >
    <div class="card-main-content">
      <div class="city-info-left">
        <h4 class="city-title">{{ cityItem.name }}</h4>
        <span class="status-text">{{ cityItem.status }}</span>
        
        <div class="temp-badge-row">
          <span v-if="cityItem.temp >= 28" class="weather-pill hot">🔥 덥고 무더움</span>
          <span v-else-if="cityItem.temp >= 20" class="weather-pill warm">🌤️ 쾌적함</span>
          <span v-else class="weather-pill cool">❄️ 쌀쌀함</span>
        </div>
      </div>

      <div class="temp-right">
        <span class="temp-value">{{ displayTemp }}</span>
        <span class="temp-unit">{{ configStore.unitSymbol }}</span>
      </div>
    </div>

    <div class="card-action-bar">
      <slot name="actions" :city-item="cityItem" :handle-detail="handleDetailClick">
        <el-button type="primary" size="small" @click.stop="handleDetailClick">
          상세 정보 →
        </el-button>
      </slot>
    </div>
  </el-card>
</template>

<style scoped>
.premium-weather-card {
  border-radius: 14px;
  transition: all 0.3s ease;
  border: 1px solid #e2e8f0;
  cursor: pointer;
  margin-bottom: 12px;
}

.premium-weather-card:hover {
  border-color: #38bdf8;
  transform: translateY(-2px);
}

.card-main-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.city-title {
  margin: 0 0 4px 0;
  font-size: 1.2rem;
  font-weight: 700;
  color: #0f172a;
}

.status-text {
  font-size: 0.9rem;
  color: #64748b;
  display: block;
  margin-bottom: 8px;
}

.temp-badge-row {
  display: flex;
  gap: 6px;
}

.weather-pill {
  font-size: 0.75rem;
  font-weight: 600;
  padding: 3px 8px;
  border-radius: 12px;
  color: #ffffff;
}

.hot {
  background: linear-gradient(135deg, #ef4444 0%, #f97316 100%);
}

.warm {
  background: linear-gradient(135deg, #0284c7 0%, #38bdf8 100%);
}

.cool {
  background: linear-gradient(135deg, #64748b 0%, #94a3b8 100%);
}

.temp-right {
  display: flex;
  align-items: baseline;
}

.temp-value {
  font-size: 2.2rem;
  font-weight: 800;
  color: #0284c7;
  letter-spacing: -1px;
}

.temp-unit {
  font-size: 1.1rem;
  font-weight: 600;
  color: #64748b;
  margin-left: 2px;
}

.card-action-bar {
  display: flex;
  justify-content: flex-end;
  border-top: 1px solid #f1f5f9;
  padding-top: 10px;
}
</style>
