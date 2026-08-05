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
      <p class="page-desc">날씨 인사이트가 제공하는 서비스와 기능을 소개합니다.</p>
    </div>

    <div class="about-card">
      <div class="intro-banner">
        <h3 class="intro-headline">한눈에 확인하는 기상 & 대기 환경 대시보드</h3>
        <p class="intro-text">
          날씨 인사이트는 매일의 일상과 야외 활동을 차질 없이 준비할 수 있도록<br />
          전국 주요 지역의 실시간 날씨, 5일간의 기상 예보, 미세먼지 정보를 직관적으로 전달하는 서비스입니다.
        </p>
      </div>

      <div class="services-grid">
        <div class="service-box">
          <span class="s-title">실시간 기상 정보</span>
          <p class="s-desc">
            서울, 수원, 부산 등 주요 관측소의 현재 기온, 체감 온도, 습도, 풍속 정보를 실시간으로 확인할 수 있습니다.
          </p>
        </div>

        <div class="service-box">
          <span class="s-title">5일 단기 기상 예보</span>
          <p class="s-desc">
            3시간 단위로 세분화된 5일간의 기상 예측 데이터를 제공하여 주간 일정이나 주말 여행을 편리하게 계획할 수 있습니다.
          </p>
        </div>

        <div class="service-box">
          <span class="s-title">통합 대기질 & 미세먼지 분석</span>
          <p class="s-desc">
            미세먼지(PM10) 및 초미세먼지(PM2.5) 수치와 함께 마스크 착용 여부, 실내 환기 가이드 등 실생활 맞춤 수칙을 안내합니다.
          </p>
        </div>

        <div class="service-box">
          <span class="s-title">맞춤형 온도 단위 제공</span>
          <p class="s-desc">
            섭씨(°C)와 화씨(°F) 버전을 자유롭게 전환하여 원하는 단위로 날씨 정보를 확인하실 수 있습니다.
          </p>
        </div>
      </div>

      <div class="action-row">
        <el-button type="primary" size="large" style="width: 100%" @click="handleGoHome">
          날씨 대시보드로 돌아가기
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
  margin-bottom: 4px;
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
  padding: 28px;
}

.intro-banner {
  border-bottom: 1px solid var(--toss-border);
  padding-bottom: 20px;
  margin-bottom: 24px;
}

.intro-headline {
  margin: 0 0 8px 0;
  font-size: 19px;
  font-weight: 700;
  color: var(--toss-blue);
}

.intro-text {
  margin: 0;
  font-size: 15px;
  color: var(--toss-body);
  line-height: 1.6;
}

.services-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 16px;
  margin-bottom: 28px;
}

.service-box {
  background: var(--toss-surface);
  padding: 18px;
  border-radius: 14px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.s-title {
  font-size: 15px;
  font-weight: 700;
  color: var(--toss-foreground);
}

.s-desc {
  margin: 0;
  font-size: 13px;
  color: var(--toss-body);
  line-height: 1.5;
}

.action-row {
  margin-top: 12px;
}
</style>
