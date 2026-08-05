<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goHome = () => {
  router.push({ name: 'WeatherHome' })
}
</script>

<template>
  <div class="toss-not-found">
    <div class="not-found-card">
      <h2 class="error-code">404</h2>
      <h3 class="error-title">요청하신 주소를 찾을 수 없습니다</h3>
      <p class="error-desc">
        입력하신 주소가 잘못되었거나 삭제되어 접근할 수 없습니다.
      </p>

      <el-button type="primary" size="large" style="width: 100%" @click="goHome">
        날씨 메인으로 이동하기
      </el-button>
    </div>
  </div>
</template>

<style scoped>
.toss-not-found {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px 0;
}

.not-found-card {
  background: var(--toss-canvas);
  border: 1px solid var(--toss-border);
  border-radius: 20px;
  padding: 40px 32px;
  text-align: center;
  max-width: 440px;
  width: 100%;
}

.error-code {
  font-size: 54px;
  font-weight: 800;
  color: var(--toss-blue);
  margin: 0 0 8px 0;
  line-height: 1;
}

.error-title {
  font-size: 20px;
  font-weight: 700;
  color: var(--toss-foreground);
  margin: 0 0 8px 0;
}

.error-desc {
  font-size: 14px;
  color: var(--toss-muted);
  line-height: 1.5;
  margin: 0 0 28px 0;
}
</style>
