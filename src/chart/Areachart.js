import {AreaChart, Area, XAxis, YAxis, Tooltip, ReferenceLine} from "recharts";


function Areachart(prop) {

    function minY() {
        const marks = prop.historicalData.map(interval => interval.mark)
        return Math.min(...marks)
    }

    return (
        <AreaChart
            width={730}
            height={500}
            data={prop.historicalData}
            margin={{
                top: 0,
                right: 30,
                left: -60,
                bottom: -15
            }}
        >
            {/*<defs>*/}
            {/*    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">*/}
            {/*        <stop offset="0%" stopColor={prop.stockTheme.one} stopOpacity={0.9} />*/}
            {/*        <stop offset="100%" stopColor={prop.stockTheme.one} stopOpacity={0.0} />*/}
            {/*    </linearGradient>*/}
            {/*</defs>*/}
            <XAxis tickLine={false} axisLine={false} tick={false} dataKey="time" />
            <YAxis tickLine={false} axisLine={false} tick={false} domain={`${minY}`} />
            {/*<ReferenceLine y={prop.general.lastPrice - prop.general.regularMarketNetChange} stroke={prop.stockTheme.one} strokeDasharray="3 3" />*/}
            <Tooltip
                contentStyle={{backgroundColor:  '#141519', color: 'white', }}
                itemStyle={{ color: prop.stockTheme }}
                labelStyle={{color: prop.stockTheme.one}}

            />
            <Area
                type="monotone"
                dataKey="mark"
                stroke={prop.stockTheme}
                fill={prop.stockTheme.one}
                // fill="url(#colorValue)"
                strokeWidth={1.25}
            />
        </AreaChart>
        )
}

export default Areachart;