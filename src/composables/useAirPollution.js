import { ref } from 'vue'
import axios from 'axios'
import { cityByKey } from '@/constants/cities'

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY
const AIR_API_URL = 'https://api.openweathermap.org/data/2.5/air_pollution'
const REQUEST_TIMEOUT = 10000

const asNumberOrNull = (value) => (typeof value === 'number' ? value : null)

const getErrorMessage = (error) => {
  if (!API_KEY) {
    return '대기질 데이터 연결 설정을 확인 중입니다. 잠시 후 다시 시도해 주세요.'
  }

  if (error?.code === 'ECONNABORTED') {
    return '대기질 응답이 지연되고 있습니다. 잠시 후 다시 시도해 주세요.'
  }

  if (error?.response?.status === 429) {
    return '요청이 많아 대기질 정보를 잠시 불러올 수 없습니다. 잠시 후 다시 시도해 주세요.'
  }

  return '대기질 측정 데이터를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.'
}

export function useAirPollution() {
  const isLoading = ref(false)
  const errorMessage = ref('')
  const airData = ref(null)

  let requestId = 0

  const getAqiStatus = (aqi) => {
    const statusMap = {
      1: { label: '매우 좋음', color: '#147a53' },
      2: { label: '좋음', color: '#1469d8' },
      3: { label: '보통', color: '#9a6700' },
      4: { label: '나쁨', color: '#c24a09' },
      5: { label: '매우 나쁨', color: '#bf2636' },
    }
    return statusMap[aqi] ?? { label: '측정 불가', color: '#66717f' }
  }

  const fetchAirPollution = async (cityKey) => {
    const city = cityByKey[cityKey]
    const currentRequestId = ++requestId
    isLoading.value = true
    errorMessage.value = ''
    airData.value = null

    if (!city) {
      errorMessage.value = '선택한 도시를 찾을 수 없습니다.'
      isLoading.value = false
      return null
    }

    try {
      if (!API_KEY) {
        throw new Error('Missing OpenWeather API key')
      }

      const response = await axios.get(AIR_API_URL, {
        params: {
          lat: city.lat,
          lon: city.lon,
          appid: API_KEY,
        },
        timeout: REQUEST_TIMEOUT,
      })

      if (currentRequestId !== requestId) return null

      const { list } = response?.data ?? {}
      const [firstItem] = list ?? []
      const { main, components, dt } = firstItem ?? {}
      const aqi = asNumberOrNull(main?.aqi)

      if (!aqi) {
        errorMessage.value = '대기질 측정 결과가 충분하지 않습니다. 잠시 후 다시 시도해 주세요.'
        return null
      }

      const data = {
        cityName: city.fullName,
        aqi,
        co: asNumberOrNull(components?.co),
        no2: asNumberOrNull(components?.no2),
        o3: asNumberOrNull(components?.o3),
        pm2_5: asNumberOrNull(components?.pm2_5),
        pm10: asNumberOrNull(components?.pm10),
        observedAt: asNumberOrNull(dt),
      }

      airData.value = data
      return data
    } catch (error) {
      if (currentRequestId === requestId) {
        errorMessage.value = getErrorMessage(error)
      }
      return null
    } finally {
      if (currentRequestId === requestId) {
        isLoading.value = false
      }
    }
  }

  return {
    isLoading,
    errorMessage,
    airData,
    getAqiStatus,
    fetchAirPollution,
  }
}
