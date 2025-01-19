import React, { useState, useEffect } from 'react'
import { IconButton, InputAdornment, Input } from '@material-ui/core'
import FilterListIcon from '@material-ui/icons/FilterList'
import CloseIcon from '@material-ui/icons/Close'
import PropTypes from 'prop-types'
import List from './List'

const Sidebar = (props) => {
    let { globalHeight, search, setSearch, highlights, isLoading, artifactData } = props
    const original_file_name = artifactData?.original_file_name
    const [searchResults, setSearchResults] = useState('')

    let searchInArray = (searchQuery) => {
        return highlights.filter(d => {
            let d1 = d?.[0]?.content?.text
            let d2 = d?.[1]?.content?.text
            let data = d1 + " " + d2
            let matchingWords = data?.toLowerCase()?.indexOf(searchQuery?.toLowerCase()) > -1

            return matchingWords
        })
    }

    let userSearchTimeout = null

    useEffect(() => {
        clearTimeout(userSearchTimeout)
        userSearchTimeout = null

        userSearchTimeout = setTimeout(() => {
            let searchArray = searchInArray(search)
            let results = search.length ? searchArray ? searchArray : null : []
            setSearchResults(results)
        }, 500)

        return () => {
            clearTimeout(userSearchTimeout)
            userSearchTimeout = null
        }
    }, [search])

    let smallArtifactName = (original_file_name && original_file_name?.length > 30) ? original_file_name?.substr(original_file_name?.length - 30, original_file_name?.length) : original_file_name

    return (
        <div style={{ minWidth: 250, maxWidth: 500, width: `80%`, overflowX: 'hidden', }}>
            <div style={{ height: globalHeight, width: '100%', background: 'white', boxShadow: ` 0px 0px 25px silver` }}>
                <Input className='input-desin'
                    disabled={isLoading}
                    startAdornment={
                        <InputAdornment onClick={() => setSearch('')} style={{ marginLeft: 10, cursor: 'pointer' }} position="start">
                            <FilterListIcon />
                        </InputAdornment>}
                    endAdornment={
                        search?.length ? (
                            <InputAdornment position="start">
                                <IconButton onClick={() => setSearch('')}>
                                    <CloseIcon />
                                </IconButton>
                            </InputAdornment>) : null
                    }
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    inputProps={{ style: { padding: 15 } }}
                    fullWidth
                    name="filter"
                    autoComplete="on"
                    placeholder={"Filter"} />
                {!isLoading && <List searchResults={searchResults} {...props} />}
            </div>
        </div>
    )
}

Sidebar.defaultProps = {
    globalHeight: 800,
    search: '',
    setSearch: () => null,
    highlights: [],
    setSelectedHighLights: () => null,
    selectedHighLights: [],
    setShouldScrollSidebar: () => null,
    setShouldScrollPDF: () => null,
}

Sidebar.propTypes = {
    globalHeight: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    search: PropTypes.string,
    setSearch: PropTypes.func,
    highlights: PropTypes.array,
    setSelectedHighLights: PropTypes.func,
    selectedHighLights: PropTypes.arrayOf(PropTypes.string),
    shouldScrollSidebar: PropTypes.bool,
    setShouldScrollSidebar: PropTypes.func,
    setShouldScrollPDF: PropTypes.func,
    shouldScrollPDF: PropTypes.bool,
}

export default Sidebar
