import { ref } from 'vue'
import axios from 'axios'
import { useConfigStore } from '@/stores/configStore'

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather'

export function useWeatherApi() {
  const isLoading = ref(false)
  const errorMessage = ref('')
  const configStore = useConfigStore()

  // 대한민국 14개 주요 도시 관측소 매핑 딕셔너리
  const cityMapping = {
    city_01: { english: 'Seoul', name: '서울', korean: '서울특별시', coords: '37.5665, 126.9780' },
    city_02: { english: 'Suwon', name: '수원', korean: '경기도 수원시', coords: '37.2636, 127.0286' },
    city_03: { english: 'Busan', name: '부산', korean: '부산광역시', coords: '35.1796, 129.0756' },
    city_04: { english: 'Incheon', name: '인천', korean: '인천광역시', coords: '37.4563, 126.7052' },
    city_05: { english: 'Daegu', name: '대구', korean: '대구광역시', coords: '35.8714, 128.6014' },
    city_06: { english: 'Daejeon', name: '대전', korean: '대전광역시', coords: '36.3510, 127.3850' },
    city_07: { english: 'Gwangju', name: '광주', korean: '광주광역시', coords: '35.1595, 126.8526' },
    city_08: { english: 'Ulsan', name: '울산', korean: '울산광역시', coords: '35.5384, 129.3114' },
    city_09: { english: 'Jeju-si', name: '제주', korean: '제주특별자치도 제주시', coords: '33.4996, 126.5312' },
    city_10: { english: 'Chuncheon', name: '춘천', korean: '강원특별자치도 춘천시', coords: '37.8813, 127.7298' },
    city_11: { english: 'Gangneung', name: '강릉', korean: '강원특별자치도 강릉시', coords: '37.7519, 128.8761' },
    city_12: { english: 'Jeonju', name: '전주', korean: '전북특별자치도 전주시', coords: '35.8242, 127.1480' },
    city_13: { english: 'Cheongju', name: '청주', korean: '충청북도 청주시', coords: '36.6424, 127.4890' },
    city_14: { english: 'Changwon', name: '창원', korean: '경상남도 창원시', coords: '35.2280, 128.6811' },
  }

  const formatTemperature = (celsiusTemp) => {
    const rawTemp = celsiusTemp ?? 0
    if (configStore.unit === 'fahrenheit') {
      return Math.round((rawTemp * 9) / 5 + 32)
    }
    return Math.round(rawTemp * 10) / 10
  }

  /**
   * 대한민국 전국 14개 주요 도시 실시간 날씨 데이터 병렬 조회
   */
  const fetchRealTimeWeatherList = async () => {
    isLoading.value = true
    errorMessage.value = ''

    try {
      const cityKeys = Object.keys(cityMapping)
      const requests = cityKeys.map((key) =>
        axios.get(`${BASE_URL}?q=${cityMapping[key].english}&appid=${API_KEY}&units=metric&lang=kr`),
      )

      const responses = await Promise.all(requests)

      return responses.map((res, index) => {
        const key = cityKeys[index]
        const cityInfo = cityMapping[key]
        const { main, weather } = res?.data ?? {}
        const [firstWeather] = weather ?? []
        return {
          id: key,
          name: cityInfo.name,
          fullName: cityInfo.korean,
          englishName: cityInfo.english,
          temp: main?.temp ?? 0,
          status: firstWeather?.description ?? '정보 없음',
        }
      })
    } catch (error) {
      console.error('전국 날씨 데이터 조회 오류:', error)
      errorMessage.value = '실시간 날씨 데이터를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.'
      return []
    } finally {
      isLoading.value = false
    }
  }

  /**
   * 단일 도시 상세 날씨 정보 조회
   */
  const fetchCityDetail = async (cityId) => {
    const targetCity = cityMapping[cityId] ?? cityMapping.city_01
    isLoading.value = true
    errorMessage.value = ''

    try {
      const { english, korean, coords } = targetCity
      const response = await axios.get(
        `${BASE_URL}?q=${english}&appid=${API_KEY}&units=metric&lang=kr`,
      )

      const { main, weather, wind, sys } = response?.data ?? {}
      const [firstWeather] = weather ?? []

      return {
        name: korean,
        englishName: english,
        coords,
        temp: main?.temp ?? 0,
        feelsLike: main?.feels_like ?? 0,
        status: firstWeather?.description ?? '정보 없음',
        humidity: `${main?.humidity ?? 0}%`,
        windSpeed: `${wind?.speed ?? 0} m/s`,
        pressure: `${main?.pressure ?? 0} hPa`,
        country: sys?.country ?? 'KR',
      }
    } catch (error) {
      console.error('상세 정보 조회 오류:', error)
      errorMessage.value = '상세 날씨 정보를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.'
      return null
    } finally {
      isLoading.value = false
    }
  }

  return {
    isLoading,
    errorMessage,
    cityMapping,
    formatTemperature,
    fetchRealTimeWeatherList,
    fetchCityDetail,
  }
}
