<template>
  <SectionCard>
    <div class="flex justify-between items-center">
      <div class="flex space-x-2">
        <div>
          {{ title }}
        </div>
        <div>
          <component :is="icon" :class="{ 'animate-spin': pending }" />
        </div>
      </div>
      <RoundButton @click="$emit('cancelled')" variant="danger">Cancel</RoundButton>
    </div>
  </SectionCard>
</template>

<script setup>
import { computed } from 'vue'
import SectionCard from '@/components/SectionCard.vue'
import RoundButton from '@/components/RoundButton.vue'
import { LoaderCircle, Check } from 'lucide-vue-next'

const props = defineProps({
  title: String,
  status: String,
})

const pending = computed(() => props.status === 'pending')
const icon = computed(() => (pending.value ? LoaderCircle : Check))
defineEmits(['cancelled'])
</script>
