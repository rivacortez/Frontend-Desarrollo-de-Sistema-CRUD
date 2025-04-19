<script setup lang="ts">
import { ref, computed, watch } from 'vue';

interface Column {
  key: string;
  title: string;
  sortable?: boolean;
  formatter?: (value: any, item: any) => string;
}

interface Props {
  items: any[];
  columns: Column[];
  loading?: boolean;
  itemsPerPageOptions?: number[];
  showSearch?: boolean;
  searchPlaceholder?: string;
  noDataText?: string;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  itemsPerPageOptions: () => [5, 10, 25, 50],
  showSearch: true,
  searchPlaceholder: 'Buscar...',
  noDataText: 'No hay datos disponibles'
});

const emit = defineEmits(['edit', 'delete', 'view']);

const search = ref('');
const sortBy = ref('');
const sortDesc = ref(false);
const page = ref(1);
const itemsPerPage = ref(props.itemsPerPageOptions[0]);

const filteredItems = computed(() => {
  let items = [...props.items];
  
  // Aplicar búsqueda
  if (search.value) {
    const searchLower = search.value.toLowerCase();
    items = items.filter(item => {
      return Object.keys(item).some(key => {
        const value = item[key];
        if (value === null || value === undefined) return false;
        return String(value).toLowerCase().includes(searchLower);
      });
    });
  }
  
  // Aplicar ordenamiento
  if (sortBy.value) {
    items.sort((a, b) => {
      const aValue = a[sortBy.value];
      const bValue = b[sortBy.value];
      
      if (aValue === bValue) return 0;
      
      const result = aValue > bValue ? 1 : -1;
      return sortDesc.value ? -result : result;
    });
  }
  
  return items;
});

const paginatedItems = computed(() => {
  const start = (page.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredItems.value.slice(start, end);
});

const totalPages = computed(() => {
  return Math.ceil(filteredItems.value.length / itemsPerPage.value);
});

function sort(column: Column) {
  if (!column.sortable) return;
  
  if (sortBy.value === column.key) {
    sortDesc.value = !sortDesc.value;
  } else {
    sortBy.value = column.key;
    sortDesc.value = false;
  }
}

function formatValue(column: Column, item: any) {
  const value = item[column.key];
  if (column.formatter) {
    return column.formatter(value, item);
  }
  return value;
}

watch(filteredItems, () => {
  if (page.value > totalPages.value && totalPages.value > 0) {
    page.value = totalPages.value;
  }
});
</script>

<template>
  <div class="data-table-container">
    <!-- Barra de búsqueda y controles -->
    <div class="data-table-header" v-if="showSearch || itemsPerPageOptions.length > 1">
      <div class="search-container" v-if="showSearch">
        <v-text-field
          v-model="search"
          :placeholder="searchPlaceholder"
          density="compact"
          variant="outlined"
          prepend-inner-icon="mdi-magnify"
          hide-details
          class="search-input"
        ></v-text-field>
      </div>
      
      <div class="items-per-page" v-if="itemsPerPageOptions.length > 1">
        <span class="items-per-page-label">Mostrar:</span>
        <v-select
          v-model="itemsPerPage"
          :items="itemsPerPageOptions"
          density="compact"
          variant="outlined"
          hide-details
          class="items-per-page-select"
        ></v-select>
      </div>
    </div>
    
    <!-- Tabla -->
    <v-table>
      <thead>
        <tr>
          <th
            v-for="column in columns"
            :key="column.key"
            @click="sort(column)"
            :class="{ 'sortable': column.sortable, 'sorted': sortBy === column.key }"
          >
            {{ column.title }}
            <v-icon
              v-if="column.sortable && sortBy === column.key"
              :icon="sortDesc ? 'mdi-arrow-down' : 'mdi-arrow-up'"
              size="small"
            ></v-icon>
          </th>
          <th class="actions-column">Acciones</th>
        </tr>
      </thead>
      <tbody>
        <template v-if="paginatedItems.length > 0">
          <tr v-for="item in paginatedItems" :key="item.id">
            <td v-for="column in columns" :key="column.key">
              {{ formatValue(column, item) }}
            </td>
            <td class="actions-column">
              <v-btn
                icon="mdi-eye"
                size="small"
                variant="text"
                color="info"
                @click="emit('view', item)"
                title="Ver detalles"
              ></v-btn>
              <v-btn
                icon="mdi-pencil"
                size="small"
                variant="text"
                color="primary"
                @click="emit('edit', item)"
                title="Editar"
              ></v-btn>
              <v-btn
                icon="mdi-delete"
                size="small"
                variant="text"
                color="error"
                @click="emit('delete', item)"
                title="Eliminar"
              ></v-btn>
            </td>
          </tr>
        </template>
        <tr v-else>
          <td :colspan="columns.length + 1" class="text-center py-4">
            <div v-if="loading">
              <v-progress-circular indeterminate color="primary"></v-progress-circular>
              <div class="mt-2">Cargando datos...</div>
            </div>
            <div v-else>
              {{ noDataText }}
            </div>
          </td>
        </tr>
      </tbody>
    </v-table>
    
    <!-- Paginación -->
    <div class="pagination-container" v-if="totalPages > 1">
      <v-pagination
        v-model="page"
        :length="totalPages"
        :total-visible="5"
        rounded="circle"
      ></v-pagination>
    </div>
  </div>
</template>

<style scoped>
.data-table-container {
  width: 100%;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.data-table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background-color: #f5f5f5;
}

.search-container {
  flex: 1;
  max-width: 300px;
}

.items-per-page {
  display: flex;
  align-items: center;
  gap: 8px;
}

.items-per-page-select {
  width: 80px;
}

.sortable {
  cursor: pointer;
  user-select: none;
}

.sortable:hover {
  background-color: rgba(0, 0, 0, 0.04);
}

.sorted {
  background-color: rgba(0, 0, 0, 0.02);
}

.actions-column {
  width: 150px;
  text-align: center;
}

.pagination-container {
  display: flex;
  justify-content: center;
  padding: 16px;
  background-color: #f5f5f5;
}
</style>