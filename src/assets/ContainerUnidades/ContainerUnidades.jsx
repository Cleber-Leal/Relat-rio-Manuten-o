import React, { useContext, useMemo, useState } from 'react'
import { Info } from '../Info/Info'
import "./ContainerUnidades.css"
import { igual, valoresUnicos } from '../Info/utils'

const ContainerUnidades = () => {
    const { jsonData } = useContext(Info);
    const [estadoSel, setEstadoSel] = useState(null)
    const [gaSel, setGaSel] = useState(null)

    const estados = useMemo(() => valoresUnicos(jsonData.map((i) => i.Estado)), [jsonData])
    // se a planilha mudar, uma seleção antiga deixa de valer
    const estadoAtivo = estados.includes(estadoSel) ? estadoSel : null

    const dadosRegiao = useMemo(
        () => estadoAtivo ? jsonData.filter((i) => igual(i.Estado, estadoAtivo)) : [],
        [jsonData, estadoAtivo]
    )
    const responsaveis = useMemo(() => valoresUnicos(dadosRegiao.map((i) => i.Responsavel)), [dadosRegiao])
    const unidadesRegiao = useMemo(() => valoresUnicos(dadosRegiao.map((i) => i.Setor)), [dadosRegiao])

    const gaAtivo = responsaveis.includes(gaSel) ? gaSel : null
    const unidadesDoGA = useMemo(
        () => gaAtivo
            ? valoresUnicos(dadosRegiao.filter((i) => igual(i.Responsavel, gaAtivo)).map((i) => i.Setor))
            : [],
        [dadosRegiao, gaAtivo]
    )

    if (jsonData.length === 0) {
        return (
            <main className='pagina pagina--vazia'>
                <h1>CARREGUE UMA PLANILHA</h1>
            </main>
        )
    }

    return (
        <main className='pagina unidades'>
            <header className='unidades__cabecalho'>
                <h1>Unidades: {unidadesRegiao.length}{estadoAtivo ? ` / ${estadoAtivo}` : ''}</h1>
                <nav>
                    <ul className='unidades__estados'>
                        {estados.map((item) => (
                            <li key={item}>
                                <button
                                    type="button"
                                    className={item === estadoAtivo ? 'unidades__estado unidades__estado--ativo' : 'unidades__estado'}
                                    onClick={() => setEstadoSel(item)}
                                >
                                    {item}
                                </button>
                            </li>
                        ))}
                    </ul>
                </nav>
            </header>

            {!estadoAtivo
                ? <p className='unidades__aviso'>Selecione um estado.</p>
                : <div className='unidades__corpo'>
                    <div className='unidades__ga'>
                        <section>
                            <h2>Responsável:</h2>
                            <ul className='unidades__responsaveis'>
                                {responsaveis.map((item) => (
                                    <li key={item}>
                                        <button
                                            type="button"
                                            className={item === gaAtivo ? 'unidades__chip unidades__chip--ativo' : 'unidades__chip'}
                                            onClick={() => setGaSel(item)}
                                        >
                                            {item}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </section>

                        <section className='unidades__por-ga'>
                            <h2>Unidades por GA</h2>
                            <div className='unidades__rolagem'>
                                {unidadesDoGA.map((item) => <p key={item}>{item}</p>)}
                            </div>
                        </section>
                    </div>

                    <aside className='unidades__todas'>
                        <div className='unidades__rolagem'>
                            {unidadesRegiao.map((item) => <p key={item}>{item}</p>)}
                        </div>
                    </aside>
                </div>}
        </main>
    )
}

export default ContainerUnidades
