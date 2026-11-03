import React, { useContext, useMemo } from 'react'
import { Info } from '../Info/Info'
import "./ContainerPecas.css"
import CardPecas from '../CardPecas/CardPecas'
import { paraNumero, texto } from '../Info/utils'

// Mostra as peças da unidade/fornecedor ou, quando há uma OS selecionada, só as peças dessa OS.
const ContainerPecas = () => {

    const { pecasDaSelecao, osSelecionada, limparOS } = useContext(Info)

    // junta linhas do mesmo produto somando total e quantidade
    const pecas = useMemo(() => Object.values(
        pecasDaSelecao.reduce((acc, { Produto, Total, Qtd }) => {
            const nome = texto(Produto) || 'Sem descrição'
            acc[nome] = acc[nome] || { Produto: nome, Total: 0, Qtd: 0 }
            acc[nome].Total += paraNumero(Total)
            acc[nome].Qtd += paraNumero(Qtd)
            return acc
        }, {})
    ), [pecasDaSelecao])

    const temOS = osSelecionada != null
    
    return (
        <section className='pecas'>
            <header className='pecas__cabecalho'>
                <h2>{temOS ? `Peças da OS ${osSelecionada}` : 'Peças da unidade'}</h2>
                <span>{pecas.length} {pecas.length === 1 ? 'item' : 'itens'}</span>
                {temOS && (
                    <button type="button" className='pecas__limpar' onClick={limparOS}>
                        Ver todas as peças
                    </button>
                )}
            </header>

            <div className='pecas__grade'>
                {pecas.length === 0
                    ? <p className='pecas__vazio'>
                        {temOS
                            ? `Nenhuma peça encontrada para a OS ${osSelecionada}.`
                            : 'Nenhuma peça encontrada para esta unidade.'}
                    </p>
                    : pecas.map((p) => (
                        <CardPecas key={p.Produto} produto={p.Produto} total={p.Total} quantidade={p.Qtd} />
                    ))}
            </div>
        </section>
    )
}

export default ContainerPecas
