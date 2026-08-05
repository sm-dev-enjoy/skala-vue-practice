import { ref } from 'vue'
import axios from 'axios'

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY
const AIR_API_URL = 'https://api.openweathermap.org/data/2.5/air_pollution'

export function useAirPollution() {
  const isLoading = ref(false)
  const errorMessage = ref('')
  const airData = ref(null)

  const cityCoords = {
    seoul: { name: '서울특별시', lat: 37.5665, lon: 126.9780 },
    suwon: { name: '수원시', lat: 37.2636, lon: 127.0286 },
    busan: { name: '부산광역시', lat: 35.1796, lon: 129.0756 },
  }

  const getAqiStatus = (aqi) => {
    const statusMap = {
      1: { label: '매우 좋음 🟢', type: 'success', color: '#10b981', percent: 20 },
      2: { label: '좋음 🔵', type: 'primary', color: '#3b82f6', percent: 40 },
      3: { label: '보통 🟡', type: 'warning', color: '#f59e0b', percent: 60 },
      4: { label: '나쁨 🟠', type: 'warning', color: '#f97316', percent: 80 },
      5: { label: '매우 나쁨 🔴', type: 'danger', color: '#ef4444', percent: 100 },
    }
    return statusMap[aqi] ?? { label: '측정 불가', type: 'info', color: '#94a3b8', percent: 0 }
  }

  const fetchAirPollution = async (cityKey) => {
    isLoading.value = true
    errorMessage.value = ''

    try {
      const currentCity = cityCoords[cityKey] ?? cityCoords.seoul
      const { lat, lon, name } = currentCity

      const response = await axios.get(
        `${AIR_API_URL}?lat=${lat}&lon=${lon}&appid=${API_KEY}`,
      )

      const { list } = response?.data ?? {}
      const [firstItem] = list ?? []
      const { main, components } = firstItem ?? {}

      airData.value = {
        cityName: name,
        aqi: main?.aqi ?? 1,
        co: components?.co ?? 0,
        no2: components?.no2 ?? 0,
        o3: components?.o3 ?? 0,
        pm2_5: components?.pm2_5 ?? 0,
        pm10: components?.pm10 ?? 0,
      }
    } catch (error) {
      console.error('대기질 API 조회 실패:', error)
      errorMessage.value = '대기질 측정 데이터를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.'
      airData.value = null
    } finally {
      isLoading.value = false
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
