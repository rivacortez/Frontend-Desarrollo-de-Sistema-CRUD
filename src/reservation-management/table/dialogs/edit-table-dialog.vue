<script setup lang="ts">
import { ref, watch } from 'vue';
import { TableRepository } from '../../domain/repositories/TableRepository';
import type { Table } from '../../domain/interfaces/Table';

const repository = new TableRepository();

const props = defineProps({
  modelValue: Boolean,
  tableId: {
    type: Number,
    required: true,
    default: 0
  }
});

const emit = defineEmits(['update:modelValue', 'table-updated']);

const showDialog = ref(false);
const table = ref<Table>({
  tableNumber: '',
  capacity: 0,
  location: ''
});
const loading = ref(false);
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

const loadTable = async () => {
  if (!props.tableId) {
    error.value = 'ID de mesa no válido';
    return;
  }

  loading.value = true;
  error.value = '';

  try {
    const tableData = await repository.getById(props.tableId);

    if (tableData) {
      table.value = {
        id: props.tableId,
        tableNumber: tableData.tableNumber || '',
        capacity: tableData.capacity || 0,
        location: tableData.location || ''
      };
    } else {
      error.value = 'No se encontró la mesa';
    }
  } catch (err) {
    console.error('Error loading table:', err);
    error.value = 'Error al cargar mesa. Por favor, inténtelo de nuevo.';
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
    if (!props.tableId) {
      throw new Error('ID de mesa no válido');
    }

    if (!table.value.tableNumber) {
      throw new Error('El número de mesa es obligatorio');
    }

    if (!table.value.capacity || table.value.capacity < 1) {
      throw new Error('La capacidad debe ser al menos 1');
    }

    await repository.update(props.tableId, table.value);
    success.value = 'Mesa actualizada correctamente';
    emit('table-updated');

    setTimeout(() => {
      emit('update:modelValue', false);
    }, 1000);
  } catch (err) {
    console.error('Error saving table:', err);
    if (err instanceof Error) {
      error.value = err.message;
    } else {
      error.value = 'Error al actualizar mesa';
    }
  } finally {
    saving.value = false;
  }
};

watch(() => props.modelValue, async (newVal) => {
  showDialog.value = newVal;

  if (newVal && props.tableId) {
    resetForm();
    await loadTable();
  }
}, { immediate: true });


watch(showDialog, (newVal) => {
  if (newVal !== props.modelValue) {
    emit('update:modelValue', newVal);
  }
});


watch(() => props.tableId, async (newVal, oldVal) => {
  if (newVal && newVal !== oldVal && props.modelValue) {
    resetForm();
    await loadTable();
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
        Editar Mesa
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

        <v-form v-if="!loading" @submit.prevent="saveChanges">
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
                  placeholder="Ingrese número de mesa"
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
                  placeholder="Ingrese capacidad"
              />
            </v-col>

            <v-col cols="12">
              <v-text-field
                  v-model="table.location"
                  label="Ubicación"
                  variant="outlined"
                  density="comfortable"
                  hide-details="auto"
                  placeholder="Ingrese ubicación"
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
            :disabled="saving || loading"
        >
          Cancelar
        </v-btn>
        <v-btn
            color="primary"
            @click="saveChanges"
            :loading="saving"
            :disabled="loading"
        >
          Actualizar Mesa
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>