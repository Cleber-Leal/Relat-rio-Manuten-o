import React, { useContext, useMemo, useState } from 'react'
import { Info } from '../Info/Info'
import CardPecas from '../CardPecas/CardPecas'
import { anoDaOS, obterValor, texto, valoresUnicos } from '../Info/utils'
import "./InfoPecas.css"

// Menor preço da peça escolhida por fornecedor (oficina), no estado da unidade selecionada.
const InfoPecas = () => {

    const { infoPeca, pecaBusca, pesquisarPeca, selecionado } = useContext(Info)

    const estado = selecionado[0]?.Estado ?? null
    const [anoSelecionado, setAnoSelecionado] = useState('')

    // ofertas da peça no estado da unidade (antes do filtro de ano)
    const baseEstado = useMemo(() => {
        // só filtra por estado se a aba de peças tiver essa coluna
        const temEstado = infoPeca.some((i) => i.Estado != null)
        return estado != null && temEstado
            ? infoPeca.filter((i) => texto(i.Estado) === texto(estado))
            : infoPeca
    }, [infoPeca, estado])

    // anos disponíveis (início do número da OS), do mais recente para o mais antigo
    const anos = useMemo(
        () => valoresUnicos(baseEstado.map((i) => anoDaOS(i.OS))).sort((a, b) => b.localeCompare(a)),
        [baseEstado]
    )
    // se a peça mudar e o ano escolhido não existir mais, o filtro deixa de valer
    const anoAtivo = anos.includes(anoSelecionado) ? anoSelecionado : ''

    const ofertas = useMemo(() => {
        const base = anoAtivo
            ? baseEstado.filter((i) => anoDaOS(i.OS) === anoAtivo)
            : baseEstado

        const melhores = new Map()
        base.forEach((item) => {
            const chave = texto(item.Oficina)
            const atual = melhores.get(chave)
            if (!atual || obterValor(item) < obterValor(atual)) melhores.set(chave, item)
        })

        return [...melhores.values()]
            .sort((a, b) => obterValor(a) - obterValor(b))
            .slice(0, 10)

    }, [baseEstado, anoAtivo])

    // console.log(typeof(ofertas[0].OS))

    const termo = texto(pecaBusca)

    return (
        <main className='pagina comparar'>
            <div className='comparar__busca'>
                <input
                    type="search"
                    className='comparar__busca-campo'
                    placeholder="Pesquisar nome da peça"
                    aria-label="Pesquisar nome da peça"
                    value={pecaBusca}
                    onChange={(e) => pesquisarPeca(e.target.value)}
                />
            </div>

            {termo === ''
                ? <h1>Nenhuma peça selecionada</h1>
                : infoPeca.length === 0
                    ? <p>Nenhuma peça encontrada para "{termo}".</p>
                    : <>
                        <header className='comparar__cabecalho'>
                            <h2>Menor preço por fornecedor: {termo}</h2>
                            <span>{estado != null ? `Estado: ${estado}` : 'Todos os estados'}</span>
                        </header>

                        {anos.length > 0 && (
                            <div className='comparar__anos'>
                                <span className='comparar__anos-titulo'>Ano da OS:</span>
                                {['', ...anos].map((ano) => (
                                    <button
                                        key={ano || 'todos'}
                                        type="button"
                                        aria-pressed={anoAtivo === ano}
                                        className={anoAtivo === ano ? 'comparar__ano comparar__ano--ativo' : 'comparar__ano'}
                                        onClick={() => setAnoSelecionado(ano)}
                                    >
                                        {ano || 'Todos'}
                                    </button>
                                ))}
                            </div>
                        )}

                        <div className='comparar__grade'>
                            {ofertas.length === 0
                                ? <p>Nenhuma oferta encontrada para esta peça com os filtros selecionados.</p>
                                : ofertas.map((i, idx) => (
                                    <CardPecas
                                        key={`${texto(i.Oficina)}-${idx}`}
                                        produto={i.Produto}
                                        total={obterValor(i)}
                                        peca={true}
                                        fornecedor={i.Oficina}
                                        OS={i.OS}
                                        equipamento={i.Equipamento}
                                    />
                                ))}
                        </div>
                    </>}
        </main>
    )
}

export default InfoPecas
