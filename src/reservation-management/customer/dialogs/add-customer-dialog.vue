<script setup lang="ts">
import { ref } from 'vue';
import { CustomerRepository } from '../../domain/repositories/CustomerRepository';
import type { Customer } from '../../domain/interfaces/Customer';
import { useNotificationStore } from '../../../stores/notification';

const customerRepository = new CustomerRepository();
const emit = defineEmits(['customer-created']);
const notificationStore = useNotificationStore();

const showDialog = ref(false);
const customer = ref<Customer>({
  name: '',
  email: '',
  phone: '',
  address: ''
});
const saving = ref(false);

const nameRules = [
  (v: string) => !!v || 'El nombre es obligatorio',
];

const emailRules = [
  (v: string) => !!v || 'El correo electrónico es obligatorio',
  (v: string) => /^\S+@\S+\.\S+$/.test(v) || 'El correo electrónico no es válido'
];

const resetForm = () => {
  customer.value = {
    name: '',
    email: '',
    phone: '',
    address: ''
  };
};

const saveCustomer = async () => {
  if (saving.value) return;

  saving.value = true;

  try {
    const createdCustomer = await customerRepository.create(customer.value);
    notificationStore.success('Comensal creado correctamente');
    emit('customer-created', createdCustomer);
    setTimeout(() => {
      showDialog.value = false;
      resetForm();
    }, 1500);
  } catch (err) {
    notificationStore.error('Error al crear el comensal');
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
        Nuevo Comensal
      </v-card-title>
      
      <v-card-text class="mt-4">

        <v-form @submit.prevent="saveCustomer">
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="customer.name"
                label="Nombre"
                required
                :rules="nameRules"
                variant="outlined"
                density="comfortable"
                hide-details="auto"
              />
            </v-col>
            
            <v-col cols="12">
              <v-text-field
                v-model="customer.email"
                label="Correo electrónico"
                type="email"
                required
                :rules="emailRules"
                variant="outlined"
                density="comfortable"
                hide-details="auto"
              />
            </v-col>
            
            <v-col cols="12" md="6">
              <v-text-field
                v-model="customer.phone"
                label="Teléfono"
                placeholder="Ej: 123456789"
                variant="outlined"
                density="comfortable"
                hide-details="auto"
              />
            </v-col>
            
            <v-col cols="12" md="6">
              <v-text-field
                v-model="customer.address"
                label="Dirección"
                placeholder="Ej: Calle Principal 123"
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
          @click="saveCustomer"
          :loading="saving"
        >
          Crear
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>