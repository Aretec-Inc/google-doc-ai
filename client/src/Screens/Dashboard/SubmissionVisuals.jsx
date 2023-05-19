import React, { useState, useEffect } from "react";
import { Pie } from '@ant-design/plots';
import { secureApi } from '../../Config/api'
import { GET } from '../../utils/apis'
import { errorMessage } from '../../utils/helpers'
import { Select } from 'antd';


const SubmissionVisuals = (props) => {

    const { accuracySubmission, setSubmissionFilter, submissionsList } = props
    // let remaining = (100.0 - accuracySubmission).toFixed(1)

    const onChange = (value) => {
        console.log(`selected ${value}`);
        setSubmissionFilter(value)
    };
    const onSearch = (value) => {
        console.log('search:', value);
    };

    const data = [
        {
            type: 'Accuracy By Submissions',
            value: 100.0 - accuracySubmission,
        },
        {
            type: 'Human Reviewed',
            value: accuracySubmission,
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
            // content: '{value}',
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
            title: false,
            content: {
                style: {
                    whiteSpace: 'pre-wrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                },
                content: `Accuracy\n${accuracySubmission ? (100.0 - accuracySubmission) : 100}%`,
            },
        },
        // annotations: [
        //     {
        //         type: 'image',
        //         src: 'https://gw.alipayobjects.com/mdn/rms_2274c3/afts/img/A*ELYbTIVCgPoAAAAAAAAAAABkARQnAQ',

        //         /** 位置 */
        //         position: ['50%', '50%'],

        //         /** 图形样式属性 */
        //         style: {
        //             width: 50,
        //             height: 50,
        //         },

        //         /** x 方向的偏移量 */
        //         offsetX: -25,

        //         /** y 方向的偏移量 */
        //         offsetY: 40,
        //     },
        // ],
    };


    return (
        <div className="padding_6px">
            <span style={{ display: 'flex', justifyContent: 'space-between' }}>
                <p className='submission-title mg_lf_15px'>Accuracy by Submission(s)</p>
                <Select
                    showSearch
                    placeholder="Select Submission"
                    optionFilterProp="children"
                    onChange={onChange}
                    onSearch={onSearch}
                    filterOption={(input, option) =>
                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                    }
                    options={submissionsList}
                />
            </span>
            <sub>Accuracy By Submission = # of fields changed / the total number of fields.</sub>
            <Pie {...config} className="width90" />
        </div>
    )
}

export default SubmissionVisuals