<template>
  <div class="space-y-10 py-8">
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
      <div>
        <h1 class="text-4xl font-bold tracking-tight text-gradient">Mes Projets</h1>
        <p class="text-text-muted mt-2 text-lg">Gérez vos retroplannings et tâches avec une interface haute précision.</p>
      </div>
      <button class="btn btn-primary group">
        <span class="flex items-center gap-2">
           <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
           Nouveau Projet
        </span>
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex flex-col items-center justify-center py-24 space-y-4">
        <div class="animate-spin h-12 w-12 border-4 border-primary/30 border-t-primary rounded-full"></div>
        <p class="text-text-muted animate-pulse">Chargement de votre univers...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="card p-8 border-red-200 bg-red-50 text-red-700 flex items-center gap-4">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
        {{ error }}
    </div>

    <!-- Projects Grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <div v-for="project in projects" :key="project.id" 
           class="card p-8 group cursor-pointer relative overflow-hidden flex flex-col h-full" 
           @click="goToProject(project.id)">
        
        <!-- Decorative subtle gradient -->
        <div class="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/20 transition-all duration-500"></div>

        <div class="flex justify-between items-start mb-6 relative z-10">
            <div class="p-3 bg-background rounded-xl group-hover:bg-primary/10 transition-colors duration-500">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
            </div>
            <span class="text-[10px] font-bold tracking-widest uppercase text-text-muted bg-stone-100 px-2 py-1 rounded-md">ID-{{ project.id }}</span>
        </div>

        <h3 class="text-2xl font-bold mb-3 group-hover:text-primary transition-colors duration-300">{{ project.name }}</h3>
        <p class="text-text-muted leading-relaxed mb-auto">{{ project.description || 'Optimisez votre flux de travail avec ce nouveau projet.' }}</p>
        
        <div class="flex justify-between items-center mt-8 pt-6 border-t border-stone-100 relative z-10">
          <div class="flex flex-col">
            <span class="text-[10px] uppercase tracking-wider text-text-muted font-bold">Créé le</span>
            <span class="text-sm font-medium text-text-main">
                {{ new Date(project.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }) }}
            </span>
          </div>
          <div class="h-10 w-10 flex items-center justify-center rounded-full bg-stone-900 text-white group-hover:bg-primary transition-all duration-300 transform group-hover:translate-x-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import api from '../services/api';

const router = useRouter();
const projects = ref([]);
const loading = ref(true);
const error = ref(null);

const fetchProjects = async () => {
    loading.value = true;
    error.value = null;
    try {
        const response = await api.get('/projects');
        projects.value = response.data;
    } catch (err) {
        error.value = 'Failed to load projects. Ensure the backend is running.';
        console.error(err);
    } finally {
        loading.value = false;
    }
};

const goToProject = (id) => {
    router.push(`/project/${id}`);
};

onMounted(() => {
    fetchProjects();
});
</script>
