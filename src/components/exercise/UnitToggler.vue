<script setup>
import { useConfigStore } from '@/stores/configStore'

const configStore = useConfigStore()

const units = [
  { value: 'celsius', label: '섭씨', shortLabel: '°C' },
  { value: 'fahrenheit', label: '화씨', shortLabel: '°F' },
]
</script>

<template>
  <div class="unit-toggler" role="group" aria-label="온도 단위">
    <span class="unit-label">온도</span>
    <div class="unit-options">
      <button
        v-for="unit in units"
        :key="unit.value"
        type="button"
        class="unit-option"
        :class="{ active: configStore.unit === unit.value }"
        :aria-pressed="configStore.unit === unit.value"
        :aria-label="`${unit.label}로 표시`"
        @click="configStore.setUnit(unit.value)"
      >
        <span class="full-label">{{ unit.label }}</span>
        <span class="short-label" aria-hidden="true">{{ unit.shortLabel }}</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.unit-toggler {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 44px;
}

.unit-label {
  color: var(--toss-body);
  font-size: 13px;
  font-weight: 700;
}

.unit-options {
  display: inline-flex;
  overflow: hidden;
  border: 1px solid var(--toss-border);
  border-radius: 10px;
  background: var(--toss-surface);
}

.unit-option {
  min-width: 52px;
  min-height: 40px;
  border: 0;
  background: transparent;
  color: var(--toss-body);
  cursor: pointer;
  font: inherit;
  font-size: 13px;
  font-weight: 700;
  padding: 0 10px;
}

.unit-option.active {
  background: var(--toss-blue);
  color: #ffffff;
}

.short-label {
  display: none;
}

@media (max-width: 480px) {
  .unit-label,
  .full-label {
    display: none;
  }

  .short-label {
    display: inline;
  }

  .unit-option {
    min-width: 42px;
    padding: 0 8px;
  }
}
</style>
