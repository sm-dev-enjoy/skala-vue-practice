<script setup>
import { ref, watch } from 'vue'

const emit = defineEmits(['update-query'])

const props = defineProps({
  currentQuery: {
    type: String,
    default: '',
  },
})

const localQuery = ref(props.currentQuery)

watch(
  () => props.currentQuery,
  (nextQuery) => {
    localQuery.value = nextQuery
  },
)

watch(localQuery, (nextQuery) => {
  emit('update-query', nextQuery)
})
</script>

<template>
  <div class="search-inner">
    <h3>🔍 도시 검색</h3>
    <input v-model.trim.lazy="localQuery" type="text" placeholder="검색할 도시 이름 입력" />
    <p>
      검색 중인 도시: <strong>{{ localQuery }}</strong>
    </p>
  </div>
</template>

<style scoped>
.search-inner {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

input {
  width: 100%;
  box-sizing: border-box;
  padding: 10px 12px;
  border: 1px solid #cfd8e3;
  border-radius: 8px;
  font-size: 1rem;
}

p {
  margin: 0;
  color: #41566f;
}
</style>
