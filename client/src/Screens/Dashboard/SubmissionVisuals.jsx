import React, { useState, useEffect } from "react";
import { Pie } from '@ant-design/plots';
import { Grid } from 'antd';


const { useBreakpoint } = Grid;

const SubmissionVisuals = () => {
    const screens = useBreakpoint();
    const data = [
        {
            type: 'Processor-1',
            value: 27,
        },
        {
            type: 'Processor-2',
            value: 25,
        },
        {
            type: 'Processor-3',
            value: 18,
        },
        {
            type: 'Processor-4',
            value: 15,
        },
        {
            type: 'Processor-5',
            value: 10,
        },
        {
            type: 'Processor-6',
            value: 5,
        },
    ];
    const config = {
        appendPadding: 10,
        data,
        angleField: 'value',
        colorField: 'type',
        radius: 1,
        innerRadius: 0.6,
        label: {
            type: 'inner',
            offset: '-50%',
            content: '{value}',
            style: {
                textAlign: 'center',
                fontSize: 14,
            },
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
                // content: 'AntV\nG2Plot',
            },
        },
        annotations: [
            // {
            //     type: 'image',
            //     src: 'https://gw.alipayobjects.com/mdn/rms_2274c3/afts/img/A*ELYbTIVCgPoAAAAAAAAAAABkARQnAQ',

            //     /** 位置 */
            //     position: ['50%', '50%'],

            //     /** 图形样式属性 */
            //     style: {
            //         width: 50,
            //         height: 50,
            //     },

            //     /** x 方向的偏移量 */
            //     offsetX: -25,

            //     /** y 方向的偏移量 */
            //     offsetY: 40,
            // },
        ],
    };


    return (
        <div className="padding_6px">
            <p className='submission-title mg_lf_15px'>Processing By Submission(s)</p>
            < Pie {...config} />
        </div>
    )
}

export default SubmissionVisuals