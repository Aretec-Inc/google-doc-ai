import React, { useState, useEffect } from "react";
import { Pie } from '@ant-design/plots';
import { secureApi } from '../../Config/api'
import { GET } from '../../utils/apis'
import { errorMessage } from '../../utils/helpers'


const SubmissionVisuals = (props) => {

    const { accuracySubmission } = props

    console.log('SUBMISSIONS ==>', accuracySubmission)



    const data = [
        {
            type: 'Submissions',
            value: accuracySubmission,
        }
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
        // statistic: {
        //     title: false,
        //     content: {
        //         style: {
        //             whiteSpace: 'pre-wrap',
        //             overflow: 'hidden',
        //             textOverflow: 'ellipsis',
        //         },
        //         content: 'AntV\nG2Plot',
        //     },
        // },
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
        <div className="border_left padding_6px">
            <p className='submission-title mg_lf_15px'>Accuracy By Submission(s)</p>
            < Pie {...config} />
        </div>
    )
}

export default SubmissionVisuals