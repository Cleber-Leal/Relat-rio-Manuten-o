import React, { useMemo, useState } from 'react'
import { Info } from './Info'
import {
    anoDaOS, formatarMoeda, igual, mesmaOS, normalizarLinhas,
    obterValor, paraBusca, paraNumero, texto, valoresUnicos,
} from './utils'

const Prover = ({ children }) => {

    // ---- dados da planilha (aba 1 = ordens de serviço, aba 2 = peças) ----
    const [jsonData, setJsonData] = useState([])
    const [jsonData2, setJsonData2] = useState([])

    // ---- seleções do usuário ----
    const [busca, setBusca] = useState('')
    const [setorSelecionado, setSetorSelecionado] = useState(null)
    const [fornecedorSelecionado, setFornecedorSelecionado] = useState('')
    const [osSelecionada, setOsSelecionada] = useState(null)
    const [anoSelecionado, setAnoSelecionado] = useState('')

    // ---- comparação de preço de uma peça (aba "Peças") ----
    const [pecaBusca, setPecaBusca] = useState('')

    // ---- valores derivados (sempre calculados a partir do estado acima) ----

    // linhas da aba de peças cujo produto contém o texto pesquisado, da mais barata para a mais cara
    const infoPeca = useMemo(() => {
        const termo = paraBusca(pecaBusca)
        if (!termo) return []
        return jsonData2
            .filter((i) => paraBusca(i.Produto).includes(termo))
            .sort((a, b) => obterValor(a) - obterValor(b))
    }, [jsonData2, pecaBusca])
    const unidades = useMemo(() => valoresUnicos(jsonData.map((i) => i.Setor)), [jsonData])

    const unidadesVisiveis = useMemo(() => {
        const termo = texto(busca).toLowerCase()
        return termo ? unidades.filter((u) => u.toLowerCase().includes(termo)) : unidades
    }, [unidades, busca])

    // linhas da aba 1 da unidade escolhida (comparação exata, sem confundir "Unidade 1" com "Unidade 10")
    const selecionado = useMemo(
        () => setorSelecionado
            ? jsonData
                .filter((i) => igual(i.Setor, setorSelecionado))
                .map((i) => ({ ...i, Custo: paraNumero(i.Custo) }))
            : [],
        [jsonData, setorSelecionado]
    )

    // anos disponíveis (início do número da OS) na unidade escolhida, do mais recente para o mais antigo
    const anos = useMemo(
        () => valoresUnicos(selecionado.map((i) => anoDaOS(i.OS))).sort((a, b) => b.localeCompare(a)),
        [selecionado]
    )
    // se a unidade mudar e o ano antigo não existir mais, o filtro deixa de valer
    const anoAtivo = anos.includes(anoSelecionado) ? anoSelecionado : ''

    // fornecedores da unidade que tiveram atendimento no ano escolhido (todos, se nenhum ano estiver escolhido)
    const fornecedores = useMemo(
        () => valoresUnicos(
            selecionado
                .filter((i) => !anoAtivo || anoDaOS(i.OS) === anoAtivo)
                .map((i) => i.Oficina)
        ),
        [selecionado, anoAtivo]
    )
    // se trocar o ano e o fornecedor escolhido não atendeu nele, o filtro de fornecedor deixa de valer
    const fornecedorAtivo = fornecedores.some((f) => igual(f, fornecedorSelecionado))
        ? fornecedorSelecionado
        : ''

    // OS (cards) da unidade, filtradas pelo fornecedor e pelo ano quando houver escolhidos
    const dadosFornecedor = useMemo(
        () => selecionado.filter((i) =>
            (!fornecedorAtivo || igual(i.Oficina, fornecedorAtivo)) &&
            (!anoAtivo || anoDaOS(i.OS) === anoAtivo)
        ),
        [selecionado, fornecedorAtivo, anoAtivo]
    )

    // Peças exibidas: se há uma OS selecionada, só as peças dela;
    // senão, as peças da unidade (e do fornecedor, se escolhido).
    const pecasDaSelecao = useMemo(() => {
        if (osSelecionada != null) {
            return jsonData2.filter((i) => mesmaOS(i.OS, osSelecionada))
        }
        if (!setorSelecionado) return []
        return jsonData2.filter((i) =>
            igual(i.Setor, setorSelecionado) &&
            (!fornecedorAtivo || igual(i.Oficina, fornecedorAtivo)) &&
            (!anoAtivo || anoDaOS(i.OS) === anoAtivo)
        )
    }, [jsonData2, osSelecionada, setorSelecionado, fornecedorAtivo, anoAtivo])

    // ---- ações ----
    const carregarPlanilha = (dadosOS, dadosPecas) => {
        setJsonData(normalizarLinhas(dadosOS))
        setJsonData2(normalizarLinhas(dadosPecas))
        setBusca('')
        setSetorSelecionado(null)
        setFornecedorSelecionado('')
        setOsSelecionada(null)
        setAnoSelecionado('')
        setPecaBusca('')
    }

    const selecionarUnidade = (setor) => {
        setSetorSelecionado(setor)
        setFornecedorSelecionado('')
        setAnoSelecionado('')
        setOsSelecionada(null)
    }

    const selecionarFornecedor = (fornecedor) => {
        setFornecedorSelecionado(fornecedor)
        setOsSelecionada(null)
    }

    const selecionarAno = (ano) => {
        setAnoSelecionado(ano)
        setOsSelecionada(null)
    }

    // clicar na OS já selecionada desmarca; clicar em outra troca a seleção
    const alternarOS = (os) => setOsSelecionada((atual) => (mesmaOS(atual, os) ? null : os))
    const limparOS = () => setOsSelecionada(null)

    // clicar numa peça (aba Início) ou digitar no campo da aba Peças: os dois usam a mesma pesquisa
    const selecionarPeca = (nome) => setPecaBusca(texto(nome))

    return (
        <Info.Provider value={{
            jsonData, jsonData2, carregarPlanilha,
            unidades, unidadesVisiveis, busca, setBusca,
            setorSelecionado, selecionado, selecionarUnidade,
            fornecedores, fornecedorSelecionado: fornecedorAtivo, selecionarFornecedor, dadosFornecedor,
            anos, anoSelecionado: anoAtivo, selecionarAno,
            osSelecionada, alternarOS, limparOS, pecasDaSelecao,
            infoPeca, pecaBusca, selecionarPeca, pesquisarPeca: setPecaBusca,
            TransformarEmMoeda: formatarMoeda,
        }}>
            {children}
        </Info.Provider>
    )
}

export default Prover
