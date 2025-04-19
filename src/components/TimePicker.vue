<script setup lang="ts">
import { computed, ref } from 'vue';

interface Props {
  modelValue: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  rules?: Array<(v: any) => true | string>;
  disabled?: boolean;
  hint?: string;
  errorMessages?: string[];
  clearable?: boolean;
  format24h?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Seleccione una hora',
  required: false,
  rules: () => [],
  disabled: false,
  hint: '',
  errorMessages: () => [],
  clearable: true,
  format24h: true
});

const emit = defineEmits(['update:modelValue']);
const menu = ref(false);

const computedRules = computed(() => {
  const allRules = [...props.rules];
  
  if (props.required) {
    allRules.unshift((v: any) => !!v || 'La hora es obligatoria');
  }
  
  return allRules;
});

function updateTime(time: string) {
  emit('update:modelValue', time);
  menu.value = false;
}
</script>

<template>
  <v-menu
    v-model="menu"
    :close-on-content-click="false"
    transition="scale-transition"
    min-width="auto"
  >
    <template v-slot:activator="{ props: menuProps }">
      <v-text-field
        :model-value="modelValue"
        :label="label"
        :placeholder="placeholder"
        :rules="computedRules"
        :disabled="disabled"
        :hint="hint"
        :error-messages="errorMessages"
        :clearable="clearable"
        variant="outlined"
        density="comfortable"
        readonly
        v-bind="menuProps"
        prepend-inner-icon="mdi-clock-outline"
        @click:clear="emit('update:modelValue', '')"
        class="time-picker"
      ></v-text-field>
    </template>
    <v-time-picker
      :model-value="modelValue"
      @update:model-value="updateTime"
      :format="format24h ? '24hr' : 'ampm'"
    ></v-time-picker>
  </v-menu>
</template>

<style scoped>
.time-picker {
  margin-bottom: 16px;
}
</style>