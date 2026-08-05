import { ref } from 'vue'
import axios from 'axios'
import { useConfigStore } from '@/stores/configStore'

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather'

export function useWeatherApi() {
  const isLoading = ref(false)
  const errorMessage = ref('')
  const configStore = useConfigStore()

  // 도시별 매핑 딕셔너리
  const cityMapping = {
    city_01: { english: 'Seoul', korean: '대한민국 서울특별시', coords: '37.5665, 126.9780' },
    city_02: { english: 'Suwon', korean: '경기도 수원시 영통구', coords: '37.2636, 127.0286' },
    city_03: { english: 'Busan', korean: '부산광역시 해운대구', coords: '35.1796, 129.0756' },
  }

  /**
   * 섭씨 온도를 설정된 단위(섭씨/화씨)에 맞춰 변환하는 순수 유틸리티 함수
   */
  const formatTemperature = (celsiusTemp) => {
    const rawTemp = celsiusTemp ?? 0
    if (configStore.unit === 'fahrenheit') {
      return Math.round((rawTemp * 9) / 5 + 32)
    }
    return Math.round(rawTemp * 10) / 10
  }

  /**
   * 메인 대시보드용 3개 주요 도시 실시간 날씨 데이터 조회
   */
  const fetchRealTimeWeatherList = async () => {
    isLoading.value = true
    errorMessage.value = ''

    try {
      const [seoulRes, suwonRes, busanRes] = await Promise.all([
        axios.get(`${BASE_URL}?q=Seoul&appid=${API_KEY}&units=metric&lang=kr`),
        axios.get(`${BASE_URL}?q=Suwon&appid=${API_KEY}&units=metric&lang=kr`),
        axios.get(`${BASE_URL}?q=Busan&appid=${API_KEY}&units=metric&lang=kr`),
      ])

      const parseCity = (id, name, res) => {
        const { main, weather } = res?.data ?? {}
        const [firstWeather] = weather ?? []
        return {
          id,
          name,
          temp: main?.temp ?? 0,
          status: firstWeather?.description ?? '정보 없음',
        }
      }

      return [
        parseCity('city_01', '서울', seoulRes),
        parseCity('city_02', '수원', suwonRes),
        parseCity('city_03', '부산', busanRes),
      ]
    } catch (error) {
      console.error('실시간 날씨 데이터 조회 오류:', error)
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
    const targetCity = cityMapping[cityId]
    if (!targetCity) {
      errorMessage.value = '해당 지역의 상세 기상 데이터 장부가 존재하지 않습니다.'
      return null
    }

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
    formatTemperature,
    fetchRealTimeWeatherList,
    fetchCityDetail,
  }
}
