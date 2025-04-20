<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useTheme, useDisplay } from 'vuetify';
import NotificationSystem from './components/NotificationSystem.vue';

const route = useRoute();
const theme = useTheme();
const { mdAndUp } = useDisplay();

// Tema claro/oscuro
const isDark = ref(false);
const toggleTheme = () => {
  isDark.value = !isDark.value;
  theme.global.name.value = isDark.value ? 'dark' : 'light';
};

const drawer = ref(true);
const rail = ref(false);

onMounted(() => {
  if (!mdAndUp.value) drawer.value = false;
});
watch(mdAndUp, val => {
  drawer.value = val;
});

const appTitle   = 'mesa 24/7';
const appLogoUrl = 'https://media.licdn.com/dms/image/v2/D4E0BAQFcuCSfL5AkqA/company-logo_200_200/company-logo_200_200/0/1700057274994/mesa_24_7_logo?e=1750291200&v=beta&t=FR4tOob3yCmeW0CBez-0ZPzYJbQ_je6Nbg-Ls3LY2GI';
const user       = { avatar: 'https://media.licdn.com/dms/image/v2/D4E03AQFADns6Xy45Og/profile-displayphoto-shrink_200_200/B4EZOBJ1S8HwAY-/0/1733038659527?e=2147483647&v=beta&t=3mjkf5XIOQQ47mW3WwEd3iELk6FZ1yfk5gnOLoMB_2o' };

// Menú
const menuItems = [
  { title: 'Comensales', icon: 'mdi-account-group', path: '/customers', color: 'primary' },
  { title: 'Reservas',    icon: 'mdi-calendar-clock', path: '/reservations', color: 'success' },
  { title: 'Mesas',       icon: 'mdi-table-chair',    path: '/tables', color: 'info' }
];

const currentPageTitle = computed(() => {
  const active = menuItems.find(i => route.path.startsWith(i.path));
  return active?.title || '';
});

// Handlers
const toggleDrawer = () => {
  drawer.value = !drawer.value;
  if (drawer.value && !mdAndUp.value) rail.value = false;
};
const onNavClick = () => {
  if (!mdAndUp.value) drawer.value = false;
};
</script>

<template>
  <v-app :theme="isDark ? 'dark' : 'light'">
    <!-- DRAWER -->
    <v-navigation-drawer
        v-model="drawer"
        :rail="rail"
        :temporary="!mdAndUp"
        :permanent="mdAndUp"
        swipeable
        width="256"
        elevation="4"
        border
    >
      <v-list-item two-line class="px-4">
        <v-list-item-avatar size="40">
          <v-img :src="appLogoUrl" alt="Logo"/>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title>{{ appTitle }}</v-list-item-title>
          <v-list-item-subtitle>Admin</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-divider class="my-2"/>

      <v-list nav dense>
        <v-list-item
            v-for="item in menuItems"
            :key="item.path"
            link
            :to="item.path"
            rounded="lg"
            :active="route.path.startsWith(item.path)"
            :active-color="item.color"
            class="mx-2 mb-1"
            @click="onNavClick"
        >
          <v-list-item-icon>
            <v-icon :color="item.color">{{ item.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
          <template v-if="!rail && route.path.startsWith(item.path)">
            <v-list-item-icon>
              <v-icon small :color="item.color">mdi-circle-small</v-icon>
            </v-list-item-icon>
</template>
        </v-list-item>
      </v-list>

      <v-spacer/>
      <v-divider/>

      <v-list dense class="pt-2">
        <v-list-item link rounded="lg" class="mx-2 mb-1" @click="toggleTheme">
          <v-list-item-icon>
            <v-icon>{{ isDark ? 'mdi-weather-night' : 'mdi-weather-sunny' }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content v-if="!rail">
            <v-list-item-title>{{ isDark ? 'Modo Oscuro' : 'Modo Claro' }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link rounded="lg" class="mx-2">
          <v-list-item-icon><v-icon>mdi-logout</v-icon></v-list-item-icon>
          <v-list-item-content v-if="!rail">
            <v-list-item-title>Cerrar Sesión</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- APP BAR -->
    <v-app-bar color="surface" elevation="2">
      <v-app-bar-nav-icon
          @click="toggleDrawer"
          icon="mdi-menu"
          color="on-surface"
      />




      <v-app-bar-title class="ml-4">{{ currentPageTitle }}</v-app-bar-title>
      <v-spacer/>

      <!-- Menú de usuario -->
      <v-menu>
        <template #activator="{ props }">
          <v-avatar v-bind="props" size="40" class="cursor-pointer">
            <v-img :src="user.avatar"/>
          </v-avatar>
</template>
        <v-list dense>
          <v-list-item link prepend-icon="mdi-account-circle">
            <v-list-item-title>Perfil</v-list-item-title>
          </v-list-item>
          <v-list-item link prepend-icon="mdi-cog">
            <v-list-item-title>Configuración</v-list-item-title>
          </v-list-item>
          <v-divider/>
          <v-list-item link prepend-icon="mdi-logout">
            <v-list-item-title>Cerrar Sesión</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <!-- CONTENIDO PRINCIPAL -->
    <v-main class="bg-background">
      <v-container fluid>
        <router-view v-slot="{ Component }">
          <v-fade-transition mode="out-in">
            <component :is="Component"/>
          </v-fade-transition>
        </router-view>
      </v-container>
    </v-main>
    <NotificationSystem />
  </v-app>
</template>

<style>
.cursor-pointer { cursor: pointer; }
</style>
