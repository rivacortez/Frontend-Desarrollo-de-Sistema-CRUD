<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  modelValue: string | number;
  label: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  rules?: Array<(v: any) => true | string>;
  disabled?: boolean;
  hint?: string;
  errorMessages?: string[];
  autofocus?: boolean;
  clearable?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  placeholder: '',
  required: false,
  rules: () => [],
  disabled: false,
  hint: '',
  errorMessages: () => [],
  autofocus: false,
  clearable: false
});

const emit = defineEmits(['update:modelValue']);

const computedRules = computed(() => {
  const allRules = [...props.rules];
  
  if (props.required) {
    allRules.unshift((v: any) => !!v || 'Este campo es obligatorio');
  }
  
  return allRules;
});

function updateValue(event: Event) {
  const target = event.target as HTMLInputElement;
  emit('update:modelValue', target.value);
}
</script>

<template>
  <v-text-field
    :model-value="modelValue"
    @input="updateValue"
    :label="label"
    :type="type"
    :placeholder="placeholder"
    :rules="computedRules"
    :disabled="disabled"
    :hint="hint"
    :error-messages="errorMessages"
    :autofocus="autofocus"
    :clearable="clearable"
    variant="outlined"
    density="comfortable"
    class="form-input"
  >
    <slot></slot>
  </v-text-field>
</template>

<style scoped>
.form-input {
  margin-bottom: 16px;
}
</style>