import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import PropTypes from 'prop-types'
import { IconButton } from '@material-ui/core';
import { Delete } from '@material-ui/icons'
import { Crop, CropOriginal, Close } from '@material-ui/icons';
import "./table.css"
import { fRect, vRect } from '../../../utils/pdfConstants';
import { Popover, Button } from 'antd';
import { ConditionalTooltip } from '../../../utils/pdfHelpers';
const useStyles = makeStyles({
    table: {
        minWidth: 200,
    },
});



const BasicTable = ({ addedKeyPairs, setCropOptions, setAddedKeyPairs, errors }) => {
    const classes = useStyles();
    const [showPopOvers, setShowPopOvers] = useState({})
    const handleDelete = (id) => {
        setAddedKeyPairs(addedKeyPairs?.filter(d => d?.id !== id))

    }



    const getPopOverId = (row, field) => {
        return `${row?.id}_${field}`
    }

    const setPopOver = (row, field, bool) => {

        setShowPopOvers({ [getPopOverId(row, field)]: bool })

    }


    const CropIcon = ({ row, field, img, hasError }) => (
        <IconButton color="primary" style={{ margin: 0, padding: 0 }} onClick={() => {
            if (img) {
                let popOverOpen = showPopOvers?.[getPopOverId(row, field)]

                setPopOver(row, field, !popOverOpen)
            } else {

                setCropOptions({ id: row?.id, field })
            }

        }}>
            {img ? <CropOriginal style={hasError ? { color: 'white' } : null} /> : <Crop style={hasError ? { color: 'white' } : null} />}
        </IconButton>
    )

    const popOverContent = ({ row, field, img }) => (
        <div>
            <a href={img} target="_blank" download>
                <img src={img} style={{ maxWidth: 400, maxHeight: 150 }} />
            </a>


            <br />
            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', margin: 10 }}>
                <Button
                    size="small"
                    onClick={() => {
                        setCropOptions({ id: row?.id, field })
                    }}
                    type="primary">
                    Edit
                </Button>
            </div>

        </div>
    )

    const popOverTitle = ({ row, field }) => (
        <div style={{ alignItems: 'center' }} className="rowSpaceBetween">
            <span>Selected Area</span>

            <IconButton style={{ margin: 0, padding: 1 }} onClick={() => setPopOver(row, field, false)
            } color="primary">
                <Close />
            </IconButton>
        </div>
    )
    const CropIconWithPopOver = (props) => (
        <Popover trigger="click" visible={showPopOvers?.[getPopOverId(props.row, props.field)]} content={popOverContent(props)} title={popOverTitle(props)}>
            <CropIcon {...props} />
        </Popover>
    )

    const FinalCropIcon = ({ row, field, hasError }) => {
        const img = row?.[field]?.img
        return img ? <CropIconWithPopOver row={row} field={field} img={img} hasError={hasError} /> : <CropIcon hasError={hasError} row={row} field={field} img={img} />

    }
    console.log("addedKeyPairs", addedKeyPairs)
    return (
        <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>Field Name</TableCell>
                        <TableCell align="right">Field Value</TableCell>
                        <TableCell align="right">Action</TableCell>

                    </TableRow>
                </TableHead>
                <TableBody>
                    {addedKeyPairs.map((row) => {

                        const hasError = errors?.[row?.id]
                        return (
                            <ConditionalTooltip key={row?.id} title={hasError} arrow show={Boolean(hasError)}>
                                <TableRow style={hasError ? { background: 'red' } : null} key={row?.id}>
                                    <TableCell align="right">
                                        <div className="rowSpaceBetween">
                                            <p style={hasError ? { color: 'white' } : null}>  {row?.field_name}</p>
                                            <FinalCropIcon hasError={hasError} row={row} field={fRect} />


                                        </div>

                                    </TableCell>

                                    <TableCell align="right">
                                        <div className="rowSpaceBetween">
                                            <p style={hasError ? { color: 'white' } : null}>  {row?.field_value}</p>
                                            <FinalCropIcon hasError={hasError} row={row} field={vRect} />
                                        </div>
                                    </TableCell>
                                    <TableCell align="right">
                                        <IconButton style={hasError ? { color: 'white' } : null} color="primary" onClick={() => handleDelete(row?.id)} >
                                            <Delete />
                                        </IconButton>
                                    </TableCell>

                                </TableRow>
                            </ConditionalTooltip>
                        )
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    );
}


BasicTable.propTypes = {
    addedKeyPairs: PropTypes.array,
    setAddedKeyPairs: PropTypes.func
}
export default BasicTable