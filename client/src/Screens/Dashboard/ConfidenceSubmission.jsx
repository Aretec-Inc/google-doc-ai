// import { Pie } from '@ant-design/plots';
// import { Select } from 'antd';
// import React from "react";

// const ConfidenceSubmission = (props) => {

//     const { overAllConfidence, confidences, setConfidenceFilter } = props
//     // let remaining = (100.0 - overAllConfidence).toFixed(1)

//     const onChange = (value) => {
//         console.log(`selected ${value}`);
//         setConfidenceFilter(value)
//     };
//     const onSearch = (value) => {
//         console.log('search:', value);
//     };

//     const data = [
//         {
//             type: 'Confidence By Submissions',
//             value: overAllConfidence,
//         },
//         {
//             type: 'Human Reviewed',
//             value: (100.0 - overAllConfidence),
//         },
//     ];
//     const config = {
//         legend: false,
//         appendPadding: 10,
//         data,
//         angleField: 'value',
//         colorField: 'type',
//         radius: 1,
//         innerRadius: 0.6,
//         color: ['#4285f4', '#fbbc05'],
//         label: {
//             type: 'inner',
//             offset: '-50%',
//             // content: '{value}',
//             content: (item) => {
//                 return (item?.value?.toFixed(0));
//             },
//             style: {
//                 textAlign: 'center',
//                 fontSize: 14,
//             },
//             labelLine: false
//         },
//         interactions: [
//             {
//                 type: 'element-selected',
//             },
//             {
//                 type: 'element-active',
//             },
//         ],
//         statistic: {
//             title: false,
//             content: {
//                 style: {
//                     whiteSpace: 'pre-wrap',
//                     overflow: 'hidden',
//                     textOverflow: 'ellipsis',
//                 },
//                 content: `Confidence\n${overAllConfidence ? overAllConfidence?.toFixed(2) : 100}%`,
//             },
//         }
//     };


//     return (
//         <div className="padding_6px">
//             <span style={{ display: 'flex', justifyContent: 'space-between' }}>
//                 <p className='submission-title mg_lf_15px'>Confidence Score by Submission(s)</p>
//                 <Select
//                     showSearch
//                     placeholder="Select Submission"
//                     optionFilterProp="children"
//                     onChange={onChange}
//                     onSearch={onSearch}
//                     filterOption={(input, option) =>
//                         (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
//                     }
//                     options={confidences}
//                 />
//             </span>
//             <sub>Confidence Score by Submission = Aggregates of Confidence Score we receive from all models.</sub>
//             <Pie {...config} className="width90" />
//         </div>
//     )
// }

// export default ConfidenceSubmission

import { Pie } from '@ant-design/plots';
import { Select } from 'antd';
import React from "react";

const ConfidenceSubmission = ({ overAllConfidence, confidences, setConfidenceFilter }) => {
    const onChange = (value) => {
        console.log(`selected ${value}`);
        setConfidenceFilter(value);
    };

    const onSearch = (value) => {
        console.log('search:', value);
    };

    const data = [
        {
            type: 'Confidence By Submissions',
            value: overAllConfidence,
        },
        {
            type: 'Human Reviewed',
            value: (100.0 - overAllConfidence),
        },
    ];

    const config = {
        legend: false,
        appendPadding: 10,
        data,
        angleField: 'value',
        colorField: 'type',
        radius: 1,
        innerRadius: 0.6,
        color: ['#4285f4', '#fbbc05'],
        label: {
            type: 'inner',
            offset: '-50%',
            content: (item) => {
                return (item?.value?.toFixed(0));
            },
            style: {
                textAlign: 'center',
                fontSize: 14,
            },
            labelLine: false
        },
        interactions: [
            {
                type: 'element-selected',
            },
            {
                type: 'element-active',
            },
        ],
        statistic: {
            title: {
                style: {
                    fontSize: '14px',
                    lineHeight: '1',
                    color: '#4B5563',
                },
                content: 'Confidence'
            },
            content: {
                style: {
                    fontSize: '24px',
                    lineHeight: '1.2',
                    fontWeight: '600',
                    color: '#111827',
                    textAlign: 'center',
                },
                content: `${overAllConfidence ? overAllConfidence?.toFixed(2) : 100}%`,
            },
        }
    };

    return (
        <div className="flex flex-col space-y-2">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-sm font-medium text-gray-600">Confidence Score by Submission(s)</h3>
                    <p className="text-xs text-gray-500">
                        Confidence Score by Submission = Aggregates of Confidence Score from all models.
                    </p>
                </div>
                <Select
                    showSearch
                    placeholder="Select a confidence"
                    optionFilterProp="children"
                    onChange={onChange}
                    onSearch={onSearch}
                    filterOption={(input, option) =>
                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                    }
                    options={confidences}
                    className="w-64"
                    size="small"
                />
            </div>
            <div className="w-full h-[240px]">
                <Pie {...config} />
            </div>
        </div>
    );
};

export default ConfidenceSubmission;