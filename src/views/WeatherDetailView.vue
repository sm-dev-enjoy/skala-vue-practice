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
const cityData = ref(null)

// 도시 매핑 사전 (전개 연산자로 불변 데이터 참조)
const cityMapping = {
  city_01: { english: 'Seoul', korean: '대한민국 서울특별시', coords: '37.5665, 126.9780' },
  city_02: { english: 'Suwon', korean: '경기도 수원시 영통구', coords: '37.2636, 127.0286' },
  city_03: { english: 'Busan', korean: '부산광역시 해운대구', coords: '35.1796, 129.0756' },
}

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY

/**
 * 라우터 파라미터(cityId)를 기반으로 해당 도시의 상세 기상 관측 정보를 가져옵니다.
 */
const fetchDetailWeather = async () => {
  const { cityId } = route?.params ?? {}
  const targetCity = cityMapping[cityId]

  if (!targetCity) {
    cityData.value = null
    errorMessage.value = '해당 지역의 상세 기상 데이터 장부가 존재하지 않습니다.'
    return
  }

  isLoading.value = true
  errorMessage.value = ''

  try {
    const { english, korean, coords } = targetCity
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${english}&appid=${API_KEY}&units=metric&lang=kr`,
    )

    // ES6+ 구조분해 할당 (Destructuring) 및 Nullish Coalescing 적용
    const { main, weather, wind, sys } = response?.data ?? {}
    const [weatherInfo] = weather ?? []

    cityData.value = {
      name: korean,
      englishName: english,
      coords,
      temp: main?.temp ?? 0,
      feelsLike: main?.feels_like ?? 0,
      tempMin: main?.temp_min ?? 0,
      tempMax: main?.temp_max ?? 0,
      status: weatherInfo?.description ?? '정보 없음',
      humidity: `${main?.humidity ?? 0}%`,
      windSpeed: `${wind?.speed ?? 0} m/s`,
      pressure: `${main?.pressure ?? 0} hPa`,
      country: sys?.country ?? 'KR',
    }
  } catch (error) {
    console.error('상세 정보 통신 에러:', error)
    cityData.value = null
    errorMessage.value = '상세 날씨 정보를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.'
  } finally {
    isLoading.value = false
  }
}

watch(
  () => route.params?.cityId,
  () => {
    fetchDetailWeather()
  },
  { immediate: true },
)

// 화씨 / 섭씨 온도 변환 연산
const displayTemp = computed(() => {
  const rawTemp = cityData.value?.temp ?? 0
  if (configStore.unit === 'fahrenheit') {
    return Math.round((rawTemp * 9) / 5 + 32)
  }
  return Math.round(rawTemp * 10) / 10
})

const displayFeelsLike = computed(() => {
  const rawFeels = cityData.value?.feelsLike ?? 0
  if (configStore.unit === 'fahrenheit') {
    return Math.round((rawFeels * 9) / 5 + 32)
  }
  return Math.round(rawFeels * 10) / 10
})
</script>

<template>
  <el-card class="detail-card" shadow="never">
    <template #header>
      <div class="detail-header">
        <h3>📊 지역별 상세 기상 관측 정보</h3>
        <el-tag type="success" effect="light">실시간 위성 연동</el-tag>
      </div>
    </template>

    <div v-if="isLoading" class="skeleton-block">
      <el-skeleton :rows="5" animated />
    </div>

    <template v-else>
      <el-alert
        v-if="errorMessage"
        :title="errorMessage"
        type="warning"
        show-icon
        :closable="false"
        style="margin-bottom: 20px"
      />

      <div v-if="cityData" class="detail-content">
        <el-descriptions
          :title="`📍 ${cityData.name} (${cityData.englishName})`"
          :column="2"
          border
          size="large"
        >
          <el-descriptions-item label="실시간 기온">
            <span class="highlight-temp">{{ displayTemp }}{{ configStore.unitSymbol }}</span>
          </el-descriptions-item>

          <el-descriptions-item label="체감 온도">
            {{ displayFeelsLike }}{{ configStore.unitSymbol }}
          </el-descriptions-item>

          <el-descriptions-item label="기상 현황">
            <el-tag type="info" size="small">{{ cityData.status }}</el-tag>
          </el-descriptions-item>

          <el-descriptions-item label="대기 습도">
            {{ cityData.humidity }}
          </el-descriptions-item>

          <el-descriptions-item label="현재 풍속">
            {{ cityData.windSpeed }}
          </el-descriptions-item>

          <el-descriptions-item label="기압">
            {{ cityData.pressure }}
          </el-descriptions-item>

          <el-descriptions-item label="위도 / 경도" :span="2">
            {{ cityData.coords }}
          </el-descriptions-item>
        </el-descriptions>
      </div>
    </template>

    <div class="card-footer">
      <el-button type="info" plain @click="router.push('/')">
        ← 메인 대시보드로 돌아가기
      </el-button>
    </div>
  </el-card>
</template>

<style scoped>
.detail-card {
  border-radius: 8px;
}

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.detail-header h3 {
  margin: 0;
  font-size: 1.15rem;
}

.skeleton-block {
  padding: 20px 0;
}

.detail-content {
  margin-bottom: 24px;
}

.highlight-temp {
  font-size: 1.25rem;
  font-weight: 700;
  color: #0284c7;
}

.card-footer {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>
