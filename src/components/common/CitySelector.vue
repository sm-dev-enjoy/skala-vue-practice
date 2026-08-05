<script setup>
defineProps({
  modelValue: {
    type: String,
    required: true,
  },
  options: {
    type: Array,
    default: () => [
      { label: '서울', value: 'seoul' },
      { label: '수원', value: 'suwon' },
      { label: '부산', value: 'busan' },
    ],
  },
  label: {
    type: String,
    default: '관측 지역',
  },
})

const emit = defineEmits(['update:modelValue'])

const handleSelect = (val) => {
  emit('update:modelValue', val)
}
</script>

<template>
  <div class="toss-city-selector">
    <span class="selector-label">{{ label }}</span>
    <div class="chips-group">
      <button
        v-for="item in options"
        :key="item.value"
        class="toss-chip"
        :class="{ active: modelValue === item.value }"
        @click="handleSelect(item.value)"
      >
        {{ item.label }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.toss-city-selector {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
  background: var(--toss-canvas);
  padding: 12px 16px;
  border-radius: 14px;
  border: 1px solid var(--toss-border);
  overflow: hidden;
}

.selector-label {
  font-size: 14px;
  font-weight: 600;
  color: var(--toss-body);
  white-space: nowrap;
  flex-shrink: 0;
}

.chips-group {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE/Edge */
  padding-bottom: 2px;
}

.chips-group::-webkit-scrollbar {
  display: none; /* Chrome/Safari */
}

.toss-chip {
  background: var(--toss-surface);
  color: var(--toss-body);
  border: none;
  padding: 7px 14px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  flex-shrink: 0;
  transition: all 0.15s ease;
}

.toss-chip:hover {
  background: #e2e8f0;
}

.toss-chip.active {
  background: var(--toss-weak-bg);
  color: var(--toss-weak-fg);
}

/* 모바일 분기 반응형 처리 */
@media (max-width: 640px) {
  .toss-city-selector {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
    padding: 12px 14px;
  }

  .chips-group {
    width: 100%;
  }
}
</style>
