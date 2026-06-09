<template>
  <div class="w-full h-full flex flex-col bg-stone-50 overflow-hidden relative" ref="ganttContainer">
    
    <!-- Controls Layout -->
    <div class="flex justify-between items-center px-10 py-5 border-b border-stone-200 bg-white/50 backdrop-blur-md shrink-0 z-10 sticky top-0">
        <div class="flex items-center gap-3">
            <button class="btn btn-secondary text-xs h-9 w-9 flex items-center justify-center p-0" @click="zoomOut">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>
            </button>
            <span class="text-[10px] font-black uppercase tracking-widest text-stone-400 w-24 text-center">{{ cellWidth }}px / JOUR</span>
            <button class="btn btn-secondary text-xs h-9 w-9 flex items-center justify-center p-0" @click="zoomIn">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="11" y1="8" x2="11" y2="14"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>
            </button>
        </div>
        <div class="flex gap-4">
            <div class="flex items-center gap-2">
                <div class="w-2 h-2 rounded-full bg-stone-400"></div>
                <span class="text-[10px] font-bold uppercase tracking-wider text-stone-500">À faire</span>
            </div>
            <div class="flex items-center gap-2">
                <div class="w-2 h-2 rounded-full bg-primary"></div>
                <span class="text-[10px] font-bold uppercase tracking-wider text-stone-500">En cours</span>
            </div>
            <div class="flex items-center gap-2">
                <div class="w-2 h-2 rounded-full bg-stone-900"></div>
                <span class="text-[10px] font-bold uppercase tracking-wider text-stone-500">Terminé</span>
            </div>
        </div>
    </div>

    <!-- The Gantt Canvas (Scrollable) -->
    <div class="flex-grow overflow-auto relative custom-scrollbar bg-stone-50" @scroll="handleScroll">
        
        <!-- Timeline Header -->
        <div class="sticky top-0 z-20 bg-white/80 backdrop-blur-xl border-b border-stone-200 flex" :style="{ width: totalChartWidth + 'px' }">
            <div class="w-72 shrink-0 bg-white border-r border-stone-200 p-5 font-black text-[11px] uppercase tracking-[0.2em] text-stone-400 sticky left-0 z-30 flex items-center justify-between">
                <span>Dénomination</span>
            </div>
            
            <div class="flex-grow flex flex-col">
                 <!-- Months -->
                 <div class="flex border-b border-stone-200 h-10">
                     <div v-for="month in timelineMonths" :key="month.key" 
                          class="flex items-center justify-start px-4 text-[11px] font-bold border-r border-stone-100 bg-stone-50/50 uppercase tracking-widest text-stone-500"
                          :style="{ minWidth: (month.days * cellWidth) + 'px' }">
                         {{ month.label }}
                     </div>
                 </div>
                 <!-- Days -->
                 <div class="flex h-10">
                     <div v-for="day in timelineDays" :key="day.date.toISOString()"
                          class="flex flex-col items-center justify-center text-[10px] border-r border-stone-100 shrink-0"
                          :class="{'bg-primary/5 text-primary font-black': day.isToday, 'text-stone-400 font-bold': !day.isToday, 'bg-stone-100/30': day.isWeekend}"
                          :style="{ width: cellWidth + 'px' }">
                         <span>{{ day.dayOfMonth }}</span>
                     </div>
                 </div>
            </div>
        </div>

        <!-- Gantt Rows -->
        <div class="relative" :style="{ width: totalChartWidth + 'px' }">
            
            <!-- Dependency Arrows Layer (Canvas or SVG) -->
            <svg class="absolute top-0 left-0 w-full h-full pointer-events-none z-10" :width="totalChartWidth" :height="sortedTasks.length * rowHeight">
                <defs>
                    <marker id="arrowhead" markerWidth="4" markerHeight="4" refX="4" refY="2" orient="auto">
                        <path d="M0,0 L4,2 L0,4 Z" fill="#D6D3D1" />
                    </marker>
                    <marker id="arrowhead-hover" markerWidth="4" markerHeight="4" refX="4" refY="2" orient="auto">
                        <path d="M0,0 L4,2 L0,4 Z" fill="#CA8A04" />
                    </marker>
                </defs>
                
                <g v-for="(dep, index) in renderedDependencies" :key="'dep-'+index">
                    <!-- Invisible wider path for easier hovering -->
                    <path :d="dep.path" fill="none" class="stroke-transparent stroke-[15px] pointer-events-auto cursor-pointer" 
                          @mouseenter="hoveredDependency = dep.id" 
                          @mouseleave="hoveredDependency = null" />
                           
                    <!-- Visible thin path -->
                    <path :d="dep.path" fill="none" 
                          :class="hoveredDependency === dep.id ? 'stroke-primary stroke-2' : 'stroke-stone-300 stroke-[1.2px]'" 
                          :marker-end="hoveredDependency === dep.id ? 'url(#arrowhead-hover)' : 'url(#arrowhead)'"
                          class="transition-all duration-300 pointer-events-none" />
                </g>
            </svg>

            <!-- Task Rows -->
            <div v-for="(task, index) in sortedTasks" :key="task.id" 
                 class="flex border-b border-stone-100/50 hover:bg-white transition-colors group relative"
                 :style="{ height: rowHeight + 'px' }">
                
                <!-- Task Details Pane (Left Side sticky) -->
                <div class="w-72 shrink-0 bg-white group-hover:bg-stone-50 border-r border-stone-200 p-5 flex items-center justify-between sticky left-0 z-20 shadow-sm transition-colors">
                    <div class="truncate text-sm font-bold text-stone-900 pr-2 flex items-center gap-3">
                         <div class="w-3 h-3 rounded-full shrink-0 border-2 border-white shadow-sm" :class="getStatusColor(task.status)"></div>
                         <span class="truncate" :title="task.name">{{ task.name }}</span>
                    </div>
                </div>

                <!-- Timeline Grid Row -->
                <div class="flex-grow flex relative">
                    <!-- Background Grid Lines -->
                    <div v-for="day in timelineDays" :key="'grid-'+day.date.toISOString()"
                         class="border-r border-stone-100 shrink-0 h-full pointer-events-none"
                         :class="{'bg-stone-100/40': day.isWeekend, 'bg-primary/5': day.isToday}"
                         :style="{ width: cellWidth + 'px' }">
                    </div>

                    <!-- The Task Bar -->
                    <div v-if="task.start_date && task.end_date"
                         class="absolute top-1/2 -translate-y-1/2 h-7 rounded-full flex items-center px-4 cursor-move group/bar select-none z-10 transition-all duration-500"
                         :class="[getBarColor(task.status), hoveredTask === task.id ? 'shadow-2xl shadow-stone-900/20 scale-[1.02]' : 'shadow-lg shadow-stone-900/5']"
                         :style="getTaskBarStyle(task)"
                         @mouseenter="hoveredTask = task.id"
                         @mouseleave="hoveredTask = null">
                         
                         <span class="truncate z-10 text-[11px] font-black uppercase tracking-wider text-white">{{ task.name }}</span>
                         
                         <!-- Progress overlay -->
                         <div class="absolute inset-0 bg-white/20 pointer-events-none rounded-full" :style="{ width: getProgressWidth(task.status) }"></div>

                         <!-- Resize Handles -->
                         <div class="absolute left-1 w-1.5 h-1.5 rounded-full bg-white/40 cursor-ew-resize opacity-0 group-hover/bar:opacity-100 transition-opacity"></div>
                         <div class="absolute right-1 w-1.5 h-1.5 rounded-full bg-white/40 cursor-ew-resize opacity-0 group-hover/bar:opacity-100 transition-opacity"></div>
                    </div>
                </div>
            </div>

            <!-- Empty State -->
            <div v-if="sortedTasks.length === 0" class="flex flex-col items-center justify-center p-24 text-center space-y-4">
                <div class="bg-stone-100 p-6 rounded-3xl">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#D6D3D1" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                </div>
                <p class="text-stone-400 font-bold uppercase tracking-widest text-xs">Aucune tâche planifiée</p>
            </div>

        </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, nextTick } from 'vue';

const props = defineProps({
    tasks: {
        type: Array,
        required: true,
        default: () => []
    },
    dependencies: {
        type: Array,
        default: () => []
    }
});

// --- Settings & State ---
const cellWidth = ref(40); // Base zoom level (pixels per day)
const minCellWidth = 20;
const maxCellWidth = 100;
const rowHeight = 48; // Pixels per task row
const ganttContainer = ref(null);

const hoveredTask = ref(null);
const hoveredDependency = ref(null);

// --- Time Calculations Setup ---
// We need to determine the overall min/max date of the project to draw the grid
const timelineRange = computed(() => {
    if (!props.tasks || props.tasks.length === 0) {
        const today = new Date();
        const start = new Date(today); start.setDate(start.getDate() - 7);
        const end = new Date(today); end.setDate(end.getDate() + 30);
        return { start, end };
    }

    let minDate = new Date("2099-01-01");
    let maxDate = new Date("1970-01-01");

    props.tasks.forEach(task => {
        if (task.start_date) {
            const sd = new Date(task.start_date);
            if (sd < minDate) minDate = sd;
        }
        if (task.end_date) {
            const ed = new Date(task.end_date);
            if (ed > maxDate) maxDate = ed;
        }
    });

    // Add padding left (2 weeks) and right (4 weeks)
    const start = new Date(minDate);
    start.setDate(start.getDate() - 14);
    
    const end = new Date(maxDate);
    end.setDate(end.getDate() + 28);

    return { start, end };
});

const timelineDays = computed(() => {
    const days = [];
    let currentDate = new Date(timelineRange.value.start);
    const endDate = timelineRange.value.end;
    const todayStr = new Date().toISOString().split('T')[0];

    const daysOfWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

    while (currentDate <= endDate) {
        const dateStr = currentDate.toISOString().split('T')[0];
        const dayOfWeekIdx = currentDate.getDay();
        
        days.push({
            date: new Date(currentDate),
            dateString: dateStr,
            dayOfMonth: currentDate.getDate(),
            dayOfWeek: daysOfWeek[dayOfWeekIdx],
            isWeekend: dayOfWeekIdx === 0 || dayOfWeekIdx === 6,
            isToday: dateStr === todayStr
        });
        currentDate.setDate(currentDate.getDate() + 1);
    }
    return days;
});

const timelineMonths = computed(() => {
    const months = [];
    let currentMonthStr = "";
    let daysInMonth = 0;

    timelineDays.value.forEach(dayObj => {
        const monthStr = dayObj.date.toLocaleString('default', { month: 'long', year: 'numeric' });
        
        if (monthStr !== currentMonthStr) {
            if (currentMonthStr !== "") {
                months.push({ label: currentMonthStr, days: daysInMonth, key: currentMonthStr + daysInMonth });
            }
            currentMonthStr = monthStr;
            daysInMonth = 1;
        } else {
            daysInMonth++;
        }
    });
    // push last
    if (currentMonthStr !== "") {
        months.push({ label: currentMonthStr, days: daysInMonth, key: currentMonthStr + "last" });
    }

    return months;
});

const totalChartWidth = computed(() => {
    return (timelineDays.value.length * cellWidth.value) + 256; // 256px is the left panel width (w-64)
});

// --- Task Preparation ---
const sortedTasks = computed(() => {
    // Basic sorting by start date
    return [...props.tasks].sort((a, b) => {
        if (!a.start_date) return 1;
        if (!b.start_date) return -1;
        return new Date(a.start_date) - new Date(b.start_date);
    });
});

// Create a map for quick index lookups needed for Y-coordinates drawing dependencies
const taskIndexMap = computed(() => {
    const map = {};
    sortedTasks.value.forEach((task, index) => {
        map[task.id] = index;
    });
    return map;
});


// --- Drawing Logic ---

const getDaysDiff = (date1, date2) => {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    // strip time
    d1.setHours(0,0,0,0);
    d2.setHours(0,0,0,0);
    const diffTime = Math.abs(d2 - d1);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

const getTaskBarStyle = (task) => {
    if (!task.start_date || !task.end_date) return { display: 'none' };

    const startIdx = timelineDays.value.findIndex(d => d.dateString === task.start_date.split('T')[0]);
    
    // Calculate duration in days (+1 because start and end on same day = 1 day duration visually)
    const durationDays = getDaysDiff(task.start_date, task.end_date) + 1;

    // Default to putting it somewhere if not found in view (edge case handling)
    const leftPx = startIdx >= 0 ? startIdx * cellWidth.value : 0;
    const widthPx = durationDays * cellWidth.value;

    return {
        left: `${leftPx}px`,
        width: `${widthPx}px`
    };
};

const getStatusColor = (status) => {
    switch(status) {
        case 'done': return 'bg-green-500';
        case 'in_progress': return 'bg-blue-500';
        default: return 'bg-slate-500';
    }
};

const getBarColor = (status) => {
    switch(status) {
        case 'done': return 'bg-gradient-to-r from-green-600 to-green-500';
        case 'in_progress': return 'bg-gradient-to-r from-blue-600 to-blue-500';
        default: return 'bg-gradient-to-r from-slate-600 to-slate-500';
    }
};

const getProgressWidth = (status) => {
    switch(status) {
        case 'done': return '100%';
        case 'in_progress': return '50%';
        default: return '0%';
    }
};

// --- Dependency Paths SVG Generation ---
const renderedDependencies = computed(() => {
    const paths = [];

    props.dependencies.forEach(dep => {
        const predIndex = taskIndexMap.value[dep.predecessor_task_id];
        const succIndex = taskIndexMap.value[dep.successor_task_id];

        if (predIndex !== undefined && succIndex !== undefined) {
            const predTask = sortedTasks.value[predIndex];
            const succTask = sortedTasks.value[succIndex];

            if (predTask.start_date && predTask.end_date && succTask.start_date && succTask.end_date) {
                
                const predStartIdx = timelineDays.value.findIndex(d => d.dateString === predTask.start_date.split('T')[0]);
                const succStartIdx = timelineDays.value.findIndex(d => d.dateString === succTask.start_date.split('T')[0]);
                
                const predDuration = getDaysDiff(predTask.start_date, predTask.end_date) + 1;
                
                // Finish-To-Start Coordinates (Right of predecessor -> Left of successor)
                // Need to offset by 256px (left panel)
                const panelWidth = 256;
                const buffer = 15; // px from exact edge
                
                const startX = panelWidth + (predStartIdx * cellWidth.value) + (predDuration * cellWidth.value) + 4; // Add slight padding to clear resize handle
                const startY = (predIndex * rowHeight) + (rowHeight / 2);
                
                const endX = panelWidth + (succStartIdx * cellWidth.value) - 6; // Move back for arrowhead space
                const endY = (succIndex * rowHeight) + (rowHeight / 2);

                let pathData = "";

                // Standard forward dependency
                if (startX <= endX - 20) {
                     // Draw angled elbow line
                     const midX = startX + 15;
                     pathData = `M ${startX} ${startY} L ${midX} ${startY} L ${midX} ${endY} L ${endX} ${endY}`;
                } else {
                     // Backward/overlap dependency (goes around)
                     const dropY = startY + (rowHeight/2) + 5;
                     const backX = endX - 15;
                     pathData = `M ${startX} ${startY} L ${startX + 10} ${startY} L ${startX + 10} ${dropY} L ${backX} ${dropY} L ${backX} ${endY} L ${endX} ${endY}`;
                }

                paths.push({
                    id: dep.id || `temp-${dep.predecessor_task_id}-${dep.successor_task_id}`,
                    path: pathData
                });
            }
        }
    });

    return paths;
});


// --- Controls ---
const zoomIn = () => {
    if (cellWidth.value < maxCellWidth) cellWidth.value += 10;
};
const zoomOut = () => {
    if (cellWidth.value > minCellWidth) cellWidth.value -= 10;
};

// Scroll to today on mount
onMounted(() => {
    nextTick(() => {
        const todayIdx = timelineDays.value.findIndex(d => d.isToday);
        if (todayIdx !== -1 && ganttContainer.value) {
            // center slightly
            const scrollX = Math.max(0, (todayIdx * cellWidth.value) - 400); 
            // Query selector to find the exact scrollable div inside our ref
            const scrollDiv = ganttContainer.value.querySelector('.custom-scrollbar');
            if(scrollDiv) {
               scrollDiv.scrollLeft = scrollX;
            }
        }
    });
});

</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(30, 41, 59, 1); 
  border-radius: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(71, 85, 105, 1); 
  border-radius: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(100, 116, 139, 1); 
}
</style>
