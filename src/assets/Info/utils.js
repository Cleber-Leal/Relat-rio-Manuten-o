// Funções auxiliares usadas em todo o projeto.

/** Remove espaços das pontas e transforma qualquer valor em texto ("" para null/undefined). */
export const texto = (valor) => String(valor ?? '').trim()

/** Compara dois valores como texto, ignorando espaços nas pontas e maiúsculas/minúsculas. */
export const igual = (a, b) => texto(a).toLowerCase() === texto(b).toLowerCase()

/** Compara duas OS (número ou texto): 123 e "123" são a mesma OS. OS vazia nunca é igual a nada. */
export const mesmaOS = (a, b) => texto(a) !== '' && texto(a) === texto(b)

/** Converte número, "1234.5" ou "R$ 1.234,50" em número. Valores inválidos viram 0. */
export const paraNumero = (valor) => {
    if (typeof valor === 'number') return Number.isFinite(valor) ? valor : 0
    if (valor == null) return 0
    const limpo = String(valor).replace(/[^\d,.-]/g, '')
    if (!limpo) return 0
    const numero = limpo.includes(',')
        ? Number(limpo.replace(/\./g, '').replace(',', '.'))
        : Number(limpo)
    return Number.isFinite(numero) ? numero : 0
}

/** Formata em reais. Nunca quebra com null/undefined. */
export const formatarMoeda = (valor) =>
    paraNumero(valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

/** Valor unitário da peça. A coluna da planilha pode se chamar "Valor " (com espaço) ou "Valor". */
export const obterValor = (item) => paraNumero(item?.['Valor '] ?? item?.Valor)

/** Lista de valores únicos, sem vazios, em ordem alfabética (pt-BR). */
export const valoresUnicos = (lista) =>
    [...new Set(lista.map(texto).filter(Boolean))].sort((a, b) => a.localeCompare(b, 'pt-BR'))

/** Remove espaços sobrando nos nomes das colunas da planilha ("Valor " -> "Valor"). */
export const normalizarLinhas = (linhas = []) =>
    linhas.map((linha) => {
        const nova = {}
        for (const [chave, valor] of Object.entries(linha)) {
            const limpa = chave.trim()
            // se já existir uma coluna com o nome limpo, mantém a original para não sobrescrever
            const conflito = limpa !== chave && Object.prototype.hasOwnProperty.call(linha, limpa)
            nova[conflito ? chave : limpa] = valor
        }
        return nova
    })

/**
 * Extrai o ano de uma data da planilha. Aceita "dd/mm/aaaa", "aaaa-mm-dd",
 * número serial do Excel e objeto Date.
 */
export const extrairAno = (data) => {
    if (data == null || data === '') return ''
    if (data instanceof Date) return data.getFullYear()
    if (typeof data === 'number') {
        // serial do Excel: dias desde 30/12/1899
        return new Date(Math.round((data - 25569) * 86400 * 1000)).getUTCFullYear()
    }
    const s = texto(data)
    const br = s.match(/^\d{1,2}\/\d{1,2}\/(\d{2,4})/)
    if (br) return br[1]
    const iso = s.match(/^(\d{4})-\d{1,2}-\d{1,2}/)
    if (iso) return iso[1]
    return s
}


export function colorirPrimeiros4(texto, cor = "#E3062C") {
    const escapar = (s) =>
        s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

    const inicio = escapar(texto.slice(0, 4));
    const resto = escapar(texto.slice(4));
    const juntar = `<span style="color:${cor}">${inicio}</span>`.concat(resto);
    return juntar;

}
/** Ano da OS: os 4 primeiros dígitos do número (ex.: 202601616 -> "2026"). Vazio se não for um ano válido. */
export const anoDaOS = (os) => {
    const ano = texto(os).slice(0, 4)
    return /^\d{4}$/.test(ano) ? ano : ''
}

/** Texto em minúsculas e sem acentos, para pesquisas ("Óleo" encontra "oleo"). */
export const paraBusca = (valor) =>
    texto(valor).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
