import React, { useState, useEffect } from "react";
import { Bar } from '@ant-design/plots';





// leftside model name


const ConfidenceModel = (props) => {
    const { belowThresholdModelAcc, aboveThresholdModelAcc, confidenceModel } = props
    const data = [...confidenceModel]
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
            <p className='submission-title mg_lf_15px'>Confidence Score by Model(s)</p>
            <sub>
                Confidence Score by Model refers to a metric that quantifies the level of confidence or certainty exhibited by a model/processor in its classifications. It provides a numerical value indicating the model's degree of confidence in its own performance.
            </sub>
            <Bar {...config} className="width90" />
        </div>
    )
}

export default ConfidenceModel