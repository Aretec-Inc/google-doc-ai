import { Line } from '@ant-design/plots';
import React, { useState, useEffect } from 'react'


const LineChart = () => {
    const [data, setData] = useState([
        { name: 'Submission', submissions: '10', processors: 1211346869605.24 },
        { name: 'Submission', submissions: '12', processors: 1339395718865.3 },
        { name: 'Submission', submissions: '20', processors: 1470550015081.55 },
        { name: 'Submission', submissions: '23', processors: 1660287965662.68 },
        { name: 'Submission', submissions: '24', processors: 1955347004963.27 },
        { name: 'Submission', submissions: '25', processors: 2285965892360.54 },
        { name: 'Submission', submissions: '26', processors: 2752131773355.16 },
        { name: 'Submission', submissions: '27', processors: 3550342425238.25 },
        { name: 'Submission', submissions: '28', processors: 4594306848763.08 },
        { name: 'Submission', submissions: '29', processors: 5101702432883.45 },
        { name: 'Submission', submissions: '30', processors: 6087164527421.24 },
        { name: 'Submission', submissions: '31', processors: 7551500425597.77 },
        { name: 'Submission', submissions: '32', processors: 8532230724141.76 },
        { name: 'Submission', submissions: '33', processors: 9570405758739.79 },
        { name: 'Submission', submissions: '34', processors: 10438529153237.6 },
        { name: 'Submission', submissions: '35', processors: 11015542352468.9 },
        { name: 'Submission', submissions: '36', processors: 11137945669350.6 },
        { name: 'Submission', submissions: '37', processors: 12143491448186.1 },
        { name: 'Submission', submissions: '38', processors: 13608151864637.9 },
        { name: 'Model', submissions: '10', processors: 10252345464000 },
        { name: 'Model', submissions: '12', processors: 10581821399000 },
        { name: 'Model', submissions: '20', processors: 10936419054000 },
        { name: 'Model', submissions: '23', processors: 11458243878000 },
        { name: 'Model', submissions: '24', processors: 12213729147000 },
        { name: 'Model', submissions: '25', processors: 13036640229000 },
        { name: 'Model', submissions: '26', processors: 13814611414000 },
        { name: 'Model', submissions: '27', processors: 14451858650000 },
        { name: 'Model', submissions: '28', processors: 14712844084000 },
        { name: 'Model', submissions: '29', processors: 14448933025000 },
        { name: 'Model', submissions: '30', processors: 14992052727000 },
        { name: 'Model', submissions: '31', processors: 15542581104000 },
        { name: 'Model', submissions: '32', processors: 16197007349000 },
        { name: 'Model', submissions: '33', processors: 16784849190000 },
        { name: 'Model', submissions: '34', processors: 17521746534000 },
        { name: 'Model', submissions: '35', processors: 18219297584000 },
        { name: 'Model', submissions: '36', processors: 18707188235000 },
        { name: 'Model', submissions: '37', processors: 19485393853000 },
        { name: 'Model', submissions: '38', processors: 20544343456936.5 },
        // { name: 'United Kingdom', submissions: '2000', processors: 1657816613708.58 },
        // { name: 'United Kingdom', submissions: '2001', processors: 1640246149417.01 },
        // { name: 'United Kingdom', submissions: '2002', processors: 1784473920863.31 },
        // { name: 'United Kingdom', submissions: '2003', processors: 2053018775510.2 },
        // { name: 'United Kingdom', submissions: '2004', processors: 2416931526913.22 },
        // { name: 'United Kingdom', submissions: '2005', processors: 2538680000000 },
        // { name: 'United Kingdom', submissions: '2006', processors: 2713749770009.2 },
        // { name: 'United Kingdom', submissions: '2007', processors: 3100882352941.18 },
        // { name: 'United Kingdom', submissions: '2008', processors: 2922667279411.76 },
        // { name: 'United Kingdom', submissions: '2009', processors: 2410909799034.12 },
        // { name: 'United Kingdom', submissions: '2010', processors: 2475244321361.11 },
        // { name: 'United Kingdom', submissions: '2011', processors: 2659310054646.23 },
        // { name: 'United Kingdom', submissions: '2012', processors: 2704887678386.72 },
        // { name: 'United Kingdom', submissions: '2013', processors: 2786022872706.81 },
        // { name: 'United Kingdom', submissions: '2014', processors: 3063803240208.01 },
        // { name: 'United Kingdom', submissions: '2015', processors: 2928591002002.51 },
        // { name: 'United Kingdom', submissions: '2016', processors: 2694283209613.29 },
        // { name: 'United Kingdom', submissions: '2017', processors: 2666229179958.01 },
        // { name: 'United Kingdom', submissions: '2018', processors: 2855296731521.96 },
        // { name: 'Russian', submissions: '2000', processors: 259710142196.94 },
        // { name: 'Russian', submissions: '2001', processors: 306602070620.5 },
        // { name: 'Russian', submissions: '2002', processors: 345470494417.86 },
        // { name: 'Russian', submissions: '2003', processors: 430347770731.79 },
        // { name: 'Russian', submissions: '2004', processors: 591016690742.8 },
        // { name: 'Russian', submissions: '2005', processors: 764017107992.39 },
        // { name: 'Russian', submissions: '2006', processors: 989930542278.7 },
        // { name: 'Russian', submissions: '2007', processors: 1299705764823.62 },
        // { name: 'Russian', submissions: '2008', processors: 1660846387624.78 },
        // { name: 'Russian', submissions: '2009', processors: 1222644282201.86 },
        // { name: 'Russian', submissions: '2010', processors: 1524917468442.01 },
        // { name: 'Russian', submissions: '2011', processors: 2051661732059.78 },
        // { name: 'Russian', submissions: '2012', processors: 2210256976945.38 },
        // { name: 'Russian', submissions: '2013', processors: 2297128039058.21 },
        // { name: 'Russian', submissions: '2014', processors: 2059984158438.46 },
        // { name: 'Russian', submissions: '2015', processors: 1363594369577.82 },
        // { name: 'Russian', submissions: '2016', processors: 1282723881134.01 },
        // { name: 'Russian', submissions: '2017', processors: 1578624060588.26 },
        // { name: 'Russian', submissions: '2018', processors: 1657554647149.87 },
        // { name: 'Japan', submissions: '2000', processors: 4887519660744.86 },
        // { name: 'Japan', submissions: '2001', processors: 4303544259842.72 },
        // { name: 'Japan', submissions: '2002', processors: 4115116279069.77 },
        // { name: 'Japan', submissions: '2003', processors: 4445658071221.86 },
        // { name: 'Japan', submissions: '2004', processors: 4815148854362.11 },
        // { name: 'Japan', submissions: '2005', processors: 4755410630912.14 },
        // { name: 'Japan', submissions: '2006', processors: 4530377224970.4 },
        // { name: 'Japan', submissions: '2007', processors: 4515264514430.57 },
        // { name: 'Japan', submissions: '2008', processors: 5037908465114.48 },
        // { name: 'Japan', submissions: '2009', processors: 5231382674593.7 },
        // { name: 'Japan', submissions: '2010', processors: 5700098114744.41 },
        // { name: 'Japan', submissions: '2011', processors: 6157459594823.72 },
        // { name: 'Japan', submissions: '2012', processors: 6203213121334.12 },
        // { name: 'Japan', submissions: '2013', processors: 5155717056270.83 },
        // { name: 'Japan', submissions: '2014', processors: 4850413536037.84 },
        // { name: 'Japan', submissions: '2015', processors: 4389475622588.97 },
        // { name: 'Japan', submissions: '2016', processors: 4926667087367.51 },
        // { name: 'Japan', submissions: '2017', processors: 4859950558538.97 },
        // { name: 'Japan', submissions: '2018', processors: 4971323079771.87 }
    ]);

    const config = {
        data,
        xField: 'submissions',
        yField: 'processors',
        seriesField: 'name',
        yAxis: {
            label: {
                formatter: (v) => `${(v / 10e8).toFixed(1)} B`,
            },
        },
        legend: {
            position: 'top',
        },
        smooth: true,
        // @TODO 后续会换一种动画方式
        animation: {
            appear: {
                animation: 'path-in',
                duration: 5000,
            },
        },
    };
    return (
        <div className="border_left padding_6px">
            <p className='submission-title mg_lf_15px'>Threshold(s)</p>
            <Line {...config} />
        </div>
    )
}

export default LineChart