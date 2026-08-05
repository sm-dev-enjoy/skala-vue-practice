import { ref } from 'vue'
import axios from 'axios'

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY
const FORECAST_URL = 'https://api.openweathermap.org/data/2.5/forecast'

export function useForecast() {
  const isLoading = ref(false)
  const errorMessage = ref('')
  const forecastList = ref([])

  const fetchForecast = async (cityName) => {
    isLoading.value = true
    errorMessage.value = ''

    try {
      const response = await axios.get(
        `${FORECAST_URL}?q=${cityName}&appid=${API_KEY}&units=metric&lang=kr`,
      )

      const { list } = response?.data ?? {}
      
      forecastList.value = (list ?? []).slice(0, 12).map((item) => {
        const { dt_txt, main, weather, wind } = item ?? {}
        const [firstWeather] = weather ?? []
        return {
          time: dt_txt ?? '',
          temp: main?.temp ?? 0,
          feelsLike: main?.feels_like ?? 0,
          humidity: main?.humidity ?? 0,
          description: firstWeather?.description ?? '정보 없음',
          icon: firstWeather?.icon ?? '01d',
          windSpeed: wind?.speed ?? 0,
        }
      })
    } catch (error) {
      console.error('5일 일기예보 통신 오류:', error)
      errorMessage.value = '일기예보 정보를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.'
      forecastList.value = []
    } finally {
      isLoading.value = false
    }
  }

  return {
    isLoading,
    errorMessage,
    forecastList,
    fetchForecast,
  }
}
