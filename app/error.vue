<script setup lang="ts">
defineProps<{
  propName: string;
}>();
</script>

<template>
  <div>
    Hello {{ propName }}
  </div>
</template>
