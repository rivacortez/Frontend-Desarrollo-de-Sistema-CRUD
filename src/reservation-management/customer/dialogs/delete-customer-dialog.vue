<script setup lang="ts">
import { ref, watch } from 'vue';
import { CustomerRepository } from '../../domain/repositories/CustomerRepository';
import type { Customer } from '../../domain/interfaces/Customer';
import { useNotificationStore } from '../../../stores/notification';

const props = defineProps({
  modelValue: Boolean,
  customer: {
    type: Object as () => Customer | null,
    default: null
  }
});

const emit = defineEmits(['update:modelValue', 'customer-deleted']);
const repository = new CustomerRepository();
const notificationStore = useNotificationStore();

const loading = ref(false);

const resetState = () => {
  loading.value = false;
};

const handleConfirm = async () => {
  if (loading.value) return;
  loading.value = true;

  if (!props.customer) {
    notificationStore.error('Cliente no válido');
    loading.value = false;
    return;
  }

  if (props.customer.id === undefined) {
    notificationStore.error('ID de cliente no válido');
    loading.value = false;
    return;
  }

  try {
    await repository.delete(props.customer.id);
    notificationStore.success('Cliente eliminado');
    setTimeout(() => {
      emit('customer-deleted');
      emit('update:modelValue', false);
    }, 1000);
  } catch (err) {
    notificationStore.error('Error al eliminar cliente');
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
        Eliminar Cliente
      </v-card-title>

      <v-card-text class="mt-4">
        <p class="text-body-1" v-if="customer">
          ¿Está seguro de eliminar al cliente
          <strong>{{ customer.name }}</strong>?
          Esta acción no se puede deshacer.
        </p>
        <p v-else class="text-body-1">
          Seleccione un cliente para eliminar.
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
            :disabled="!customer"
        >
          Eliminar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>