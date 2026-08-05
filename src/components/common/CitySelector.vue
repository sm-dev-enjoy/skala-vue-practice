<script setup>
import { useId } from 'vue'

defineProps({
  modelValue: {
    type: String,
    required: true,
  },
  options: {
    type: Array,
    default: () => [],
  },
  disabledValues: {
    type: Array,
    default: () => [],
  },
  label: {
    type: String,
    default: '관측 지역',
  },
})

const emit = defineEmits(['update:modelValue'])
const labelId = useId()
const selectId = useId()

const handleSelect = (value) => {
  emit('update:modelValue', value)
}
</script>

<template>
  <section class="city-selector" :aria-labelledby="labelId">
    <span :id="labelId" class="selector-label">{{ label }}</span>

    <div class="chips-group" role="group" :aria-labelledby="labelId">
      <button
        v-for="item in options"
        :key="item.value"
        type="button"
        class="city-chip"
        :class="{ active: modelValue === item.value }"
        :aria-pressed="modelValue === item.value"
        :disabled="disabledValues.includes(item.value)"
        @click="handleSelect(item.value)"
      >
        {{ item.label }}
      </button>
    </div>

    <div class="mobile-select-wrap">
      <label :for="selectId" class="sr-only">{{ label }} 선택</label>
      <select
        :id="selectId"
        class="mobile-select"
        :value="modelValue"
        @change="handleSelect($event.target.value)"
      >
        <option
          v-for="item in options"
          :key="item.value"
          :value="item.value"
          :disabled="disabledValues.includes(item.value)"
        >
          {{ item.label }}
        </option>
      </select>
    </div>
  </section>
</template>

<style scoped>
.city-selector {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  border: 1px solid var(--toss-border);
  border-radius: 14px;
  background: var(--toss-canvas);
  padding: 12px 16px;
}

.selector-label {
  min-height: 40px;
  display: inline-flex;
  flex: 0 0 auto;
  align-items: center;
  color: var(--toss-body);
  font-size: 14px;
  font-weight: 800;
  white-space: nowrap;
}

.chips-group {
  display: flex;
  flex: 1;
  flex-wrap: wrap;
  gap: 8px;
}

.city-chip {
  min-height: 40px;
  border: 1px solid transparent;
  border-radius: 9px;
  background: var(--toss-surface);
  color: var(--toss-body);
  cursor: pointer;
  font-size: 14px;
  font-weight: 700;
  padding: 0 13px;
}

.city-chip:hover {
  border-color: #b9d4f4;
  background: var(--toss-weak-bg);
}

.city-chip.active {
  border-color: #8dbcf1;
  background: var(--toss-weak-bg);
  color: var(--toss-weak-fg);
}

.city-chip:disabled {
  cursor: not-allowed;
  opacity: 0.45;
}

.mobile-select-wrap {
  display: none;
  width: 100%;
}

.mobile-select {
  width: 100%;
  min-height: 44px;
  appearance: auto;
  border: 1px solid #aeb8c3;
  border-radius: 10px;
  background: #ffffff;
  color: var(--toss-foreground);
  font-size: 15px;
  font-weight: 700;
  padding: 0 12px;
}

@media (max-width: 640px) {
  .city-selector {
    flex-direction: column;
    gap: 8px;
    padding: 12px 14px;
  }

  .selector-label {
    min-height: auto;
  }

  .chips-group {
    display: none;
  }

  .mobile-select-wrap {
    display: block;
  }
}
</style>
