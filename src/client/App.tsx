import { Routes, Route } from 'react-router-dom'
import { ContextProvider } from '@/hooks/useContext'
import Layout from '@/components/Layout'
import Dashboard from '@/components/Dashboard'
import Contexts from '@/components/Contexts'
import Information from '@/components/Information'
import Search from '@/components/Search'
import Settings from '@/components/Settings'

function App() {
  return (
    <ContextProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/contexts" element={<Contexts />} />
          <Route path="/information" element={<Information />} />
          <Route path="/search" element={<Search />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Layout>
    </ContextProvider>
  )
}

export default App