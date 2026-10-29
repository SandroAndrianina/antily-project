<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { apiClient, auth } from '../api/client';

const email = ref('');
const password = ref('');
const error = ref<string | null>(null);
const router = useRouter();

const handleSubmit = async () => {
  error.value = null;
  try {
    const res = await apiClient.create<{ access_token: string }>('auth/register', {
      email: email.value,
      password: password.value,
    });
    auth.setToken(res.access_token);
    router.push('/member');
  } catch (e) {
    error.value = e instanceof Error ? e.message : "Erreur d'inscription";
  }
};
</script>

<template>
  <div class="auth-shell">
    <div class="auth-form-side">
      <div class="auth-card">
        <div class="auth-brand">Gestion de données</div>
        <h1 class="auth-title">Créer un compte</h1>
        <p class="auth-subtitle">Créez votre compte pour accéder à l'espace de gestion.</p>
        <form @submit.prevent="handleSubmit">
          <label for="email">
            Adresse email
            <input id="email" type="email" v-model="email" required />
          </label>
          <label for="password">
            Mot de passe
            <input id="password" type="password" v-model="password" minlength="6" required />
          </label>
          <p v-if="error" class="empty-state">{{ error }}</p>
          <div class="form-actions">
            <button type="submit" class="btn">Créer mon compte</button>
          </div>
        </form>
        <p class="auth-switch">Déjà un compte ? <RouterLink to="/login">Se connecter</RouterLink></p>
      </div>
    </div>
  </div>
</template>
