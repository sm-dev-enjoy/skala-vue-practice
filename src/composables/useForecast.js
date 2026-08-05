import { ref } from 'vue'
import axios from 'axios'
import { cities } from '@/constants/cities'

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY
const FORECAST_URL = 'https://api.openweathermap.org/data/2.5/forecast'
const REQUEST_TIMEOUT = 10000

const asNumberOrNull = (value) => (typeof value === 'number' ? value : null)

const getErrorMessage = (error) => {
  if (!API_KEY) {
    return '예보 데이터 연결 설정을 확인 중입니다. 잠시 후 다시 시도해 주세요.'
  }

  if (error?.code === 'ECONNABORTED') {
    return '예보 응답이 지연되고 있습니다. 잠시 후 다시 시도해 주세요.'
  }

  if (error?.response?.status === 429) {
    return '요청이 많아 예보를 잠시 불러올 수 없습니다. 잠시 후 다시 시도해 주세요.'
  }

  return '예보 정보를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.'
}

export function useForecast() {
  const isLoading = ref(false)
  const errorMessage = ref('')
  const forecastList = ref([])
  const observedAt = ref(null)

  let requestId = 0

  const fetchForecast = async (englishCityName) => {
    const city = cities.find((item) => item.englishName === englishCityName)
    const currentRequestId = ++requestId
    isLoading.value = true
    errorMessage.value = ''

    if (!city) {
      errorMessage.value = '선택한 도시를 찾을 수 없습니다.'
      isLoading.value = false
      forecastList.value = []
      return []
    }

    try {
      if (!API_KEY) {
        throw new Error('Missing OpenWeather API key')
      }

      const response = await axios.get(FORECAST_URL, {
        params: {
          lat: city.lat,
          lon: city.lon,
          appid: API_KEY,
          units: 'metric',
          lang: 'kr',
        },
        timeout: REQUEST_TIMEOUT,
      })

      if (currentRequestId !== requestId) return []

      const { list } = response?.data ?? {}
      const normalizedList = (list ?? []).map((item) => {
        const { dt, main, weather, wind, pop } = item ?? {}
        const [firstWeather] = weather ?? []

        return {
          timestamp: asNumberOrNull(dt),
          temp: asNumberOrNull(main?.temp),
          humidity: asNumberOrNull(main?.humidity),
          description: firstWeather?.description ?? '정보 없음',
          windSpeed: asNumberOrNull(wind?.speed),
          precipitationProbability: asNumberOrNull(pop),
        }
      })

      forecastList.value = normalizedList
      observedAt.value = new Date()
      return normalizedList
    } catch (error) {
      if (currentRequestId === requestId) {
        errorMessage.value = getErrorMessage(error)
        forecastList.value = []
        observedAt.value = null
      }
      return []
    } finally {
      if (currentRequestId === requestId) {
        isLoading.value = false
      }
    }
  }

  return {
    isLoading,
    errorMessage,
    forecastList,
    observedAt,
    fetchForecast,
  }
}
