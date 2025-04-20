<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { ReservationRepository } from '../../domain/repositories/ReservationRepository';
import { CustomerRepository } from '../../domain/repositories/CustomerRepository';
import { TableRepository } from '../../domain/repositories/TableRepository';
import type { Reservation } from '../../domain/interfaces/Reservation';
import type { Customer } from '../../domain/interfaces/Customer';
import type { Table } from '../../domain/interfaces/Table';
import { useNotificationStore } from '../../../stores/notification';

const emit = defineEmits(['reservation-created']);
const reservationRepository = new ReservationRepository();
const customerRepository = new CustomerRepository();
const tableRepository = new TableRepository();
const notificationStore = useNotificationStore();

const showDialog = ref(false);
const reservation = ref<Reservation>({
  date: '',
  time: '',
  numberOfPeople: 0,
  customerId: 0,
  tableId: 0
});
const saving = ref(false);
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

onMounted(async () => {
  try {
    customers.value = await customerRepository.getAll();
    tables.value = await tableRepository.getAll();
  } catch (err) {
    console.error('Error al cargar datos:', err);
    notificationStore.error('Error al cargar clientes y mesas');
  }
});

const resetForm = () => {
  reservation.value = {
    date: '',
    time: '',
    numberOfPeople: 0,
    customerId: 0,
    tableId: 0
  };
  selectedCustomer.value = null;
  selectedTable.value = null;

};

const updateCustomerId = () => {
  if (selectedCustomer.value && selectedCustomer.value.id) {
    reservation.value.customerId = selectedCustomer.value.id;
  }
};

const updateTableId = () => {
  if (selectedTable.value && selectedTable.value.id) {
    reservation.value.tableId = selectedTable.value.id;
  }
};

const saveReservation = async () => {
  if (saving.value) return;
  

  saving.value = true;
  
  try {
    await reservationRepository.create(reservation.value);
    notificationStore.success('Reserva creada');
    emit('reservation-created');
    setTimeout(() => {
      showDialog.value = false;
      resetForm();
    }, 1500);
  } catch (err) {
    notificationStore.error('Error al crear reserva');
    console.error(err);
  } finally {
    saving.value = false;
  }
};

const openDialog = () => {
  resetForm();
  showDialog.value = true;
};

defineExpose({
  openDialog
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
        Nueva Reserva
      </v-card-title>
      
      <v-card-text class="mt-4">

        
        <v-form @submit.prevent="saveReservation">
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
          @click="saveReservation"
          :loading="saving"
        >
          Crear Reserva
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>