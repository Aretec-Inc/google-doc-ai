import React, { useState, useEffect, useMemo } from 'react'
import { IconButton, TextField, InputAdornment, Input, Tooltip } from '@material-ui/core'
import { Icon_Blue_Color } from '../../utils/pdfConstants'
import FilterListIcon from '@material-ui/icons/FilterList'
import CloseIcon from '@material-ui/icons/Close'
import PropTypes from 'prop-types'
import List from './List'
const Sidebar = (props) => {
    let { globalHeight, search, setSearch, highlights, isLoading, artifactData } = props
    // if (highlights?.flat()) {
    //     highlights = highlights?.flat()

    // }


    const original_artifact_name = artifactData?.original_artifact_name
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

    let smallArtifactName = (original_artifact_name && original_artifact_name?.length > 30) ? original_artifact_name?.substr(original_artifact_name?.length - 30, original_artifact_name?.length) : original_artifact_name
    let finalFileName = original_artifact_name ? smallArtifactName : "FILENAME.PDF"

    return (
        <div style={{ minWidth: 250, maxWidth: 350, width: `80%` }}>
            <div style={{ height: globalHeight, width: '100%', background: 'white', boxShadow: ` 0px 0px 25px silver` }}>
                <Tooltip arrow title={original_artifact_name || "FileName.pdf"}>
                    <div style={{ fontWeight: 'bold', fontSize: 15, padding: 18, cursor: "default" }} className="ParentFunctionsDiv" >
                        {finalFileName}
                    </div>
                </Tooltip>
                <Input
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
