<template>
  <div class="about-container">
    <header class="page-title-box">
      <h1 class="page-title">서비스 안내</h1>
      <p class="page-desc">날씨 인사이트에서 제공하는 정보의 범위와 확인 방법을 안내합니다.</p>
    </header>

    <section class="about-card" aria-labelledby="about-intro-title">
      <div class="intro-banner">
        <p class="eyebrow">오늘의 외출과 일정을 위한 빠른 확인</p>
        <h2 id="about-intro-title">날씨, 예보, 대기질을 필요한 순서로 확인하세요</h2>
        <p>
          먼저 현재 날씨에서 도시를 고르고, 일정이 있다면 5일 예보에서 날짜별 시간대를 살펴보세요.
          대기질 정보는 외출 전 참고용으로 함께 확인할 수 있습니다.
        </p>
      </div>

      <section aria-labelledby="features-title">
        <h2 id="features-title" class="section-heading">할 수 있는 일</h2>
        <div class="services-grid">
          <article class="service-box">
            <h3>현재 날씨 비교</h3>
            <p>
              14개 주요 도시의 현재 기온과 날씨 상태를 보고, 카드를 선택해 상세 관측값을 확인할 수
              있습니다.
            </p>
          </article>
          <article class="service-box">
            <h3>날짜별 예보 확인</h3>
            <p>
              도시와 날짜를 선택하면 3시간 단위 기온, 습도, 풍속, 강수 확률을 한국 표준시 기준으로
              볼 수 있습니다.
            </p>
          </article>
          <article class="service-box">
            <h3>대기질 참고</h3>
            <p>
              대기질 단계와 PM2.5·PM10 등 물질별 수치를 제공합니다. 건강 관련 판단은 공식 안내를
              우선해 주세요.
            </p>
          </article>
          <article class="service-box">
            <h3>표시 단위 유지</h3>
            <p>
              상단에서 섭씨와 화씨를 전환할 수 있으며, 선택한 단위는 다음 방문 때에도 유지됩니다.
            </p>
          </article>
        </div>
      </section>

      <aside class="data-note" aria-labelledby="data-note-title">
        <h2 id="data-note-title">데이터 관련 안내</h2>
        <p>
          날씨·예보·대기질 정보는 OpenWeather API 응답을 바탕으로 표시됩니다. 데이터의 갱신 시각과
          제공 범위는 OpenWeather의 응답 및 요금제에 따라 달라질 수 있습니다.
        </p>
        <a href="https://openweathermap.org/api" target="_blank" rel="noreferrer">
          OpenWeather API 정보 보기 <span aria-hidden="true">↗</span>
        </a>
      </aside>

      <RouterLink class="home-link" to="/">현재 날씨 확인하기</RouterLink>
    </section>
  </div>
</template>

<style scoped>
.about-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.page-title {
  margin: 0 0 4px;
  color: var(--toss-foreground);
  font-size: 24px;
  font-weight: 800;
  letter-spacing: -0.4px;
}

.page-desc {
  margin: 0;
  color: var(--toss-muted);
  font-size: 14px;
  font-weight: 600;
}

.about-card {
  border: 1px solid var(--toss-border);
  border-radius: 18px;
  background: var(--toss-canvas);
  padding: 28px;
}

.intro-banner {
  border-bottom: 1px solid var(--toss-border);
  padding-bottom: 22px;
}

.eyebrow {
  margin: 0 0 6px;
  color: var(--toss-weak-fg);
  font-size: 14px;
  font-weight: 800;
}

.intro-banner h2,
.section-heading,
.data-note h2 {
  margin: 0;
  color: var(--toss-foreground);
  font-size: 20px;
  font-weight: 800;
  letter-spacing: -0.3px;
}

.intro-banner > p:last-child {
  max-width: 680px;
  margin: 10px 0 0;
  color: var(--toss-body);
  font-size: 15px;
  font-weight: 600;
  line-height: 1.7;
}

.section-heading {
  margin-top: 26px;
  font-size: 18px;
}

.services-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  margin-top: 14px;
}

.service-box {
  border: 1px solid #e1e6eb;
  border-radius: 14px;
  background: #ffffff;
  padding: 18px;
}

.service-box h3 {
  margin: 0;
  color: var(--toss-foreground);
  font-size: 15px;
  font-weight: 800;
}

.service-box p {
  margin: 8px 0 0;
  color: var(--toss-body);
  font-size: 14px;
  font-weight: 600;
  line-height: 1.6;
}

.data-note {
  margin-top: 22px;
  border: 1px solid #b9d4f4;
  border-radius: 14px;
  background: #f4f8ff;
  padding: 18px;
}

.data-note h2 {
  font-size: 16px;
}

.data-note p {
  margin: 8px 0 10px;
  color: var(--toss-body);
  font-size: 14px;
  font-weight: 600;
  line-height: 1.6;
}

.data-note a {
  color: var(--toss-blue);
  font-size: 14px;
  font-weight: 800;
  text-decoration: underline;
  text-underline-offset: 3px;
}

.home-link {
  display: flex;
  min-height: 46px;
  align-items: center;
  justify-content: center;
  margin-top: 24px;
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

@media (max-width: 640px) {
  .about-card {
    padding: 20px;
  }

  .services-grid {
    grid-template-columns: 1fr;
  }
}
</style>
