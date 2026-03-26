<template>
  <div class="max-w-md mx-auto px-4 py-6 md:max-w-2xl lg:max-w-4xl min-h-screen">
    <!-- Header & Dashboard -->
    <header class="mb-8">
      <div class="flex items-center justify-between mb-8">
        <h1 class="text-2xl font-bold flex items-center gap-2">
          <LucidePackage class="text-blue-500 w-8 h-8" />
          <span class="tracking-tight">Peças Controle</span>
        </h1>
        <div class="flex gap-2">
          <button @click="showSettings = true" class="p-3 bg-gray-900 border border-gray-800 rounded-2xl hover:bg-gray-800 transition-all text-gray-400 group">
            <LucideSettings class="w-6 h-6 group-hover:rotate-45 transition-transform" />
          </button>
          <button @click="toggleForm" class="p-3 bg-gray-900 border border-gray-800 rounded-2xl hover:bg-gray-800 transition-all">
            <LucidePlus v-if="!showForm" class="w-6 h-6 text-blue-500" />
            <LucideX v-else class="w-6 h-6 text-red-500" />
          </button>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-4 md:grid-cols-4">
        <div class="card p-4 bg-gradient-to-br from-blue-500/10 to-transparent border-blue-500/10 hover:border-blue-500/30 transition-all">
          <div class="flex items-center gap-2 mb-2">
             <div class="p-1.5 bg-blue-500/20 rounded-lg text-blue-500">
                <LucidePackage class="w-4 h-4" />
             </div>
             <span class="text-xs text-gray-400 uppercase font-black tracking-widest">Total</span>
          </div>
          <span class="text-3xl font-black">{{ stats.total }}</span>
        </div>

        <div class="card p-4 bg-gradient-to-br from-yellow-500/5 to-transparent border-yellow-500/10 hover:border-yellow-500/30 transition-all">
          <div class="flex items-center gap-2 mb-2">
             <div class="p-1.5 bg-yellow-500/20 rounded-lg text-yellow-500">
                <LucideClock class="w-4 h-4" />
             </div>
             <span class="text-xs text-yellow-500/70 uppercase font-black tracking-widest">Pendente</span>
          </div>
          <span class="text-3xl font-black text-yellow-500">{{ stats.pending }}</span>
        </div>

        <div class="card p-4 bg-gradient-to-br from-red-500/5 to-transparent border-red-500/10 hover:border-red-500/30 transition-all">
          <div class="flex items-center gap-2 mb-2">
             <div class="p-1.5 bg-red-500/20 rounded-lg text-red-500">
                <LucideAlertCircle class="w-4 h-4" />
             </div>
             <span class="text-xs text-red-500/70 uppercase font-black tracking-widest">Atrasado</span>
          </div>
          <span class="text-3xl font-black text-red-500">{{ stats.overdue }}</span>
        </div>

        <div class="card p-4 bg-gradient-to-br from-emerald-500/5 to-transparent border-emerald-500/10 hover:border-emerald-500/30 transition-all">
          <div class="flex items-center gap-2 mb-2">
             <div class="p-1.5 bg-emerald-500/20 rounded-lg text-emerald-500">
                <LucideCheckCircle class="w-4 h-4" />
             </div>
             <span class="text-xs text-emerald-500/70 uppercase font-black tracking-widest">Entregue</span>
          </div>
          <span class="text-3xl font-black text-emerald-500">{{ stats.returned }}</span>
        </div>
      </div>
    </header>

    <!-- Form Section -->
    <section v-if="showForm" class="mb-8 space-y-4 animate-in slide-in-from-top duration-300">
      <div class="card bg-gray-900/50 backdrop-blur-sm border-blue-500/30 ring-1 ring-blue-500/20">
        <h2 class="text-xl font-bold mb-6 flex items-center gap-3">
          <div :class="isEditing ? 'bg-blue-500' : 'bg-green-500'" class="w-3 h-3 rounded-full animate-pulse"></div>
          {{ isEditing ? 'Editando Registro' : 'Novo Empréstimo' }}
        </h2>
        <form @submit.prevent="registerLoan" class="space-y-6">
          <div class="space-y-4">
            <div class="space-y-2">
              <label class="text-xs font-black text-gray-500 uppercase tracking-widest">O que está sendo emprestado?</label>
              <input v-model="form.partName" type="text" placeholder="Ex: Tela iPhone 13 Apple Original" class="input py-4 text-lg" required />
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="space-y-2">
                <label class="text-xs font-black text-gray-500 uppercase tracking-widest">Loja Origem</label>
                <select v-model="form.fromStore" class="input py-3 h-12" required>
                  <option value="" disabled>Selecione a loja origem</option>
                  <option v-for="s in stores" :key="s.id" :value="s.name">{{ s.name }}</option>
                  <option v-if="!stores?.length" value="Loja Padrão">Cadastre lojas nas config</option>
                </select>
              </div>
              <div class="space-y-2">
                <label class="text-xs font-black text-gray-500 uppercase tracking-widest">Loja Destino</label>
                <select v-model="form.toStore" class="input py-3 h-12" required>
                  <option value="" disabled>Para onde vai?</option>
                  <option v-for="s in stores" :key="s.id" :value="s.name">{{ s.name }}</option>
                  <option v-if="!stores?.length" value="Loja Terceira">Loja Terceira</option>
                </select>
              </div>
              <div class="space-y-2">
                <label class="text-xs font-black text-gray-500 uppercase tracking-widest">Responsável</label>
                <select v-model="form.employeeName" class="input py-3 h-12" required>
                  <option value="" disabled>Quem pegou?</option>
                  <option v-for="e in filteredEmployeesForForm" :key="e.id" :value="e.name">{{ e.name }}</option>
                  <option v-if="!employees?.length" value="Técnico Genérico">Cadastre técnicos nas config</option>
                </select>
              </div>
              <div class="space-y-2">
                <label class="text-xs font-black text-gray-500 uppercase tracking-widest">Previsão para Devolução</label>
                <input v-model="form.expectedReturn" type="date" class="input py-3 h-12" required />
              </div>
            </div>
          </div>
          <div class="flex gap-2">
            <button v-if="isEditing" type="button" @click="resetForm" class="flex-1 bg-gray-800 text-white font-bold py-4 rounded-2xl hover:bg-gray-700 transition-all">
              Cancelar
            </button>
            <button type="submit" class="flex-[3] btn-primary flex items-center justify-center gap-2 py-4 shadow-xl" :disabled="loading" :class="isEditing ? '!bg-blue-600' : ''">
              <LucideLoader2 v-if="loading" class="w-5 h-5 animate-spin" />
              <LucideCheckCircle v-else class="w-5 h-5" />
              <span class="font-black uppercase tracking-wider">{{ isEditing ? 'Salvar Alterações' : 'Confirmar Empréstimo' }}</span>
            </button>
          </div>
        </form>
      </div>
    </section>

    <!-- Search & Filters -->
    <section class="mb-8 space-y-4">
      <div class="flex gap-2 p-1.5 bg-gray-950 border border-gray-800 rounded-2xl overflow-x-auto no-scrollbar">
        <button v-for="f in filterOptions" :key="f.value" 
          @click="activeFilter = f.value"
          class="px-5 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all uppercase tracking-tight"
          :class="activeFilter === f.value ? 'bg-white text-black shadow-lg scale-105' : 'text-gray-500 hover:text-white'">
          {{ f.label }}
        </button>
      </div>

      <div class="relative group">
        <LucideSearch class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-blue-500 transition-colors" />
        <input v-model="search" type="text" placeholder="Encontrar peça ou técnico..." class="input pl-12 py-4 bg-gray-900 border-gray-800 focus:ring-2 ring-blue-500/20" />
      </div>
    </section>

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
        class="card group hover:scale-[1.01] transition-all relative overflow-hidden bg-gray-900/40 border-gray-800" 
        :class="{ 'opacity-50 grayscale': loan.returnDate }">
        
        <!-- Action Buttons -->
        <div class="absolute top-4 right-4 flex gap-2 invisible group-hover:visible animate-in fade-in duration-200">
          <button @click="editLoan(loan)" class="p-2.5 bg-gray-800 hover:bg-blue-600 text-gray-400 hover:text-white rounded-xl transition-all shadow-xl">
            <LucideEdit2 class="w-4 h-4" />
          </button>
          <button @click="deleteLoan(loan.id)" class="p-2.5 bg-gray-800 hover:bg-red-600 text-gray-400 hover:text-white rounded-xl transition-all shadow-xl">
            <LucideTrash2 class="w-4 h-4" />
          </button>
        </div>

        <div class="flex items-start gap-4 mb-4">
           <!-- Brand/Store Visual -->
           <div class="w-14 h-14 rounded-2xl bg-gray-800 flex items-center justify-center overflow-hidden border border-gray-700 shrink-0 shadow-inner">
             <img v-if="getStoreLogo(loan.fromStore)" :src="getStoreLogo(loan.fromStore)" class="w-full h-full object-cover" />
             <LucideBuilding2 v-else class="text-gray-600 w-6 h-6" />
           </div>
           
           <div class="flex-1 pr-12">
              <div class="flex items-center gap-2 mb-1">
                <span :class="getStatusClass(loan)" class="text-[10px] font-black uppercase px-2 py-0.5 rounded-full tracking-tighter border border-current opacity-80">
                  {{ getStatusLabel(loan) }}
                </span>
                <span v-if="loan.brand || loan.model" class="text-[10px] font-black uppercase text-gray-500 tracking-tighter">
                  {{ [loan.brand, loan.model].filter(Boolean).join(' / ') }}
                </span>
              </div>
              <h3 class="text-xl font-black tracking-tight mb-0.5">{{ loan.partName }}</h3>
           </div>
        </div>

        <div class="grid grid-cols-2 gap-4 text-xs font-bold text-gray-300 border-t border-gray-800/50 pt-4 mt-2">
          <div class="flex items-center gap-3">
            <div class="p-1.5 bg-gray-800 rounded-lg text-gray-500">
              <LucideUser class="w-3.5 h-3.5" />
            </div>
            <span>{{ loan.employeeName }}</span>
          </div>
          <div class="flex items-center gap-3">
            <div class="p-1.5 bg-gray-800 rounded-lg text-gray-500">
              <LucideCalendar class="w-3.5 h-3.5" />
            </div>
            <span>{{ formatDate(loan.loanDate) }}</span>
          </div>
          <div class="flex items-center gap-3 col-span-2">
            <div class="p-1.5 bg-gray-800 rounded-lg text-gray-500">
              <LucideStore class="w-3.5 h-3.5" />
            </div>
            <div class="flex items-center gap-2 truncate">
              <span class="text-gray-400">{{ loan.fromStore }}</span>
              <LucideArrowRight class="w-3 h-3 text-gray-700" />
              <span class="text-white">{{ loan.toStore }}</span>
            </div>
          </div>
        </div>

        <div v-if="!loan.returnDate" class="mt-5">
          <button @click="markAsReturned(loan.id)" class="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black py-3.5 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-900/20 active:scale-[0.98]">
            <LucideCheckCircle class="w-5 h-5" />
            CONCLUIR DEVOLUÇÃO
          </button>
        </div>
        <div v-else class="mt-5 py-3 border border-emerald-500/30 bg-emerald-500/5 rounded-2xl text-center text-[10px] text-emerald-500 font-black uppercase tracking-widest flex items-center justify-center gap-2">
          <LucideCheck class="w-4 h-4" />
          Devolvido com sucesso em {{ formatDate(loan.returnDate) }}
        </div>
      </div>
    </section>

    <!-- Settings Modal -->
    <div v-if="showSettings" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div class="bg-gray-900 border border-gray-800 rounded-3xl w-full max-w-lg max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        <div class="p-6 border-b border-gray-800 flex items-center justify-between">
          <h2 class="text-xl font-bold flex items-center gap-2">
            <LucideSettings class="text-blue-500" />
            Configurações
          </h2>
          <button @click="showSettings = false" class="p-2 hover:bg-gray-800 rounded-xl transition-all">
            <LucideX class="w-6 h-6 text-gray-400" />
          </button>
        </div>

        <div class="p-6 overflow-y-auto space-y-8 no-scrollbar">
          <!-- Employees Management -->
          <div class="space-y-4">
            <h3 class="font-bold text-gray-400 flex items-center gap-2 uppercase text-xs tracking-wider">
              <LucideUser class="w-4 h-4" />
              Funcionários
            </h3>
            <div class="space-y-2">
              <input v-model="newEmployee.name" type="text" placeholder="Nome do funcionário" class="input py-2" />
              <div class="flex gap-2">
                <select v-model="newEmployee.storeId" class="input py-2 flex-1">
                  <option value="">Sem loja fixa</option>
                  <option v-for="s in stores" :key="s.id" :value="s.id">{{ s.name }}</option>
                </select>
                <button @click="addEmployee" class="bg-blue-600 px-4 rounded-xl hover:bg-blue-700 transition-all font-bold">
                  Add
                </button>
              </div>
            </div>
            <div class="grid grid-cols-1 gap-2">
              <div v-for="e in employees" :key="e.id" class="flex items-center justify-between bg-gray-800 p-3 rounded-xl group/item">
                <div class="flex flex-col">
                  <span class="font-medium">{{ e.name }}</span>
                  <span v-if="e.storeId" class="text-[10px] text-gray-500 uppercase tracking-tighter">
                    {{ getStoreNameById(e.storeId) }}
                  </span>
                </div>
                <button @click="deleteEmployee(e.id)" class="text-red-500 p-1 hover:bg-red-500 hover:text-white rounded-lg opacity-0 group-hover/item:opacity-100 transition-all">
                  <LucideTrash2 class="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <!-- Stores Management -->
          <div class="space-y-4">
            <h3 class="font-bold text-gray-400 flex items-center gap-2 uppercase text-xs tracking-wider">
              <LucideStore class="w-4 h-4" />
              Lojas
            </h3>
            <div class="space-y-3 p-4 bg-gray-800/50 rounded-2xl border border-gray-800">
              <input v-model="newStore.name" type="text" placeholder="Nome da Loja" class="input py-2" />
              <div class="flex items-center gap-4">
                <div class="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center border border-gray-700 overflow-hidden relative">
                   <img v-if="newStore.logo" :src="newStore.logo" class="w-full h-full object-cover" />
                   <LucideImage v-else class="text-gray-600" />
                   <input type="file" @change="onLogoChange" class="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" />
                </div>
                <div class="flex-1 text-xs text-gray-500">
                  Clique no ícone ao lado para subir a logo da loja.
                </div>
              </div>
              <button @click="addStore" class="btn-primary py-2 text-sm !bg-blue-600 shadow-none">
                Adicionar Loja
              </button>
            </div>
            <div class="grid grid-cols-1 gap-2">
              <div v-for="s in stores" :key="s.id" class="flex items-center justify-between bg-gray-800 p-3 rounded-xl gap-3">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-lg bg-gray-900 flex items-center justify-center overflow-hidden border border-gray-700">
                    <img v-if="s.logo" :src="s.logo" class="w-full h-full object-cover" />
                    <LucideBuilding2 v-else class="w-4 h-4 text-gray-600" />
                  </div>
                  <span>{{ s.name }}</span>
                </div>
                <button @click="deleteStore(s.id)" class="text-red-500 p-1 hover:bg-gray-700 rounded-lg">
                  <LucideTrash2 class="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
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
  LucideClock, LucideAlertCircle
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
  if (!form.value.fromStore || isEditing.value) return employees.value || []
  const store = stores.value?.find(s => s.name === form.value.fromStore)
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

// Watch employee selection to auto-fill store
watch(() => form.value.employeeName, (newName) => {
  if (isEditing.value) return // Don't auto-fill when editing
  const emp = employees.value?.find(e => e.name === newName)
  if (emp?.storeId) {
    const storeName = getStoreNameById(emp.storeId)
    if (storeName) {
      form.value.fromStore = storeName
    }
  }
})

// Watch store selection to clear employee AND set destination
watch(() => form.value.fromStore, (newStoreName) => {
  if (isEditing.value || !newStoreName) return
  
  // Clear employee if invalid
  const currentEmp = employees.value?.find(e => e.name === form.value.employeeName)
  const store = stores.value?.find(s => s.name === newStoreName)
  if (currentEmp && store && currentEmp.storeId !== store.id) {
    form.value.employeeName = ''
  }

  // Auto-set destination if only 2 stores exist
  if (stores.value?.length === 2 && !form.value.toStore) {
    const otherStore = stores.value.find(s => s.name !== newStoreName)
    if (otherStore) {
      form.value.toStore = otherStore.name
    }
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
