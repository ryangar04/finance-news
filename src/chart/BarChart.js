import {BarChart, Bar, XAxis, YAxis, Tooltip, Legend} from "recharts";
import {useEffect, useState} from "react";

// https://finnhub.io/api/v1/stock/earnings?symbol=AAPL&token=cbgrlmqad3i8nvck2b9g

// https://finnhub.io/api/v1/stock/recommendation?symbol=AAPL&token=cbgrlmqad3i8nvck2b9g

function Barchart(prop) {

    const [data, setData] = useState([])

    // prop.dataType | earnings or recommendation
    // prop.ticker | ticker

    useEffect(() => {
        fetch(`https://finnhub.io/api/v1/stock/${prop.type}?symbol=${prop.ticker}&token=cbgrlmqad3i8nvck2b9g`)
            .then(res => res.json())
            .then(data => {
                if (prop.type === 'recommendation') {
                    setData(data.map(interval => {
                        return {
                            ...interval,
                            Poor: interval.strongSell,
                            Fair: interval.sell,
                            Average: interval.hold,
                            Good: interval.buy,
                            Strong: interval.strongBuy
                        }
                    }))
                } else {
                    setData(data)
                }
        })
    }, [prop.searches])

    return (
        <BarChart
            width={350}
            height={300}
            data={data}
            margin={{
                top: 0,
                right: 0,
                left: -60,
                bottom: 0
            }}
        >
            <XAxis tickLine={false} axisLine={false} tick={false} dataKey={prop.type === 'earnings' ? 'period' : prop.type === 'recommendation' ? 'Date' : ''}/>
            <YAxis tickLine={false} axisLine={false} tick={false} />
            <Tooltip
                contentStyle={{backgroundColor:  '#141519', color: '#FFFFFF', }}
                itemStyle={{ color: '#FFFFFF' }}
            />
            {prop.type === 'recommendation' ? <Legend align="right"/> : <Legend align="center" />}
            {prop.type === 'recommendation' &&
                <>
                    <Bar dataKey="Poor" stackId="a" fill={prop.stockTheme.five} tooltipItemColor={prop.stockTheme.five}/>
                    <Bar dataKey="Fair" stackId="b" fill={prop.stockTheme.four} tooltipItemColor={prop.stockTheme.four}/>
                    <Bar dataKey="Average" stackId="c" fill={prop.stockTheme.three} tooltipItemColor={prop.stockTheme.three}/>
                    <Bar dataKey="Good" stackId="d" fill={prop.stockTheme.two} tooltipItemColor={prop.stockTheme.two}/>
                    <Bar dataKey="Strong" stackId="e" fill={prop.stockTheme.one} tooltipItemColor={prop.stockTheme.one}/>
                </>
            }
            {prop.type === 'earnings' &&
                <>
                    <Bar dataKey="estimate" fill={prop.stockTheme.five} />
                    <Bar dataKey="actual" fill={prop.stockTheme.one} />
                </>
            }
        </BarChart>
    );
}

export default Barchart;

