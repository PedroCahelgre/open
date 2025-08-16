import { useState } from 'react'
import { Search as SearchIcon, FileText, Link, CheckCircle, Clock } from 'lucide-react'
import { useContext } from '@/hooks/useContext'
import { InformationType as InfoType } from '@/types'

export default function Search() {
  const { state } = useContext()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<InfoType | 'all'>('all')

  const filteredInformation = state.information.filter((info: any) => {
    const matchesSearch = searchTerm === '' || 
      info.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      info.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      info.tags.some((tag: string) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesType = filterType === 'all' || info.type === filterType
    
    return matchesSearch && matchesType
  })

  const getTypeIcon = (type: InfoType) => {
    switch (type) {
      case 'note': return <FileText className="h-4 w-4" />
      case 'link': return <Link className="h-4 w-4" />
      case 'task': return <CheckCircle className="h-4 w-4" />
      case 'reminder': return <Clock className="h-4 w-4" />
      default: return <FileText className="h-4 w-4" />
    }
  }

  const getTypeLabel = (type: InfoType) => {
    switch (type) {
      case 'note': return 'Nota'
      case 'link': return 'Link'
      case 'task': return 'Tarefa'
      case 'reminder': return 'Lembrete'
      default: return 'Arquivo'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
          Busca
        </h1>
        <p className="text-neutral-600 dark:text-neutral-400">
          Encontre rapidamente suas informações
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar por título, conteúdo ou tags..."
          className="input pl-10"
        />
      </div>

      {/* Filters */}
      <div className="flex space-x-2">
        <button
          onClick={() => setFilterType('all')}
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            filterType === 'all'
              ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300'
              : 'bg-neutral-100 text-neutral-700 dark:bg-neutral-700 dark:text-neutral-300'
          }`}
        >
          Todos
        </button>
        {(['note', 'link', 'task', 'reminder'] as InfoType[]).map((type) => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              filterType === type
                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300'
                : 'bg-neutral-100 text-neutral-700 dark:bg-neutral-700 dark:text-neutral-300'
            }`}
          >
            {getTypeLabel(type)}
          </button>
        ))}
      </div>

      {/* Results */}
      <div className="space-y-4">
        {filteredInformation.length > 0 && (
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            {filteredInformation.length} resultado(s) encontrado(s)
          </p>
        )}
        
        {filteredInformation.map((info: any) => (
          <div key={info.id} className="card">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 mt-1">
                {getTypeIcon(info.type)}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
                  {info.title}
                </h3>
                <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
                  {info.content}
                </p>
                <div className="mt-2 flex items-center space-x-4">
                  <span className="text-xs text-neutral-500">
                    {getTypeLabel(info.type)}
                  </span>
                  <span className={`priority-${info.priority}`}>
                    {info.priority}
                  </span>
                  {info.type === 'task' && (
                    <span className={`text-xs ${info.isCompleted ? 'text-green-600' : 'text-yellow-600'}`}>
                      {info.isCompleted ? 'Concluída' : 'Pendente'}
                    </span>
                  )}
                </div>
                {info.tags.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {info.tags.map((tag: string) => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-neutral-100 text-neutral-700 dark:bg-neutral-700 dark:text-neutral-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {searchTerm && filteredInformation.length === 0 && (
        <div className="text-center py-12">
          <SearchIcon className="mx-auto h-12 w-12 text-neutral-400" />
          <h3 className="mt-2 text-sm font-medium text-neutral-900 dark:text-white">
            Nenhum resultado encontrado
          </h3>
          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
            Tente ajustar seus termos de busca ou filtros.
          </p>
        </div>
      )}

      {/* Initial State */}
      {!searchTerm && (
        <div className="text-center py-12">
          <SearchIcon className="mx-auto h-12 w-12 text-neutral-400" />
          <h3 className="mt-2 text-sm font-medium text-neutral-900 dark:text-white">
            Digite algo para buscar
          </h3>
          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
            Busque por título, conteúdo ou tags das suas informações.
          </p>
        </div>
      )}
    </div>
  )
}