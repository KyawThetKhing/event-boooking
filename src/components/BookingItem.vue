<template>
  <SectionCard>
    <div class="flex justify-between items-center">
      <div>
        {{ title }}
      </div>
      <RoundButton @click="$emit('cancel')" variant="danger">Cancel</RoundButton>
    </div>
  </SectionCard>
</template>

<script setup>
import SectionCard from '@/components/SectionCard.vue'
import RoundButton from '@/components/RoundButton.vue'

defineProps({
  title: String,
})

defineEmits(['cancel'])
</script>
