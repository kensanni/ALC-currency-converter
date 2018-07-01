const getCurrencies = "https://free.currencyconverterapi.com/api/v5/currencies";
const currencies = [];


/**
 * @description 
 */
const selectCurrencyFromElement = document.querySelector("#selectCurrencyFrom");
const selectCurrencyToElement = document.querySelector("#selectCurrencyTo");
const amountElement = document.querySelector("#amount");
const submitBtnElement = document.querySelector("#submit");
const amountFromElement = document.querySelector("#amountFrom");
const amountToElement = document.querySelector("#amountTo");
const currenyFromElement = document.querySelector("#currencyFrom");
const currencyToElement = document.querySelector("#currencyTo");
const smallDevicesElement = document.querySelector("#smallDevice")

// variable for assigning or re-assigning indexdb result
let db;

const getDBvalue = (val) => {
  const transaction = db.transaction(['currencies'], 'readwrite')

  transaction.oncomplete = (event) => {
    console.log('event complete')
  }
  transaction.onerror = (event) => {
    console.log('onerror')
  }

  const objectStore = transaction.objectStore("currencies")
  const objectStoreRequest = objectStore.get(val)

  objectStoreRequest.onsuccess = (event) => {
    const result = objectStoreRequest.result
    console.log('result', result)
  }
}


/**
 * @class IndexedDb
 */
class IndexedDB {

  /**
   * @description Initialize and Open IndexedDB for storing exchange rates data
   * 
   * @param {string} symbol 
   * @param {integer} currencies
   * 
   */
  static initDb(symbol, currencies) {

    const openRequest = window.indexedDB.open('CurrencyConverter', 1);

    openRequest.onupgradeneeded = (event) => {

      console.log('ugrade needed');

      const newVersion = event.target.result;

      if (!newVersion.objectStoreNames.contains('currencies')) {
        newVersion.createObjectStore('currencies')
      }
    }

    openRequest.onerror = (event) => {
      console.log("Database error: " + event.target.errorCode)
    }

    openRequest.onsuccess = (event) => {
      const db = event.target.result;
      const query = db.transaction('currencies', 'readwrite');
      const store = query.objectStore('currencies');
      const addRequest = store.add(currencies, symbol)
    }
  }

  /**
   * @description Get currencies exchange rate from the indexedDB for offline use
   */
  static getData(data) {
    const openRequest = window.indexedDB.open('CurrencyConverter', 1);

    openRequest.onsuccess = (event) => {
      db = openRequest.result;
    }

    getDBvalue(data, db)
  }
}

/**
 * @class ServiceWorker
 */

class ServiceWorkers {

  /**
   * @description register service worker for offline use
   */
  static registerServiceWorker() {
    if (navigator.serviceWorker) {
      navigator.serviceWorker.register('sw.js').then(() => {
        console.log('Service worker running.')
      }).catch((error) => {
        console.log("error")
      })
    }
  }

}

/**
 * @class Converter
 */
class Converter {

  /**
   * @description Get all the currencies and apend it to the select field of the 'From' label
   * 
   * @param {Array} currencies 
   */
  static currencyFrom(currencies) {
    currencies.forEach(currency => {
      let opt = document.createElement('option');
      opt.value = currency.id;
      opt.innerHTML = currency.currencyName;
      selectCurrencyFromElement.appendChild(opt)
    })
    return currencies
  }

  /**
   * @description Get all the currencies and apend it to the select field of the 'To' label
   * 
   * @param {Array} currencies
   */
  static currencyTo(currencies) {
    currencies.forEach(currency => {
      let opt = document.createElement('option');
      opt.value = currency.id;
      opt.innerHTML = currency.currencyName;
      selectCurrencyToElement.appendChild(opt)
    })
    return currencies
  }

  static currencyObject(currencyId, currencyValue) {
    for(let i = 0; i < currencyId.length; i++) {
      const allCurrency = {
        currencyName: currencyValue[i].currencyName,
        id: currencyValue[i].id
      };
  
      currencies.push(allCurrency)
    }
  }

  static getALLCurrencies(getCurrencies) {
    console.log(getCurrencies, 'nrjffjjd')
    fetch(getCurrencies).then(response => { return response.json() })
      .then(response => {
        const currencyId = Object.keys(response.results);
        const currencyValue = Object.values(response.results)
        Converter.currencyObject(currencyId, currencyValue);
        Converter.currencyFrom(currencies);
        Converter.currencyTo(currencies);
      })
  }

  static convertCurrency() {
    const selectedFromValue = selectCurrencyFromElement.value;
    const selectedToValue = selectCurrencyToElement.value;
    const amount = amountElement.value
    const query = `${selectedFromValue}_${selectedToValue}`;
    const url = `https://free.currencyconverterapi.com/api/v5/convert?q=${query}&compact=y`

    fetch(url).then(response => { return response.json() })
      .then(response => {
        const symbol = response[query]
        const exchangeRate = response[query].val;
        const value = (amount * exchangeRate).toFixed(2);
        IndexedDB.initDb(query, response[query].val)
        IndexedDB.getData(query)
        amountFromElement.innerHTML = amount
        amountToElement.innerHTML = value
        currenyFromElement.innerHTML = selectedFromValue
        currencyToElement.innerHTML = selectedToValue
        smallDevicesElement.innerHTML = `${amount}${selectedFromValue} = ${value}${selectedToValue}` 
      })
  }
}



ServiceWorkers.registerServiceWorker();
Converter.getALLCurrencies(getCurrencies);

submitBtnElement.addEventListener("click", function (){
  Converter.convertCurrency(); 
}); 