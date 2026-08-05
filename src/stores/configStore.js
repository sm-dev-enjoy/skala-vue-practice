import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

const STORAGE_KEY = 'weather-insight:temperature-unit'
const validUnits = new Set(['celsius', 'fahrenheit'])

const getSavedUnit = () => {
  try {
    const savedUnit = window.localStorage.getItem(STORAGE_KEY)
    return validUnits.has(savedUnit) ? savedUnit : 'celsius'
  } catch {
    return 'celsius'
  }
}

export const useConfigStore = defineStore('config', () => {
  const unit = ref(getSavedUnit())

  const unitSymbol = computed(() => (unit.value === 'celsius' ? '°C' : '°F'))

  const setUnit = (nextUnit) => {
    if (!validUnits.has(nextUnit)) return

    unit.value = nextUnit

    try {
      window.localStorage.setItem(STORAGE_KEY, nextUnit)
    } catch {
      // 저장소 접근이 제한된 환경에서는 현재 세션에서만 단위를 유지합니다.
    }
  }

  const toggleUnit = () => {
    setUnit(unit.value === 'celsius' ? 'fahrenheit' : 'celsius')
  }

  return {
    unit,
    unitSymbol,
    setUnit,
    toggleUnit,
  }
})
