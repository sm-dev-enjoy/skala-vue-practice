<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import UnitToggler from './components/exercise/UnitToggler.vue'

const route = useRoute()
const activeMenu = computed(() => route.path)
</script>

<template>
  <div class="app-shell">
    <!-- Sticky Glass Header -->
    <header class="app-header-glass">
      <div class="header-inner">
        <div class="brand-box">
          <div class="logo-icon">⛅</div>
          <div>
            <h1 class="brand-title">SkyMetrics Weather</h1>
            <span class="brand-badge">Live OpenWeather Studio</span>
          </div>
        </div>

        <div class="header-right">
          <UnitToggler />
        </div>
      </div>

      <!-- Navigation Tabs -->
      <nav class="nav-bar-container">
        <el-menu
          :default-active="activeMenu"
          mode="horizontal"
          router
          class="custom-nav-menu"
          :ellipsis="false"
        >
          <el-menu-item index="/">
            <span>🌦️ 실시간 날씨</span>
          </el-menu-item>
          <el-menu-item index="/forecast">
            <span>📅 5일 예보</span>
          </el-menu-item>
          <el-menu-item index="/air">
            <span>🍃 대기질/미세먼지</span>
          </el-menu-item>
          <el-menu-item index="/about">
            <span>ℹ️ 서비스 소개</span>
          </el-menu-item>
        </el-menu>
      </nav>
    </header>

    <main class="main-content-wrapper">
      <RouterView />
    </main>

    <footer class="app-footer">
      <p>© 2026 SkyMetrics Weather Studio. Powered by OpenWeatherMap REST API</p>
    </footer>
  </div>
</template>

<style>
@import '@/assets/exercise.css';

.app-shell {
  max-width: 1080px;
  margin: 0 auto;
  padding: 0 16px 40px;
}

/* Sticky Glassmorphism Header */
.app-header-glass {
  position: sticky;
  top: 12px;
  z-index: 100;
  background: rgba(15, 23, 42, 0.88);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 16px 24px 0 24px;
  margin-bottom: 24px;
  box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.25);
  color: #ffffff;
}

.header-inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.brand-box {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-icon {
  font-size: 2.2rem;
  line-height: 1;
}

.brand-title {
  margin: 0;
  font-size: 1.4rem;
  font-weight: 800;
  color: #f8fafc;
  letter-spacing: -0.5px;
}

.brand-badge {
  font-size: 0.75rem;
  color: #38bdf8;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.custom-nav-menu {
  background: transparent !important;
  border-bottom: none !important;
}

.custom-nav-menu .el-menu-item {
  color: #94a3b8 !important;
  font-weight: 600;
  font-size: 0.95rem;
  transition: all 0.2s ease;
}

.custom-nav-menu .el-menu-item:hover,
.custom-nav-menu .el-menu-item.is-active {
  color: #38bdf8 !important;
  background: transparent !important;
  border-bottom: 2px solid #38bdf8 !important;
}

.main-content-wrapper {
  min-height: 520px;
}

.app-footer {
  margin-top: 40px;
  text-align: center;
  color: #94a3b8;
  font-size: 0.85rem;
  border-top: 1px solid #e2e8f0;
  padding-top: 20px;
}
</style>
