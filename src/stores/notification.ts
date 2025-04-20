/**
 * Pinia store for managing notifications in the application.
 * This store provides methods to add, remove, and manage notifications of various types.
 * Notifications are automatically removed after a specified timeout.
 */

import { defineStore } from 'pinia';
import { ref } from 'vue';

/**
 * Interface representing a notification object.
 */
export interface Notification {
  /**
   * Unique identifier for the notification.
   */
  id: string;

  /**
   * The message to be displayed in the notification.
   */
  message: string;

  /**
   * The type of the notification, which determines its visual style.
   * Can be one of: 'success', 'error', 'info', or 'warning'.
   */
  type: 'success' | 'error' | 'info' | 'warning';

  /**
   * The duration (in milliseconds) for which the notification is displayed.
   * If not specified, a default timeout of 5000ms is used.
   */
  timeout?: number;
}

/**
 * Pinia store definition for managing notifications.
 */
export const useNotificationStore = defineStore('notification', () => {
  /**
   * Reactive array to store the list of notifications.
   */
  const notifications = ref<Notification[]>([]);

  /**
   * Adds a new notification to the store.
   * Automatically removes the notification after the specified timeout.
   * @param {Omit<Notification, 'id'>} notification - The notification object without the `id` field.
   * @returns {string} The unique identifier of the added notification.
   */
  function addNotification(notification: Omit<Notification, 'id'>) {
    const id = Date.now().toString();
    const timeout = notification.timeout || 5000;

    notifications.value.push({
      id,
      ...notification,
      timeout
    });


    if (timeout > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, timeout);
    }

    return id;
  }

  /**
   * Removes a notification from the store by its unique identifier.
   * @param {string} id - The unique identifier of the notification to remove.
   */
  function removeNotification(id: string) {
    const index = notifications.value.findIndex(n => n.id === id);
    if (index !== -1) {
      notifications.value.splice(index, 1);
    }
  }

  /**
   * Clears all notifications from the store.
   */
  function clearAll() {
    notifications.value = [];
  }

  /**
   * Adds a success notification.
   * @param {string} message - The message to display.
   * @param {number} [timeout=5000] - The duration for which the notification is displayed.
   * @returns {string} The unique identifier of the added notification.
   */
  function success(message: string, timeout = 5000) {
    return addNotification({ message, type: 'success', timeout });
  }

  /**
   * Adds an error notification.
   * @param {string} message - The message to display.
   * @param {number} [timeout=5000] - The duration for which the notification is displayed.
   * @returns {string} The unique identifier of the added notification.
   */
  function error(message: string, timeout = 5000) {
    return addNotification({ message, type: 'error', timeout });
  }

  /**
   * Adds an informational notification.
   * @param {string} message - The message to display.
   * @param {number} [timeout=5000] - The duration for which the notification is displayed.
   * @returns {string} The unique identifier of the added notification.
   */
  function info(message: string, timeout = 5000) {
    return addNotification({ message, type: 'info', timeout });
  }

  /**
   * Adds a warning notification.
   * @param {string} message - The message to display.
   * @param {number} [timeout=5000] - The duration for which the notification is displayed.
   * @returns {string} The unique identifier of the added notification.
   */
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