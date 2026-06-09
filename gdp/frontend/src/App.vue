<template>
  <div class="min-h-screen bg-background text-text-main flex flex-col selection:bg-primary/30 selection:text-primary">
    <!-- Premium Header -->
    <header class="glass-effect top-0 z-50 sticky px-8 py-5 flex justify-between items-center mx-auto w-full max-w-[1600px] mt-4 rounded-full border-stone-200">
        <div class="flex items-center gap-3">
          <div class="bg-stone-900 p-2 rounded-xl shadow-lg">
             <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#CA8A04" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="3" x2="9" y2="21"></line><line x1="15" y1="3" x2="15" y2="21"></line><line x1="3" y1="9" x2="21" y2="9"></line><line x1="3" y1="15" x2="21" y2="15"></line></svg>
          </div>
          <h1 class="text-2xl font-black tracking-tighter text-stone-900">
            ANTIGRAVITY<span class="text-primary">GDP</span>
          </h1>
        </div>
        <nav class="hidden md:flex items-center gap-8">
            <router-link to="/" class="text-sm font-bold uppercase tracking-widest text-text-muted hover:text-primary transition-all">Dashboard</router-link>
            <span class="h-4 w-px bg-stone-200"></span>
            <div class="flex items-center gap-4">
               <div class="h-8 w-8 rounded-full bg-stone-200 border-2 border-white"></div>
               <span class="text-xs font-bold text-stone-900">Cécile D.</span>
            </div>
        </nav>
    </header>

    <main class="flex-grow p-8 w-full max-w-7xl mx-auto">
      <router-view />
    </main>

    <footer class="py-10 text-center text-text-muted text-xs font-medium tracking-tight">
       &copy; 2026 Antigravity Systems • Propulsé par UI UX Pro Max
    </footer>
  </div>
</template>

<script setup>
// Main App Component
</script>
