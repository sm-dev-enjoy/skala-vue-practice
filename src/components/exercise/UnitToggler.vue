<script setup>
import { useConfigStore } from '@/stores/configStore'

// Pinia 전역 스토어에서 온습도 단위(섭씨/화씨) 상태를 가져옵니다.
const configStore = useConfigStore()
</script>

<template>
  <div class="unit-toggler">
    <span class="unit-label">온도 단위</span>
    <el-radio-group
      v-model="configStore.unit"
      size="small"
      class="custom-radio-group"
    >
      <el-radio-button value="celsius">°C 섭씨</el-radio-button>
      <el-radio-button value="fahrenheit">°F 화씨</el-radio-button>
    </el-radio-group>
  </div>
</template>

<style scoped>
.unit-toggler {
  margin-left: auto;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: rgba(255, 255, 255, 0.8);
  padding: 4px 12px;
  border-radius: 20px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
}

.unit-label {
  font-size: 13px;
  font-weight: 600;
  color: #475569;
}
</style>
