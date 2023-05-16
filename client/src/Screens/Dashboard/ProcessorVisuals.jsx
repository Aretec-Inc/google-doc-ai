import React, { useState, useEffect } from "react";
import { Bar } from '@ant-design/plots';





// leftside model name


const ProcessorVisuals = (props) => {
    const { belowThresholdModelAcc, aboveThresholdModelAcc } = props
    const data = [...aboveThresholdModelAcc, ...belowThresholdModelAcc]
    const config = {
        data,
        xField: 'count',
        yField: 'processor_name',
        seriesField: 'mode',
        isPercent: true,
        isStack: true,

        /** 自定义颜色 */
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
    }



    return (
        <div className="padding_6px">
            <p className='submission-title mg_lf_15px'>Accuracy By Model(s)</p>
            <Bar {...config} className="width90" />
        </div>
    )
}

export default ProcessorVisuals