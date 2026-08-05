<script setup>
defineProps({
  message: {
    type: String,
    default: '',
  },
  type: {
    type: String,
    default: 'error', // 'success' | 'warning' | 'info' | 'error'
  },
  showIcon: {
    type: Boolean,
    default: true,
  },
})
</script>

<template>
  <el-alert
    v-if="message"
    :title="message"
    :type="type"
    :show-icon="showIcon"
    :closable="false"
    class="status-alert"
  />
</template>

<style scoped>
.status-alert {
  margin-bottom: 16px;
  border-radius: 6px;
}
</style>
