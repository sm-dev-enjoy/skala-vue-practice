import { ref } from 'vue'
import axios from 'axios'
import { cities, cityById } from '@/constants/cities'
import { useConfigStore } from '@/stores/configStore'

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather'
const REQUEST_TIMEOUT = 10000

const getErrorMessage = (error, serviceName) => {
  if (!API_KEY) {
    return `${serviceName} 연결 설정을 확인 중입니다. 잠시 후 다시 시도해 주세요.`
  }

  if (error?.code === 'ECONNABORTED') {
    return `${serviceName} 응답이 지연되고 있습니다. 잠시 후 다시 시도해 주세요.`
  }

  if (error?.response?.status === 429) {
    return '요청이 많아 데이터를 잠시 불러올 수 없습니다. 잠시 후 다시 시도해 주세요.'
  }

  return `${serviceName} 정보를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.`
}

const asNumberOrNull = (value) => (typeof value === 'number' ? value : null)

export function useWeatherApi() {
  const isLoading = ref(false)
  const errorMessage = ref('')
  const partialFailureMessage = ref('')
  const configStore = useConfigStore()

  let listRequestId = 0
  let detailRequestId = 0

  const formatTemperature = (celsiusTemp) => {
    if (!Number.isFinite(celsiusTemp)) return null

    if (configStore.unit === 'fahrenheit') {
      return Math.round((celsiusTemp * 9) / 5 + 32)
    }

    return Math.round(celsiusTemp * 10) / 10
  }

  const fetchCurrentWeather = (city) =>
    axios.get(BASE_URL, {
      params: {
        lat: city.lat,
        lon: city.lon,
        appid: API_KEY,
        units: 'metric',
        lang: 'kr',
      },
      timeout: REQUEST_TIMEOUT,
    })

  const fetchRealTimeWeatherList = async () => {
    const requestId = ++listRequestId
    isLoading.value = true
    errorMessage.value = ''
    partialFailureMessage.value = ''

    try {
      if (!API_KEY) {
        throw new Error('Missing OpenWeather API key')
      }

      const results = await Promise.allSettled(cities.map(fetchCurrentWeather))

      if (requestId !== listRequestId) return []

      const weatherList = []
      const failedCities = []

      results.forEach((result, index) => {
        const city = cities[index]

        if (result.status !== 'fulfilled') {
          failedCities.push(city.name)
          return
        }

        const { main, weather, dt } = result.value?.data ?? {}
        const [firstWeather] = weather ?? []

        if (!Number.isFinite(main?.temp)) {
          failedCities.push(city.name)
          return
        }

        weatherList.push({
          id: city.id,
          name: city.name,
          fullName: city.fullName,
          englishName: city.englishName,
          temp: asNumberOrNull(main?.temp),
          status: firstWeather?.description ?? '정보 없음',
          observedAt: asNumberOrNull(dt),
        })
      })

      if (weatherList.length === 0) {
        errorMessage.value = '실시간 날씨 정보를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.'
      } else if (failedCities.length > 0) {
        partialFailureMessage.value = `일부 지역(${failedCities.join(', ')})의 정보를 불러오지 못했습니다.`
      }

      return weatherList
    } catch (error) {
      if (requestId === listRequestId) {
        errorMessage.value = getErrorMessage(error, '실시간 날씨')
      }
      return []
    } finally {
      if (requestId === listRequestId) {
        isLoading.value = false
      }
    }
  }

  const fetchCityDetail = async (cityId) => {
    const city = cityById[cityId]
    const requestId = ++detailRequestId
    isLoading.value = true
    errorMessage.value = ''

    if (!city) {
      errorMessage.value = '요청한 관측소를 찾을 수 없습니다.'
      isLoading.value = false
      return null
    }

    try {
      if (!API_KEY) {
        throw new Error('Missing OpenWeather API key')
      }

      const response = await fetchCurrentWeather(city)

      if (requestId !== detailRequestId) return null

      const { main, weather, wind, sys, dt } = response?.data ?? {}
      const [firstWeather] = weather ?? []

      return {
        name: city.name,
        fullName: city.fullName,
        englishName: city.englishName,
        temp: asNumberOrNull(main?.temp),
        feelsLike: asNumberOrNull(main?.feels_like),
        status: firstWeather?.description ?? '정보 없음',
        humidity: asNumberOrNull(main?.humidity),
        windSpeed: asNumberOrNull(wind?.speed),
        pressure: asNumberOrNull(main?.pressure),
        country: sys?.country === 'KR' ? '대한민국' : (sys?.country ?? '정보 없음'),
        observedAt: asNumberOrNull(dt),
      }
    } catch (error) {
      if (requestId === detailRequestId) {
        errorMessage.value = getErrorMessage(error, '상세 날씨')
      }
      return null
    } finally {
      if (requestId === detailRequestId) {
        isLoading.value = false
      }
    }
  }

  return {
    isLoading,
    errorMessage,
    partialFailureMessage,
    formatTemperature,
    fetchRealTimeWeatherList,
    fetchCityDetail,
  }
}
