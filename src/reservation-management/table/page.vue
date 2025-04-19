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
const tableToDelete = ref<Table | null>(null);
const error = ref('');
const editDialog = ref(false);
const selectedTableId = ref<number | undefined>(undefined);
const addDialog = ref(false);

const columns = [
  { key: 'tableNumber', title: 'Número de Mesa', sortable: true },
  { key: 'capacity', title: 'Capacidad', sortable: true },
  { key: 'location', title: 'Ubicación', sortable: true },
];

async function loadTables() {
  loading.value = true;
  error.value = '';

  try {
    tables.value = await tableRepository.getAll();
  } catch (err) {
    error.value = 'Error al cargar las mesas. Por favor, inténtelo de nuevo.';
    console.error(err);
  } finally {
    loading.value = false;
  }
}

function confirmDelete(table: Table) {
  tableToDelete.value = table;
  showDeleteDialog.value = true;
}

function editTable(table: Table) {
  if (table.id !== undefined) {
    selectedTableId.value = table.id;
    editDialog.value = true;
  } else {
    error.value = 'Error: La mesa seleccionada no tiene un ID válido';
  }
}

function createTable() {
  addDialog.value = true;
}

function handleTableUpdated() {
  loadTables();
}

function handleTableDeleted() {
  loadTables();
}

function handleTableCreated() {
  loadTables();
}

const safeTableToDelete = computed(() => {
  return tableToDelete.value || {
    tableNumber: '',
    capacity: 0,
    location: ''
  };
});

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
                  :items="tables"
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
        :table="safeTableToDelete"
        @table-deleted="handleTableDeleted"
    />

    <EditTableDialog
        v-model="editDialog"
        :table-id="selectedTableId || 0"
        @table-updated="handleTableUpdated"
    />

    <AddTableDialog
        ref="addTableDialog"
        v-model="addDialog"
        @table-created="handleTableCreated"
    />
  </div>
</template>

<style scoped>
.tables-list {
  padding: 16px 0;
}
</style>