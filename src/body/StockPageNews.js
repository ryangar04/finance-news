import {useState} from "react";

function StockPageNews(prop) {

    const [displayText, setDisplay] = useState(false)

    function handleHover() {
        setDisplay(prevDisplay => !prevDisplay)
    }

    return (
        <a onMouseEnter={handleHover} onMouseLeave={handleHover} className='stock-page-news-card' href={prop.story.news_url}>
            {!displayText ?
                <>
                    <div className='stock-page-news-body'>
                        <div className='stock-page-news-head'>
                            <p className='stock-page-news-source'>{prop.story.source_name}</p>
                            <h3 className='stock-page-news-title'>{prop.story.title}</h3>
                        </div>
                        <p className='stock-page-news-sentiment'
                           style={{color: prop.story.sentiment === 'Positive' ? '#00C805' : prop.story.sentiment === 'Negative' ? '#ff5000' : '#FFFFFF'}}>{prop.story.sentiment}</p>
                    </div>
                </>
            : <p style={{color: 'white', fontSize: '.9rem', height: '125px', margin: 0}} className='stock-page-news-text'>{prop.story.text}</p>}
                    <img className='stock-page-news-img' src={prop.story.image_url} />
        </a>
    )
}

export default StockPageNews;