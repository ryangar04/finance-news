import Linechart from "./chart/Linechart";
import NewsSectors from "./header/NewsSectors";
import './Header.css'

function Header(prop) {

    const linechartHtml = prop.tickers.map(ticker => {
        // console.log(priceData[ticker])
        return (
            <div key={ticker} className='nav-linechart'>
                <Linechart
                    ticker={ticker}
                    marketOpen={true}
                    extended={false}
                    showTicks={false}
                    showTooltip={false}
                    // pctChg={getStockData(ticker)}
                    // pctChg={Object.keys(prop.priceData).length === 0 ? '' : prop.priceData[ticker]['pctChg']}
                    // pctChg={Object.keys(prop.priceData).length === 0 ? '' : prop.priceData[ticker]['markPercentChangeInDouble'].toFixed(2) === undefined ? '' : prop.priceData[ticker]['markPercentChangeInDouble'].toFixed(2)}
                    //  prop.priceData[ticker]['markPercentChangeInDouble'].toFixed(2)
                />
            </div>
        )
    })

    const newsSectorHtml = prop.sectors.map(sector => <NewsSectors key={sector} sector={sector} setNewsQuery={prop.setNewsQuery} />)

    const handleMarketOverviewChange = (marketState) => {
        prop.setTickers(marketState)
    }

    return (
        <div>
            <div className='market-overview'>
                <h1 className='market-overview-title'>{
                    prop.tickers[9] === prop.standardPoorStocks[9] ? 'S&P 500' :
                    prop.tickers[9] === prop.dowJonesStocks[9] ? 'Dow Jones Industrial' :
                    prop.tickers[9] === prop.nasdaqStocks[9] ? 'Nasdaq Composite' :
                    'Russell 2000'
                } Market Overview</h1>
                <div className='market-overview-button-container'>
                    <button className='market-overview-button' onClick={() => handleMarketOverviewChange(prop.standardPoorStocks)}>Standard & Poor 500</button>
                    <button className='market-overview-button' onClick={() => handleMarketOverviewChange(prop.dowJonesStocks)}>Dow Jones Industrial</button>
                    <button className='market-overview-button' onClick={() => handleMarketOverviewChange(prop.nasdaqStocks)}>Nasdaq Composite</button>
                    <button className='market-overview-button' onClick={() => handleMarketOverviewChange(prop.russellStocks)}>Russell 2000</button>
                </div>
                <div className='nav-linechart-container'>
                    {linechartHtml}
                </div>
            </div>
            <div className='sector-button-container'>
                {newsSectorHtml}
            </div>
        </div>
    )
}

export default Header

// https://api.tdameritrade.com/v1/marketdata/${ticker}/pricehistory?apikey=PSHTVYVGEH2HMKPAYNIKC0AC6H1OK21E&periodType=day&period=1&frequencyType=minute&frequency=1&needExtendedHoursData=false