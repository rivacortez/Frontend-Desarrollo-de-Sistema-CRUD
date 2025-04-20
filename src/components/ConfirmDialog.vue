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
      :model-value="props.modelValue"
      @update:model-value="emit('update:modelValue', $event)"
      :width="props.width"
      :persistent="props.persistent"
  >
    <v-card>
      <v-card-title class="text-h5 pa-4">
        {{ props.title }}
      </v-card-title>

      <v-card-text class="pa-4 pt-2">
        {{ props.message }}
      </v-card-text>

      <v-card-actions class="pa-4 pt-0">
        <v-spacer></v-spacer>
        <v-btn
            variant="text"
            @click="cancel"
        >
          {{ props.cancelText }}
        </v-btn>
        <v-btn
            :color="props.confirmColor"
            variant="elevated"
            @click="confirm"
        >
          {{ props.confirmText }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>