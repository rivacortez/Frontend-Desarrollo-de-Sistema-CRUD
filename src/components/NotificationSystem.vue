<script setup lang="ts">
import { useNotificationStore } from '../stores/notification';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';

const store = useNotificationStore();
const { notifications } = storeToRefs(store);

const positionStyle = computed(() => ({
  position: 'fixed',
  top: '20px',
  right: '20px',
  zIndex: 9999,
  maxWidth: '400px',
  width: '100%'
}));
</script>

<template>
  <div class="notification-container" :style="positionStyle">
    <v-slide-y-transition group>
      <v-alert
        v-for="notification in notifications"
        :key="notification.id"
        :type="notification.type"
        variant="elevated"
        closable
        :border="'start'"
        elevation="8"
        class="mb-3 custom-alert"
        @click:close="store.removeNotification(notification.id)"
      >
        <template #prepend>
          <v-icon>
            {{
              notification.type === 'success' ? 'mdi-check-circle' :
              notification.type === 'error' ? 'mdi-alert-circle' :
              notification.type === 'warning' ? 'mdi-alert' :
              'mdi-information'
            }}
          </v-icon>
        </template>
        {{ notification.message }}
      </v-alert>
    </v-slide-y-transition>
  </div>
  
</template>

<style scoped>
.notification-container {
  pointer-events: none;
}

.notification-container .v-alert {
  pointer-events: auto;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.custom-alert {
  font-size: 0.95rem;
}
</style>
