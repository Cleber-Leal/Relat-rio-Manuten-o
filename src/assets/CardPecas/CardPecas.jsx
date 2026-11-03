import React, { useContext } from 'react'
import "./CardPecas.css"
import { FaGear } from "react-icons/fa6";
import { Info } from '../Info/Info';
import { formatarMoeda, paraNumero, colorirPrimeiros4 } from '../Info/utils';

// peca = false -> card da lista de peças (aba Início); clicar leva a peça para comparação de preços.
// peca = true  -> card de oferta de um fornecedor (aba Peças).
const CardPecas = ({ produto, total, quantidade, peca = false, fornecedor, OS, equipamento }) => {

    const { selecionarPeca } = useContext(Info);

    if (peca) {
        return (
            <div className='cardPeca cardPeca--oferta'>
                <FaGear size={36} />
                {fornecedor ? <h4 className='cardPeca__fornecedor'>{fornecedor}</h4> : null}
                <h3 className='cardPeca__nome'>{produto}</h3>
                <p className='cardPeca__valor'>{formatarMoeda(total)}</p>
                <div className='cardPeca__rodape'>
                    {equipamento ? <span>{equipamento}</span> : null}
                    {OS != null ?<span> OS:  <span style={{ color: "#E3062C", fontWeight: "bold" }}>{OS.slice(0, 4)}</span>{OS.slice(4)}</span> : null}
                    {/* {OS != null ? colorirPrimeiros4(OS) : null} */}
                </div>
            </div>
        )
    }

    const qtd = paraNumero(quantidade)
    const unitario = qtd > 0 ? paraNumero(total) / qtd : paraNumero(total)

    const aoTeclar = (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            selecionarPeca(produto)
        }
    }

    return (
        <div
            role="button"
            tabIndex={0}
            title="Comparar preços na aba Peças"
            className='cardPeca'
            onClick={() => selecionarPeca(produto)}
            onKeyDown={aoTeclar}
        >
            <FaGear size={36} />
            <h3 className='cardPeca__nome'>{produto}</h3>
            <p className='cardPeca__valor'>{formatarMoeda(total)}</p>
            <span>Qtd: {quantidade}</span>
            <p className='cardPeca__unitario'>Un: {formatarMoeda(unitario)}</p>
        </div>
    )
}

export default CardPecas
