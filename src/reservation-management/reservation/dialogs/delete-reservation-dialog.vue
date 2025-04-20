<script setup lang="ts">
import { ref, watch } from 'vue';
import { ReservationRepository } from '../../domain/repositories/ReservationRepository';
import type { Reservation } from '../../domain/interfaces/Reservation';
import { useNotificationStore } from '../../../stores/notification';

const props = defineProps({
  modelValue: Boolean,
  reservation: {
    type: Object as () => Reservation,
    default: () => ({
      id: 0,
      date: '',
      time: '',
      numberOfPeople: 0,
      customerId: 0,
      tableId: 0
    })
  }
});

const emit = defineEmits(['update:modelValue', 'reservation-deleted']);
const repository = new ReservationRepository();
const notificationStore = useNotificationStore();

const loading = ref(false);

const resetState = () => {
  loading.value = false;
};

const handleConfirm = async () => {
  if (loading.value) return;
  loading.value = true;
  if (props.reservation.id === undefined) {
    notificationStore.error('Error: ID de reserva no válido');
    loading.value = false;
    return;
  }

  try {
    await repository.delete(props.reservation.id);
    notificationStore.success('Reserva eliminada');
    setTimeout(() => {
      emit('reservation-deleted');
      emit('update:modelValue', false);
    }, 1500);
  } catch (err) {
    notificationStore.error('Error al eliminar reserva');
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
        Eliminar Reserva
      </v-card-title>
      
      <v-card-text class="mt-4">
        <p class="text-body-1" v-if="reservation && reservation.customer">
          ¿Está seguro de eliminar la reserva para
          <strong>{{ reservation.customer.name }}</strong>
          el día {{ reservation.date }}?
        </p>
        <p class="text-body-1" v-else>
          Seleccione una reserva para eliminar.
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