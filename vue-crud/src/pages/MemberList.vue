<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { PhUploadSimple, PhUserPlus } from '@phosphor-icons/vue';
import { apiClient } from '../api/client';

type Row = Record<string, unknown>;

const rows = ref<Row[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);

const load = () => {
  loading.value = true;
  error.value = null;
  apiClient
    .list<Row>('member')
    .then((data) => { rows.value = data; })
    .catch((e) => { error.value = e instanceof Error ? e.message : 'Erreur de chargement'; })
    .finally(() => { loading.value = false; });
};

onMounted(load);

type ImportResult = { imported: number; errors: { line: number; message: string }[] };
const importResult = ref<ImportResult | null>(null);
const importError = ref<string | null>(null);

const handleFile = async (event: Event) => {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;
  importResult.value = null;
  importError.value = null;
  try {
    importResult.value = await apiClient.upload<ImportResult>('member/import', file);
    load();
  } catch (e) {
    importError.value = e instanceof Error ? e.message : "Erreur d'import";
  }
  input.value = ''; // allows choosing the same file again
};

const handleDelete = async (id: unknown) => {
  if (!window.confirm('Supprimer cet élément ?')) return;
  await apiClient.remove('member', id as string);
  load();
};
</script>

<template>
  <div>
    <div class="page-header">
      <div class="page-title">
        <h1>Gestion des membres</h1>
        <p class="page-sub">Inscription · Suivi · Vie de groupe</p>
      </div>
      <div class="page-actions">
        <label class="btn secondary">
          <PhUploadSimple :size="18" weight="bold" />
          Importer CSV
          <input type="file" accept=".csv" hidden @change="handleFile" />
        </label>
        <RouterLink class="btn" to="/member/new">
          <PhUserPlus :size="18" weight="bold" />
          Nouveau
        </RouterLink>
      </div>
    </div>
    <p v-if="importError" class="empty-state">{{ importError }}</p>
    <div v-if="importResult" class="card">
      <p>{{ importResult.imported }} membre(s) importé(s).</p>
      <ul v-if="importResult.errors.length">
        <li v-for="err in importResult.errors" :key="err.line">Ligne {{ err.line }} : {{ err.message }}</li>
      </ul>
    </div>
    <p v-if="loading">Chargement...</p>
    <p v-else-if="error" class="empty-state">{{ error }}</p>
    <p v-else-if="rows.length === 0" class="empty-state">Aucun élément pour le moment.</p>
    <div v-else class="card">
    <table>
      <thead>
        <tr>
          <th>id</th>
          <th>name</th>
          <th>firstname</th>
          <th>dateOfBirth</th>
          <th>email</th>
          <th>phone</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, i) in rows" :key="String(row.id ?? i)">
          <td>{{ (row as any).id ?? '' }}</td>
          <td>{{ (row as any).name ?? '' }}</td>
          <td>{{ (row as any).firstname ?? '' }}</td>
          <td>{{ (row as any).dateOfBirth ?? '' }}</td>
          <td>{{ (row as any).email ?? '' }}</td>
          <td>{{ (row as any).phone ?? '' }}</td>
          <td>
            <RouterLink :to="`/member/${row.id}/edit`">Modifier</RouterLink>
            <button type="button" class="btn danger" @click="handleDelete(row.id)">Supprimer</button>
          </td>
        </tr>
      </tbody>
    </table>
    </div>
  </div>
</template>
