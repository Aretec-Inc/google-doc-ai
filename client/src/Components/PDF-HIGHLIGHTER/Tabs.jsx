import React from 'react'
import PropTypes from 'prop-types'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import { Tooltip } from '@material-ui/core'

const Tabbs = ({ value, onChange, redacted_file_address, showTableTab }) => {
  return (
    <Tabs
      value={value}
      onChange={onChange}
      indicatorColor='primary'
      textColor='primary'
      variant='fullWidth'
    >
      <Tab value={0} label='KEY PAIRS' />
      <Tab value={1} label='OCR' />
      {/* {showJSONTab && <Tab label='JSON' />} */}

      {showTableTab && <Tab value={3} label='ADJUDICATE' />}
      {showTableTab && <Tab value={4} label={<Tooltip title='Data Loss Prevention' arrow><span>DLP</span></Tooltip>} />}
      {/* {(showTableTab && redacted_file_address) && <Tab value={5} label={<Tooltip title='Redacted' arrow><span>Redacted</span></Tooltip>} />} */}

      {/* <Tab value={2} label='PROPERTIES' /> */}
    </Tabs>
  )
}


Tabbs.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onChange: PropTypes.func,
  showTableTab: PropTypes.bool,
  showKeyPairTab: PropTypes.bool,
}

Tabbs.defaultProps = {
  showTableTab: false,
  showKeyPairTab: false,
  value: '',
  onChange: () => null
}

export default Tabbs