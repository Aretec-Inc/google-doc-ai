import React, { useRef, useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import SignatureCanvas from 'react-signature-canvas'

const widthOfCanvas = 300;
const heightOfCanvas = 300

const SignatureModal = ({ closeModal, setSignatures, signatures }) => {
    const canvasRef = useRef()


    useEffect(async () => {
        const fromDataURL = canvasRef?.current?.fromDataURL
        const signature = signatures[0]
        if (fromDataURL && signature) {
            await fromDataURL(signature.imgURL)
        }

    }, [canvasRef])

    const closeTheModal = () => { if (typeof closeModal == "function") closeModal(); }

    const getDataURL = async () => {
        const toDataURL = canvasRef?.current?.toDataURL
        if (toDataURL) {
            return toDataURL()
        } else {
            return null
        }
    }

    const isCanvasEmpty = () => {
        const isEmpty = canvasRef?.current?.isEmpty

        if (typeof isEmpty == "function") {
            return isEmpty()
        }
        else {
            return true
        }

    }
    const getSetSignature = async () => {
        if (!isCanvasEmpty()) {
            let sign = await getDataURL()
            if (sign) {
                let signatur = [{
                    imgURL: sign,
                    layout: { x: 0, y: 0, width: widthOfCanvas, height: heightOfCanvas }
                }]
                setSignatures(signatur)
                closeTheModal()
            } else {
                console.log("NO SIGN", sign)
            }
        }
        else {
            // alert("You forgot to draw signature!")
        }
    }

    const clearCanvas = () => {
        const clear = canvasRef?.current?.clear
        if (clear) clear();
    }
    return (

        <Dialog
            open={true}
            onClose={closeTheModal}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">DRAW YOUR SIGNATURE</DialogTitle>


            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    <SignatureCanvas ref={canvasRef} penColor='green'
                        canvasProps={{ width: widthOfCanvas, height: heightOfCanvas, className: 'sigCanvas' }} />
                </DialogContentText>
            </DialogContent>



            <DialogActions>
                <Button onClick={clearCanvas} color="primary">
                    Clear
                 </Button>
                <Button onClick={closeTheModal} color="primary">
                    cancel
               </Button>
                <Button onClick={getSetSignature} color="primary" autoFocus>
                    ADD TO PDF
          </Button>
            </DialogActions>
        </Dialog>
    );
}
export default SignatureModal