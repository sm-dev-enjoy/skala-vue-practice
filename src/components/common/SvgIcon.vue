<script setup>
import { computed } from 'vue'

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  size: {
    type: [Number, String],
    default: 18,
  },
  color: {
    type: String,
    default: 'currentColor',
  },
  strokeWidth: {
    type: [Number, String],
    default: 2,
  },
})

const sizePx = computed(() => (typeof props.size === 'number' ? `${props.size}px` : props.size))
</script>

<template>
  <svg
    class="svg-icon"
    :width="sizePx"
    :height="sizePx"
    viewBox="0 0 24 24"
    fill="none"
    :stroke="color"
    :stroke-width="strokeWidth"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <!-- Sun (맑음) -->
    <g v-if="name === 'sun'">
      <circle cx="12" cy="12" r="4" />
      <path
        d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
      />
    </g>

    <!-- Cloud (구름) -->
    <g v-else-if="name === 'cloud'">
      <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9z" />
    </g>

    <!-- Rain (비) -->
    <g v-else-if="name === 'rain'">
      <path d="M16 13a5 5 0 0 0-9-3 6 6 0 0 0 0 12h9a5 5 0 0 0 0-10z" />
      <path d="M8 19v2M12 19v2M16 19v2" />
    </g>

    <!-- Droplet (습도) -->
    <g v-else-if="name === 'droplet'">
      <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
    </g>

    <!-- Wind (풍속) -->
    <g v-else-if="name === 'wind'">
      <path
        d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2"
      />
    </g>

    <!-- Thermometer (온도) -->
    <g v-else-if="name === 'thermometer'">
      <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z" />
    </g>

    <!-- Gauge (기압/지수) -->
    <g v-else-if="name === 'gauge'">
      <path d="M12 15l3.5-3.5" />
      <path d="M20.3 18a9 9 0 1 0-16.6 0" />
    </g>

    <!-- MapPin (위치) -->
    <g v-else-if="name === 'map-pin'">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </g>

    <!-- Refresh (새로고침) -->
    <g v-else-if="name === 'refresh'">
      <path d="M23 4v6h-6M1 20v-6h6" />
      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
    </g>

    <!-- ArrowRight (화살표) -->
    <g v-else-if="name === 'arrow-right'">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </g>

    <!-- Sparkles (하이라이트) -->
    <g v-else-if="name === 'sparkles'">
      <path
        d="M12 3l1.912 5.813a2 2 0 0 0 1.275 1.275L21 12l-5.813 1.912a2 2 0 0 0-1.275 1.275L12 21l-1.912-5.813a2 2 0 0 0-1.275-1.275L3 12l5.813-1.912a2 2 0 0 0 1.275-1.275L12 3z"
      />
    </g>

    <!-- Air (대기) -->
    <g v-else-if="name === 'air'">
      <path d="M6 12h12M4 8h16M8 16h8" />
    </g>

    <!-- Search (검색) -->
    <g v-else-if="name === 'search'">
      <circle cx="11" cy="11" r="6" />
      <path d="m16 16 4 4" />
    </g>
  </svg>
</template>

<style scoped>
.svg-icon {
  display: inline-block;
  vertical-align: middle;
  flex-shrink: 0;
}
</style>
