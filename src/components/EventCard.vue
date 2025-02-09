<script setup>
import RoundButton from '@/components/RoundButton.vue'
import SectionCard from '@/components/SectionCard.vue'

defineProps({
  title: String,
  when: String,
  description: String,
})
defineEmits(['register'])
</script>

<template>
  <SectionCard>
    <template #header>{{ title }}</template>
    <template #default>
      {{ when }}
    </template>
    <template #footer>
      <div class="scroll-py-4">
        <p>{{ description }}</p>
        <div class="flex justify-end">
          <RoundButton label="Register" @click="$emit('register')">Register</RoundButton>
        </div>
      </div>
    </template>
  </SectionCard>
</template>

<!-- <style scoped></style> -->
