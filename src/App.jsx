import { useContext, useState } from 'react'
import './App.css'
import * as XLSX from 'xlsx'
import { Routes, Route, NavLink, Navigate } from 'react-router-dom'
import Menu from './assets/Menu/Menu'
import Dados from './assets/Dados/Dados'
import { Info } from './assets/Info/Info'
import InfoPecas from './assets/InfoPecas/InfoPecas'
import ContainerUnidades from './assets/ContainerUnidades/ContainerUnidades'

const classeLink = ({ isActive }) => (isActive ? 'ativo' : undefined)

function App() {
  const { jsonData, carregarPlanilha } = useContext(Info)
  const [erro, setErro] = useState('')

  const handleFileUpload = (event) => {
    const input = event.target
    const file = input.files?.[0]
    if (!file) return

    const reader = new FileReader()

    reader.onload = (e) => {
      try {
        const workbook = XLSX.read(new Uint8Array(e.target.result), { type: 'array' })
        const [aba1, aba2] = workbook.SheetNames
        // a segunda aba (peças) pode não existir
        const lerAba = (nome) =>
          nome ? XLSX.utils.sheet_to_json(workbook.Sheets[nome], { defval: null }) : []

        carregarPlanilha(lerAba(aba1), lerAba(aba2))
        setErro('')
      } catch (error) {
        console.error('Erro ao processar planilha:', error)
        setErro('Não foi possível ler a planilha. Confira se o arquivo é .xlsx ou .xls válido.')
      }
    }

    reader.onerror = (error) => {
      console.error('Erro ao ler arquivo:', error)
      setErro('Não foi possível abrir o arquivo.')
    }

    reader.readAsArrayBuffer(file)
    // permite escolher o mesmo arquivo de novo depois
    input.value = ''
  }

  return (
    <div className='app'>
      <Menu />

      <div className='app__conteudo'>
        <header className='topbar'>
          <div className='topbar__logo' />
          <h1>Quantidade de manutenção: {jsonData.length}</h1>
          <input type='file' className='topbar__arquivo' accept='.xlsx, .xls' onChange={handleFileUpload} />
        </header>

        {erro && <p className='app__erro' role='alert'>{erro}</p>}

        <nav className='nav'>
          <ul>
            <li><NavLink to='/' end className={classeLink}>Início</NavLink></li>
            <li><NavLink to='/pecas' className={classeLink}>Peças</NavLink></li>
            <li><NavLink to='/unidades' className={classeLink}>Unidades</NavLink></li>
          </ul>
        </nav>

        <div className='app__rota'>
          <Routes>
            <Route path='/' element={<Dados />} />
            <Route path='/pecas' element={<InfoPecas />} />
            <Route path='/unidades' element={<ContainerUnidades />} />
            <Route path='*' element={<Navigate to='/' replace />} />
          </Routes>
        </div>
      </div>
    </div>
  )
}

export default App
