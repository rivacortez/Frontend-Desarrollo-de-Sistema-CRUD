<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { ReservationRepository } from '../domain/repositories/ReservationRepository';
import type { Reservation } from '../domain/interfaces/Reservation';
import AddReservationDialog from './dialogs/add-reservation-dialog.vue';
import EditReservationDialog from './dialogs/edit-reservation-dialog.vue';
import DeleteReservationDialog from './dialogs/delete-reservation-dialog.vue';
import DataTable from "../../components/DataTable.vue";


const reservationRepository = new ReservationRepository();

const reservations = ref<Reservation[]>([]);
const loading = ref(true);
const showDeleteDialog = ref(false);
const reservationToDelete = ref<Reservation | null>(null);
const error = ref('');
const addDialog = ref<InstanceType<typeof AddReservationDialog> | null>(null);
const editDialog = ref(false);
const selectedReservationId = ref<number>(0);

// Columnas tabla
const columns = [
  { key: 'date', title: 'Fecha', sortable: true },
  { key: 'time', title: 'Hora', sortable: true },
  { key: 'numberOfPeople', title: 'Personas', sortable: true },
  {
    key: 'customer',
    title: 'Comensal',
    sortable: true,
    formatter: (value: any) => value?.name || '-'
  },
  {
    key: 'table',
    title: 'Mesa',
    sortable: true,
    formatter: (value: any) => value?.tableNumber || '-'
  }
  ];

onMounted(() => {
  loadReservations();
});

const loadReservations = async () => {
  loading.value = true;
  error.value = '';
  try {
    reservations.value = await reservationRepository.getAll();
  } catch (err) {
    error.value = 'Error al cargar reservas';
    console.error(err);
  } finally {
    loading.value = false;
  }
};

const confirmDelete = (reservation: Reservation) => {
  reservationToDelete.value = reservation;
  showDeleteDialog.value = true;
};

const deleteReservation = async () => {
  if (!reservationToDelete.value?.id) return;
  loading.value = true;
  try {
    await reservationRepository.delete(reservationToDelete.value.id);
    reservations.value = reservations.value.filter(r => r.id !== reservationToDelete.value?.id);
  } catch (err) {
    error.value = 'Error al eliminar reserva';
    console.error(err);
  } finally {
    loading.value = false;
    showDeleteDialog.value = false;
    reservationToDelete.value = null;
  }
};

const editReservation = (reservation: Reservation) => {
  selectedReservationId.value = reservation.id;
  editDialog.value = true;
};

const openAddDialog = () => {
  addDialog.value?.openDialog();
};

const handleReservationUpdated = () => {
  loadReservations();
};

const handleReservationDeleted = () => {
  loadReservations();
};
</script>

<template>
  <div class="reservations-list">
    <v-container>
      <v-row>
        <v-col cols="12">
          <div class="d-flex justify-space-between align-center mb-4">
            <h1 class="text-h4">Gestión de Reservas</h1>
            <v-btn
                color="primary"
                prepend-icon="mdi-plus"
                @click="openAddDialog"
            >
              Nueva Reserva
            </v-btn>
          </div>

          <v-alert
              v-if="error"
              type="error"
              variant="tonal"
              closable
              class="mb-4"
          >
            {{ error }}
          </v-alert>

          <v-card>
            <v-card-text>
              <DataTable
                  :items="reservations"
                  :columns="columns"
                  :loading="loading"
                  search-placeholder="Buscar reservas..."
                  @edit="editReservation"
                  @delete="confirmDelete"
              >
                <template #item.actions="{ item }">
                  <div class="d-flex gap-2">
                    <v-btn
                        density="comfortable"
                        icon
                        variant="text"
                        color="primary"
                        @click="editReservation(item)"
                    >
                      <v-icon>mdi-pencil</v-icon>
                    </v-btn>
                    <v-btn
                        density="comfortable"
                        icon
                        variant="text"
                        color="error"
                        @click="confirmDelete(item)"
                    >
                      <v-icon>mdi-delete</v-icon>
                    </v-btn>
                  </div>
                </template>
              </DataTable>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <!-- Diálogos -->
    <DeleteReservationDialog
        v-model="showDeleteDialog"
        :reservation="reservationToDelete"
        @reservation-deleted="handleReservationDeleted"
    />

    <AddReservationDialog
        ref="addDialog"
        @reservation-created="loadReservations"
    />

    <EditReservationDialog
        v-model="editDialog"
        :reservation-id="selectedReservationId"
        @reservation-updated="handleReservationUpdated"
    />
  </div>
</template>