import { ref, computed, watch, watchEffect } from 'vue'

export function useWeatherSearch() {
  const weatherList = ref([
    { id: 'city_01', name: '서울', temp: 28, status: '맑음' },
    { id: 'city_02', name: '수원', temp: 24, status: '비' },
    { id: 'city_03', name: '부산', temp: 26, status: '구름' },
  ])

  const searchQuery = ref('')
  const selectedCityInfo = ref('카드를 클릭하거나 검색해 보세요.')

  const filteredWeatherList = computed(() => {
    const query = searchQuery.value.trim()
    if (!query) return weatherList.value
    return weatherList.value.filter((item) => item.name.includes(query))
  })

  watch(
    selectedCityInfo,
    (newInfo) => {
      console.log(`👁️‍🗨️ [watch 감지] 상태 바 문구가 업데이트되었습니다 -> "${newInfo}"`)
    },
    { immediate: true },
  )

  watchEffect(() => {
    console.log(
      `🤖 [watchEffect 자동 호출] 현재 검색어 '${searchQuery.value}'에 매칭되는 API 데이터를 필터링합니다.`,
    )
  })

  const updateQuery = (query) => {
    searchQuery.value = query
  }

  const selectCity = (message) => {
    selectedCityInfo.value = message
  }

  return {
    weatherList,
    searchQuery,
    selectedCityInfo,
    filteredWeatherList,
    updateQuery,
    selectCity,
  }
}
