<script setup lang="ts">
import { computed } from 'vue';

interface Item {
  value: string | number;
  text: string;
}

interface Props {
  modelValue: string | number | null;
  label: string;
  items: Array<Item | string | number>;
  itemValue?: string;
  itemText?: string;
  placeholder?: string;
  required?: boolean;
  rules?: Array<(v: any) => true | string>;
  disabled?: boolean;
  hint?: string;
  errorMessages?: string[];
  multiple?: boolean;
  clearable?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: '',
  required: false,
  rules: () => [],
  disabled: false,
  hint: '',
  errorMessages: () => [],
  itemValue: 'value',
  itemText: 'text',
  multiple: false,
  clearable: true
});

const emit = defineEmits(['update:modelValue']);

const computedRules = computed(() => {
  const allRules = [...props.rules];
  
  if (props.required) {
    allRules.unshift((v: any) => !!v || 'Este campo es obligatorio');
  }
  
  return allRules;
});

const normalizedItems = computed(() => {
  return props.items.map(item => {
    if (typeof item === 'object') {
      return item;
    } else {
      return {
        [props.itemValue]: item,
        [props.itemText]: item
      };
    }
  });
});
</script>

<template>
  <v-select
    :model-value="modelValue"
    @update:model-value="emit('update:modelValue', $event)"
    :items="normalizedItems"
    :item-value="itemValue"
    :item-title="itemText"
    :label="label"
    :placeholder="placeholder"
    :rules="computedRules"
    :disabled="disabled"
    :hint="hint"
    :error-messages="errorMessages"
    :multiple="multiple"
    :clearable="clearable"
    variant="outlined"
    density="comfortable"
    class="form-select"
  >
    <slot></slot>
  </v-select>
</template>

<style scoped>
.form-select {
  margin-bottom: 16px;
}
</style>