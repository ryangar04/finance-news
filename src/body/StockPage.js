import './StockPage.css'
import {useEffect, useState} from "react";
import Areachart from "../chart/Areachart";
import Barchart from "../chart/BarChart";
import StockPageNews from "./StockPageNews";
import News from './News'

function StockPage(prop) {

    const [historicalData, setHistoricalData] = useState([])
    const [stocknews, setStockNews] = useState([])
    const [percentChange, setPercentChange] = useState(0)
    const [priceChange, setPriceChange] = useState(0)

    function formatTime(num) {
        num = num.toString()
        num = num.slice(0, -3);
        num = parseInt(num)
        let date = new Date(num*1000)
        return date.toString().split(' ')[4]
    }

    function abbrNum(number, decPlaces) {
        // 2 decimal places => 100, 3 => 1000, etc
        decPlaces = Math.pow(10, decPlaces);

        // Enumerate number abbreviations
        let abbrev = ["K", "M", "B", "T"];

        // Go through the array backwards, so we do the largest first
        for (let i = abbrev.length - 1; i >= 0; i--) {

            // Convert array index to "1000", "1000000", etc
            let size = Math.pow(10, (i + 1) * 3);

            // If the number is bigger or equal do the abbreviation
            if (size <= number) {
                // Here, we multiply by decPlaces, round, and then divide by decPlaces.
                // This gives us nice rounding to a particular decimal place.
                number = Math.round(number * decPlaces / size) / decPlaces;

                // Handle special case where we round up to the next abbreviation
                if ((number === 1000) && (i < abbrev.length - 1)) {
                    number = 1;
                    i++;
                }

                // Add the letter for the abbreviation
                number += abbrev[i];

                // We are done... stop
                break;
            }
        }

        return number;
    }

    function commas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    useEffect(() => {
        if (prop.holiday) {
            let start
            let end
            fetch(`https://api.tdameritrade.com/v1/marketdata/${prop.ticker}/pricehistory?apikey=PSHTVYVGEH2HMKPAYNIKC0AC6H1OK21E&periodType=day&period=1&frequencyType=minute&frequency=1&needExtendedHoursData=true`)
                .then(res => res.json())
                .then(data => {
                    start = data.candles[0].datetime - 86400000
                    end = data.candles[data.candles.length - 1].datetime - 86400000
                    setHistoricalData(data.candles.map(interval => {
                        return {
                            ...interval,
                            mark: interval.close.toFixed(2),
                            time: formatTime(interval.datetime)
                        }
                    }))
                })
            fetch(`https://api.tdameritrade.com/v1/marketdata/${prop.ticker}/pricehistory?apikey=PSHTVYVGEH2HMKPAYNIKC0AC6H1OK21E&frequencyType=minute&frequency=1&endDate=${end}&startDate=${start}&needExtendedHoursData=true`)
                .then(res => res.json())
                .then(data => {
                    setPercentChange((historicalData[historicalData.length - 1].close / data.candles[data.candles.length - 1].close).toFixed(2))
                    setPriceChange((historicalData[historicalData.length - 1].close - data.candles[data.candles.length - 1].close).toFixed(2))
                })
        } else {
            setPriceChange(prop.general.markChangeInDouble)
            setPercentChange(prop.general.markPercentChangeInDouble.toFixed(2))
            const start = parseInt(prop.general.regularMarketTradeTimeInLong.toString().slice(0, -3)) - 23400 + '000'
            const end = prop.general.regularMarketTradeTimeInLong.toString().slice(0, -3) + '000'
            console.log(start, end)
            fetch(`https://api.tdameritrade.com/v1/marketdata/${prop.ticker}/pricehistory?apikey=PSHTVYVGEH2HMKPAYNIKC0AC6H1OK21E&frequencyType=minute&frequency=1&endDate=${end}&startDate=${start}&needExtendedHoursData=true`)
                .then(res => res.json())
                .then(data => setHistoricalData(data.candles.map(interval => {
                    return {
                        ...interval,
                        mark: interval.close.toFixed(2),
                        time: formatTime(interval.datetime)
                    }
                })))
        }
    }, [prop.searches])

    // useEffect(() => {
    //     const start = parseInt(prop.general.regularMarketTradeTimeInLong.toString().slice(0, -3)) - 23400 + '000'
    //     const end = prop.general.regularMarketTradeTimeInLong.toString().slice(0, -3) + '000'
    //     console.log(start, end)
    //     fetch(`https://api.tdameritrade.com/v1/marketdata/${prop.ticker}/pricehistory?apikey=PSHTVYVGEH2HMKPAYNIKC0AC6H1OK21E&frequencyType=minute&frequency=1&endDate=${end}&startDate=${start}&needExtendedHoursData=false`)
    //         .then(res => res.json())
    //         .then(data => setHistoricalData(data.candles.map(interval => {
    //             return {
    //                 ...interval,
    //                 mark: interval.close.toFixed(2),
    //                 time: formatTime(interval.datetime)
    //             }
    //         })))
    // }, [prop.searches])

    useEffect(() => {
        fetch(`https://stocknewsapi.com/api/v1?tickers=${prop.ticker}&items=50&page=1&token=wk05m5apjaiqsdxny8hlcuwyzarjnftryhgeq8n8`)
            .then(res => res.json())
            .then(data => setStockNews(data.data))
    }, [prop.searches])

    const newsHtml = stocknews.length !== 0 ? stocknews.map(story => <StockPageNews key={story.title} story={story} />) : ''

    //00C805
    //FF5000

    const stockTheme = percentChange > 0 ? {one: '#00C805', two: '#33d337', three: '#66de69', four: '#99e99b', five: '#ccf4cd'} : percentChange < 0 ? {one: '#ff5000', two: '#ff7333', three: '#ff9666', four: '#ffb999', five: '#ffdccc'} : {one: '#FFFFFF', two: '#CCCCCC', three: '#999999', four: '#666666', five: '#333333'}

    // console.log(firstInterval.close, lastInterval.close)
    // console.log(((lastInterval.close / firstInterval.close) - 1).toFixed(4) * 100 + '%')

    function handleChart(periodType, period, frequencyType, frequency) {
        if (frequencyType === 'minute' && frequency === 1) {
            if (prop.holiday) {
                let start
                let end
                fetch(`https://api.tdameritrade.com/v1/marketdata/${prop.ticker}/pricehistory?apikey=PSHTVYVGEH2HMKPAYNIKC0AC6H1OK21E&periodType=day&period=1&frequencyType=minute&frequency=1&needExtendedHoursData=true`)
                    .then(res => res.json())
                    .then(data => {
                        start = data.candles[0].datetime - 86400000
                        end = data.candles[data.candles.length - 1].datetime - 86400000
                        setHistoricalData(data.candles.map(interval => {
                            return {
                                ...interval,
                                mark: interval.close.toFixed(2),
                                time: formatTime(interval.datetime)
                            }
                        }))
                    })
                fetch(`https://api.tdameritrade.com/v1/marketdata/${prop.ticker}/pricehistory?apikey=PSHTVYVGEH2HMKPAYNIKC0AC6H1OK21E&frequencyType=minute&frequency=1&endDate=${end}&startDate=${start}&needExtendedHoursData=true`)
                    .then(res => res.json())
                    .then(data => {
                        setPercentChange((historicalData[historicalData.length - 1].close / data.candles[data.candles.length - 1].close).toFixed(2))
                        setPriceChange((historicalData[historicalData.length - 1].close - data.candles[data.candles.length - 1].close).toFixed(2))
                    })
            } else {
                setPriceChange(prop.general.markChangeInDouble)
                setPercentChange(prop.general.markPercentChangeInDouble.toFixed(2))
                const start = parseInt(prop.general.regularMarketTradeTimeInLong.toString().slice(0, -3)) - 23400 + '000'
                const end = prop.general.regularMarketTradeTimeInLong.toString().slice(0, -3) + '000'
                console.log(start, end)
                fetch(`https://api.tdameritrade.com/v1/marketdata/${prop.ticker}/pricehistory?apikey=PSHTVYVGEH2HMKPAYNIKC0AC6H1OK21E&frequencyType=minute&frequency=1&endDate=${end}&startDate=${start}&needExtendedHoursData=true`)
                    .then(res => res.json())
                    .then(data => setHistoricalData(data.candles.map(interval => {
                        return {
                            ...interval,
                            mark: interval.close.toFixed(2),
                            time: formatTime(interval.datetime)
                        }
                    })))
            }
        } else {
            fetch(`https://api.tdameritrade.com/v1/marketdata/${prop.ticker}/pricehistory?apikey=PSHTVYVGEH2HMKPAYNIKC0AC6H1OK21E&periodType=${periodType}&period=${period}&frequencyType=${frequencyType}&frequency=${frequency}&needExtendedHoursData=false`)
                .then(res => res.json())
                .then(data => {
                    setHistoricalData(data.candles.map(interval => {
                        return {
                            ...interval,
                            mark: interval.close.toFixed(2),
                            time: interval.datetime
                        }
                    }))
                    setPriceChange((data.candles[data.candles.length - 1].close - data.candles[0].close).toFixed(2))
                    setPercentChange((((data.candles[data.candles.length - 1].close / data.candles[0].close) - 1).toFixed(2) * 100).toFixed(2))
                    console.log(priceChange)
                    console.log(percentChange)
                })
        }
    }

    return (
        <div className='stock-container'>
            <div className='stock-header'>
                <h1 className='stock-company'>{prop.general.company}</h1>
                <h1 style={{color: stockTheme.one}} className='stock-price'>{`$${prop.general.lastPrice.toFixed(2)}`}</h1>
                <div className='stock-head-metric'>
                    <p style={{color: stockTheme.one}} className='stock-change'>{`${priceChange > 0 ? '+' : '-'}$${priceChange < 0 ? priceChange.toString().slice(1) : priceChange}`}</p>
                    <p style={{color: stockTheme.one}} className='stock-pct'>{`(${percentChange > 0 ? '+' : ''}${percentChange}%)`}</p>
                </div>
            </div>
            <Areachart stockTheme={stockTheme} historicalData={historicalData}/>
            <div className='button-container'>
                <button onClick={() => handleChart('day', 1, 'minute', 1)}>1D</button>
                <button onClick={() => handleChart('day', 5, 'minute', 10)}>1W</button>
                <button onClick={() => handleChart('month', 3, 'daily', 1)}>3M</button>
                <button onClick={() => handleChart('year', 1, 'daily', 1)}>1Y</button>
                {/*<button onClick={() => handleChart('year', 5, 'daily', 1)}>5Y</button>*/}
                {/*<button onClick={() => handleChart('year', 10, 'daily', 1)}>10Y</button>*/}
            </div>
            <div className='stock-statistics'>
                <h1 className='stock-section-header'>Statistics</h1>
                <div className='stock-statistics-row'>
                    <div className='stock-statistics-row-metric'>
                        <p className='stock-statistics-metric-title'>Market Cap</p>
                        <p className='stock-statistics-metric'>${abbrNum((prop.fundamental.marketCap * 1000000).toFixed(), 2)}</p>
                    </div>
                    <div className='stock-statistics-row-metric'>
                        <p className='stock-statistics-metric-title'>Volume</p>
                        <p className='stock-statistics-metric'>{abbrNum(prop.general.totalVolume, 2)}</p>
                    </div>
                    <div className='stock-statistics-row-metric'>
                        <p className='stock-statistics-metric-title'>Avg 10D Volume</p>
                        <p className='stock-statistics-metric'>{abbrNum(prop.fundamental.vol10DayAvg, 2)}</p>
                    </div>
                    <div className='stock-statistics-row-metric'>
                        <p className='stock-statistics-metric-title'>Avg 3M Volume</p>
                        <p className='stock-statistics-metric'>{abbrNum(prop.fundamental.vol3MonthAvg, 2)}</p>
                    </div>
                </div>
                <div className='stock-statistics-row'>
                    <div className='stock-statistics-row-metric'>
                        <p className='stock-statistics-metric-title'>High Today</p>
                        <p className='stock-statistics-metric'>${commas(prop.general.highPrice.toFixed(2))}</p>
                    </div>
                    <div className='stock-statistics-row-metric'>
                        <p className='stock-statistics-metric-title'>Low Today</p>
                        <p className='stock-statistics-metric'>${commas(prop.general.lowPrice.toFixed(2))}</p>
                    </div>
                    <div className='stock-statistics-row-metric'>
                        <p className='stock-statistics-metric-title'>Open Price</p>
                        <p className='stock-statistics-metric'>${commas(prop.general.openPrice.toFixed(2))}</p>
                    </div>
                    <div className='stock-statistics-row-metric'>
                        <p className='stock-statistics-metric-title'>Beta</p>
                        <p className='stock-statistics-metric'>{prop.fundamental.beta.toFixed(4)}</p>
                    </div>
                </div>
                <div className='stock-statistics-row'>
                    <div className='stock-statistics-row-metric'>
                        <p className='stock-statistics-metric-title'>52 Week High</p>
                        <p className='stock-statistics-metric'>${commas(prop.general['52WkHigh'].toFixed(2))}</p>
                    </div>
                    <div className='stock-statistics-row-metric'>
                        <p className='stock-statistics-metric-title'>52 Week Low</p>
                        <p className='stock-statistics-metric'>${commas(prop.general['52WkLow'].toFixed(2))}</p>
                    </div>
                    {prop.general.divDate !== '' &&
                        <div className='stock-statistics-row-metric'>
                            <p className='stock-statistics-metric-title'>Dividend Date</p>
                            <p className='stock-statistics-metric'>{prop.general.divDate.split(' ')[0]}</p>
                        </div>
                    }
                    {prop.general.divYield !== 0 &&
                        <div className='stock-statistics-row-metric'>
                            <p className='stock-statistics-metric-title'>Dividend Yield</p>
                            <p className='stock-statistics-metric'>{prop.general.divYield}</p>
                        </div>
                    }
                </div>
            </div>
            <div>
                <h1 className='stock-section-header'>Earnings & Analysis</h1>
                <div className='stock-trends-analysis'>
                    <Barchart stockTherme ticker={prop.ticker} searches={prop.searches} type='earnings' stockTheme={stockTheme} />
                    <Barchart ticker={prop.ticker} searches={prop.searches} type='recommendation' stockTheme={stockTheme} />
                </div>
            </div>
            <div className='stock-news'>
                <h1 className='stock-section-header'>News</h1>
                <div className='stock-page-news'>
                    {newsHtml}
                </div>
            </div>
        </div>
    )
}

export default StockPage