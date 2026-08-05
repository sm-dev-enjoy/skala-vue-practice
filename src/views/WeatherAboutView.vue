<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const handleGoHome = () => {
  router.push('/')
}
</script>

<template>
  <el-card class="about-card" shadow="never">
    <template #header>
      <div class="about-header">
        <h3>ℹ️ 서비스 및 시스템 기술 아키텍처</h3>
        <el-tag type="info" size="small">Vue 3 + Vite</el-tag>
      </div>
    </template>

    <div class="about-intro">
      <p>
        본 애플리케이션은 <strong>Vue 3 Composition API</strong> 및 <strong>OpenWeatherMap REST API</strong>를 기반으로 구축된 기상 관측 및 통합 대기 환경 분석 시스템입니다.
      </p>
    </div>

    <el-divider content-position="left">핵심 기술 구현 포인트</el-divider>

    <el-timeline style="padding-left: 8px">
      <el-timeline-item timestamp="UI & Design System" placement="top" type="primary">
        <el-card shadow="hover">
          <h4>Element Plus & Design System</h4>
          <p>Vanilla CSS 기반 토큰과 Element Plus 컴포넌트를 조화시켜 직관적이고 반응성 높은 인터페이스를 구성했습니다.</p>
        </el-card>
      </el-timeline-item>

      <el-timeline-item timestamp="State & Routing" placement="top" type="success">
        <el-card shadow="hover">
          <h4>Pinia & Vue Router 4</h4>
          <p>전역 온도 단위(섭씨/화씨) 상태 관리 및 URL 쿼리 파라미터 기반의 동적 필터링을 완벽하게 동기화했습니다.</p>
        </el-card>
      </el-timeline-item>

      <el-timeline-item timestamp="Modern JS (ES6+)" placement="top" type="warning">
        <el-card shadow="hover">
          <h4>Modern JavaScript 문법 적용</h4>
          <p>Destructuring(구조분해 할당), Spread operator(전개 연산자), Optional chaining(?.), Nullish coalescing(??) 등의 문법을 적극 적용하여 안전하고 가독성 높은 코드를 작성했습니다.</p>
        </el-card>
      </el-timeline-item>
    </el-timeline>

    <div class="action-footer">
      <el-button type="primary" size="large" style="width: 100%" @click="handleGoHome">
        대시보드 홈으로 이동
      </el-button>
    </div>
  </el-card>
</template>

<style scoped>
.about-card {
  border-radius: 8px;
}

.about-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.about-header h3 {
  margin: 0;
  font-size: 1.15rem;
}

.about-intro {
  color: #475569;
  line-height: 1.6;
  font-size: 0.95rem;
}

.action-footer {
  margin-top: 24px;
}
</style>
