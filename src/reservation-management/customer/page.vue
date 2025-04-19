<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { CustomerRepository } from '../domain/repositories/CustomerRepository';
import type { Customer } from '../domain/interfaces/Customer';
import AddCustomerDialog from './dialogs/add-customer-dialog.vue';
import EditCustomerDialog from './dialogs/edit-customer-dialog.vue';
import DeleteCustomerDialog from './dialogs/delete-customer-dialog.vue';
import DataTable from "../../components/DataTable.vue";

const customerRepo = new CustomerRepository();

const customers = ref<Customer[]>([]);
const isLoading = ref(false);
const dialog = ref();
const editDialog = ref();
const showDeleteDialog = ref(false);
const customerToDelete = ref<Customer | null>(null);
const errorMessage = ref('');

const columns = [
  { key: 'name', title: 'Nombre', sortable: true },
  { key: 'email', title: 'Correo', sortable: true },
  { key: 'phone', title: 'Teléfono', sortable: true },
  { key: 'address', title: 'Dirección', sortable: true },
];

onMounted(loadCustomerList);

async function loadCustomerList() {
  isLoading.value = true;
  errorMessage.value = '';

  try {
    customers.value = await customerRepo.getAll();
  } catch (error) {
    errorMessage.value = 'Error al cargar los comensales';
    console.error('Error loading customers:', error);
  } finally {
    isLoading.value = false;
  }
}

function handleCreate() {
  dialog.value?.openDialog();
}

function handleEdit(customer: Customer) {
  editDialog.value?.openDialog(customer);
}

function handleDeleteConfirmation(customer: Customer) {
  customerToDelete.value = customer;
  showDeleteDialog.value = true;
}

function handleCustomerCreated() {
  loadCustomerList();
}

function handleCustomerUpdated() {
  loadCustomerList();
}

function handleCustomerDeleted() {
  loadCustomerList();
}
</script>

<template>
  <div class="customers-management">
    <v-container>
      <v-row>
        <v-col cols="12">
          <div class="d-flex justify-space-between align-center mb-4">
            <h1 class="text-h4">Gestión de Comensales</h1>
            <v-btn
                color="primary"
                prepend-icon="mdi-plus"
                @click="handleCreate"
            >
              Nuevo Comensal
            </v-btn>
          </div>

          <v-alert
              v-if="errorMessage"
              type="error"
              variant="tonal"
              closable
              class="mb-4"
          >
            {{ errorMessage }}
          </v-alert>

          <v-card>
            <v-card-text>
              <DataTable
                  :items="customers"
                  :columns="columns"
                  :loading="isLoading"
                  search-placeholder="Buscar comensales..."
                  @edit="handleEdit"
                  @delete="handleDeleteConfirmation"
              >
                <template #item.actions="{ item }">
                  <div class="d-flex gap-2">
                    <v-btn
                        density="comfortable"
                        icon
                        variant="text"
                        color="primary"
                        @click="handleEdit(item)"
                    >
                      <v-icon>mdi-pencil</v-icon>
                    </v-btn>
                    <v-btn
                        density="comfortable"
                        icon
                        variant="text"
                        color="error"
                        @click="handleDeleteConfirmation(item)"
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

    <AddCustomerDialog
        ref="dialog"
        @customer-created="handleCustomerCreated"
    />

    <EditCustomerDialog
        ref="editDialog"
        @close="handleCustomerUpdated"
    />

    <DeleteCustomerDialog
        v-model="showDeleteDialog"
        :customer="customerToDelete"
        @customer-deleted="handleCustomerDeleted"
    />
  </div>
</template>

<style scoped>
.customers-management {
  padding: 2rem;
}
</style>