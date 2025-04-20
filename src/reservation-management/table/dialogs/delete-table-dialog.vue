<script setup lang="ts">
import { ref, watch } from 'vue';
import { TableRepository } from '../../domain/repositories/TableRepository';
import type { Table } from '../../domain/interfaces/Table';
import { useNotificationStore } from '../../../stores/notification';

const props = defineProps({
  modelValue: Boolean,
  table: {
    type: Object as () => Table,
    required: true
  }
});

const emit = defineEmits(['update:modelValue', 'table-deleted']);
const repository = new TableRepository();
const notificationStore = useNotificationStore();

const loading = ref(false);

const resetState = () => {
  loading.value = false;
};

const handleConfirm = async () => {
  if (loading.value) return;
  loading.value = true;

  if (props.table.id === undefined) {
    notificationStore.error('Error: ID de mesa no válido');
    loading.value = false;
    return;
  }

  try {
    await repository.delete(props.table.id);
    notificationStore.success('Mesa eliminada');
    setTimeout(() => {
      emit('table-deleted');
      emit('update:modelValue', false);
    }, 1000);
  } catch (err) {
    notificationStore.error('Error al eliminar mesa');
    console.error(err);
  } finally {
    loading.value = false;
  }
};

watch(() => props.modelValue, (newVal) => {
  if (!newVal) resetState();
});
</script>

<template>
  <v-dialog
      :model-value="modelValue"
      @update:model-value="$emit('update:modelValue', $event)"
      max-width="500px"
      persistent
  >
    <v-card>
      <v-card-title class="text-h5 primary white--text">
        Eliminar Mesa
      </v-card-title>
      
      <v-card-text class="mt-4">
        <!-- Alertas manejadas por NotificationSystem -->
        
        <p class="text-body-1">
          ¿Está seguro de eliminar la mesa 
          <strong>{{ table.tableNumber }}</strong>?
          Esta acción no se puede deshacer.
        </p>
      </v-card-text>
      
      <v-card-actions>
        <v-spacer />
        <v-btn
          variant="text"
          @click="$emit('update:modelValue', false)"
          :disabled="loading"
        >
          Cancelar
        </v-btn>
        <v-btn
          color="error"
          @click="handleConfirm"
          :loading="loading"
        >
          Eliminar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>