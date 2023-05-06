import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import moment from 'moment';
import { Tooltip } from '@material-ui/core';
import EditableCell from '../EditableCell'
import { isNull, perc2color } from '../../utils/pdfHelpers';
import SchemaButton from './SchemaButton';


const useStyles = makeStyles({
    table: {
        minWidth: 650,
    },
});



const shortFormat = "DD-MM-YYYY hh:mm a"
let fullFormat = "dddd, Do MMMM YYYY, h:mm:ss a"
const formatedDate = (date, format) => moment(date).format(format || shortFormat);


const KeyPairTable = ({ key_pairs, is_editable = true, refresh, isDLP, isSchemaGenerated, artifactData, justTable = false }) => {

    const classes = useStyles();

    return (
        <>
            <div style={{ ...!justTable ? { padding: 50, minHeight: 500 } : {}, background: 'white' }}>
                {!justTable && <SchemaButton artifactData={artifactData} isSchemaGenerated={isSchemaGenerated} is_editable={is_editable} refresh={refresh} />}
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', }}>
                    {Array.isArray(key_pairs) && key_pairs.length ? <TableContainer component={Paper}>
                        <Table className={classes.table} aria-label="simple table">
                            <TableHead>
                                <TableRow style={{fontSize:'15px'}}>
                                    {/* <TableCell>Field Name</TableCell>
                            <TableCell >Field Value</TableCell>
                            <TableCell >Time Added</TableCell> */}
                                    <TableCell>Field Name</TableCell>
                                    <TableCell> Field Value</TableCell>
                                    {isDLP && (
                                        <>
                                            <TableCell>TYPE</TableCell>
                                            <TableCell>LIKELIHOOD</TableCell>
                                        </>
                                    )
                                    }
                                    <TableCell>Time Updated</TableCell>
                                    {!isDLP && <TableCell>Confidence</TableCell>}

                                </TableRow>
                            </TableHead>
                            <TableBody>

                                {Array.isArray(key_pairs) && key_pairs.length && key_pairs?.map((key_pair, i) => {
                                    /** is_editable, field, id, setFinalText, Loading,isFieldName */
                                    const f_n = key_pair?.field_name
                                    const f_v = key_pair?.field_value
                                    const v_f_n = key_pair?.validated_field_name
                                    const v_f_v = key_pair?.validated_field_value
                                    const key_pair_id = key_pair?.id
                                    const d_i_t = key_pair?.dlp_info_type
                                    const d_m_l = key_pair?.dlp_match_likelihood


                                    let is_name_editable = isNull(v_f_n) && is_editable

                                    let is_value_editable = isNull(v_f_v) && is_editable
                                    const confidence_perc = Math.round(parseFloat(key_pair?.confidence) * 100)
                                    return (
                                        <TableRow key={key_pair_id}>
                                            {/* 
                                    <TableCell >{key_pair?.field_name}</TableCell>
                                    <TableCell >{key_pair?.field_value}</TableCell> */}
                                            {/* <TableCell >{key_pair?.time_stamp}</TableCell> */}
                                            {!isDLP ? (
                                                <>
                                                    <EditableCell key_pair={key_pair} refresh={refresh} isFieldName is_editable={is_name_editable} />
                                                    <EditableCell key_pair={key_pair} refresh={refresh} is_editable={is_value_editable} />
                                                </>
                                            ) : (
                                                <>
                                                    <TableCell >{isNull(v_f_n) ? (f_n || "undefined") : v_f_n}</TableCell>
                                                    <TableCell >{isNull(v_f_v) ? (f_v || "undefined") : v_f_v}</TableCell>
                                                </>
                                            )
                                            }



                                            {isDLP && (<>
                                                <TableCell >{d_i_t || "null"}</TableCell>
                                                <TableCell >{d_m_l || "null"}</TableCell>
                                            </>
                                            )
                                            }

                                            <TableCell >
                                                <Tooltip title={formatedDate(key_pair?.updated_date?.value, fullFormat)} arrow>
                                                    <span>
                                                        {formatedDate(key_pair?.updated_date?.value)}
                                                    </span>
                                                </Tooltip>
                                            </TableCell>
                                            {!isDLP && <TableCell style={{ backgroundColor: '#21CF6A', color: confidence_perc > 20 ? 'black' : 'white', fontWeight: 'bold', textAlign: 'center' }} align="center">{confidence_perc + "%" || key_pair?.confidence}</TableCell>}
                                            {/* {!isDLP && <TableCell style={{ backgroundColor: perc2color(confidence_perc), color: confidence_perc > 20 ? 'black' : 'white', fontWeight: 'bold', textAlign: 'center' }} align="center">{confidence_perc + "%" || key_pair?.confidence}</TableCell>} */}


                                        </TableRow>
                                    )
                                }
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer> : <div>
                        <p>No data.</p>
                        {/* {isDLP ? <p>No data.</p> : <p>
                            </p>} */}
                    </div>}
                </div >
            </div>
        </>
    );
}

export default KeyPairTable