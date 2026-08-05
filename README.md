# ☀️ 날씨 인사이트 (Weather Insight)

> **대한민국 전국 14개 주요 도시의 실시간 날씨, 5일간의 단기 기상 예보, 통합 대기질(AQI) 정보를 한눈에 제공하는 직관적인 대시보드 웹 애플리케이션입니다.**

🌐 **서비스 바로가기 (배포 링크)**: [https://weather-pro-chi.vercel.app](https://weather-pro-chi.vercel.app/)

---

## 📌 주요 화면 및 핵심 기능

### 1. 실시간 날씨 대시보드 (메인)
![실시간 날씨 대시보드](docs/images/preview_home.png)
- **전국 14개 주요 관측소 기상 현황**: 서울, 부산, 인천, 대구, 대전, 광주, 울산, 수원, 제주, 춘천, 강릉, 전주, 청주, 창원 등 전국 거점 도시의 기온, 체감 온도, 날씨 상태를 한눈에 파악할 수 있습니다.
- **인터랙티브 관측소 카드**: 카드를 클릭하면 살짝 눌리는 Active 애니메이션과 함께 해당 관측소의 상세 분석 페이지로 즉시 이동합니다.
- **실시간 도시 검색**: 검색창에 도시명을 입력하면 매칭되는 도시 카드가 실시간 필터링됩니다.

---

### 2. 5일 기상 예보
![5일 기상 예보](docs/images/preview_forecast.png)
- **동적 날짜 필터 탭**: 5일간 3시간 단위 예측 데이터(총 40개 예보 항목)를 날짜 탭(8/5, 8/6, 8/7, 8/8...)으로 클릭 한 번에 선택하여 손쉽게 탐색할 수 있습니다.
- **직관적인 상태 뱃지 칩**: 맑음(오렌지/골드 뱃지), 비(청량한 딥 블루 뱃지), 구름(슬레이트 뱃지) 등 날씨 상태별 시각적 뱃지와 라인 아트 SVG 아이콘으로 시인성을 극대화했습니다.

---

### 3. 대기질 및 미세먼지 분석
![대기질 분석](docs/images/preview_air.png)
- **통합 대기 오염 지수 (AQI)**: 1~5 단계별 오염 지수를 서클 프로그레스 게이지로 시각화합니다.
- **실생활 맞춤 행동 가이드**: 단순 수치 제공을 넘어 마스크 착용 권장, 실내 환기 적정성, 야외 활동 가이드 등 실용적인 행동 수칙을 안내합니다.
- **세부 오염 물질 측정**: 초미세먼지(PM2.5), 미세먼지(PM10), 이산화질소(NO2), 오존(O3), 일산화탄소(CO)의 상세 수치를 정돈된 카드로 제공합니다.

---

### 4. 서비스 소개 및 맞춤형 설정
![서비스 소개](docs/images/preview_about.png)
- **온도 단위 원클릭 전환**: 상단 토글 버튼을 통해 섭씨(`°C`)와 화씨(`°F`) 단위를 원클릭으로 변환할 수 있습니다.
- **직관적인 사용자 안내**: 서비스 특징과 활용 방안을 유저 관점의 친근한 톤앤매너로 안내합니다.

---

## 🛠 기술 스택 (Tech Stack)

- **Framework**: Vue 3 (Composition API / `<script setup>`)
- **State Management**: Pinia
- **Routing**: Vue Router 4 (페이지 라우팅 & 브라우저 탭 타이틀 관리)
- **UI & Design**: Element Plus, Toss Design System (TDS), Custom Line Art SVG Icons
- **HTTP Client**: Axios (`Promise.allSettled` 예외 방어 파이프라인)
- **Build Tool**: Vite 8
- **Deployment**: Vercel

---

## 🚀 프로젝트 실행 및 빌드

### 환경 변수 설정
프로젝트 루트 디렉토리에 `.env.local` 파일 생성 후 OpenWeather API 키를 설정합니다.

```env
VITE_OPENWEATHER_API_KEY=your_openweather_api_key_here
```

### 명령 구동
```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# Code Lint 검사
npm run lint

# 프로덕션 빌드
npm run build
```
