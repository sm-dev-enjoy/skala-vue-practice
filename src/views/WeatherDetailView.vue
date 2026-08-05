<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useConfigStore } from '@/stores/configStore'
import { useWeatherApi } from '@/composables/useWeatherApi'
import StatusAlert from '../components/common/StatusAlert.vue'

const route = useRoute()
const router = useRouter()
const configStore = useConfigStore()

const cityData = ref(null)
const { isLoading, errorMessage, fetchCityDetail, formatTemperature } = useWeatherApi()

const loadDetailData = async () => {
  const cityId = route.params?.cityId
  cityData.value = await fetchCityDetail(cityId)
}

watch(
  () => route.params?.cityId,
  () => {
    loadDetailData()
  },
  { immediate: true },
)

// 온도 연산 유틸 바인딩
const displayTemp = computed(() => formatTemperature(cityData.value?.temp))
const displayFeelsLike = computed(() => formatTemperature(cityData.value?.feelsLike))
</script>

<template>
  <el-card class="detail-card" shadow="never">
    <template #header>
      <div class="detail-header">
        <h3>📊 지역별 상세 기상 관측 정보</h3>
        <el-tag type="success" effect="light">실시간 위성 연동</el-tag>
      </div>
    </template>

    <div v-if="isLoading" class="skeleton-block">
      <el-skeleton :rows="5" animated />
    </div>

    <template v-else>
      <StatusAlert :message="errorMessage" type="warning" />

      <div v-if="cityData" class="detail-content">
        <el-descriptions
          :title="`📍 ${cityData.name} (${cityData.englishName})`"
          :column="2"
          border
          size="large"
        >
          <el-descriptions-item label="실시간 기온">
            <span class="highlight-temp">{{ displayTemp }}{{ configStore.unitSymbol }}</span>
          </el-descriptions-item>

          <el-descriptions-item label="체감 온도">
            {{ displayFeelsLike }}{{ configStore.unitSymbol }}
          </el-descriptions-item>

          <el-descriptions-item label="기상 현황">
            <el-tag type="info" size="small">{{ cityData.status }}</el-tag>
          </el-descriptions-item>

          <el-descriptions-item label="대기 습도">
            {{ cityData.humidity }}
          </el-descriptions-item>

          <el-descriptions-item label="현재 풍속">
            {{ cityData.windSpeed }}
          </el-descriptions-item>

          <el-descriptions-item label="기압">
            {{ cityData.pressure }}
          </el-descriptions-item>

          <el-descriptions-item label="위도 / 경도" :span="2">
            {{ cityData.coords }}
          </el-descriptions-item>
        </el-descriptions>
      </div>
    </template>

    <div class="card-footer">
      <el-button type="info" plain @click="router.push('/')">
        ← 메인 대시보드로 돌아가기
      </el-button>
    </div>
  </el-card>
</template>

<style scoped>
.detail-card {
  border-radius: 8px;
}

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.detail-header h3 {
  margin: 0;
  font-size: 1.15rem;
}

.skeleton-block {
  padding: 20px 0;
}

.detail-content {
  margin-bottom: 24px;
}

.highlight-temp {
  font-size: 1.25rem;
  font-weight: 700;
  color: #0284c7;
}

.card-footer {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>
