import { computed, ref } from 'vue'

export function useWeatherSearch() {
  const weatherList = ref([])
  const searchQuery = ref('')

  const filteredWeatherList = computed(() => {
    const query = searchQuery.value.trim()
    if (!query) return weatherList.value

    return weatherList.value.filter((item) => item.name.includes(query))
  })

  return {
    weatherList,
    searchQuery,
    filteredWeatherList,
  }
}
