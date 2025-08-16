import { useEffect, useState } from 'react'
import { 
  FolderOpen, 
  FileText, 
  CheckCircle, 
  Activity,
  Search
} from 'lucide-react'
import { useContext } from '@/hooks/useContext'
import { DashboardStats, Context } from '@/types'

export default function Dashboard() {
  const { state } = useContext()
  const [stats, setStats] = useState<DashboardStats | null>(null)

  useEffect(() => {
    fetch('/api/dashboard')
      .then(res => res.json())
      .then(setStats)
      .catch(console.error)
  }, [])

  const getContextColor = (color?: string) => {
    switch (color) {
      case 'work': return 'bg-context-work-100 text-context-work-700'
      case 'study': return 'bg-context-study-100 text-context-study-700'
      case 'personal': return 'bg-context-personal-100 text-context-personal-700'
      case 'health': return 'bg-context-health-100 text-context-health-700'
      case 'finance': return 'bg-context-finance-100 text-context-finance-700'
      default: return 'bg-neutral-100 text-neutral-700'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
          Dashboard
        </h1>
        <p className="text-neutral-600 dark:text-neutral-400">
          Visão geral do seu sistema de gerenciamento de contextos
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <FolderOpen className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                Total de Contextos
              </p>
              <p className="text-2xl font-bold text-neutral-900 dark:text-white">
                {stats?.totalContexts || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Activity className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                Contextos Ativos
              </p>
              <p className="text-2xl font-bold text-neutral-900 dark:text-white">
                {stats?.activeContexts || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <FileText className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                Total de Informações
              </p>
              <p className="text-2xl font-bold text-neutral-900 dark:text-white">
                {stats?.totalInformation || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CheckCircle className="h-8 w-8 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                Tarefas Concluídas
              </p>
              <p className="text-2xl font-bold text-neutral-900 dark:text-white">
                {stats?.contextStats.reduce((acc, stat) => acc + stat.completedTasks, 0) || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Context Stats */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="card">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
            Estatísticas por Contexto
          </h3>
          <div className="space-y-4">
            {stats?.contextStats.map((contextStat) => (
              <div key={contextStat.contextId} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${getContextColor(state.contexts.find((c: Context) => c.id === contextStat.contextId)?.color)}`} />
                  <span className="text-sm font-medium text-neutral-900 dark:text-white">
                    {contextStat.contextName}
                  </span>
                </div>
                <div className="flex items-center space-x-4 text-sm text-neutral-600 dark:text-neutral-400">
                  <span>{contextStat.totalInformation} itens</span>
                  <span>{contextStat.completedTasks}/{contextStat.completedTasks + contextStat.pendingTasks} tarefas</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
            Atividade Recente
          </h3>
          <div className="space-y-4">
            {stats?.recentActivity.slice(0, 5).map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-neutral-900 dark:text-white truncate">
                    {activity.title}
                  </p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    {new Date(activity.updatedAt).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getContextColor(state.contexts.find((c: Context) => c.id === activity.contextId)?.color)}`}>
                    {state.contexts.find((c: Context) => c.id === activity.contextId)?.name}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
          Ações Rápidas
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <button className="flex items-center justify-center px-4 py-3 border border-neutral-300 rounded-lg hover:bg-neutral-50 dark:border-neutral-600 dark:hover:bg-neutral-800 transition-colors">
            <FolderOpen className="h-5 w-5 mr-2 text-blue-600" />
            <span className="text-sm font-medium">Novo Contexto</span>
          </button>
          <button className="flex items-center justify-center px-4 py-3 border border-neutral-300 rounded-lg hover:bg-neutral-50 dark:border-neutral-600 dark:hover:bg-neutral-800 transition-colors">
            <FileText className="h-5 w-5 mr-2 text-purple-600" />
            <span className="text-sm font-medium">Nova Nota</span>
          </button>
          <button className="flex items-center justify-center px-4 py-3 border border-neutral-300 rounded-lg hover:bg-neutral-50 dark:border-neutral-600 dark:hover:bg-neutral-800 transition-colors">
            <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
            <span className="text-sm font-medium">Nova Tarefa</span>
          </button>
          <button className="flex items-center justify-center px-4 py-3 border border-neutral-300 rounded-lg hover:bg-neutral-50 dark:border-neutral-600 dark:hover:bg-neutral-800 transition-colors">
            <Search className="h-5 w-5 mr-2 text-orange-600" />
            <span className="text-sm font-medium">Buscar</span>
          </button>
        </div>
      </div>
    </div>
  )
}