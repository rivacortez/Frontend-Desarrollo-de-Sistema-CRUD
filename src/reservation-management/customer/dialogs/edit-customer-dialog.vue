<script setup lang="ts">
import { ref } from 'vue';
import { CustomerRepository } from '../../domain/repositories/CustomerRepository';
import type { Customer } from '../../domain/interfaces/Customer';

const customerRepository = new CustomerRepository();

interface DialogProps {
  customerData?: Customer;
}

defineProps<DialogProps>();
const emit = defineEmits(['close']);

const showDialog = ref(false);
const customerId = ref<number | undefined>(undefined);
const customer = ref<Customer>({
  name: '',
  email: '',
  phone: '',
  address: ''
});
const saving = ref(false);
const error = ref('');
const success = ref('');

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
  customerId.value = undefined;
  error.value = '';
  success.value = '';
};

const saveCustomer = async () => {
  if (saving.value) return;

  error.value = '';
  success.value = '';
  saving.value = true;

  try {
    if (customerId.value !== undefined) {
      await customerRepository.update(customerId.value, customer.value);
      success.value = 'Comensal actualizado correctamente';
    } else {
      await customerRepository.create(customer.value);
      success.value = 'Comensal creado correctamente';
    }

    setTimeout(() => {
      showDialog.value = false;
      resetForm();
      emit('close');
    }, 1500);
  } catch (err) {
    error.value = customerId.value !== undefined
        ? 'Error al actualizar el comensal'
        : 'Error al crear el comensal';
    console.error(err);
  } finally {
    saving.value = false;
  }
};

const openDialog = (customerData?: Customer) => {
  if (customerData) {
    customerId.value = customerData.id;
    customer.value = { ...customerData };
  } else {
    resetForm();
  }
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
        {{ customerId !== undefined ? 'Editar Comensal' : 'Nuevo Comensal' }}
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
          {{ customerId ? 'Guardar' : 'Crear' }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>