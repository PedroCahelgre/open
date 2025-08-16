import { useState } from 'react'
import { Plus, Edit, Trash2, FolderOpen } from 'lucide-react'
import { useContext } from '@/hooks/useContext'
import { Context, ContextColor } from '@/types'

export default function Contexts() {
  const { state, actions } = useContext()
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingContext, setEditingContext] = useState<Context | null>(null)

  const contextColors: { value: ContextColor; label: string; color: string }[] = [
    { value: 'work', label: 'Trabalho', color: 'bg-context-work-500' },
    { value: 'study', label: 'Estudo', color: 'bg-context-study-500' },
    { value: 'personal', label: 'Pessoal', color: 'bg-context-personal-500' },
    { value: 'health', label: 'Saúde', color: 'bg-context-health-500' },
    { value: 'finance', label: 'Financeiro', color: 'bg-context-finance-500' },
  ]

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
            Contextos
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400">
            Gerencie seus contextos de trabalho e vida pessoal
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn-primary"
        >
          <Plus className="h-4 w-4 mr-2" />
          Novo Contexto
        </button>
      </div>

      {/* Contexts Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {state.contexts.map((context: Context) => (
          <div key={context.id} className="card hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${getContextColor(context.color)}`} />
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
                  {context.name}
                </h3>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setEditingContext(context)}
                  className="p-1 rounded hover:bg-neutral-100 dark:hover:bg-neutral-700"
                >
                  <Edit className="h-4 w-4 text-neutral-600" />
                </button>
                <button
                  onClick={() => actions.deleteContext(context.id)}
                  className="p-1 rounded hover:bg-neutral-100 dark:hover:bg-neutral-700"
                >
                  <Trash2 className="h-4 w-4 text-red-600" />
                </button>
              </div>
            </div>
            
            <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
              {context.description}
            </p>
            
            <div className="mt-4 flex items-center justify-between">
              <div className="flex flex-wrap gap-1">
                {context.tags.map((tag: string) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-neutral-100 text-neutral-700 dark:bg-neutral-700 dark:text-neutral-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              
              <button
                onClick={() => actions.setActiveContext(context)}
                className={`btn-ghost text-xs ${
                  state.activeContext?.id === context.id
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300'
                    : ''
                }`}
              >
                {state.activeContext?.id === context.id ? 'Ativo' : 'Ativar'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {state.contexts.length === 0 && (
        <div className="text-center py-12">
          <FolderOpen className="mx-auto h-12 w-12 text-neutral-400" />
          <h3 className="mt-2 text-sm font-medium text-neutral-900 dark:text-white">
            Nenhum contexto criado
          </h3>
          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
            Comece criando seu primeiro contexto para organizar suas informações.
          </p>
          <div className="mt-6">
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn-primary"
            >
              <Plus className="h-4 w-4 mr-2" />
              Criar Contexto
            </button>
          </div>
        </div>
      )}

      {/* Create/Edit Modal */}
      {(showCreateModal || editingContext) && (
        <ContextModal
          context={editingContext}
          onClose={() => {
            setShowCreateModal(false)
            setEditingContext(null)
          }}
          onSave={async (data) => {
            if (editingContext) {
              await actions.updateContext(editingContext.id, data)
            } else {
              await actions.createContext(data)
            }
            setShowCreateModal(false)
            setEditingContext(null)
          }}
          contextColors={contextColors}
        />
      )}
    </div>
  )
}

// Context Modal Component
function ContextModal({ 
  context, 
  onClose, 
  onSave, 
  contextColors 
}: {
  context: Context | null
  onClose: () => void
  onSave: (data: any) => Promise<void>
  contextColors: { value: ContextColor; label: string; color: string }[]
}) {
  const [formData, setFormData] = useState({
    name: context?.name || '',
    description: context?.description || '',
    color: context?.color || 'work',
    tags: context?.tags || [],
    tagInput: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSave({
      name: formData.name,
      description: formData.description,
      color: formData.color,
      tags: formData.tags,
    })
  }

  const addTag = () => {
    if (formData.tagInput.trim() && !formData.tags.includes(formData.tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, prev.tagInput.trim()],
        tagInput: '',
      }))
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove),
    }))
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-neutral-800 rounded-lg p-6 w-full max-w-md mx-4">
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
          {context ? 'Editar Contexto' : 'Novo Contexto'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
              Nome
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="input"
              placeholder="Nome do contexto"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
              Descrição
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="textarea"
              placeholder="Descrição do contexto"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
              Cor
            </label>
            <div className="grid grid-cols-5 gap-2">
              {contextColors.map((colorOption) => (
                <button
                  key={colorOption.value}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, color: colorOption.value }))}
                  className={`p-2 rounded-lg border-2 transition-colors ${
                    formData.color === colorOption.value
                      ? 'border-blue-500'
                      : 'border-neutral-200 dark:border-neutral-600'
                  }`}
                >
                  <div className={`w-4 h-4 rounded ${colorOption.color}`} />
                  <span className="sr-only">{colorOption.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
              Tags
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={formData.tagInput}
                onChange={(e) => setFormData(prev => ({ ...prev, tagInput: e.target.value }))}
                className="input flex-1"
                placeholder="Adicionar tag"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              />
              <button
                type="button"
                onClick={addTag}
                className="btn-secondary"
              >
                Adicionar
              </button>
            </div>
            <div className="flex flex-wrap gap-1">
              {formData.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-neutral-100 text-neutral-700 dark:bg-neutral-700 dark:text-neutral-300"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-1 hover:text-red-600"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn-primary"
            >
              {context ? 'Salvar' : 'Criar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}