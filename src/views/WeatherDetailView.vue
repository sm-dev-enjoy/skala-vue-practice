<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useConfigStore } from '@/stores/configStore'
import axios from 'axios'

const route = useRoute()
const router = useRouter()
const configStore = useConfigStore()

const isLoading = ref(false)
const errorMessage = ref('')

const cityMapping = {
  city_01: { english: 'Seoul', korean: '대한민국 서울특별시' },
  city_02: { english: 'Suwon', korean: '경기도 수원시 영통구' },
  city_03: { english: 'Busan', korean: '부산광역시 해운대구' },
}

const cityData = ref(null)

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY

const fetchDetailWeather = async () => {
  const targetCity = cityMapping[route.params.cityId]

  if (!targetCity) {
    cityData.value = null
    errorMessage.value = '해당 지역의 상세 데이터 장부가 존재하지 않습니다.'
    return
  }

  isLoading.value = true
  errorMessage.value = ''

  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${targetCity.english}&appid=${API_KEY}&units=metric&lang=kr`,
    )

    const raw = response.data
    cityData.value = {
      name: targetCity.korean,
      temp: raw.main.temp,
      status: raw.weather[0].description,
      humidity: `${raw.main.humidity}%`,
      wind: `${raw.wind.speed}m/s`,
    }
  } catch (error) {
    console.error('🔴 상세 정보 로딩 중 네트워크 에러 발생:', error)
    cityData.value = null
    errorMessage.value = '상세 날씨 정보를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.'
  } finally {
    isLoading.value = false
  }
}

watch(
  () => route.params.cityId,
  () => {
    fetchDetailWeather()
  },
  { immediate: true },
)

const displayTemp = computed(() => {
  const rawTemp = cityData.value?.temp ?? 0
  if (configStore.unit === 'fahrenheit') {
    return Math.round((rawTemp * 9) / 5 + 32)
  }
  return rawTemp
})
</script>

<template>
  <div class="detail-container">
    <h3>📊 지역별 상세 기상 관측 정보 (실시간 데이터 연동)</h3>
    <hr />

    <div v-if="isLoading" class="loading-message">
      데이터베이스로부터 상세 정보를 동기화하는 중입니다...
    </div>

    <template v-else>
      <div v-if="errorMessage && !cityData" class="error-message">{{ errorMessage }}</div>

      <div v-if="cityData" class="info-card">
        <h4>📍 지정 지역: {{ cityData.name }}</h4>
        <p>
          실시간 기온: <strong>{{ displayTemp }}{{ configStore.unitSymbol }}</strong>
        </p>
        <p>기상 현황: {{ cityData.status }}</p>
        <p>대기 습도: {{ cityData.humidity }}</p>
        <p>현재 풍속: {{ cityData.wind }}</p>
      </div>

      <div v-else-if="!errorMessage">
        <p>해당 지역의 상세 데이터 장부가 존재하지 않습니다.</p>
      </div>
    </template>

    <button @click="router.push('/')" class="back-btn">← 메인 대시보드로 돌아가기</button>
  </div>
</template>

<style scoped>
.detail-container {
  margin: 0 auto;
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}
.info-card {
  background: #f1f2f6;
  padding: 15px;
  border-radius: 6px;
  margin: 15px 0;
}
.loading-message,
.error-message {
  margin: 15px 0;
  padding: 14px;
  border-radius: 6px;
  text-align: center;
}
.loading-message {
  background: #eef6ff;
  color: #2980b9;
}
.error-message {
  background: #fff3f3;
  color: #c0392b;
}
.back-btn {
  padding: 8px 12px;
  background: #2c3e50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>
