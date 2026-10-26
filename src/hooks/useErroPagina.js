import { useSearchParams } from 'react-router-dom'

const TIPOS_ERRO = ['carregar', 'timeout', 'indisponibilidade']

// Le o tipo de erro da URL (?erro=carregar|timeout|indisponibilidade).
// Mantem compatibilidade com o formato antigo ?erro=1 (erro ao carregar).
export default function useErroPagina() {
  const [searchParams, setSearchParams] = useSearchParams()
  const valor = (searchParams.get('erro') || '').trim().toLowerCase()

  const tipo = valor === '1'
    ? 'carregar'
    : TIPOS_ERRO.includes(valor)
      ? valor
      : null

  function limparErro() {
    const proximos = new URLSearchParams(searchParams)
    proximos.delete('erro')
    setSearchParams(proximos, { replace: true })
  }

  return { tipo, limparErro }
}
