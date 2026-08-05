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
    default: '관측 지역 선택',
  },
})

const emit = defineEmits(['update:modelValue'])

const handleSelect = (val) => {
  emit('update:modelValue', val)
}
</script>

<template>
  <div class="city-selector-bar">
    <span class="selector-label">{{ label }}:</span>
    <el-radio-group
      :model-value="modelValue"
      size="default"
      @change="handleSelect"
    >
      <el-radio-button
        v-for="item in options"
        :key="item.value"
        :value="item.value"
      >
        {{ item.label }}
      </el-radio-button>
    </el-radio-group>
  </div>
</template>

<style scoped>
.city-selector-bar {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
  background: #f8fafc;
  padding: 12px 16px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.selector-label {
  font-weight: 600;
  font-size: 0.9rem;
  color: #334155;
}
</style>
