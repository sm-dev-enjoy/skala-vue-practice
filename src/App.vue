<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import UnitToggler from './components/exercise/UnitToggler.vue'

const route = useRoute()
const activeMenu = computed(() => route.path)
</script>

<template>
  <div class="app-shell">
    <!-- Toss Style Clean Top Header -->
    <header class="toss-header">
      <div class="header-main-row">
        <div class="brand-group">
          <span class="brand-logo-badge">날씨</span>
          <h1 class="brand-title">날씨 인사이트</h1>
        </div>

        <div class="header-right">
          <UnitToggler />
        </div>
      </div>

      <!-- Navigation Tabs -->
      <nav class="nav-container">
        <el-menu
          :default-active="activeMenu"
          mode="horizontal"
          router
          class="toss-nav-menu"
          :ellipsis="false"
        >
          <el-menu-item index="/">실시간 날씨</el-menu-item>
          <el-menu-item index="/forecast">5일 예보</el-menu-item>
          <el-menu-item index="/air">대기질 분석</el-menu-item>
          <el-menu-item index="/about">서비스 소개</el-menu-item>
        </el-menu>
      </nav>
    </header>

    <main class="main-body">
      <RouterView />
    </main>

    <footer class="toss-footer">
      <p>날씨 데이터 출처: OpenWeatherMap REST API</p>
    </footer>
  </div>
</template>

<style>
@import '@/assets/exercise.css';

.app-shell {
  max-width: 960px;
  margin: 0 auto;
  padding: 0 16px 40px;
}

/* Toss Clean White Header */
.toss-header {
  background: var(--toss-canvas);
  border-bottom: 1px solid var(--toss-border);
  padding: 20px 24px 0 24px;
  margin-bottom: 24px;
  border-radius: 0 0 20px 20px;
}

.header-main-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.brand-group {
  display: flex;
  align-items: center;
  gap: 10px;
}

.brand-logo-badge {
  background: var(--toss-blue);
  color: #ffffff;
  font-size: 12px;
  font-weight: 700;
  padding: 4px 8px;
  border-radius: 6px;
}

.brand-title {
  margin: 0;
  font-size: 20px;
  font-weight: 700;
  color: var(--toss-foreground);
  letter-spacing: -0.4px;
}

.toss-nav-menu {
  border-bottom: none !important;
  background: transparent !important;
}

.toss-nav-menu .el-menu-item {
  font-size: 15px;
  font-weight: 600;
  color: var(--toss-muted) !important;
  border-bottom: 2px solid transparent !important;
  padding: 0 16px;
}

.toss-nav-menu .el-menu-item.is-active {
  color: var(--toss-blue) !important;
  border-bottom-color: var(--toss-blue) !important;
  background: transparent !important;
}

.main-body {
  min-height: 480px;
}

.toss-footer {
  margin-top: 40px;
  text-align: center;
  color: var(--toss-muted);
  font-size: 13px;
}
</style>
