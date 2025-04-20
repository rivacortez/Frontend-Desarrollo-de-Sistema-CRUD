import { defineStore } from 'pinia';
import { ref } from 'vue';

export interface Notification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  timeout?: number;
}

export const useNotificationStore = defineStore('notification', () => {
  const notifications = ref<Notification[]>([]);

  function addNotification(notification: Omit<Notification, 'id'>) {
    const id = Date.now().toString();
    const timeout = notification.timeout || 5000; // Default timeout 5 seconds
    
    notifications.value.push({
      id,
      ...notification,
      timeout
    });

    // Auto remove notification after timeout
    if (timeout > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, timeout);
    }

    return id;
  }

  function removeNotification(id: string) {
    const index = notifications.value.findIndex(n => n.id === id);
    if (index !== -1) {
      notifications.value.splice(index, 1);
    }
  }

  function clearAll() {
    notifications.value = [];
  }

  // Helper functions for different notification types
  function success(message: string, timeout = 5000) {
    return addNotification({ message, type: 'success', timeout });
  }

  function error(message: string, timeout = 5000) {
    return addNotification({ message, type: 'error', timeout });
  }

  function info(message: string, timeout = 5000) {
    return addNotification({ message, type: 'info', timeout });
  }

  function warning(message: string, timeout = 5000) {
    return addNotification({ message, type: 'warning', timeout });
  }

  return {
    notifications,
    addNotification,
    removeNotification,
    clearAll,
    success,
    error,
    info,
    warning
  };
});