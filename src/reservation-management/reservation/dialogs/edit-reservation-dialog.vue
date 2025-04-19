<script setup lang="ts">
import { ref, watch } from 'vue';
import { ReservationRepository } from '../../domain/repositories/ReservationRepository';
import type { Reservation } from '../../domain/interfaces/Reservation';

const props = defineProps({
  modelValue: Boolean,
  reservationId: {
    type: Number,
    required: true
  }
});

const emit = defineEmits(['update:modelValue', 'reservation-updated']);
const repository = new ReservationRepository();

const showDialog = ref(false);
const reservation = ref<Reservation>({
  id: 0,
  date: '',
  time: '',
  numberOfPeople: 0,
  customerId: 0,
  tableId: 0
});
const loading = ref(false);
const saving = ref(false);
const error = ref('');
const success = ref('');

const dateRules = [(v: string) => !!v || 'Fecha requerida'];
const timeRules = [(v: string) => !!v || 'Hora requerida'];
const peopleRules = [
  (v: number) => v > 0 || 'Mínimo 1 persona',
  (v: number) => !isNaN(v) || 'Número inválido'
];

const loadReservation = async () => {
  if (!props.reservationId) return;
  loading.value = true;
  try {
    const data = await repository.getById(props.reservationId);
    if (data) reservation.value = { ...data };
  } catch (err) {
    error.value = 'Error al cargar reserva';
    console.error(err);
  } finally {
    loading.value = false;
  }
};

const saveChanges = async () => {
  if (saving.value) return;
  error.value = '';
  success.value = '';
  saving.value = true;
  
  try {
    await repository.update(reservation.value.id, reservation.value);
    success.value = 'Reserva actualizada';
    emit('reservation-updated');
    setTimeout(() => {
      showDialog.value = false;
    }, 1000);
  } catch (err) {
    error.value = 'Error al actualizar reserva';
    console.error(err);
  } finally {
    saving.value = false;
  }
};

watch(() => props.modelValue, (newVal) => {
  showDialog.value = newVal;
  if (newVal) loadReservation();
});

watch(showDialog, (newVal) => {
  emit('update:modelValue', newVal);
});
</script>

<template>
  <v-dialog
    v-model="showDialog"
    max-width="600px"
    persistent
  >
    <v-card>
      <v-card-title class="text-h5 primary white--text">
        Editar Reserva
      </v-card-title>
      
      <v-card-text class="mt-4">
        <v-alert
          v-if="error"
          type="error"
          variant="tonal"
          closable
          class="mb-4"
        >
          {{ error }}
        </v-alert>
        
        <v-alert
          v-if="success"
          type="success"
          variant="tonal"
          closable
          class="mb-4"
        >
          {{ success }}
        </v-alert>
        
        <v-form @submit.prevent="saveChanges">
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="reservation.date"
                label="Fecha"
                type="date"
                required
                :rules="dateRules"
                variant="outlined"
                density="comfortable"
                hide-details="auto"
              />
            </v-col>
            
            <v-col cols="12" md="6">
              <v-text-field
                v-model="reservation.time"
                label="Hora"
                type="time"
                required
                :rules="timeRules"
                variant="outlined"
                density="comfortable"
                hide-details="auto"
              />
            </v-col>
            
            <v-col cols="12" md="6">
              <v-text-field
                v-model.number="reservation.numberOfPeople"
                label="Personas"
                type="number"
                min="1"
                required
                :rules="peopleRules"
                variant="outlined"
                density="comfortable"
                hide-details="auto"
              />
            </v-col>
            
            <v-col cols="12" md="6">
              <v-text-field
                v-model.number="reservation.customerId"
                label="ID Cliente"
                type="number"
                required
                variant="outlined"
                density="comfortable"
                hide-details="auto"
              />
            </v-col>
            
            <v-col cols="12" md="6">
              <v-text-field
                v-model.number="reservation.tableId"
                label="ID Mesa"
                type="number"
                required
                variant="outlined"
                density="comfortable"
                hide-details="auto"
              />
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      
      <v-card-actions>
        <v-spacer />
        <v-btn
          variant="text"
          @click="showDialog = false"
          :disabled="saving"
        >
          Cancelar
        </v-btn>
        <v-btn
          color="primary"
          @click="saveChanges"
          :loading="saving"
        >
          Actualizar Reserva
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>