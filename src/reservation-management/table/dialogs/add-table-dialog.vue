<script setup lang="ts">
import { ref } from 'vue';
import { TableRepository } from '../../domain/repositories/TableRepository';
import type { Table } from '../../domain/interfaces/Table';
import { useNotificationStore } from '../../../stores/notification';

const emit = defineEmits(['table-created']);
const repository = new TableRepository();
const notificationStore = useNotificationStore();

const showDialog = ref(false);
const table = ref<Table>({
  tableNumber: '',
  capacity: 0,
  location: ''
});
const saving = ref(false);

const numberRules = [
  (v: string) => !!v || 'Número de mesa requerido',
  (v: string) => /^[A-Za-z0-9-]+$/.test(v) || 'Formato inválido'
];

const capacityRules = [
  (v: number) => v > 0 || 'Capacidad mínima 1',
  (v: number) => !isNaN(v) || 'Número inválido'
];

const resetForm = () => {
  table.value = {
    tableNumber: '',
    capacity: 0,
    location: ''
  };
};

const saveTable = async () => {
  if (saving.value) return;

  saving.value = true;

  try {
    await repository.create(table.value);
    notificationStore.success('Mesa creada');
    emit('table-created');
    setTimeout(() => {
      showDialog.value = false;
      resetForm();
    }, 1000);
  } catch (err) {
    notificationStore.error('Error al crear mesa');
    console.error(err);
  } finally {
    saving.value = false;
  }
};

const closeDialog = () => {
  showDialog.value = false;
  resetForm();
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
        Nueva Mesa
      </v-card-title>

      <v-card-text class="mt-4">

        <v-form @submit.prevent="saveTable">
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                  v-model="table.tableNumber"
                  label="Número de Mesa"
                  required
                  :rules="numberRules"
                  variant="outlined"
                  density="comfortable"
                  hide-details="auto"
              />
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field
                  v-model.number="table.capacity"
                  label="Capacidad"
                  type="number"
                  min="1"
                  required
                  :rules="capacityRules"
                  variant="outlined"
                  density="comfortable"
                  hide-details="auto"
              />
            </v-col>

            <v-col cols="12">
              <v-text-field
                  v-model="table.location"
                  label="Ubicación"
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
            @click="closeDialog"
            :disabled="saving"
        >
          Cancelar
        </v-btn>
        <v-btn
            color="primary"
            @click="saveTable"
            :loading="saving"
        >
          Crear Mesa
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>