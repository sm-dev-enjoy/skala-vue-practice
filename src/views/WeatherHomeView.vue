<script setup>
import { onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import BaseDashboardCard from '../components/exercise/BaseDashboardCard.vue'
import SearchBar from '../components/exercise/SearchBar.vue'
import WeatherCard from '../components/exercise/WeatherCard.vue'
import { useWeatherSearch } from '@/composables/useWeatherSearch'

const route = useRoute()
const router = useRouter()

const { searchQuery, selectedCityInfo, filteredWeatherList, updateQuery, selectCity } =
  useWeatherSearch()

onMounted(() => {
  const query = route.query.search
  searchQuery.value = typeof query === 'string' ? query : ''
})

watch(
  () => route.query.search,
  (nextQuery) => {
    const normalizedQuery = typeof nextQuery === 'string' ? nextQuery : ''
    if (normalizedQuery !== searchQuery.value) {
      searchQuery.value = normalizedQuery
    }
  },
)

watch(searchQuery, (nextQuery) => {
  router.replace({
    path: route.path,
    query: nextQuery ? { search: nextQuery } : {},
  })
})

const handleDetailJump = (cityId) => {
  router.push(`/weather/${cityId}`)
}
</script>

<template>
  <div class="dashboard-page">
    <BaseDashboardCard>
      <template #header>
        <h3>🔍 도시 검색</h3>
      </template>

      <SearchBar :current-query="searchQuery" @update-query="updateQuery" />
    </BaseDashboardCard>

    <BaseDashboardCard>
      <template #header>
        <h3>🏙️ 지역별 날씨 현황</h3>
      </template>

      <WeatherCard
        v-for="item in filteredWeatherList"
        :key="item.id"
        :city-item="item"
        @select-card="selectCity"
        @click-detail="handleDetailJump"
      >
        <template #actions="{ handleDetail }">
          <button class="btn-detail" @click.stop="handleDetail">상세보기</button>
        </template>
      </WeatherCard>

      <p v-if="filteredWeatherList.length === 0" class="empty-result">
        😭 검색 결과와 일치하는 도시가 없습니다.
      </p>

      <template #footer>
        <div class="status-bar">
          {{ selectedCityInfo }}
        </div>
      </template>
    </BaseDashboardCard>
  </div>
</template>

<style scoped>
.dashboard-page {
  width: 100%;
}

.btn-detail {
  padding: 6px 10px;
  cursor: pointer;
}

.empty-result {
  text-align: center;
  color: #e74c3c;
  padding: 10px 0 0;
  margin: 0;
}

.status-bar {
  background: #e8f5e9;
  padding: 10px;
  text-align: center;
  color: #2e7d32;
  font-weight: bold;
  border-radius: 6px;
}
</style>
