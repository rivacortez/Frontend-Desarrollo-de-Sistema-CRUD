<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useTheme, useDisplay } from 'vuetify';

const router = useRouter();
const route = useRoute();
const theme = useTheme();
const { mdAndUp, name: displayName } = useDisplay();

const isDark = ref(false);
const toggleTheme = () => {
  isDark.value = !isDark.value;
  theme.global.name.value = isDark.value ? 'dark' : 'light';
};

const drawer = ref(true);
const rail = ref(false);

onMounted(() => {
  if (!mdAndUp.value) {
    drawer.value = false;
  }
});

watch(mdAndUp, (newVal) => {
  if (newVal && !drawer.value) {
    drawer.value = true;
  }
});

const appTitle = ref('mesa 24/7');
const appLogoUrl = ref('https://media.licdn.com/dms/image/v2/D4E0BAQFcuCSfL5AkqA/company-logo_200_200/company-logo_200_200/0/1700057274994/mesa_24_7_logo?e=1750291200&v=beta&t=FR4tOob3yCmeW0CBez-0ZPzYJbQ_je6Nbg-Ls3LY2GI');

const menuItems = [
  {
    title: 'Comensales',
    icon: 'mdi-account-group',
    path: '/customers',
    color: 'primary'
  },
  {
    title: 'Reservas',
    icon: 'mdi-calendar-clock',
    path: '/reservations',
    color: 'success'
  },
  {
    title: 'Mesas',
    icon: 'mdi-table-chair',
    path: '/tables',
    color: 'info'
  }
];

const user = ref({
  name: 'Ely Cortez',
  role: 'Admin',
  avatar: 'https://media.licdn.com/dms/image/v2/D4E03AQFADns6Xy45Og/profile-displayphoto-shrink_200_200/B4EZOBJ1S8HwAY-/0/1733038659527?e=2147483647&v=beta&t=3mjkf5XIOQQ47mW3WwEd3iELk6FZ1yfk5gnOLoMB_2o'
});

const currentPageTitle = computed(() => {
  const currentItem = menuItems.find(item => isRouteActive(item.path));
  return currentItem ? currentItem.title : 'Dashboard';
});

const isRouteActive = (path: string): boolean => {
  return route.path.startsWith(path);
};

const navigate = (path: string): void => {
  router.push(path);
  if (!mdAndUp.value) {
    drawer.value = false;
  }
};

const toggleDrawer = () => {
  drawer.value = !drawer.value;
  if (drawer.value && !mdAndUp.value) {
    rail.value = false;
  }
};
</script>

<template>
  <v-app :theme="isDark ? 'dark' : 'light'">
    <v-navigation-drawer
        v-model="drawer"
        :rail="rail"
        :temporary="!mdAndUp"
        :permanent="mdAndUp"
        elevation="4"
        border
        width="256"
    >
      <v-list-item
          :title="appTitle"
          :subtitle="user.role"
          lines="two"
          class="py-3"
      >
        <template v-slot:prepend>
          <v-avatar size="40" rounded="0">
            <v-img :src="appLogoUrl" alt="Logo" />
          </v-avatar>
        </template>
        <template v-slot:append>
          <v-btn
              variant="text"
              :icon="rail ? 'mdi-chevron-right' : 'mdi-chevron-left'"
              @click.stop="rail = !rail"
              v-if="mdAndUp"
          ></v-btn>
        </template>
      </v-list-item>

      <v-divider class="my-2"></v-divider>
      <v-list nav density="compact">
        <v-list-item
            v-for="item in menuItems"
            :key="item.title"
            :value="item.title"
            :prepend-icon="item.icon"
            :title="item.title"
            @click="navigate(item.path)"
            :active="isRouteActive(item.path)"
            :color="item.color"
            rounded="lg"
            class="mb-1 mx-2"
        >
          <template v-slot:append v-if="!rail && isRouteActive(item.path)">
            <v-icon :color="item.color" icon="mdi-circle-small"></v-icon>
          </template>
        </v-list-item>
      </v-list>

      <template v-slot:append>
        <div class="pa-2">
          <v-divider class="mb-2"></v-divider>
          <v-list>
            <v-list-item @click="toggleTheme" rounded="lg">
              <template v-slot:prepend>
                <v-icon :icon="isDark ? 'mdi-weather-night' : 'mdi-weather-sunny'"></v-icon>
              </template>
              <v-list-item-title v-if="!rail">{{ isDark ? 'Modo Oscuro' : 'Modo Claro' }}</v-list-item-title>
            </v-list-item>

            <v-list-item rounded="lg" prepend-icon="mdi-logout" title="Cerrar Sesión"></v-list-item>
          </v-list>
        </div>
      </template>
    </v-navigation-drawer>
    <v-app-bar
        elevation="2"
        color="surface"
    >
      <template v-slot:prepend>
        <v-app-bar-nav-icon @click="toggleDrawer"></v-app-bar-nav-icon>

        <v-avatar size="32" rounded="0" class="ml-2 d-none d-md-flex">
        </v-avatar>
      </template>

      <v-app-bar-title class="text-h6 font-weight-bold ml-2">
        {{ currentPageTitle }}
      </v-app-bar-title>

      <template v-slot:append>

        <v-menu transition="slide-y-transition">
          <template v-slot:activator="{ props }">
            <v-avatar
                v-bind="props"
                class="ml-2 cursor-pointer"
                size="40"
            >
              <v-img :src="user.avatar" alt="User"></v-img>
            </v-avatar>
          </template>
          <v-list>
            <v-list-item title="Perfil" prepend-icon="mdi-account-circle"></v-list-item>
            <v-list-item title="Configuración" prepend-icon="mdi-cog"></v-list-item>
            <v-divider></v-divider>
            <v-list-item title="Cerrar Sesión" prepend-icon="mdi-logout"></v-list-item>
          </v-list>
        </v-menu>
      </template>
    </v-app-bar>

    <!-- Main Content -->
    <v-main class="bg-background">
      <v-container fluid>
        <router-view v-slot="{ Component }">
          <v-fade-transition mode="out-in">
            <component :is="Component" />
          </v-fade-transition>
        </router-view>
      </v-container>
    </v-main>



  </v-app>
</template>

<style>
@import '@mdi/font/css/materialdesignicons.css';

:root {
  font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
  line-height: 1.5;
  font-weight: 400;
}

body {
  margin: 0;
  min-height: 100vh;
}

.cursor-pointer {
  cursor: pointer;
}

.v-navigation-drawer {
  z-index: 1000 !important;
}

.v-list-item--active {
  font-weight: bold;
}
</style>