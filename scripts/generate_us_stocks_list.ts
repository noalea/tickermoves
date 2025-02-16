import axios from 'axios';
import { headers } from "../constants/headers";
const fs = require('fs');

type Stock = {
  symbol: string;
  name: string;
}

type ListData = {
  ticker: string;
  name: string;
}

const EXCHANGES = ['nasdaq', 'nyse'];

async function fetchUSStocks() {
  try {
    const list_data: Record<"data", ListData[]> = { "data": []};
    const promises = EXCHANGES.map(async exchange => {
      const url = `https://api.nasdaq.com/api/screener/stocks?tableonly=true&exchange=${exchange}&download=true`;

      let config = {
        timeout: 10000,
        url,
        headers
      };
  
      const response = await axios.get(config.url, config);
      const data = response.data;
      
      // Extract stock list
      const stocks = data?.data?.rows || [];
      stocks.forEach((stock: Stock) => {
        const name = stock.name.replace(/Common Stock|American Depositary Shares|Inc.|American Depository Shares|Common Shares|Class B Ordinary Shares|Ordinary Shares|Class A|Ordinary Share|Units/g, '').replace('  ', ' ');
        list_data.data.push({ 
          ticker: stock.symbol, 
          name: removeTrailingSpace(name), 
        });
      });
    });

    await Promise.all(promises);

    fs.writeFileSync('data/us_stocks_list.json', JSON.stringify(list_data, null, 2), 'utf-8');

  } catch (error) {
    const err = error as Error;
    console.error('Error fetching data:', err.message);
  }
}

fetchUSStocks();

function removeTrailingSpace(str: string): string {
  return str.endsWith(' ') ? str.slice(0, -1) : str;
}