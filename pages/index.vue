<template>
  <div class="max-w-md mx-auto px-4 py-6 md:max-w-2xl lg:max-w-4xl min-h-screen">
    <!-- Header & Dashboard -->
    <header class="mb-10">
      <div class="flex items-center justify-between mb-10">
        <div class="flex flex-col">
          <h1 class="text-3xl font-black flex items-center gap-3">
            <div class="p-2 bg-gradient-to-tr from-blue-600 to-cyan-400 rounded-2xl shadow-lg shadow-blue-500/20">
              <LucideZap class="text-white w-6 h-6" />
            </div>
            <span class="tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">NEXUS PARTS</span>
          </h1>
          <span class="text-[10px] font-black text-blue-500/60 uppercase tracking-[0.2em] ml-12 -mt-1">Core Intelligence</span>
        </div>
        <div class="flex gap-3">
          <button @click="showSettings = true" class="p-3.5 bg-gray-950 border border-gray-800/50 rounded-2xl hover:bg-gray-900 transition-all text-gray-500 hover:text-blue-400 shadow-xl group">
            <LucideSettings class="w-6 h-6 group-hover:rotate-90 transition-transform duration-500" />
          </button>
          <button @click="toggleForm" class="p-3.5 bg-blue-600 border border-blue-500/30 rounded-2xl hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/20 text-white">
            <LucidePlus v-if="!showForm" class="w-6 h-6" />
            <LucideX v-else class="w-6 h-6" />
          </button>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-4 md:grid-cols-4">
        <div class="card p-5 bg-gray-950/50 border-gray-800/50 hover:border-blue-500/20 transition-all group">
          <div class="flex items-center justify-between mb-4">
             <div class="p-2 bg-blue-500/10 rounded-xl text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                <LucideRepeat class="w-4 h-4" />
             </div>
             <span class="text-[9px] text-gray-500 uppercase font-black tracking-widest">Movimentações</span>
          </div>
          <div class="flex items-baseline gap-1">
            <span class="text-4xl font-black text-white">{{ stats.total }}</span>
          </div>
        </div>

        <div class="card p-5 bg-gray-950/50 border-gray-800/50 hover:border-yellow-500/20 transition-all group">
          <div class="flex items-center justify-between mb-4">
             <div class="p-2 bg-yellow-500/10 rounded-xl text-yellow-500 group-hover:bg-yellow-500 group-hover:text-black transition-colors">
                <LucideClock class="w-4 h-4" />
             </div>
             <span class="text-[9px] text-yellow-500/50 uppercase font-black tracking-widest">Pendentes</span>
          </div>
          <span class="text-4xl font-black text-yellow-500">{{ stats.pending }}</span>
        </div>

        <div class="card p-5 bg-gray-950/50 border-gray-800/50 hover:border-red-500/20 transition-all group">
          <div class="flex items-center justify-between mb-4">
             <div class="p-2 bg-red-500/10 rounded-xl text-red-500 group-hover:bg-red-500 group-hover:text-white transition-colors">
                <LucideAlertCircle class="w-4 h-4" />
             </div>
             <span class="text-[9px] text-red-500/50 uppercase font-black tracking-widest">Atrasadas</span>
          </div>
          <span class="text-4xl font-black text-red-500">{{ stats.overdue }}</span>
        </div>

        <div class="card p-5 bg-gray-950/50 border-gray-800/50 hover:border-emerald-500/20 transition-all group">
          <div class="flex items-center justify-between mb-4">
             <div class="p-2 bg-emerald-500/10 rounded-xl text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                <LucideCheckCircle class="w-4 h-4" />
             </div>
             <span class="text-[9px] text-emerald-500/50 uppercase font-black tracking-widest">Finalizadas</span>
          </div>
          <span class="text-4xl font-black text-emerald-500">{{ stats.returned }}</span>
        </div>
      </div>
    </header>

    <!-- Form Section -->
    <section v-if="showForm" class="mb-12 space-y-4 animate-in slide-in-from-top duration-500">
      <div class="card bg-gray-900/40 backdrop-blur-xl border-blue-500/20 ring-1 ring-blue-500/10 p-8 shadow-2xl">
        <div class="flex items-center justify-between mb-8">
          <h2 class="text-2xl font-black flex items-center gap-4 text-white">
            <div :class="isEditing ? 'bg-blue-500 shadow-blue-500/50' : 'bg-cyan-500 shadow-cyan-500/50'" class="w-2.5 h-2.5 rounded-full animate-pulse shadow-lg"></div>
            {{ isEditing ? 'Ajustar Cadastro' : 'Nova Movimentação' }}
          </h2>
          <span class="text-[10px] font-black text-gray-500 uppercase tracking-widest italic">Operational Flow</span>
        </div>
        <form @submit.prevent="registerLoan" class="space-y-8">
          <div class="space-y-6">
            <div class="space-y-3">
              <label class="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Descrição Técnica da Peça</label>
              <div class="relative group">
                <input v-model="form.partName" type="text" placeholder="Ex: Módulo Display Original iPhone 13 Pro" class="input py-5 text-lg pl-14 bg-gray-950/80 border-gray-800 focus:border-blue-500/50 transition-all" required />
                <LucideCpu class="absolute left-5 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-blue-500 transition-colors w-5 h-5" />
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-3">
                <label class="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Loja de Origem</label>
                <div class="relative">
                  <select v-model="form.fromStore" class="input py-4 h-14 pl-12 bg-gray-950/80 border-gray-800 appearance-none" required>
                    <option value="" disabled>Selecione a origem</option>
                    <option v-for="s in stores" :key="s.id" :value="s.name">{{ s.name }}</option>
                    <option v-if="!stores?.length" value="Unidade Alpha">Unidade Alpha (Padrão)</option>
                  </select>
                  <LucideWarehouse class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 w-5 h-5 pointer-events-none" />
                </div>
              </div>
              <div class="space-y-3">
                <label class="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Loja de Destino</label>
                <div class="relative">
                  <select v-model="form.toStore" class="input py-4 h-14 pl-12 bg-gray-950/80 border-gray-800 appearance-none" required>
                    <option value="" disabled>Selecione o destino</option>
                    <option v-for="s in stores" :key="s.id" :value="s.name">{{ s.name }}</option>
                    <option v-if="!stores?.length" value="Unidade Beta">Unidade Beta</option>
                  </select>
                  <LucideSend class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 w-5 h-5 pointer-events-none" />
                </div>
              </div>
              <div class="space-y-3">
                <label class="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Técnico Responsável</label>
                <div class="relative">
                  <select v-model="form.employeeName" class="input py-4 h-14 pl-12 bg-gray-950/80 border-gray-800 appearance-none" required>
                    <option value="" disabled>Quem realizou a retirada?</option>
                    <option v-for="e in filteredEmployeesForForm" :key="e.id" :value="e.name">{{ e.name }}</option>
                    <option v-if="!employees?.length" value="Técnico Nível 1">Técnico Nível 1</option>
                  </select>
                  <LucideUserCheck class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 w-5 h-5 pointer-events-none" />
                </div>
              </div>
              <div class="space-y-3">
                <label class="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Data Limite de Retorno</label>
                <div class="relative">
                  <input v-model="form.expectedReturn" type="date" class="input py-4 h-14 pl-12 bg-gray-950/80 border-gray-800" required />
                  <LucideCalendarClock class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 w-5 h-5 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>
          <div class="flex gap-4">
            <button v-if="isEditing" type="button" @click="resetForm" class="flex-1 bg-gray-950 text-gray-400 font-black py-4 rounded-2xl hover:bg-gray-900 border border-gray-800 transition-all uppercase text-xs tracking-widest">
              Interromper
            </button>
            <button type="submit" class="flex-[3] bg-blue-600 text-white font-black py-4 rounded-2xl hover:bg-blue-500 transition-all shadow-xl shadow-blue-600/30 flex items-center justify-center gap-3 uppercase text-xs tracking-[0.2em]" :disabled="loading">
              <LucideLoader2 v-if="loading" class="w-5 h-5 animate-spin" />
              <LucideTerminal v-else class="w-5 h-5" />
              {{ isEditing ? 'Confirmar Ajuste' : 'Executar Registro' }}
            </button>
          </div>
        </form>
      </div>
    </section>

    <!-- Navigation Tabs -->
    <div class="flex bg-gray-950/50 p-1.5 rounded-2xl border border-gray-800/50 mb-8 sticky top-4 z-40 backdrop-blur-md">
      <button v-for="tab in ['pendentes', 'atrasados', 'devolvidos']" :key="tab" 
        @click="activeTab = tab"
        class="flex-1 py-3.5 px-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
        :class="activeTab === tab ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'">
        {{ tab }}
      </button>
    </div>

    <!-- Loans List -->
    <section class="space-y-5">
      <div v-if="pending" class="flex flex-col items-center py-20 gap-4 text-gray-500">
        <LucideLoader2 class="w-10 h-10 animate-spin text-blue-500" />
        <p class="font-medium animate-pulse tracking-widest uppercase text-xs">Sincronizando Banco de Dados...</p>
      </div>

      <div v-else-if="filteredLoans.length === 0" class="card bg-gray-900/20 border-gray-800/50 border-dashed text-center py-20">
        <LucidePackage class="w-12 h-12 text-gray-700 mx-auto mb-4" />
        <p class="text-gray-500 font-medium">Nenhum empréstimo registrado nesta categoria.</p>
      </div>

      <div v-for="loan in filteredLoans" :key="loan.id" 
        class="card group hover:shadow-2xl hover:shadow-blue-500/10 hover:border-blue-500/40 transition-all relative overflow-hidden bg-gray-900/20 border-gray-800/60 p-6" 
        :class="{ 'opacity-40 grayscale scale-[0.98]': loan.returnDate }">
        
        <!-- Action Buttons Overlay -->
        <div class="absolute top-6 right-6 flex gap-2 invisible group-hover:visible animate-in fade-in zoom-in duration-300">
          <button @click="editLoan(loan)" class="p-2.5 bg-gray-950 border border-gray-800 hover:bg-blue-600 text-gray-500 hover:text-white rounded-xl transition-all shadow-2xl">
            <LucideEdit2 class="w-4 h-4" />
          </button>
          <button @click="deleteLoan(loan.id)" class="p-2.5 bg-gray-950 border border-gray-800 hover:bg-red-600 text-gray-500 hover:text-white rounded-xl transition-all shadow-2xl">
            <LucideTrash2 class="w-4 h-4" />
          </button>
        </div>

        <div class="flex items-center gap-6 mb-8">
           <!-- Quem Pegou (Destino) -->
           <div class="flex flex-col items-center gap-2">
             <div class="w-16 h-16 rounded-[1.25rem] bg-gray-950 flex items-center justify-center overflow-hidden border border-blue-500/30 shadow-inner group-hover:border-blue-500 transition-all scale-110">
               <img v-if="getStoreLogo(loan.toStore)" :src="getStoreLogo(loan.toStore)" class="w-full h-full object-cover" />
               <LucideCpu v-else class="text-blue-500 w-7 h-7" />
             </div>
             <span class="text-[8px] font-black text-blue-500 uppercase tracking-widest">Destino</span>
           </div>

           <div class="flex flex-col items-center justify-center text-gray-700 animate-pulse">
             <LucideArrowLeft class="w-5 h-5 mb-1" />
             <div class="h-0.5 w-6 bg-current rounded-full"></div>
           </div>

           <!-- De Onde Pegou (Origem) -->
           <div class="flex flex-col items-center gap-2">
             <div class="w-14 h-14 rounded-2xl bg-gray-950 flex items-center justify-center overflow-hidden border border-gray-800 shadow-inner group-hover:border-gray-700 transition-colors">
               <img v-if="getStoreLogo(loan.fromStore)" :src="getStoreLogo(loan.fromStore)" class="w-full h-full object-cover" />
               <LucideBuilding2 v-else class="text-gray-700 w-6 h-6" />
             </div>
             <span class="text-[8px] font-black text-gray-700 uppercase tracking-widest">Origem</span>
           </div>

           <div class="flex-1 ml-4">
              <h3 class="text-xl font-black tracking-tight text-white group-hover:text-blue-400 transition-colors">{{ loan.partName }}</h3>
              <div class="flex items-center gap-3 mt-2">
                 <span :class="getStatusClass(loan)" class="text-[9px] font-black uppercase px-2.5 py-1 rounded-lg tracking-[0.2em] border border-current shadow-sm shadow-black/50 bg-black/20">
                    {{ getStatusLabel(loan) }}
                 </span>
                 <span class="text-[9px] font-black text-gray-600 uppercase tracking-widest">ID: #{{ String(loan.id).padStart(4, '0') }}</span>
              </div>
           </div>
        </div>

        <!-- Details List -->
        <div class="space-y-4 p-1">
          <div class="flex items-center gap-4 text-sm group/item">
            <div class="w-10 h-10 rounded-xl bg-blue-600/10 flex items-center justify-center text-blue-500 group-hover/item:bg-blue-600 group-hover/item:text-white transition-all shrink-0 border border-blue-500/10">
              <LucideUserCheck class="w-5 h-5" />
            </div>
            <div class="flex flex-col">
              <span class="text-[9px] text-gray-500 uppercase font-black tracking-widest leading-none mb-1">Responsável</span>
              <span class="font-bold text-gray-200 text-base">{{ loan.employeeName }}</span>
            </div>
          </div>

          <div class="flex items-center gap-4 text-sm group/item">
            <div class="w-10 h-10 rounded-xl bg-orange-600/10 flex items-center justify-center text-orange-500 group-hover/item:bg-orange-600 group-hover/item:text-white transition-all shrink-0 border border-orange-500/10">
              <LucideShuffle class="w-5 h-5" />
            </div>
            <div class="flex flex-col">
              <span class="text-[9px] text-gray-500 uppercase font-black tracking-widest leading-none mb-1">Fluxo Nexus</span>
              <div class="flex items-center gap-3 font-black text-gray-200">
                <span class="text-gray-400">{{ loan.fromStore }}</span>
                <LucideArrowRight class="w-4 h-4 text-gray-700 animate-pulse" />
                <span class="text-blue-400">{{ loan.toStore }}</span>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4 mt-6">
            <div class="bg-gray-950/80 p-4 rounded-2xl border border-gray-800/50 hover:border-gray-700 transition-colors">
               <div class="flex items-center gap-3 mb-2">
                  <LucideCalendar class="w-3.5 h-3.5 text-gray-600" />
                  <span class="text-[8px] text-gray-600 uppercase font-black tracking-widest">Início</span>
               </div>
               <span class="text-xs font-black text-gray-400 tracking-wider">{{ formatDate(loan.loanDate) }}</span>
            </div>

            <div class="bg-gray-950/80 p-4 rounded-2xl border transition-all" :class="getStatusLabel(loan) === 'Atrasado' ? 'border-red-500/30 bg-red-500/5' : 'border-gray-800/50'">
               <div class="flex items-center gap-3 mb-2">
                  <LucideTarget class="w-3.5 h-3.5 text-gray-600" />
                  <span class="text-[8px] text-gray-600 uppercase font-black tracking-widest">Prazo Final</span>
               </div>
               <span class="text-xs font-black tracking-wider" :class="getStatusLabel(loan) === 'Atrasado' ? 'text-red-500' : 'text-emerald-500'">{{ formatDate(loan.expectedReturn) }}</span>
            </div>
          </div>
        </div>

        <div v-if="!loan.returnDate" class="mt-8">
          <button @click="markAsReturned(loan.id)" class="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-3 transition-all shadow-xl shadow-blue-900/20 active:scale-[0.98] uppercase text-[10px] tracking-[0.3em]">
            <LucideCheckCircle class="w-5 h-5 shadow-lg" />
            Log: Finalizar Movimentação
          </button>
        </div>
        <div v-else class="mt-8 py-4 bg-gray-950/50 rounded-2xl border border-emerald-500/30 text-center text-[9px] text-emerald-500 font-black uppercase tracking-[0.3em] flex items-center justify-center gap-2">
          <LucideCheck class="w-4 h-4" />
          Nexus Log: Arquivado em {{ formatDate(loan.returnDate) }}
        </div>
      </div>
    </section>

    <!-- Settings Modal: Nexus Core -->
    <div v-if="showSettings" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-950/90 backdrop-blur-xl animate-in fade-in duration-500">
      <div class="bg-gray-900/80 border border-blue-500/20 rounded-[2.5rem] w-full max-w-xl max-h-[85vh] flex flex-col shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden ring-1 ring-white/5">
        <div class="p-8 border-b border-gray-800 flex items-center justify-between bg-gray-950/30">
          <div class="flex flex-col">
            <h2 class="text-2xl font-black flex items-center gap-3 text-white">
              <LucideSettings class="text-blue-500 w-6 h-6 animate-[spin_10s_linear_infinite]" />
              Nexus Core
            </h2>
            <span class="text-[9px] font-black text-blue-500/50 uppercase tracking-[0.3em] ml-9 mt-1">System Configurations</span>
          </div>
          <button @click="showSettings = false" class="p-3 bg-gray-950 border border-gray-800 hover:bg-gray-800 rounded-2xl transition-all group">
            <LucideX class="w-6 h-6 text-gray-500 group-hover:text-red-400 group-hover:rotate-90 transition-all duration-300" />
          </button>
        </div>

        <div class="p-8 overflow-y-auto space-y-12 no-scrollbar custom-scrollbar">
          <!-- Employees Management -->
          <div class="space-y-6">
            <div class="flex items-center justify-between border-b border-gray-800 pb-4">
               <h3 class="font-black text-gray-400 flex items-center gap-3 uppercase text-[10px] tracking-[0.2em]">
                 <LucideUserCheck class="w-4 h-4 text-blue-500" />
                 Agentes Técnicos
               </h3>
               <span class="text-[9px] font-bold text-gray-600 px-2 py-0.5 bg-gray-950 rounded border border-gray-800 uppercase tracking-widest">{{ employees?.length || 0 }} Ativos</span>
            </div>
            
            <div class="space-y-4 bg-gray-950/50 p-6 rounded-3xl border border-gray-800 shadow-inner">
              <div class="space-y-4">
                <input v-model="newEmployee.name" type="text" placeholder="Nome Completo do Agente" class="input py-4 bg-gray-900 border-gray-800 focus:border-blue-500/30" />
                <div class="flex gap-3">
                  <select v-model="newEmployee.storeId" class="input py-4 flex-1 bg-gray-900 border-gray-800">
                    <option value="">Status: Freelancer / Sem Sede</option>
                    <option v-for="s in stores" :key="s.id" :value="s.id">{{ s.name }}</option>
                  </select>
                  <button @click="addEmployee" class="bg-blue-600 px-8 rounded-2xl hover:bg-blue-500 transition-all font-black text-[10px] uppercase tracking-widest text-white shadow-lg shadow-blue-600/20 active:scale-95">
                    Link
                  </button>
                </div>
              </div>
            </div>

            <div class="grid grid-cols-1 gap-3">
              <div v-for="e in employees" :key="e.id" class="flex items-center justify-between bg-gray-950/40 p-5 rounded-2xl border border-gray-800/50 group/item hover:border-blue-500/20 transition-all">
                <div class="flex items-center gap-4">
                  <div class="w-10 h-10 rounded-xl bg-gray-900 border border-gray-800 flex items-center justify-center text-gray-600 font-black text-xs">
                    {{ e.name.charAt(0) }}
                  </div>
                  <div class="flex flex-col">
                    <span class="font-bold text-gray-100">{{ e.name }}</span>
                    <span v-if="e.storeId" class="text-[8px] text-blue-500/60 font-black uppercase tracking-[0.1em]">
                      Alocado em {{ getStoreNameById(e.storeId) }}
                    </span>
                    <span v-else class="text-[8px] text-gray-600 font-black uppercase tracking-[0.1em]">Agente Externo</span>
                  </div>
                </div>
                <button @click="deleteEmployee(e.id)" class="text-gray-600 p-2.5 hover:bg-red-500/10 hover:text-red-500 rounded-xl transition-all">
                  <LucideTrash2 class="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <!-- Stores Management -->
          <div class="space-y-6">
            <div class="flex items-center justify-between border-b border-gray-800 pb-4">
               <h3 class="font-black text-gray-400 flex items-center gap-3 uppercase text-[10px] tracking-[0.2em]">
                 <LucideWarehouse class="w-4 h-4 text-cyan-500" />
                 Unidades Operacionais
               </h3>
               <span class="text-[9px] font-bold text-gray-600 px-2 py-0.5 bg-gray-950 rounded border border-gray-800 uppercase tracking-widest">{{ stores?.length || 0 }} Bases</span>
            </div>

            <div class="space-y-5 bg-gray-950/50 p-6 rounded-3xl border border-gray-800 shadow-inner">
              <div class="flex items-center gap-6">
                <div class="w-20 h-20 bg-gray-900 rounded-[1.5rem] flex items-center justify-center border border-dashed border-gray-700 overflow-hidden relative group cursor-pointer hover:border-cyan-500/50 transition-colors">
                   <img v-if="newStore.logo" :src="newStore.logo" class="w-full h-full object-cover" />
                   <div v-else class="flex flex-col items-center gap-2 text-gray-600 group-hover:text-cyan-400 transition-colors">
                      <LucideImage class="w-6 h-6" />
                      <span class="text-[8px] font-black uppercase tracking-tighter">Avatar</span>
                   </div>
                   <input type="file" @change="onLogoChange" class="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" />
                </div>
                <div class="flex-1 space-y-4">
                   <input v-model="newStore.name" type="text" placeholder="Identificação da Unidade" class="input py-4 bg-gray-900 border-gray-800 focus:border-cyan-500/30" />
                   <button @click="addStore" class="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-black py-3.5 rounded-2xl transition-all shadow-lg shadow-cyan-600/10 uppercase text-[9px] tracking-widest active:scale-95">
                    Inicializar Base
                  </button>
                </div>
              </div>
            </div>

            <div class="grid grid-cols-1 gap-3">
              <div v-for="s in stores" :key="s.id" class="flex items-center justify-between bg-gray-950/40 p-5 rounded-2xl border border-gray-800/50 group/item hover:border-cyan-500/20 transition-all">
                <div class="flex items-center gap-4">
                  <div class="w-12 h-12 rounded-xl bg-gray-950 flex items-center justify-center overflow-hidden border border-gray-800 shadow-inner group-hover/item:border-cyan-500/30 transition-colors">
                    <img v-if="s.logo" :src="s.logo" class="w-full h-full object-cover" />
                    <LucideBuilding2 v-else class="w-5 h-5 text-gray-700" />
                  </div>
                  <div class="flex flex-col">
                    <span class="font-bold text-gray-100">{{ s.name }}</span>
                    <span class="text-[8px] text-gray-600 font-black uppercase tracking-[0.1em]">Status: Operacional</span>
                  </div>
                </div>
                <button @click="deleteStore(s.id)" class="text-gray-600 p-2.5 hover:bg-red-500/10 hover:text-red-500 rounded-xl transition-all">
                  <LucideTrash2 class="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div class="p-4 bg-gray-950/50 border-t border-gray-800 text-center">
           <span class="text-[8px] font-black text-gray-700 uppercase tracking-[0.4em]">Nexus Parts v2.0 // Core Intelligence</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { 
  LucidePackage, LucidePlus, LucideX, LucidePlusCircle, 
  LucideSearch, LucideUser, LucideCalendar, LucideStore, 
  LucideArrowRight, LucideCheckCircle, LucideLoader2, LucideCheck,
  LucideEdit2, LucideTrash2, LucideSettings, LucideImage, LucideBuilding2,
  LucideClock, LucideAlertCircle, LucideHistory
} from 'lucide-vue-next'
import { format, isAfter, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'

const showForm = ref(false)
const showSettings = ref(false)
const search = ref('')
const activeFilter = ref('all')
const loading = ref(false)
const isEditing = ref(false)
const editingId = ref(null)

const filterOptions = [
  { label: 'Todos', value: 'all' },
  { label: 'Pendentes', value: 'pending' },
  { label: 'Atrasados', value: 'overdue' },
  { label: 'Devolvidos', value: 'returned' }
]

const form = ref({
  partName: '',
  fromStore: '',
  toStore: '',
  employeeName: '',
  expectedReturn: new Date().toISOString().split('T')[0]
})

// Fetch Data
const { data, pending, refresh } = await useFetch('/api/loans', {
  query: computed(() => ({
    search: search.value,
    filter: activeFilter.value
  }))
})

const { data: employees, refresh: refreshEmployees } = await useFetch('/api/employees')
const { data: stores, refresh: refreshStores } = await useFetch('/api/stores')

const loans = computed(() => data.value?.loans || [])
const stats = computed(() => data.value?.stats || { total: 0, pending: 0, overdue: 0, returned: 0 })

const filteredEmployeesForForm = computed(() => {
  if (!form.value.toStore || isEditing.value) return employees.value || []
  const store = stores.value?.find(s => s.name === form.value.toStore)
  if (!store) return employees.value || []
  return (employees.value || []).filter(e => e.storeId === store.id)
})

const filteredLoans = computed(() => loans.value)

const toggleForm = () => {
  if (showForm.value && isEditing.value) {
    resetForm()
  } else {
    showForm.value = !showForm.value
  }
}

const resetForm = () => {
  form.value = {
    partName: '',
    fromStore: '',
    toStore: '',
    employeeName: '',
    expectedReturn: new Date().toISOString().split('T')[0]
  }
  isEditing.value = false
  editingId.value = null
  showForm.value = false
}

const registerLoan = async () => {
  loading.value = true
  try {
    const url = isEditing.value ? `/api/loans/${editingId.value}` : '/api/loans'
    const method = isEditing.value ? 'PUT' : 'POST'
    
    await $fetch(url, {
      method,
      body: {
        ...form.value,
        brand: '', // Legacy support
        model: ''  // Legacy support
      }
    })
    resetForm()
    await refresh()
  } catch (err) {
    alert('Erro ao salvar empréstimo')
    console.error(err)
  } finally {
    loading.value = false
  }
}

const editLoan = (loan) => {
  const brandModelSuffix = [loan.brand, loan.model].filter(Boolean).join(' ')
  form.value = {
    partName: loan.brand || loan.model ? `${loan.partName} ${brandModelSuffix}` : loan.partName,
    fromStore: loan.fromStore,
    toStore: loan.toStore,
    employeeName: loan.employeeName,
    expectedReturn: loan.expectedReturn.split('T')[0]
  }
  isEditing.value = true
  editingId.value = loan.id
  showForm.value = true
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const deleteLoan = async (id) => {
  if (!confirm('Tem certeza que deseja excluir este registro?')) return
  try {
    await $fetch(`/api/loans/${id}`, { method: 'DELETE' })
    await refresh()
  } catch (err) {
    alert('Erro ao excluir')
  }
}

const markAsReturned = async (id) => {
  if (!confirm('Deseja marcar como devolvido?')) return
  try {
    await $fetch(`/api/loans/${id}/return`, { method: 'PATCH' })
    await refresh()
  } catch (err) {
    alert('Erro ao atualizar status')
  }
}

// Stores & Employees Management
const newEmployee = ref({ name: '', storeId: '' })
const newStore = ref({ name: '', logo: '' })

const addEmployee = async () => {
  if (!newEmployee.value.name) return
  await $fetch('/api/employees', { method: 'POST', body: newEmployee.value })
  newEmployee.value = { name: '', storeId: '' }
  await refreshEmployees()
}

const deleteEmployee = async (id) => {
  await $fetch(`/api/employees/${id}`, { method: 'DELETE' })
  await refreshEmployees()
}

const addStore = async () => {
  if (!newStore.value.name) return
  await $fetch('/api/stores', { method: 'POST', body: newStore.value })
  newStore.value = { name: '', logo: '' }
  await refreshStores()
}

const deleteStore = async (id) => {
  await $fetch(`/api/stores/${id}`, { method: 'DELETE' })
  await refreshStores()
}

const onLogoChange = (e) => {
  const file = e.target.files[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = (ev) => {
    newStore.value.logo = ev.target.result
  }
  reader.readAsDataURL(file)
}

const getStoreLogo = (storeName) => {
  return stores.value?.find(s => s.name === storeName)?.logo
}

const getStoreNameById = (id) => {
  return stores.value?.find(s => s.id === id)?.name
}

// Watch technician selection to auto-fill destination (since they pick up for their store)
watch(() => form.value.employeeName, (newName) => {
  if (isEditing.value || !newName) return
  const emp = employees.value?.find(e => e.name === newName)
  if (emp?.storeId) {
    const storeName = getStoreNameById(emp.storeId)
    if (storeName) {
      form.value.toStore = storeName
    }
  }
})

// Watch source selection to auto-set destination if possible
watch(() => form.value.fromStore, (newSource) => {
  if (isEditing.value || !newSource) return
  
  // Auto-set destination if only 2 stores exist and it's not the source
  if (stores.value?.length === 2 && !form.value.toStore) {
    const otherStore = stores.value.find(s => s.name !== newSource)
    if (otherStore) {
      form.value.toStore = otherStore.name
    }
  }
})

// Watch destination selection to clear technician if inconsistent
watch(() => form.value.toStore, (newDest) => {
  if (isEditing.value || !newDest) return
  const currentEmp = employees.value?.find(e => e.name === form.value.employeeName)
  const store = stores.value?.find(s => s.name === newDest)
  if (currentEmp && store && currentEmp.storeId !== store.id) {
    form.value.employeeName = ''
  }
})

// Helpers
const formatDate = (date) => {
  if (!date) return ''
  return format(parseISO(date.toString()), 'dd/MM/yyyy', { locale: ptBR })
}

const getStatusLabel = (loan) => {
  if (loan.returnDate) return 'Devolvido'
  const today = new Date()
  const expected = parseISO(loan.expectedReturn)
  if (isAfter(today, expected)) return 'Atrasado'
  return 'Pendente'
}

const getStatusClass = (loan) => {
  if (loan.returnDate) return 'badge-returned'
  const today = new Date()
  const expected = parseISO(loan.expectedReturn)
  if (isAfter(today, expected)) return 'badge-overdue'
  return 'badge-pending'
}
</script>

<style>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

@keyframes slide-in-from-top {
  from {
    transform: translateY(-20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.animate-in {
  animation-fill-mode: both;
}
</style>
