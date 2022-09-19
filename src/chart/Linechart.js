import {LineChart, Line, Tooltip, ResponsiveContainer, XAxis, YAxis, AreaChart, Area, ReferenceLine} from "recharts";
import {useEffect, useState} from "react";

export default function Linechart(prop) {

    const [historicalPriceData, setHistoricalPriceData] = useState([])
    const [pctChange, setPctChange] = useState('')

    useEffect(() => {
        fetch(`https://api.tdameritrade.com/v1/marketdata/${prop.ticker}/pricehistory?apikey=PSHTVYVGEH2HMKPAYNIKC0AC6H1OK21E&periodType=day&period=1&frequencyType=minute&frequency=5${prop.marketOpen ? '&endDate=1660161600000&startDate=1660138200000' : ''}&needExtendedHoursData=${prop.extended}`)
            .then(res => res.json())
            .then(data => setHistoricalPriceData(data.candles.map(interval => {
                return {
                    ...interval,
                    close: interval.close.toFixed(2)
                    // round off close to two decimals
                }
            })))
    }, [])

    useEffect(() => {
        fetch(`https://api.tdameritrade.com/v1/marketdata/${prop.ticker}/quotes?apikey=SF9AX6HDID13OPBKOPEBRPG9DDCOHAAU`)
            .then(res => res.json())
            .then(data => {
                setPctChange(data[prop.ticker]['markPercentChangeInDouble'].toFixed(2))
            })
    }, [])

    return (
        <div className='linechart'>
            <p className='nav-linechart-ticker'>{prop.ticker}</p>
            <p className='nav-linechart-pct-chg' style={{color: pctChange > 0 ? 'rgb(135, 182, 130)' : 'rgb(168, 100, 123)'}}>{pctChange > 0 ? `+${pctChange}` : pctChange}%</p>
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart margin={{ top: 30, left: 0, right: 0, bottom: 0 }} data={historicalPriceData}>
                    <Area
                        type="monotone"
                        dataKey="close"
                        stroke={pctChange > 0 ?"rgb(135, 182, 130)" : "rgb(168, 100, 123)"}
                        strokeWidth={1}
                        dot={false}
                        activeDot={false}
                        // fill={prop.pctChg > 0 ?"rgba(223, 236, 222, .2)" : "rgba(241, 217, 225, .2)"}
                        fill={'rgba(20, 21, 25, .8)'}
                    />
                    <XAxis dataKey="" tick={prop.showTicks} />
                    <YAxis domain=""  tick={prop.showTicks} />
                    {/*<Tooltip contentStyle={{backgroundColor:  '#111827', color: 'lightgray', }} itemStyle={{ color: '#818cf8' }}/>*/}
                    <ReferenceLine y={150} stroke='red' />
                </AreaChart>
            </ResponsiveContainer>
            {/*<p className='nav-linechart-text'>Pct Chg</p>*/}
        </div>
    )
}

// return (
//     <ResponsiveContainer width="100%" height="100%">
//         <AreaChart
//             width={200}
//             height={60}
//             data={historicalPriceData}
//             margin={{
//                 top: 0,
//                 right: 0,
//                 left: 0,
//                 bottom: 0
//             }}>
//             <XAxis dataKey="" tick={prop.showTicks} />
//             <YAxis domain=""  tick={prop.showTicks} />
//             {prop.showTooltip ? <Tooltip contentStyle={{backgroundColor: '#111827', color: 'lightgray',}} itemStyle={{color: '#818cf8'}}/> : ''}
//             <Area
//                 type="monotone"
//                 dataKey="close"
//                 stroke="#818cf8"
//                 fill="#312e81"
//                 strokeWidth={1.25}
//             />
//         </AreaChart>
//     </ResponsiveContainer>
//
// )

//  rgb(241, 217, 225) red
//  rgb(168, 100, 123) red stroke
//  rgb(223, 236, 222) green
//  rgb(135, 182, 130) green stroke