import React from 'react'
import { removeArtifactData, setArtifactData } from '../../Redux/actions/artifactActions'
import { connect } from 'react-redux'
import { Skeleton, Collapse } from 'antd'
import { randomInteger, load_artifact_data_by_type, errorMessage } from '../../utils/pdfHelpers'
import { fadeList, isPDF } from '../../utils/pdfConstants'
import PDFVIEWER from '../../Components/PDF-HIGHLIGHTER/index'
import { Tabs } from 'antd'
import './SelectedCardData.css'
import HeaderTopBar from './HeaderTopBar'

const { TabPane } = Tabs
const { Panel } = Collapse

class SelectedCardData extends React.Component {
    constructor(props) {
        super(props)
        const { freqWord, artifactData, selectedCard, adj } = this.props
        console.log("PROPS", adj)

        this.state = {
            detailTabs: ['General', 'Insights', 'Transcripts', 'Similar', 'General', 'Insights', 'Transcripts', 'Similar'],
            loading: (selectedCard || artifactData) ? false : true,
            selectedCard,
            freqWord,
            showComments: false,
            file_name: '',
            tags: [],
            inputVisible: false,
            inputValue: '',
            editInputIndex: -1,
            editInputValue: '',
            Panel,
            text: ` Likely `,
            graphData: null,
            value: 1,
            loadingRate: false,
            disableRate: true,
            aggregate: 0,
            isBookMark: false,
            visible: false,
            disabled: true,
            isRefreshing: false
        }
    }

    componentDidMount() {
        this.loadData()
        // this.refreshData()
    }
    loadData = () => {
        let selectedCard = this?.props?.selectedCard || this?.props?.artifactData
        if (selectedCard?.artifact_type !== 'csv' && selectedCard?.artifact_type !== 'xml') {
            load_artifact_data_by_type(selectedCard)
                .then((data) => {
                    this.setState({
                        selectedCard: data,
                        artifact_id: selectedCard.id,
                        loading: false
                    })
                    console.log('load Data Executed ', data)
                    this.props.setArtifactData(data)
                    if (!data?.success) {
                        let errMsg = data?.message;
                        errMsg && errorMessage(errMsg);
                    }
                    // console.log(d,'LIne 63')
                })
                .catch((err) => {
                    console.log('e', err)
                    let errMsg = err?.response?.data?.message;
                    errMsg && errorMessage(errMsg);
                    // if (e.code !== 'NO_PARAMS' && e?.message) errorMessage(e?.message);
                    // this.setState({ loading: false })
                })
        }
    }

    refreshData = () => {
        const { selectedCard } = this.props

        let name = selectedCard?.file_name
        if (name) {
            this.setState({ isRefreshing: true })

            load_artifact_data_by_type(selectedCard)
                .then((data) => {
                    let refreshedData = data
                    this.setState({ isRefreshing: false })

                    if (refreshedData?.id) { //make sure that the data is correct and has required info
                        this.props.setArtifactData(refreshedData)
                    }

                    if (!data?.success) {
                        let errMsg = data?.message;
                        errMsg && errorMessage(errMsg);
                    }

                })
                .catch((err) => {
                    this.setState({ isRefreshing: false })
                    let errMsg = err?.response?.data?.message;
                    errMsg && errorMessage(errMsg);
                })
        }
    }


    render() {
        const { selectedCard, loading } = this.state
        const artifact_type = selectedCard?.artifact_type
        // console.log('ADJ ===>', adj)

        const alreadyHasTabs = !isPDF(artifact_type)
        const conditionalStyle = alreadyHasTabs ? { background: 'white', padding: 10, paddingTop: 0 } : {}

        const allElements = (
            <div
                // className='card-box'
                // style={{ width: width || '92%', backgroundColor: 'white', height: '80%' }}
                data-aos={fadeList[randomInteger(0, fadeList.length - 1)]}
            >
                <div className='container-box container-div'>
                    {loading ? (
                        <Skeleton paragraph={{ rows: 5 }} />
                    ) : (
                        <div style={{ display: 'flex', flex: 1, flexDirection: 'column', width: '100%' }}>
                            {/* {(!isPDF(artifact_type) && selectedCard && selectedCard?.id) && <ArtifactDataCard goBack={this.props.goBack} {...this.props} selectedCard={selectedCard} />} */}
                            <PDFVIEWER isTemplateView={this?.props?.isTemplateView} maxWidth={'100vw'} enableShadow artifactData={selectedCard} {...this.props} />
                        </div>
                    )}
                </div>
            </div >
        )

        return (
            <div className='card-div' style={(!isPDF(artifact_type)) ? { filter: `drop-shadow(0px 0px 20px silver)` } : {}}>
                <HeaderTopBar {...this.props} selectedCard={selectedCard || this.props.selectedCard} goBack={this.props.goBack} />
                <div style={conditionalStyle}>
                    {alreadyHasTabs ? allElements : allElements}
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        user: state?.authReducer?.user,
        selectedKey: state?.authReducer?.selectedKey
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        removeArtifactData: () => dispatch(removeArtifactData()),
        setArtifactData: (artifact) => dispatch(setArtifactData(artifact))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SelectedCardData)