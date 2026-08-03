<template>
  <div class="base-dashboard-card">
    <header v-if="$slots.header" class="card-header">
      <slot name="header"></slot>
    </header>

    <section class="card-body">
      <slot></slot>
    </section>

    <footer v-if="$slots.footer" class="card-footer">
      <slot name="footer"></slot>
    </footer>
  </div>
</template>

<style scoped>
.base-dashboard-card {
  background: #f8f9fa;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 15px;
  border: 1px solid #e9ecef;
}
.card-header {
  margin-bottom: 12px;
}
.card-body {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.card-footer {
  margin-top: 12px;
}
</style>
