<script setup>
// 1. 상위로부터 단방향 주입받을 객체 데이터 규격 검수 (매크로)
defineProps({
  cityItem: {
    type: Object,
    required: true,
  },
})

// 2. 상위로 송신할 두 가지 경로의 커스텀 이벤트 식별자 등록 (매크로)
const emit = defineEmits(['select-card', 'click-detail'])

const handleDetailClick = () => {
  emit('click-detail', cityItem.id, cityItem.name, cityItem.status)
}
</script>

<template>
  <div class="weather-card" @click="emit('select-card', `${cityItem.name}이 선택되었습니다.`)">
    <div class="weather-card-body">
      <h4>{{ cityItem.name }} ({{ cityItem.status }})</h4>
      <p>현재 기온: {{ cityItem.temp }}°C</p>

      <span v-if="cityItem.temp >= 28" class="badge hot">🔥 더움</span>
      <span v-else-if="cityItem.temp >= 25" class="badge warm">🌤️ 보통</span>
      <span v-else class="badge cool">❄️ 선선함</span>
    </div>

    <div class="weather-card-footer">
      <slot name="actions" :city-item="cityItem" :handle-detail="handleDetailClick">
        <button class="btn-detail" @click.stop="handleDetailClick">상세보기</button>
      </slot>
    </div>
  </div>
</template>

<style scoped>
.weather-card {
  background: #fff;
  border: 1px solid #dee2e6;
  padding: 16px;
  margin-bottom: 12px;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.weather-card-body {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.weather-card-body h4,
.weather-card-body p {
  margin: 0;
}
.badge {
  display: inline-block;
  padding: 4px 8px;
  font-size: 12px;
  border-radius: 4px;
  color: #fff;
}
.hot {
  background-color: #ff7675;
}
.warm {
  background-color: #fdcb6e;
}
.cool {
  background-color: #74b9ff;
}
.weather-card-footer {
  display: flex;
  justify-content: flex-end;
}
.btn-detail {
  padding: 6px 10px;
  cursor: pointer;
}
</style>
