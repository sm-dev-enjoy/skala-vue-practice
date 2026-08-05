<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import UnitToggler from './components/exercise/UnitToggler.vue'

const route = useRoute()
// 현재 활성화된 라우트 경로를 Element Plus 메뉴 선택값과 동기화
const activeMenu = computed(() => route.path)
</script>

<template>
  <div class="app-shell">
    <header class="app-header">
      <div class="header-content">
        <div class="title-group">
          <h1>⛅ OpenWeather 실시간 기상 대시보드</h1>
          <p class="subtitle">OpenWeatherMap API 기반 도시별 기상 관측 및 통합 대기 환경 분석</p>
        </div>
        <UnitToggler />
      </div>
    </header>

    <div class="main-container">
      <el-menu
        :default-active="activeMenu"
        mode="horizontal"
        router
        class="nav-menu"
        :ellipsis="false"
      >
        <el-menu-item index="/">
          <el-icon><i-ep-partly-cloudy /></el-icon>
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

      <main class="view-panel">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<style>
@import '@/assets/exercise.css';

.app-shell {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px 16px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
}

.app-header {
  background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
  color: #ffffff;
  padding: 24px 28px;
  border-radius: 12px;
  margin-bottom: 16px;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.1);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}

.title-group h1 {
  margin: 0 0 6px 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: #f8fafc;
}

.subtitle {
  margin: 0;
  font-size: 0.875rem;
  color: #94a3b8;
}

.main-container {
  background: #ffffff;
  border-radius: 12px;
  padding: 16px 20px 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
}

.nav-menu {
  border-bottom: 1px solid #e2e8f0;
  margin-bottom: 20px;
}

.view-panel {
  min-height: 400px;
}
</style>
