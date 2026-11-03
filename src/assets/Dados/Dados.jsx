import React, { useContext } from 'react'
import { Info } from '../Info/Info'
import "./Dados.css"
import Card from '../Card/Card';
import ContainerPecas from '../ContainerPecas/ContainerPecas';
import { formatarMoeda } from '../Info/utils';
import { GiConfirmed } from "react-icons/gi";
import { IoMdCloseCircleOutline } from "react-icons/io";

const Dados = () => {
    const {
        jsonData, selecionado, fornecedores, fornecedorSelecionado,
        selecionarFornecedor, dadosFornecedor,
        anos, anoSelecionado, selecionarAno,
    } = useContext(Info);

    if (jsonData.length === 0) {
        return (
            <main className='pagina pagina--vazia'>
                <h1>CARREGUE UMA PLANILHA</h1>
            </main>
        )
    }

    if (selecionado.length === 0) {
        return (
            <main className='pagina pagina--vazia'>
                <h1>SELECIONE UMA UNIDADE</h1>
            </main>
        )
    }

    const unidade = selecionado[0]
    const integrado = unidade.Integracao === "Sim"

    return (
        <main className='pagina dados'>
            <div className='dados__lateral'>
                <div className='dados__fornecedores'>
                    <h2>FORNECEDORES</h2>
                    <select
                        id='Selecionar'
                        className='dados__select'
                        value={fornecedorSelecionado}
                        onChange={(e) => selecionarFornecedor(e.target.value)}
                    >
                        <option value="">Todos os fornecedores</option>
                        {fornecedores.map((fornecedor) => (
                            <option key={fornecedor} value={fornecedor}>{fornecedor}</option>
                        ))}
                    </select>

                    <h2>ANO DA OS</h2>
                    <div className='dados__anos'>
                        {['', ...anos].map((ano) => (
                            <button
                                key={ano || 'todos'}
                                type="button"
                                aria-pressed={anoSelecionado === ano}
                                className={anoSelecionado === ano ? 'dados__ano dados__ano--ativo' : 'dados__ano'}
                                onClick={() => selecionarAno(ano)}
                            >
                                {ano || 'Todos'}
                            </button>
                        ))}
                    </div>
                </div>

                <div className='dados__itens'>
                    {dadosFornecedor.map((item, indice) => (
                        <Card
                            key={`${item.OS}-${indice}`}
                            item={item.Equipamento}
                            valor={item.Custo}
                            quant={item.Quantidade}
                            OS={item.OS}
                            data={item["Data de Fechamento"]}
                        />
                    ))}
                </div>
            </div>

            <div className='dados__principal'>
                <div className='dados__unidade'>
                    <h1>{unidade.Setor}</h1>
                    <div className='dados__unidade-info'>
                        <div>
                            <p className='dados__integracao'>
                                Integração:
                                {integrado
                                    ? <GiConfirmed style={{ color: "green" }} size={20} />
                                    : <IoMdCloseCircleOutline style={{ color: "red" }} size={20} />}
                            </p>
                            <h3>{unidade.Responsavel}</h3>
                        </div>
                        {integrado && <p>Orçado: {formatarMoeda(unidade.Orcamento)}</p>}
                    </div>
                </div>

                <ContainerPecas />
            </div>
        </main>
    )
}

export default Dados
