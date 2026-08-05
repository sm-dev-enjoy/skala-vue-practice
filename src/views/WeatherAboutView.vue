<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const handleGoHome = () => {
  router.push('/')
}
</script>

<template>
  <div class="toss-about-container">
    <div class="page-title-box">
      <h2 class="page-title">서비스 소개</h2>
      <p class="page-desc">날씨 인사이트의 기술 구성 및 핵심 로직 안내입니다.</p>
    </div>

    <div class="about-card">
      <h3 class="card-section-title">시스템 아키텍처</h3>

      <div class="feature-list">
        <div class="feature-item">
          <span class="f-title">Vue 3 Composition API & Pinia</span>
          <p class="f-desc">전역 온도 단위(섭씨/화씨) 상태와 컴포저블 비즈니스 로직을 온전히 분리하여 유지보수성을 극대화했습니다.</p>
        </div>

        <div class="feature-item">
          <span class="f-title">OpenWeatherMap REST API 연동</span>
          <p class="f-desc">실시간 기상 정보, 5일/3시간 단기 예보 및 통합 대기질(AQI) 파이프라인을 비동기로 수신합니다.</p>
        </div>

        <div class="feature-item">
          <span class="f-title">토스 디자인 시스템 (TDS) UI 스펙</span>
          <p class="f-desc">시그니처 컬러(#3182f6), 16px 둥근 카드, 직관적인 텍스트 레이블로 사용자 경험을 최적화했습니다.</p>
        </div>
      </div>

      <div class="action-row">
        <el-button type="primary" size="large" style="width: 100%" @click="handleGoHome">
          메인 대시보드로 돌아가기
        </el-button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.toss-about-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.page-title-box {
  margin-bottom: 8px;
}

.page-title {
  margin: 0 0 4px 0;
  font-size: 22px;
  font-weight: 700;
  color: var(--toss-foreground);
}

.page-desc {
  margin: 0;
  font-size: 14px;
  color: var(--toss-muted);
}

.about-card {
  background: var(--toss-canvas);
  border: 1px solid var(--toss-border);
  border-radius: 16px;
  padding: 24px;
}

.card-section-title {
  margin: 0 0 16px 0;
  font-size: 18px;
  font-weight: 700;
  color: var(--toss-foreground);
}

.feature-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;
}

.feature-item {
  background: var(--toss-surface);
  padding: 16px;
  border-radius: 12px;
}

.f-title {
  font-size: 15px;
  font-weight: 700;
  color: var(--toss-foreground);
  display: block;
  margin-bottom: 4px;
}

.f-desc {
  margin: 0;
  font-size: 14px;
  color: var(--toss-body);
  line-height: 1.5;
}

.action-row {
  margin-top: 16px;
}
</style>
