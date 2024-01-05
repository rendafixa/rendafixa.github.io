import { defineStore } from "pinia";

interface Currency {
  title: string;
  value: string;
}

interface CurrencyConversion {
  amount: Number;
  base: string;
  date: Date;
  rates: {
    [key: string]: number;
  };
}

interface currencyHistory {
  amount: number;
  base: string;
  start_date: Date;
  end_date: Date;
  rates: {
    date: string;
    value: number;
  };
}

export const useCurrencyStore = defineStore("currency", {
  state: () => {
    return {
      amount: 1000,
      currencies: [] as Currency[],
      origin: { title: "British Pound", value: "GBP" } as Currency,
      target: { title: "Brazillian Real", value: "BRL" } as Currency,
      conversion: {} as CurrencyConversion,
      conversionRate: 0 as number,
      historicalData: {} as currencyHistory,
      currencySeries: {} as Object,
    };
  },
  persist: true,
  actions: {
    initializeStore() {
      this.fetchCurrencies();
      this.fetchHistoricalData();
    },
    flipCurrencies() {
      const temp = this.origin;
      this.origin = this.target;
      this.target = temp;
    },
    parseHistoricalData() {
      if (!this.historicalData || !this.historicalData.rates) return;
      this.currencySeries = Object.entries(this.historicalData.rates).map(
        ([key]) => ({
          name: key as string,
          value: [key, this.historicalData.rates[key][this.target.value]],
        })
      );
    },
    setConvertionRate(data: CurrencyConversion) {
      this.conversionRate = Object.values(data.rates)[0];
    },
    fetchCurrencies() {
      fetch("https://api.frankfurter.app/currencies")
        .then((response) => response.json())
        .then(
          (data) =>
            (this.currencies = Object.entries(data)
              .map(([value, title]) => ({
                title: title as string,
                value: value as string,
              }))
              .sort((a, b) => a.title.localeCompare(b.title)))
        )
        .catch((error) => console.log(error));
    },
    fetchConversion() {
      if (
        !this.amount ||
        !this.origin ||
        !this.target ||
        this.origin.value === this.target.value
      ) {
        return;
      }
      fetch(
        `https://api.frankfurter.app/latest?amount=${this.amount}&from=${this.origin.value}&to=${this.target.value}`
      )
        .then((response) => response.json())
        .then((data) => this.setConvertionRate(data))
        .catch((error) => console.log(error));
    },
    fetchHistoricalData() {
      fetch(
        `https://api.frankfurter.app/2000-01-01..2024-01-05?from=${this.origin.value}&to=${this.target.value}&amount=${this.amount}`
      )
        .then((response) => response.json())
        .then((data) => {
          this.historicalData = data;
          this.parseHistoricalData();
        })
        .catch((error) => console.log(error));
    },
  },
});
