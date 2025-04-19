<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  modelValue: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  rules?: Array<(v: any) => true | string>;
  disabled?: boolean;
  hint?: string;
  errorMessages?: string[];
  minDate?: string;
  maxDate?: string;
  clearable?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Seleccione una fecha',
  required: false,
  rules: () => [],
  disabled: false,
  hint: '',
  errorMessages: () => [],
  minDate: undefined,
  maxDate: undefined,
  clearable: true
});

const emit = defineEmits(['update:modelValue']);

const computedRules = computed(() => {
  const allRules = [...props.rules];
  
  if (props.required) {
    allRules.unshift((v: any) => !!v || 'La fecha es obligatoria');
  }
  
  return allRules;
});
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
        prepend-inner-icon="mdi-calendar"
        @click:clear="emit('update:modelValue', '')"
        class="date-picker"
      ></v-text-field>
    </template>
    <v-date-picker
      :model-value="modelValue"
      @update:model-value="(date) => {
        emit('update:modelValue', date);
        menu = false;
      }"
      :min="minDate"
      :max="maxDate"
    ></v-date-picker>
  </v-menu>
</template>

<script lang="ts">
export default {
  data() {
    return {
      menu: false
    };
  }
};
</script>

<style scoped>
.date-picker {
  margin-bottom: 16px;
}
</style>