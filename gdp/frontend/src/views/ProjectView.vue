<template>
  <div class="h-[calc(100vh-12rem)] flex flex-col gap-8">
    <!-- Project Header -->
    <div v-if="project" class="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
      <div class="space-y-2">
        <div class="flex items-center gap-4">
            <router-link to="/" class="p-2 bg-stone-100 hover:bg-stone-200 rounded-full transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
            </router-link>
            <h1 class="text-4xl font-black tracking-tighter text-stone-900">{{ project.name }}</h1>
        </div>
        <p class="text-text-muted text-lg max-w-2xl font-medium">{{ project.description }}</p>
      </div>
      <div class="flex items-center gap-3 w-full md:w-auto">
        <button class="btn btn-secondary flex-grow md:flex-grow-0">Partager</button>
        <button class="btn btn-primary flex-grow md:flex-grow-0 flex items-center justify-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            Ajouter une tâche
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex-grow flex flex-col items-center justify-center space-y-4">
        <div class="animate-spin h-12 w-12 border-4 border-primary/30 border-t-primary rounded-full"></div>
        <p class="text-text-muted font-bold tracking-widest uppercase text-[10px]">Synchronisation...</p>
    </div>

    <div v-else-if="error" class="card p-8 border-red-200 bg-red-50 text-red-700">
        {{ error }}
    </div>

    <!-- Main Content Area: The Gantt Chart -->
    <div v-else-if="project" class="flex-grow glass-effect rounded-[2.5rem] overflow-hidden flex flex-col relative border-stone-200 shadow-2xl">
       <GanttChart :tasks="tasks" :dependencies="dependencies" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import api from '../services/api';
import GanttChart from '../components/GanttChart.vue';

const route = useRoute();
const projectId = route.params.id;

const project = ref(null);
const tasks = ref([]);
const dependencies = ref([]);

const loading = ref(true);
const error = ref(null);

const fetchProjectData = async () => {
    loading.value = true;
    error.value = null;
    try {
        // Fetch project details
        const projectRes = await api.get(`/projects/${projectId}`);
        project.value = projectRes.data;

        // Fetch tasks and dependencies
        const tasksRes = await api.get(`/tasks/project/${projectId}`);
        tasks.value = tasksRes.data.tasks;
        dependencies.value = tasksRes.data.dependencies;

    } catch (err) {
        error.value = 'Failed to load project details.';
        console.error(err);
    } finally {
        loading.value = false;
    }
}

onMounted(() => {
    fetchProjectData();
});
</script>
