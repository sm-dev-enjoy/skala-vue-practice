<script setup>
defineProps({
  message: {
    type: String,
    default: '',
  },
  type: {
    type: String,
    default: 'error',
  },
  showIcon: {
    type: Boolean,
    default: true,
  },
  retryable: {
    type: Boolean,
    default: false,
  },
  isRetrying: {
    type: Boolean,
    default: false,
  },
  retryLabel: {
    type: String,
    default: '다시 시도',
  },
})

defineEmits(['retry'])
</script>

<template>
  <div
    v-if="message"
    class="status-alert"
    :class="`status-${type}`"
    role="status"
    aria-live="polite"
  >
    <el-alert :title="message" :type="type" :show-icon="showIcon" :closable="false" />
    <button
      v-if="retryable"
      type="button"
      class="retry-button"
      :disabled="isRetrying"
      @click="$emit('retry')"
    >
      {{ isRetrying ? '불러오는 중…' : retryLabel }}
    </button>
  </div>
</template>

<style scoped>
.status-alert {
  display: flex;
  align-items: center;
  gap: 12px;
  border: 1px solid #f3c4c4;
  border-radius: 12px;
  background: #fff8f8;
  padding: 8px;
}

.status-alert.status-warning {
  border-color: #f2d08a;
  background: #fffaf0;
}

.status-alert.status-info,
.status-alert.status-success {
  border-color: #b9d4f4;
  background: #f4f8ff;
}

.status-alert :deep(.el-alert) {
  flex: 1;
  min-width: 0;
  background: transparent;
  padding: 6px 8px;
}

.retry-button {
  min-width: max-content;
  min-height: 40px;
  border: 1px solid #c33d4a;
  border-radius: 8px;
  background: #ffffff;
  color: #a72d39;
  cursor: pointer;
  font-size: 13px;
  font-weight: 800;
  padding: 0 12px;
}

.retry-button:disabled {
  cursor: wait;
  opacity: 0.6;
}

@media (max-width: 480px) {
  .status-alert {
    align-items: stretch;
    flex-direction: column;
  }

  .retry-button {
    width: 100%;
    min-height: 42px;
  }
}
</style>
