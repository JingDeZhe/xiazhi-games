<script setup>
import AppContent from './components/AppContent.vue'
</script>

<template>
  <n-modal-provider>
    <n-notification-provider>
      <n-message-provider>
        <AppContent></AppContent>
      </n-message-provider>
    </n-notification-provider>
  </n-modal-provider>
</template>
