<script setup lang="ts">
import { ref, watch } from 'vue';
import { TableRepository } from '../../domain/repositories/TableRepository';
import type { Table } from '../../domain/interfaces/Table';

const props = defineProps({
  modelValue: Boolean
});

const emit = defineEmits(['update:modelValue', 'table-created']);
const repository = new TableRepository();

const showDialog = ref(false);
const table = ref<Table>({
  tableNumber: '',
  capacity: 0,
  location: ''
});
const saving = ref(false);
const error = ref('');
const success = ref('');

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
  error.value = '';
  success.value = '';
};

const saveTable = async () => {
  if (saving.value) return;

  error.value = '';
  success.value = '';
  saving.value = true;

  try {
    await repository.create(table.value);
    success.value = 'Mesa creada';
    emit('table-created');
    setTimeout(() => {
      emit('update:modelValue', false);
      resetForm();
    }, 1000);
  } catch (err) {
    error.value = 'Error al crear mesa';
    console.error(err);
  } finally {
    saving.value = false;
  }
};

const closeDialog = () => {
  emit('update:modelValue', false);
};

const openDialog = () => {
  resetForm();
  showDialog.value = true;
};

watch(() => props.modelValue, (newVal) => {
  showDialog.value = newVal;
  if (newVal) resetForm();
});

watch(showDialog, (newVal) => {
  emit('update:modelValue', newVal);
});

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