import { useState } from 'react'
import { Download, Upload, Trash2 } from 'lucide-react'
import { useContext } from '@/hooks/useContext'

export default function Settings() {
  const { state } = useContext()
  const [exporting, setExporting] = useState(false)

  const exportData = async () => {
    setExporting(true)
    try {
      const data = {
        contexts: state.contexts,
        information: state.information,
        exportDate: new Date().toISOString(),
        version: '1.0.0'
      }
      
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `context-manager-backup-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Erro ao exportar dados:', error)
    } finally {
      setExporting(false)
    }
  }

  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = async (e) => {
      try {
        const data = JSON.parse(e.target?.result as string)
        // Aqui você implementaria a lógica para importar os dados
        console.log('Dados importados:', data)
        alert('Importação realizada com sucesso!')
      } catch (error) {
        console.error('Erro ao importar dados:', error)
        alert('Erro ao importar dados. Verifique se o arquivo é válido.')
      }
    }
    reader.readAsText(file)
  }

  const clearAllData = () => {
    if (confirm('Tem certeza que deseja apagar todos os dados? Esta ação não pode ser desfeita.')) {
      // Aqui você implementaria a lógica para limpar todos os dados
      console.log('Limpando todos os dados...')
      alert('Todos os dados foram apagados.')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
          Configurações
        </h1>
        <p className="text-neutral-600 dark:text-neutral-400">
          Gerencie as configurações do seu sistema
        </p>
      </div>

      {/* Settings Sections */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Data Management */}
        <div className="card">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
            Gerenciamento de Dados
          </h3>
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Backup e Restauração
              </h4>
              <div className="space-y-2">
                <button
                  onClick={exportData}
                  disabled={exporting}
                  className="btn-secondary w-full"
                >
                  <Download className="h-4 w-4 mr-2" />
                  {exporting ? 'Exportando...' : 'Exportar Dados'}
                </button>
                
                <label className="btn-secondary w-full cursor-pointer">
                  <Upload className="h-4 w-4 mr-2" />
                  Importar Dados
                  <input
                    type="file"
                    accept=".json"
                    onChange={importData}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Limpeza de Dados
              </h4>
              <button
                onClick={clearAllData}
                className="btn-danger w-full"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Apagar Todos os Dados
              </button>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="card">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
            Estatísticas
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-sm text-neutral-600 dark:text-neutral-400">
                Total de Contextos:
              </span>
              <span className="text-sm font-medium text-neutral-900 dark:text-white">
                {state.contexts.length}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-neutral-600 dark:text-neutral-400">
                Contextos Ativos:
              </span>
              <span className="text-sm font-medium text-neutral-900 dark:text-white">
                {state.contexts.filter((c: any) => c.isActive).length}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-neutral-600 dark:text-neutral-400">
                Total de Informações:
              </span>
              <span className="text-sm font-medium text-neutral-900 dark:text-white">
                {state.information.length}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-neutral-600 dark:text-neutral-400">
                Tarefas Concluídas:
              </span>
              <span className="text-sm font-medium text-neutral-900 dark:text-white">
                {state.information.filter((i: any) => i.type === 'task' && i.isCompleted).length}
              </span>
            </div>
          </div>
        </div>

        {/* System Information */}
        <div className="card">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
            Informações do Sistema
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-sm text-neutral-600 dark:text-neutral-400">
                Versão:
              </span>
              <span className="text-sm font-medium text-neutral-900 dark:text-white">
                1.0.0
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-neutral-600 dark:text-neutral-400">
                Armazenamento:
              </span>
              <span className="text-sm font-medium text-neutral-900 dark:text-white">
                Local (JSON)
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-neutral-600 dark:text-neutral-400">
                Última Atualização:
              </span>
              <span className="text-sm font-medium text-neutral-900 dark:text-white">
                {new Date().toLocaleDateString('pt-BR')}
              </span>
            </div>
          </div>
        </div>

        {/* About */}
        <div className="card">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
            Sobre
          </h3>
          <div className="space-y-4">
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Context Manager é um sistema pessoal de gerenciamento de contextos 
              que utiliza engenharia de contextos para organizar e acessar 
              rapidamente informações relevantes.
            </p>
            <div className="pt-4 border-t border-neutral-200 dark:border-neutral-700">
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Desenvolvido com React, TypeScript e Node.js
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}