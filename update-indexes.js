const axios = require('axios');
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'assets', 'indicadores.json');
const indicadores = require(filePath);

async function fetchPoupanca() {
  try {
    console.log('Fetching Poupanca...');
    const response = await axios.get('https://api.bcb.gov.br/dados/serie/bcdata.sgs.195/dados/ultimos/1?formato=json');
    const value = parseFloat(response.data[0].valor);
    if(isNaN(value)) {
      console.error('Invalid Poupanca value received:', value);
      console.error('Full payload:', response.data);
      return null;
    }
    console.log('Poupanca value fetched:', value);
    return value;
  } catch (error) {
    console.error('Error fetching Poupanca:', error);
  }
}

async function fetchDi() {
  try {
    console.log('Fetching DI...');
    const response = await axios.get('https://api.bcb.gov.br/dados/serie/bcdata.sgs.4391/dados/ultimos/13?formato=json');
    const data = response.data.slice(1); // Ignores the partial value of current month
    const value = data.map(item => parseFloat(item.valor)).reduce((acc, value) => acc + value, 0);
    console.log('DI value fetched:', value);
    return value;
  } catch (error) {
    console.error('Error fetching DI:', error);
  }
}

async function fetchSelic() {
  try {
    console.log('Fetching Selic...');
    const response = await axios.get('https://www.bcb.gov.br/api/servico/sitebcb/historicotaxasjuros');
    const value = response.data.conteudo[0].MetaSelic;
    console.log('Selic value fetched:', value);
    return value;
  } catch (error) {
    console.error('Error fetching Selic:', error);
  }
}

async function updateIndicadores() {
  try {
    const poupancaValue = await fetchPoupanca();
    const selicValue = await fetchSelic();
    const cdiValue = await fetchDi();

    if (!poupancaValue || isNaN(poupancaValue)) {
      console.warn('Skipping update: Invalid poupanca value.');
      indicadores.poupanca.value = poupancaValue;
    }
    
    indicadores.selic.value = selicValue;
    indicadores.cdi.value = cdiValue;

    fs.writeFileSync(filePath, JSON.stringify(indicadores, null, 2));
    console.log('indicadores.json updated successfully');
  } catch (error) {
    console.error('Error updating indicadores.json:', error);
  }
}

updateIndicadores();