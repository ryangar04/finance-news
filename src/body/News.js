import {useEffect, useState} from "react";

function News(prop) {

    const [pctChange, setPctChange] = useState(0)

    const cardType = prop.story.title === prop.newsData[0].title ? 'feature' : 'news'
    // 'markPercentChangeInDouble'
    function formatTime(time) {
        let date = time.split(' ')
        let hours = date[4]
        return hours
    }

    useEffect(() => {
        if (prop.story.tickers && prop.newsQuery === 'Stock Specific') {
            fetch(`https://api.tdameritrade.com/v1/marketdata/quotes?apikey=SF9AX6HDID13OPBKOPEBRPG9DDCOHAAU&symbol=${prop.story.tickers[0]}`)
                .then(res => res.json())
                .then(data => {
                    setPctChange(data[prop.story.tickers[0]]['markPercentChangeInDouble'].toFixed(2))
                })
        }
    }, [])

    const percentText = pctChange > 0 ? `+${pctChange}%` : `${pctChange}%`

    return (
            <a href={prop.story.news_url} className={`${cardType}-card`}>
                <div className={`${cardType}-card-body`}>
                    <div className={`${cardType}-main`}>
                        <div className={`${cardType}-header`}>
                            <p className={`${cardType}-source`}>{prop.story.source_name}</p>
                        </div>
                        <h3 className={`${cardType}-title`}>{prop.story.title}</h3>
                        {cardType === 'feature' ? <p className='feature-text'>{prop.story.text}</p> : ''}
                    </div>
                    {prop.newsQuery === 'Stock Specific' && prop.story.tickers &&
                        <div className='card-footer'>
                            <p className={`${cardType}-ticker`}>{prop.story.tickers[0]}</p><p className='percent-change' style={{color: pctChange > 0 ? 'rgb(135, 182, 130)' : pctChange < 0 ? "rgb(168, 100, 123)" : 'none'}}>{percentText}</p>
                        </div>}
                </div>
                <img alt='story image' className={`${cardType}-img`} src={prop.story.image_url}/>
            </a>
    )
}

export default News
