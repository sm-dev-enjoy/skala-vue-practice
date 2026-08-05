<template>
  <div class="toss-not-found">
    <div class="not-found-card">
      <p class="error-code" aria-hidden="true">404</p>
      <h1 class="error-title">요청하신 페이지를 찾을 수 없습니다</h1>
      <p class="error-desc">주소가 잘못되었거나 더 이상 제공되지 않는 페이지입니다.</p>

      <RouterLink class="home-link" to="/">현재 날씨로 이동하기</RouterLink>
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

.home-link {
  display: flex;
  min-height: 46px;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  background: var(--toss-blue);
  color: #ffffff;
  font-size: 15px;
  font-weight: 800;
}

.home-link:hover {
  background: var(--toss-blue-hover);
  color: #ffffff;
}
</style>
