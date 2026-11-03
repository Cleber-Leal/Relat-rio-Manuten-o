import React, { useContext } from 'react'
import "./Card.css"
import { Info } from '../Info/Info'
import { extrairAno, formatarMoeda, mesmaOS, colorirPrimeiros4 } from '../Info/utils'

// Card de uma OS. A seleção fica no contexto (uma única OS por vez):
// clicar seleciona e mostra as peças dessa OS; clicar de novo desmarca.
const Card = ({ item, valor, quant, OS, data }) => {

  const { osSelecionada, alternarOS } = useContext(Info)

  const ativo = mesmaOS(osSelecionada, OS)
  const ano = extrairAno(data)

  const aoTeclar = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      alternarOS(OS)
    }
  }

  return (
    <div
      role="button"
      tabIndex={0}
      aria-pressed={ativo}
      className={ativo ? 'card card--ativo' : 'card'}
      onClick={() => alternarOS(OS)}
      onKeyDown={aoTeclar}
    >
      <div className='card__os'>
        <p>{OS}</p>
      </div>
      <div className='card__corpo'>
        {ano !== '' && <span className='card__ano'>{ano}</span>}
        <h3 className='card__titulo'>{item ?? "SETOR"}</h3>
        <div className='card__dados'>
          <p>Total: {formatarMoeda(valor)}</p>
          <p>Quantidade: {quant ?? 0}</p>
        </div>
      </div>
    </div>
  )
}

export default Card
