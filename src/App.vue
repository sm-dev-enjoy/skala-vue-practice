<template>
  <div class="app-shell">
    <header class="app-header">
      <h1>⛅ 과제 4: 라우터적용</h1>
      <p>날씨 대시보드, 서비스 소개, 상세 페이지를 라우터로 이동합니다.</p>
    </header>

    <div class="dashboard-wrapper">
      <nav class="navigation-bar">
        <RouterLink to="/" class="nav-item">🌦️ 날씨 대시보드</RouterLink>
        <span class="divider">|</span>
        <RouterLink to="/about" class="nav-item">ℹ️ 서비스 소개</RouterLink>
      </nav>

      <main class="view-panel">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<style>
@import '@/assets/exercise.css';
</style>
