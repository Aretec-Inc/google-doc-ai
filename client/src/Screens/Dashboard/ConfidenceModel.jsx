// import { Bar } from '@ant-design/plots';
// import React from "react";

// const ConfidenceModel = (props) => {
//     const { belowThresholdModelAcc, aboveThresholdModelAcc, confidenceModel } = props
//     // console.log("CONFIDENCE MODAL ===>", confidenceModel)
//     const data = [...confidenceModel]
//     const config = {
//         data,
//         xField: 'count',
//         yField: 'processor_name',
//         seriesField: 'mode',
//         // isPercent: true,
//         // isStack: true,

//         color: ['#4285f4', '#fbbc05'],
//         label: {
//             position: 'middle',
//             content: (item) => {
//                 return (item?.count?.toFixed(2) + '%');
//             },
//             style: {
//                 fill: '#fff',
//             },
//         },
//     }

//     return (
//         <div className="padding_6px">
//             <p className='submission-title mg_lf_15px'>Confidence Score by Model(s)</p>
//             <sub>Confidence Score by Model = Aggregates of Confidence Score we receive from models grouped by models.</sub>
//             <Bar {...config} className="width90" />
//         </div>
//     )
// }

// export default ConfidenceModel

import { Bar } from '@ant-design/plots';
import React from "react";

const ConfidenceModel = ({ confidenceModel }) => {
    const data = [...confidenceModel];

    const config = {
        data,
        xField: 'count',
        yField: 'processor_name',
        seriesField: 'mode',
        color: ['#4285f4', '#fbbc05'],
        label: {
            position: 'middle',
            content: (item) => {
                return (item?.count?.toFixed(2) + '%');
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

export default ConfidenceModel;