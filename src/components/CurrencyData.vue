<template>
  <div class="currency-data-wrap f-center">
    <div class="container m-sides">
      <div class="input-box">
        <div class="bg-blur"></div>
        <div class="input">
          <label for="">Type</label>
          <select name="type" v-model="rateType" required>
            <option value="" disabled>Choose type</option>
            <option value="eu">EU</option>
            <option value="lt">LT</option>
          </select>
        </div>
        <div class="input">
          <label for="">Currency</label>
          <select name="currency" v-model="currency" required>
            <option value="" disabled>Choose currency</option>
            <option v-for="(cur, i) in currencyList" :key="i" :value="cur">{{ cur.toUpperCase() }}</option>
          </select>
        </div>
        <div class="input">
          <label for="">Date From</label>
          <input type="date" v-model="dateFrom" required>
        </div>
        <div class="input">
          <label for="">Date To</label>
          <input type="date" v-model="dateTo" required>
        </div>
      </div>
      <button class="get-btn" type="button" @click="getData">GET DATA</button>
      <div v-if="ratesData.length !== 0" class="data-wrap">
        <table>
          <thead>
            <tr>
              <th>Currency</th>
              <th>Date from - to</th>
              <th>Total rate</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{{ ratesData[0].ccy }}</td>
              <td>{{ ratesData[ratesData.length - 1].date }} - {{ ratesData[0].date }}</td>
              <td>{{ totalRate }}</td>
            </tr>
          </tbody>
        </table>
        <table>
          <thead>
            <tr>
              <th>Currency</th>
              <th>Date</th>
              <th>Rate</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(val, i) in ratesData" :key="i">
              <td>{{ val.ccy }}</td>
              <td>{{ val.date }}</td>
              <td>{{ val.rate }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CurrencyData',
  data () {
    return {
      rateType: '',
      currency: '',
      dateFrom: '',
      dateTo: '',
      currencyList: [
        'aud',
        'bgn',
        'brl',
        'cad',
        'chf',
        'cny',
        'czk',
        'dkk',
        'gbp',
        'hkd',
        'hrk',
        'huf',
        'idr',
        'ils',
        'inr',
        'isk',
        'jpy',
        'krw',
        'mxn',
        'myr',
        'nok',
        'nzd',
        'php',
        'pln',
        'ron',
        'rub',
        'sek',
        'sgd',
        'thb',
        'try',
        'usd',
        'zar'
      ],
      ratesData: [],
      totalRate: Number
    }
  },
  methods: {
    getData () {
      // If have chrome extension CORS enable it and make runHeroku = false. Otherwise leave it like this
      const herokuData = {
        runHeroku: true,
        herokuUrl: 'https://cors-escape.herokuapp.com/'
      }

      if (this.rateType && this.currency && this.dateFrom && this.dateTo) {
        const xhttp = new XMLHttpRequest()
        const url = `${(herokuData.runHeroku) ? herokuData.herokuUrl : ''}http://old.lb.lt/webservices/fxrates/FxRates.asmx/getFxRatesForCurrency?tp=${this.rateType}&ccy=${this.currency}&dtFrom=${this.dateFrom}&dtTo=${this.dateTo}`
        xhttp.open('GET', url, true)
        xhttp.onreadystatechange = () => {
          if (xhttp.readyState === 4 && xhttp.status === 200) {
            const docArr = [...xhttp.responseXML.documentElement.children]
            this.saveData(docArr)
          }
        }
        xhttp.send()
      } else {
        alert('All inputs must be filled')
      }
    },
    saveData (data) {
      this.ratesData = []
      data.forEach(el => {
        const configData = {
          date: el.children.item(1).innerHTML,
          ccy: el.children.item(3).children.item(0).innerHTML,
          rate: el.children.item(3).children.item(1).innerHTML
        }
        this.ratesData.push(Object.assign(configData))
      })
      this.$nextTick(() => {
        this.totalRate = this.calcTotalRate()
      })
    },
    calcTotalRate () {
      return this.ratesData
        .map(item => Number(item.rate))
        .reduce((acc, cur) => acc + cur) / this.ratesData.length
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.currency-data-wrap {
  width: 100%;
}
.input-box {
  width: 100%;
  margin: 50px 0 25px 0;
  padding: 10px 0;
  position: relative;
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
}
  .input-box .bg-blur {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: #EDF1F3;
    filter: blur(30px);
    border-radius: 25px;
    z-index: 1;
  }
  .input-box > .input {
    max-width: 300px;
    width: 100%;
    z-index: 5;
  }
  .input > label {
    display: block;
    width: 100%;
    margin-top: 15px;
    text-align: left;
  }
  .input > input,
  .input > select {
    width: 100%;
    height: 48px;
    text-align: center;
    font-size: 18px;
    margin: 5px 0 10px 0;
    outline: none;
    border: 1px solid #E0E0E0;
  }
  .input > input:active,
  .input > input:focus {
    border-left: 2px solid #56CCF2;
  }
  input[type="date"]::-webkit-inner-spin-button {
    display: none;
    -webkit-appearance: none;
  }
.get-btn {
  width: 108px;
  height: 40px;
  margin-bottom: 50px;
  background-color: #FF4081;
  box-shadow: 0 4px 4px rgba(0, 0, 0, .25);
  border-radius: 50px;
  border: none;
  font-size: 18px;
  font-weight: bold;
  color: #fff;
  cursor: pointer;
}
table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 50px;
}
table th,
table td {
  border: 1px solid #dddddd;
  text-align: left;
  padding: 8px;
}
</style>
