<script setup>
import { useConfigStore } from '@/stores/configStore'
const configStore = useConfigStore()
</script>

<template>
  <div class="unit-toggler">
    <span
      >날씨단위: <strong>{{ configStore.unitSymbol }}</strong></span
    >
    <button @click="configStore.toggleUnit()" class="toggle-btn">단위변경</button>
  </div>
</template>

<style scoped>
.unit-toggler {
  margin-left: auto;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;
}

.toggle-btn {
  padding: 6px 10px;
  background-color: #4b6584;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}
</style>
