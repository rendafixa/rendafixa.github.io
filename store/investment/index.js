import axios from 'axios'

axios
  .get('https://www2.cetip.com.br/ConsultarTaxaDi/ConsultarTaxaDICetip.aspx')
  .then(function (response) {
    const index = response.data.taxa
    state.di = parseFloat(index.replace(/[.]/g, '').replace(',', '.'))
  })

axios
  .get('https://www.bcb.gov.br/api/servico/sitebcb/historicotaxasjuros')
  .then(function (response) {
    state.selic = response.data.conteudo[0].MetaSelic
  })

  axios
  .get('https://api.bcb.gov.br/dados/serie/bcdata.sgs.195/dados/ultimos/1?formato=json')
  .then(function (response) {
    state.poupanca = parseFloat(response.data[0].valor)
  })

export const state = {
  amount: 1000,
  duration: 12,
  di: 11.23,
  selic: 12.34,
  cdb: 105,
  lcx: 100,
  poupanca: 0.68
}
