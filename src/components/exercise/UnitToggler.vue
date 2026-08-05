<script setup>
import { useConfigStore } from '@/stores/configStore'

const configStore = useConfigStore()
</script>

<template>
  <div class="toss-unit-toggler">
    <span class="unit-label">온도 단위</span>
    <el-radio-group
      v-model="configStore.unit"
      size="small"
      class="toss-segmented-group"
    >
      <el-radio-button value="celsius">섭씨 (°C)</el-radio-button>
      <el-radio-button value="fahrenheit">화씨 (°F)</el-radio-button>
    </el-radio-group>
  </div>
</template>

<style scoped>
.toss-unit-toggler {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: var(--toss-surface);
  padding: 4px 8px;
  border-radius: 12px;
}

.unit-label {
  font-size: 13px;
  font-weight: 600;
  color: var(--toss-body);
}

.toss-segmented-group :deep(.el-radio-button__inner) {
  border-radius: 8px !important;
  border: none !important;
  font-weight: 600;
}
</style>
