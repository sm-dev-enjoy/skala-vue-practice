<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import UnitToggler from './components/exercise/UnitToggler.vue'
import SvgIcon from './components/common/SvgIcon.vue'

const route = useRoute()
const isWeatherSection = computed(() => route.path === '/' || route.path.startsWith('/weather/'))
</script>

<template>
  <a class="skip-link" href="#main-content">본문으로 건너뛰기</a>

  <div class="app-shell">
    <header class="site-header">
      <div class="header-main-row">
        <RouterLink class="brand-group" to="/" aria-label="날씨 인사이트 홈">
          <span class="brand-logo-icon" aria-hidden="true">
            <SvgIcon name="sun" size="20" color="#ffffff" />
          </span>
          <span class="brand-title">날씨 인사이트</span>
        </RouterLink>

        <UnitToggler />
      </div>

      <nav class="primary-nav" aria-label="주요 메뉴">
        <RouterLink
          to="/"
          class="nav-link"
          :class="{ active: isWeatherSection }"
          :aria-current="isWeatherSection ? 'page' : undefined"
        >
          현재 날씨
        </RouterLink>
        <RouterLink to="/forecast" class="nav-link" active-class="active"> 5일 예보 </RouterLink>
        <RouterLink to="/air" class="nav-link" active-class="active">대기질</RouterLink>
        <RouterLink to="/about" class="nav-link" active-class="active">서비스 안내</RouterLink>
      </nav>
    </header>

    <main id="main-content" class="main-body" tabindex="-1">
      <RouterView />
    </main>

    <footer class="site-footer">
      <span>날씨·대기질 데이터: OpenWeather</span>
      <RouterLink to="/about">데이터 안내</RouterLink>
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

.skip-link {
  position: fixed;
  top: 12px;
  left: 12px;
  z-index: 100;
  transform: translateY(-160%);
  border-radius: 8px;
  background: #191f28;
  color: #ffffff;
  font-weight: 700;
  padding: 10px 14px;
  transition: transform 0.15s ease;
}

.skip-link:focus {
  transform: translateY(0);
}

.site-header {
  position: sticky;
  top: 0;
  z-index: 10;
  margin: 0 -1px 24px;
  border: 1px solid var(--toss-border);
  border-top: 0;
  border-radius: 0 0 20px 20px;
  background: rgba(255, 255, 255, 0.96);
  box-shadow: 0 5px 16px rgba(25, 31, 40, 0.04);
  backdrop-filter: blur(12px);
}

.header-main-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 18px 24px 14px;
}

.brand-group {
  display: inline-flex;
  min-width: 0;
  align-items: center;
  gap: 10px;
  border-radius: 8px;
}

.brand-logo-icon {
  display: inline-flex;
  width: 34px;
  height: 34px;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  background: var(--toss-blue);
}

.brand-title {
  color: var(--toss-foreground);
  font-size: 20px;
  font-weight: 800;
  letter-spacing: -0.5px;
  white-space: nowrap;
}

.primary-nav {
  display: flex;
  gap: 4px;
  overflow-x: auto;
  padding: 0 14px;
  scrollbar-width: thin;
}

.nav-link {
  position: relative;
  display: inline-flex;
  min-width: max-content;
  min-height: 44px;
  align-items: center;
  justify-content: center;
  border-radius: 8px 8px 0 0;
  color: var(--toss-body);
  font-size: 15px;
  font-weight: 700;
  padding: 0 14px;
}

.nav-link:hover {
  color: var(--toss-blue);
  background: var(--toss-weak-bg);
}

.nav-link.active {
  color: var(--toss-blue);
}

.nav-link.active::after {
  position: absolute;
  right: 14px;
  bottom: 0;
  left: 14px;
  height: 3px;
  border-radius: 3px 3px 0 0;
  background: currentColor;
  content: '';
}

.main-body {
  min-height: 480px;
}

.site-footer {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding: 26px 4px 0;
  color: var(--toss-muted);
  font-size: 13px;
}

.site-footer a {
  color: var(--toss-body);
  font-weight: 700;
  text-decoration: underline;
  text-underline-offset: 3px;
}

@media (max-width: 600px) {
  .app-shell {
    padding: 0 12px 28px;
  }

  .site-header {
    margin-bottom: 18px;
  }

  .header-main-row {
    padding: 14px 16px 10px;
  }

  .brand-title {
    font-size: 18px;
  }

  .primary-nav {
    gap: 0;
    padding: 0 8px;
  }

  .nav-link {
    min-height: 42px;
    font-size: 14px;
    padding: 0 12px;
  }

  .site-footer {
    flex-direction: column;
    padding-top: 22px;
  }
}
</style>
