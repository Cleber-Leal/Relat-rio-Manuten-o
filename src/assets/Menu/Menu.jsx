import React, { useContext } from 'react'
import "./Menu.css"
import { Info } from '../Info/Info'

const Menu = () => {

    const { unidades, unidadesVisiveis, busca, setBusca, setorSelecionado, selecionarUnidade } = useContext(Info)

    const mensagemVazia = unidades.length === 0
        ? 'Carregue uma planilha para ver as unidades'
        : 'Nenhuma unidade encontrada'

    return (
        <aside className='menu'>
            <input
                type="search"
                name="unidade"
                id="unidade"
                className='menu__busca'
                placeholder='Pesquisar unidade'
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
            />
            <nav className='menu__nav'>
                <ul className='menu__lista'>
                    {unidadesVisiveis.length === 0
                        ? <li className='menu__vazio'>{mensagemVazia}</li>
                        : unidadesVisiveis.map((item) => (
                            <li key={item}>
                                <button
                                    type="button"
                                    className={item === setorSelecionado ? 'menu__item menu__item--ativo' : 'menu__item'}
                                    onClick={() => selecionarUnidade(item)}
                                >
                                    {item}
                                </button>
                            </li>
                        ))}
                </ul>
            </nav>
        </aside>
    )
}

export default Menu
