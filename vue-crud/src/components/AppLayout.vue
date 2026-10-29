<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import {
  PhUsers,
  PhCalendarBlank,
  PhTent,
  PhMoney,
  PhStack,
  PhShieldCheck,
  PhCreditCard,
  PhSignOut,
} from '@phosphor-icons/vue';
import '../App.css';
import { auth } from '../api/client';

const router = useRouter();

// Only the routes that really exist in router/index.ts
const navItems = [
  { to: '/member', label: 'Membres', icon: PhUsers },
  { to: '/membership-year', label: 'Années', icon: PhCalendarBlank },
  { to: '/branch', label: 'Branches', icon: PhTent },
  { to: '/membership-fee', label: 'Cotisations', icon: PhMoney },
  { to: '/territory-level', label: 'Niveaux', icon: PhStack },
  { to: '/role', label: 'Rôles', icon: PhShieldCheck },
  { to: '/membership-payment', label: 'Paiements', icon: PhCreditCard },
];

// The token payload (middle part) is readable: it contains the email
const email = computed(() => {
  try {
    const payload = auth.getToken()!.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(payload)).email as string;
  } catch {
    return '';
  }
});
const initial = computed(() => (email.value[0] ?? '?').toUpperCase());

const logout = () => {
  auth.logout();
  router.push('/login');
};
</script>

<template>
  <div class="app-shell">
    <aside class="sidebar">
      <div>
        <RouterLink to="/member" class="brand">
          <img class="brand-mark" src="/logo.png" alt="Antilin'i Madagasikara" />
          <span class="brand-text">
            <span class="brand-top">Antilin'</span>
            <span class="brand-name">Mada</span>
          </span>
          <span class="brand-tag">Vonona hatrany</span>
        </RouterLink>

        <nav class="sidebar-nav">
          <RouterLink v-for="item in navItems" :key="item.to" :to="item.to" active-class="active">
            <component :is="item.icon" :size="22" weight="fill" />
            {{ item.label }}
          </RouterLink>
        </nav>
      </div>

      <p class="sidebar-quote">Ho voninahitr’Andriamanitra</p>
      <div class="sidebar-scenery" aria-hidden="true"></div>
    </aside>

    <div class="main">
      <header class="topbar">
        <div class="user-chip">
          <span class="avatar">{{ initial }}</span>
          <div class="user-meta">
            <strong>{{ email }}</strong>
            <small>Connecté</small>
          </div>
        </div>
        <button type="button" class="btn secondary sm" @click="logout">
          <PhSignOut :size="18" weight="bold" />
          Déconnexion
        </button>
      </header>
      <main class="main-content">
        <!-- key = full path: each page change plays the transition -->
        <RouterView v-slot="{ Component, route }">
          <Transition name="page" mode="out-in">
            <component :is="Component" :key="route.path" />
          </Transition>
        </RouterView>
      </main>
    </div>
    <div class="pines" aria-hidden="true"></div>
  </div>
</template>
