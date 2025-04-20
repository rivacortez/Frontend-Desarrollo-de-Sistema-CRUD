<script setup lang="ts">
interface Props {
  modelValue: boolean;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  confirmColor?: string;
  width?: number | string;
  persistent?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Confirmar acción',
  message: '¿Está seguro que desea realizar esta acción?',
  confirmText: 'Confirmar',
  cancelText: 'Cancelar',
  confirmColor: 'error',
  width: 400,
  persistent: true
});

const emit = defineEmits(['update:modelValue', 'confirm', 'cancel']);

function confirm() {
  emit('confirm');
  emit('update:modelValue', false);
}

function cancel() {
  emit('cancel');
  emit('update:modelValue', false);
}
</script>

<template>
  <v-dialog
    :model-value="modelValue"
    @update:model-value="emit('update:modelValue', $event)"
    :width="width"
    :persistent="persistent"
  >
    <v-card>
      <v-card-title class="text-h5 pa-4">
        {{ title }}
      </v-card-title>
      
      <v-card-text class="pa-4 pt-2">
        {{ message }}
      </v-card-text>
      
      <v-card-actions class="pa-4 pt-0">
        <v-spacer></v-spacer>
        <v-btn
          variant="text"
          @click="cancel"
        >
          {{ cancelText }}
        </v-btn>
        <v-btn
          :color="confirmColor"
          variant="elevated"
          @click="confirm"
        >
          {{ confirmText }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped>
</style>