import React, { useState } from 'react'
import PropTypes from 'prop-types';

const LongClick = ({ Button, onShortClick, onLongClick, delayTime = 300, ...props }) => {
  const [isLongClicked, setIsLongClicked] = useState(false)



  let clickTimeout = null
  const mouseUp = (isZoomIn) => {


    if (!isLongClicked) {//SHORT CLICK
      if (typeof onShortClick == "function") onShortClick();

    }
    clearTimeout(clickTimeout)
    setIsLongClicked(false)

  }

  const mouseDown = (isZoomIn) => {
    clearTimeout(clickTimeout)
    clickTimeout = setTimeout(() => {  //LONG CLICK
      setIsLongClicked(true)
      if (typeof onLongClick == "function") onLongClick();

    }, delayTime);
  }


  return (

    <Button onMouseDown={mouseDown} onMouseUp={mouseUp} {...props} />
  )
}
LongClick.propTypes = {
  delayTime: PropTypes.number,
  Button: PropTypes.oneOfType([PropTypes.element, PropTypes.func]).isRequired,
  onShortClick: (props, propName, componentName) => {
    if (typeof props?.onShortClick !== "function" && typeof props?.onLongClick !== "function") {//Any one of them is required with type function
      return new Error(`One of props 'onShortClick' or 'onLongClick' was not specified in '${componentName}'.`);
    }
  },
  onLongClick: (props, propName, componentName) => {
    if (typeof props?.onShortClick !== "function" && typeof props?.onLongClick !== "function") { //Any one of them is required
      return new Error(`One of props 'onShortClick' or 'onLongClick' was not specified in '${componentName}'.`);
    }
  },
}
export default LongClick
