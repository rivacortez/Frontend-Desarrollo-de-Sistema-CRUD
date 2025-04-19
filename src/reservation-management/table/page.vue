<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { TableRepository } from '../domain/repositories/TableRepository';
import type { Table } from '../domain/interfaces/Table';
import EditTableDialog from './dialogs/edit-table-dialog.vue';
import DeleteTableDialog from './dialogs/delete-table-dialog.vue';
import AddTableDialog from './dialogs/add-table-dialog.vue';
import DataTable from "../../components/DataTable.vue";

const tableRepository = new TableRepository();
const tables = ref<Table[]>([]);
const loading = ref(true);
const showDeleteDialog = ref(false);
const showEditDialog = ref(false);
const selectedTableId = ref<number>(0);
const tableToDelete = ref<Table | null>(null);
const error = ref('');
const addTableDialog = ref();
const refreshTrigger = ref(0);

const columns = [
  { key: 'tableNumber', title: 'Número de Mesa', sortable: true },
  { key: 'capacity', title: 'Capacidad', sortable: true },
  { key: 'location', title: 'Ubicación', sortable: true },
];


const formattedTables = computed(() => {
  return tables.value.map(table => ({
    ...table,
    capacity: table.capacity || 0
  }));
});

async function loadTables() {
  loading.value = true;
  error.value = '';

  try {
    const result = await tableRepository.getAll();
    tables.value = result;

    if (tables.value.length === 0) {
      error.value = 'No hay mesas registradas. Puede crear una nueva mesa usando el botón "Nueva Mesa".';
    }
  } catch (err) {
    error.value = 'Error al cargar las mesas. Por favor, inténtelo de nuevo.';
    console.error('Error loading tables:', err);
  } finally {
    loading.value = false;
  }
}

function confirmDelete(table: Table) {
  if (!table || table.id === undefined) {
    error.value = 'Error: No se puede eliminar una mesa sin ID válido';
    return;
  }

  tableToDelete.value = table;
  showDeleteDialog.value = true;
}

function editTable(table: Table) {
  if (!table || table.id === undefined) {
    error.value = 'Error: La mesa seleccionada no tiene un ID válido';
    return;
  }

  selectedTableId.value = table.id;
  showEditDialog.value = true;
}

function createTable() {
  if (addTableDialog.value) {
    addTableDialog.value.openDialog();
  }
}

function refreshData() {
  refreshTrigger.value++;
  loadTables();
}

function handleTableUpdated() {
  refreshData();
}

function handleTableDeleted() {
  refreshData();
}

function handleTableCreated() {
  refreshData();
}

onMounted(() => {
  loadTables();
});
</script>

<template>
  <div class="tables-list">
    <v-container>
      <v-row>
        <v-col cols="12">
          <div class="d-flex justify-space-between align-center mb-4">
            <h1 class="text-h4">Gestión de Mesas</h1>
            <v-btn
                color="primary"
                prepend-icon="mdi-plus"
                @click="createTable"
            >
              Nueva Mesa
            </v-btn>
          </div>

          <v-alert
              v-if="error"
              :type="tables.length === 0 ? 'info' : 'error'"
              variant="tonal"
              closable
              class="mb-4"
          >
            {{ error }}
          </v-alert>

          <v-card>
            <v-card-text>
              <DataTable
                  :items="formattedTables"
                  :columns="columns"
                  :loading="loading"
                  search-placeholder="Buscar mesas..."
                  @edit="editTable"
                  @delete="confirmDelete"
              />
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <!-- Dialogs -->
    <DeleteTableDialog
        v-model="showDeleteDialog"
        :table="tableToDelete || {tableNumber: '', capacity: 0, location: ''}"
        @table-deleted="handleTableDeleted"
    />

    <EditTableDialog
        v-model="showEditDialog"
        :tableId="selectedTableId"
        @update:modelValue="showEditDialog = $event"
        @table-updated="handleTableUpdated"
    />

    <AddTableDialog
        ref="addTableDialog"
        @table-created="handleTableCreated"
    />
  </div>
</template>