<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import { ReservationRepository } from '../../domain/repositories/ReservationRepository';
import { CustomerRepository } from '../../domain/repositories/CustomerRepository';
import { TableRepository } from '../../domain/repositories/TableRepository';
import type { Reservation } from '../../domain/interfaces/Reservation';
import type { Customer } from '../../domain/interfaces/Customer';
import type { Table } from '../../domain/interfaces/Table';

const props = defineProps({
  modelValue: Boolean,
  reservationId: {
    type: Number,
    required: true,
    default: 0
  }
});

const emit = defineEmits(['update:modelValue', 'reservation-updated']);
const repository = new ReservationRepository();
const customerRepository = new CustomerRepository();
const tableRepository = new TableRepository();

const showDialog = ref(false);
const reservation = ref<Reservation>({
  id: 0,
  date: '',
  time: '',
  numberOfPeople: 1,
  customerId: 0,
  tableId: 0
});
const loading = ref(false);
const saving = ref(false);
const error = ref('');
const success = ref('');
const customers = ref<Customer[]>([]);
const tables = ref<Table[]>([]);
const selectedCustomer = ref<Customer | null>(null);
const selectedTable = ref<Table | null>(null);

const dateRules = [(v: string) => !!v || 'Fecha requerida'];
const timeRules = [(v: string) => !!v || 'Hora requerida'];
const peopleRules = [
  (v: number) => v > 0 || 'Mínimo 1 persona',
  (v: number) => !isNaN(v) || 'Número inválido'
];
const selectRules = [(v: any) => !!v || 'Este campo es requerido'];

const loadReferenceData = async () => {
  try {
    const [customersData, tablesData] = await Promise.all([
      customerRepository.getAll(),
      tableRepository.getAll()
    ]);
    customers.value = customersData;
    tables.value = tablesData;
    return true;
  } catch (err) {
    console.error('Error loading reference data:', err);
    error.value = 'Error al cargar datos de clientes y mesas';
    return false;
  }
};

onMounted(() => {
  loadReferenceData();
});

const resetForm = () => {
  reservation.value = {
    id: 0,
    date: '',
    time: '',
    numberOfPeople: 1,
    customerId: 0,
    tableId: 0
  };
  selectedCustomer.value = null;
  selectedTable.value = null;
  error.value = '';
  success.value = '';
};

const loadReservation = async () => {
  if (!props.reservationId) {
    return;
  }

  loading.value = true;
  error.value = '';

  try {
    if (customers.value.length === 0 || tables.value.length === 0) {
      await loadReferenceData();
    }

    const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api'}/reservations/${props.reservationId}`);

    if (!response.ok) {
      throw new Error(`Error fetching reservation: ${response.statusText}`);
    }

    const responseData = await response.json();

    const reservationData = responseData.data || responseData;

    if (reservationData) {
      reservation.value = {
        id: props.reservationId,
        date: reservationData.fecha || reservationData.date || '',
        time: reservationData.hora || reservationData.time || '',
        numberOfPeople: reservationData.numero_de_personas || reservationData.number_of_people || reservationData.numberOfPeople || 1,
        customerId: reservationData.comensal_id || reservationData.customer_id || reservationData.customerId || 0,
        tableId: reservationData.mesa_id || reservationData.table_id || reservationData.tableId || 0
      };


      selectedCustomer.value = customers.value.find(c => c.id === reservation.value.customerId) || null;
      selectedTable.value = tables.value.find(t => t.id === reservation.value.tableId) || null;
    } else {
      error.value = 'No se encontró la reserva';
    }
  } catch (err) {
    console.error('Error loading reservation:', err);
    error.value = 'Error al cargar reserva';
  } finally {
    loading.value = false;
  }
};

const updateCustomerId = () => {
  if (selectedCustomer.value?.id !== undefined) {
    reservation.value.customerId = selectedCustomer.value.id;
  }
};

const updateTableId = () => {
  if (selectedTable.value?.id !== undefined) {
    reservation.value.tableId = selectedTable.value.id;
  }
};

const saveChanges = async () => {
  if (saving.value) return;
  error.value = '';
  success.value = '';
  saving.value = true;

  try {
    if (!props.reservationId) {
      throw new Error('ID de reserva no válido');
    }

    await repository.update(props.reservationId, reservation.value);
    success.value = 'Reserva actualizada';
    emit('reservation-updated');

    setTimeout(() => {
      emit('update:modelValue', false);
    }, 1000);
  } catch (err) {
    error.value = 'Error al actualizar reserva';
  } finally {
    saving.value = false;
  }
};

watch(() => props.modelValue, (newVal) => {
  showDialog.value = newVal;

  if (newVal && props.reservationId) {
    loadReservation();
  } else if (!newVal) {
    resetForm();
  }
}, { immediate: true });

watch(showDialog, (newVal) => {
  if (newVal !== props.modelValue) {
    emit('update:modelValue', newVal);
  }
});

watch(() => props.reservationId, (newVal, oldVal) => {
  if (newVal && newVal !== oldVal && props.modelValue) {
    loadReservation();
  }
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

        <v-progress-circular
            v-if="loading"
            indeterminate
            color="primary"
            class="mx-auto my-4 d-block"
        ></v-progress-circular>

        <v-form @submit.prevent="saveChanges" v-else>
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
              <v-select
                  v-model="selectedCustomer"
                  label="Cliente"
                  :items="customers"
                  item-title="name"
                  item-value="id"
                  return-object
                  required
                  :rules="selectRules"
                  variant="outlined"
                  density="comfortable"
                  hide-details="auto"
                  @update:model-value="updateCustomerId"
              />
            </v-col>

            <v-col cols="12" md="6">
              <v-select
                  v-model="selectedTable"
                  label="Mesa"
                  :items="tables"
                  item-title="tableNumber"
                  item-value="id"
                  return-object
                  required
                  :rules="selectRules"
                  variant="outlined"
                  density="comfortable"
                  hide-details="auto"
                  @update:model-value="updateTableId"
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