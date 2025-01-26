// import { Bar } from '@ant-design/plots';
// import React from "react";

// const ProcessorVisuals = (props) => {
//     const { belowThresholdModelAcc, aboveThresholdModelAcc } = props
//     const data = [...aboveThresholdModelAcc, ...belowThresholdModelAcc]
//     const config = {
//         data,
//         xField: 'count',
//         yField: 'processor_name',
//         seriesField: 'mode',
//         isPercent: true,
//         isStack: true,

//         /** 自定义颜色 */
//         color: ['#4285f4', '#fbbc05'],
//         label: {
//             position: 'middle',
//             content: (item) => {
//                 return (item?.count?.toFixed(2) * 100 + '%');
//             },
//             style: {
//                 fill: '#fff',
//             },
//         },
//     }



//     return (
//         <div className="padding_6px">
//             <p className='submission-title mg_lf_15px'>Accuracy by Model(s)</p>
//             <sub>Accuracy by Model(s) = # of fields changed / the total number of fields grouped by Model.</sub>
//             <Bar {...config} className="width90" />
//         </div>
//     )
// }

// export default ProcessorVisuals

import { Bar } from '@ant-design/plots';
import React from "react";

const ProcessorVisuals = ({ belowThresholdModelAcc, aboveThresholdModelAcc }) => {
    const data = [...aboveThresholdModelAcc, ...belowThresholdModelAcc];

    const config = {
        data,
        xField: 'count',
        yField: 'processor_name',
        seriesField: 'mode',
        isPercent: true,
        isStack: true,
        color: ['#4285f4', '#fbbc05'],
        label: {
            position: 'middle',
            content: (item) => {
                return (item?.count?.toFixed(2) * 100 + '%');
            },
            style: {
                fill: '#fff',
            },
        },
    };

    return (
        <div className="w-full h-[240px]">
            <Bar {...config} />
        </div>
    );
};

export default ProcessorVisuals;