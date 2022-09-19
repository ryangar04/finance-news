import News from "./News";
import {useEffect} from "react";
import './Content.css'

function MainNews(prop) {

    const callOne = ['Consumer Goods', 'Financial', 'Healthcare', 'Industrial Goods', 'Services', 'Technology', 'Utilities']
    const callTwo = ['General Market']
    const callThree = ['Stock Specific']

    const token = 'wk05m5apjaiqsdxny8hlcuwyzarjnftryhgeq8n8'

    useEffect(() => {
        prop.setNewsData([])
        fetch(callOne.includes(prop.newsQuery) ? `https://stocknewsapi.com/api/v1/category?section=alltickers&items=20&page=1&sector=${prop.newsQuery.replace(/ /g, "+")}&token=${token}` : callTwo.includes(prop.newsQuery) ? `https://stocknewsapi.com/api/v1/category?section=general&items=50&page=1&token=${token}` : callThree.includes(prop.newsQuery) ? `https://stocknewsapi.com/api/v1?tickers=AAPL,MSFT,GOOG,GOOGL,AMZN,TSLA,UNH,META,JNJ,V,NVDA,XOM,WMT,PG,JPM,MA,HD,CVX,PFE,NFLX,C&sources=Barrons,Benzinga,Business+Insider,CNBC,CNN+Business,Forbes,Fox+Business,NYTimes,The+Guardian&items=11&page=1&token=${token}` : '')
            .then(res => res.json())
            .then(data => {
                prop.setNewsData(data.data)
            })
    }, [prop.newsQuery])

    // useEffect(() => {
    //     if (prop.newsData.length !== 0 && prop.newsQuery === 'Stock Specific') {
    //         const tickers = prop.newsData.map(story => story.tickers[0])
    //         const query = tickers.map(ticker => ticker + '%2C').join('').slice(0, -3)
    //         console.log(query)
    //             fetch(`https://api.tdameritrade.com/v1/marketdata/quotes?apikey=SF9AX6HDID13OPBKOPEBRPG9DDCOHAAU&symbol=${query}`)
    //                 .then(res => res.json())
    //                 .then(data => {
    //                     let listStockData = Object.entries(data)
    //                     let stockData = listStockData.map(stock => stock[1])
    //                     console.log(stockData)
    //                 })
    //     }
    // })

    const newsCardHtml = prop.newsData.length === 0 ? '' : prop.newsData.map(story => {
        return (
            <News newsQuery={prop.newsQuery} key={story.title} story={story} newsData={prop.newsData} />
        )
    })

    return (
        <div className='news-container'>
            {newsCardHtml}
        </div>
    )
}

export default MainNews