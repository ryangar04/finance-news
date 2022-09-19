import Header from "./Header";
import MainNews from "./body/MainNews";
import StockPage from "./body/StockPage";
import './App.css';
import {useEffect, useState} from "react";
import stock from './data/stock-data'
import etf from './data/etf-data'

const stockArray = Object.values(stock['Symbol'])
const etfArray = Object.values(etf['Symbol'])

function App() {

    const standardPoorStocks = ['AAPL','MSFT','AMZN','TSLA','GOOGL','GOOG','BRK.B','UNH','NVDA','JNJ']
    const dowJonesStocks = ['UNH','GS','HD','MSFT','MCD','AMGN','V','HON','CRM','CAT']
    const nasdaqStocks = ['AAPL','MSFT','AMZN','TSLA','GOOG','GOOGL','NVDA','META','PEP','COST']
    const russellStocks = ['AMC','NTLA','CROX','LSCC','THC','BJ','TTEK','RXN','VRNS','STAA']
    const sectors = ['Stock Specific','Consumer Goods', 'Financial', 'Healthcare', 'Industrial Goods', 'Services', 'Technology', 'Utilities', 'General Market']

    const [tickers, setTickers] = useState(nasdaqStocks)
    const [priceData, setPriceData] = useState({})
    const [newsData, setNewsData] = useState([])
    const [newsQuery, setNewsQuery] = useState('Stock Specific')
    const [search, setSearch] = useState('')
    const [searches, setSearches] = useState(0)
    const [showStockPage, setShowStockPage] = useState(false)
    const [generalSearchData, setGeneralSearchData] = useState({})
    const [fundamentalSearchData, setFundamentalSearchData] = useState({})
    const [holiday, setHoliday] = useState(false)
    const [openTrading, setOpenTrading] = useState(true)

    function handleChange(event) {
        setSearch(event.target.value)
    }

    function handleSubmit(event) {
        event.preventDefault()
        if (stockArray.includes(search.toUpperCase()) || etfArray.includes(search.toUpperCase())) {
            setSearches(prevSearches => prevSearches + 1)
            setShowStockPage(true)
        }
    }

    function nyseTimes(year, month, day) {
        // year yyyy
        // month 0-11
        // day 1-31
        // true or false
        // Eastern Time
        // day += 1
        const preMarketOpen = (new Date(year, month, day).getTime()) + 3600000
        const marketOpen = (new Date(year, month, day).getTime()) + 23400000
        const marketClose = (new Date(year, month, day).getTime()) + 46800000
        const postMarketClose = new Date(year, month, day).getTime() + 61200000
        return {preMarketOpen, marketOpen, marketClose, postMarketClose}
    }

    const d = new Date()

    const nyse = new Date().toLocaleString("en-US", {timeZone: "America/New_York"})
    const nyseTime = new Date(nyse)
    const hour = parseInt(nyseTime.toString().split(' ')[4].slice(0, 2))

    useEffect(() => {
        console.log(hour)
        if (nyseTime.getDay() === 0 || nyseTime.getDay() === 6) { // or market is closed
            setOpenTrading(false)
            setHoliday(true)
        } else if (nyseTime.getDay() === 1) {
            if (hour < 7) {
                // because of how the API is strucutred I need to count monday pre trading as a holioday becasue trading data is still wiped
                console.log('trading day not started')
                setOpenTrading(false)
                setHoliday(true)
            }
        } else {
            if (hour < 7) {
                console.log('trading day not started')
                setOpenTrading(false)
            } else if (hour > 20) {
                setOpenTrading(false)
                console.log('trading day over')
            } else {
                console.log('trading day')
            }
        }
    }, [])

    useEffect(() => {
        // if ()
        const index = Object.values(stock['Symbol']).indexOf(search.toUpperCase())
        if (stockArray.includes(search.toUpperCase()) || etfArray.includes(search.toUpperCase())) {
            fetch(`https://api.tdameritrade.com/v1/marketdata/${search.toUpperCase()}/quotes?apikey={token}`)
                .then(res => res.json())
                .then(data => setGeneralSearchData({...data[search.toUpperCase()], company: Object.values(stock['Company Name'])[index], industry: Object.values(stock['Industry'])[index]})) // setGeneralSearchData(data[search.toUpperCase()])
            fetch(`https://api.tdameritrade.com/v1/instruments?apikey={token}&symbol=${search.toUpperCase()}&projection=fundamental`)
                .then(res => res.json())
                .then(data => setFundamentalSearchData(data[search.toUpperCase()]['fundamental']))
            if (stockArray.includes(search.toUpperCase())) {
                const index = Object.values(stock['Symbol']).indexOf(search.toUpperCase())
                setGeneralSearchData(prevData => {
                    return {
                        ...prevData,
                        company: Object.values(stock['Company Name'])[index],
                        industry: Object.values(stock['Industry'])[index],
                        test: 'THIS A TEST PROPERTY'
                    }
                })
            } else {
                const index = Object.values(etf['Symbol']).indexOf(search.toUpperCase())
                setGeneralSearchData(prevData => {
                    return {
                        ...prevData,
                        fund: Object.values(etf['Fund Name'])[index],
                        assetClass: Object.values(etf['Asset Class'])[index]
                    }
                })
            }
        } else {
            console.log(false)
        }
    }, [searches])

    console.log(generalSearchData)

    return (
    <div className="App">
        <div className='search-container'>
            <input className='search-bar' placeholder='Ticker' value={search} onChange={handleChange} />
            <button className='search-button' onClick={handleSubmit}>Search</button>
        </div>
        {!showStockPage &&
            <div>
                <Header
                    setNewsQuery={setNewsQuery}
                    sectors={sectors}

                    standardPoorStocks={standardPoorStocks}
                    dowJonesStocks={dowJonesStocks}
                    nasdaqStocks={nasdaqStocks}
                    russellStocks={russellStocks}
                    priceData={priceData}
                    tickers={tickers}
                    setTickers={setTickers}
                />
                <MainNews
                    newsData={newsData}
                    setNewsData={setNewsData}
                    newsQuery={newsQuery}
                />
            </div>}
        {
            showStockPage &&
            Object.keys(generalSearchData).length !== 0 &&
            Object.keys(fundamentalSearchData).length !== 0 &&

            <StockPage ticker={search.toUpperCase()} holiday={holiday} openTrading={openTrading} searches={searches} general={generalSearchData} fundamental={fundamentalSearchData}  />
        }

    </div>
  );
}

export default App;

// https://stocknewsapi.com/api/v1?tickers=AAPL,MSFT,GOOG,GOOGL,AMZN,TSLA,UNH,META,JNJ,V,NVDA,XOM,WMT,PG,JPM,MA,HD,CVX,PFE,KO,BAC,PEP,BABA,COST,TM,ORCL,ADBE,DIS,MCD,SHEL,VZ,CSCO,TMUS,NKE,UPS,CMCSA,WFC,AMD,MS,INTC,CVS,T,LOW,BX,IBM,GS,PYPL,BLK,NFLX,C&sources=Barrons,Benzinga,Business+Insider,CNBC,CNN+Business,Forbes,Fox+Business,NYTimes,The+Guardian&items=20&page=1&token={token}

// &sector=Basic+Materials Basic Materials
// &sector=Conglomerates Conglomerates
// &sector=Consumer+Goods Consumer Goods
// &sector=Financial Financial
// &sector=Healthcare Healthcare
// &sector=Industrial+Goods Industrial Goods
// &sector=Services Services
// &sector=Technology Technology
// &sector=Utilities Utilities
