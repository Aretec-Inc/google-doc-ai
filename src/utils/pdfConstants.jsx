import React from 'react'
import { FaDatabase, FaFileCsv } from 'react-icons/fa'
import { AiTwotoneVideoCamera, AiFillSound, AiOutlineForm } from 'react-icons/ai'
import { FiActivity, FiSettings } from 'react-icons/fi'
import { SiGraphql } from 'react-icons/si'
import { CgFileDocument } from 'react-icons/cg'
import { HomeOutlined, ApartmentOutlined, DatabaseOutlined, AntDesignOutlined, FileImageFilled, FilePdfFilled, AudioFilled, FileExcelFilled, VideoCameraFilled, FileWordFilled, PictureFilled, DashboardOutlined, LineChartOutlined, AreaChartOutlined, DotChartOutlined, BarChartOutlined, CodepenOutlined, SortAscendingOutlined, UngroupOutlined, FullscreenExitOutlined, PicCenterOutlined, FilterOutlined, DiffOutlined } from '@ant-design/icons'
import ViewQuiltIcon from '@material-ui/icons/ViewQuilt'
import { Security } from '@material-ui/icons'
import { AccountTree } from '@material-ui/icons'
import { allPaths } from '../Config/paths'
import { BIG_QUERY_APIS } from './apis'
export const publicVisibility = 'Public'
export const privateVisibility = 'Private'
export const visibilities = [publicVisibility, privateVisibility]
export const minimumFilesRequiredForDatasetTraining = 5
const googleClientId = '1093943387531-sut2415eo36iv4capfstrunii744er9o.apps.googleusercontent.com'
const facebookId = '4587317037945418'

const { GET: { BQ_GET_VIDEO_DATA, BQ_GET_IMAGE_DATA, BQ_GET_DOC_DATA, BQ_GET_AUDIO_DATA } } = BIG_QUERY_APIS

const uploadProps = {
    name: 'file',
    multiple: true,
    action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76'
}

const uploadIcons = {
    form: <FilePdfFilled style={{ color: '#1890ff' }} />,
    docs: <FileWordFilled style={{ color: ' #1890ff' }} />,
    images: <FileImageFilled style={{ color: ' #1890ff' }} />,
    csv: <FileExcelFilled style={{ color: ' #1890ff' }} />,
    video: <VideoCameraFilled style={{ color: ' #1890ff' }} />,
    audio: <AudioFilled style={{ color: ' #1890ff' }} />
}

export const fRect = 'fRect'
export const vRect = 'vRect'
export const minimumWidthHeight = 20

export const customAnot = 'Custom Annotation'
const colorsList = ['#9136CB', '#3F5979', '#8282FB', '#679801', '#00C830', '#0597E0', '#8698F7', '#E55235', '#CFCFCF', '#F6CC0A', '#D33D60', '#F8553B', '#0C7FF2', '#5EC52A', '#DD1A22', '#00F700', '#0077B5', '#E85826', '#007CF8', '#632C8D', '#25B3E5', '#043B95', '#33BEE8', '#2195F1', '#ED4F1D', '#0081C6', '#0095C0', '#CA2608', '#18D770', '#F8551D', '#92Ba46', '#24D3F1', '#F8F501', '#F85310', '#1DD15D', '#00BBEC', '#5EA3D8', '#4C6B8D', '#545C9C', '#7754BA', '#00A6EA', '#00BBEA', '#1AD13F', '#F80000', '#3498db', '#CD5C5C', '#F08080', '#FA8072', '#E9967A', '#FFA07A', '#00FFFF', '#00C5CD', '#73B1B7', '#39B7CD', '#00B2EE', '#33A1DE', '#5993E5', '#5190ED', '#0000FF', '#FF00FF', '#00FF00', '#FF7F50', '#FF6347', '#FF4500', '#FFD700', '#FFA500', '#FF8C00', '#7CFC00', '#7FFF00', '#32CD32', '#ADFF2F', '#00FF7F']

const fadeList = ['fade-up', 'fade-down', 'fade-right', 'fade-left', 'fade-up-right', 'fade-up-left', 'fade-down-right', 'fade-down-left', 'flip-left', 'flip-right', 'flip-up', 'flip-down', 'zoom-in', 'zoom-in-up', 'zoom-in-down', 'zoom-in-left', 'zoom-in-right', 'zoom-out', 'zoom-out-up', 'zoom-out-down', 'zoom-out-right', 'zoom-out-left']

const countries = ['Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Antigua and Barbuda', 'Argentina', 'Armenia', 'Aruba', 'Australia', 'Austria', 'Azerbaijan', 'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Belize', 'Bolivia', 'Bosnia and Herzegovina', 'Botswana', 'Brazil', 'Brunei', 'Bulgaria', 'Cambodia', 'Cameroon', 'Canada', 'Cayman Islands', 'Chile', 'China', 'Colombia', 'Congo', 'Costa Rica', 'Croatia', 'Cuba', 'Cyprus', 'Czech Republic', 'Denmark', 'Dominican Republic', 'Ecuador', 'Egypt', 'El Salvador', 'Estonia', 'Faroe Islands', 'Finland', 'France', 'French Polynesia', 'Gabon', 'Georgia', 'Germany', 'Ghana', 'Greece', 'Greenland', 'Guadeloupe', 'Guam', 'Guatemala', 'Guinea', 'Haiti', 'Hashemite Kingdom of Jordan', 'Honduras', 'Hong Kong', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland', 'Isle of Man', 'Israel', 'Italy', 'Jamaica', 'Japan', 'Kazakhstan', 'Kenya', 'Kosovo', 'Kuwait', 'Latvia', 'Lebanon', 'Libya', 'Liechtenstein', 'Luxembourg', 'Macedonia', 'Madagascar', 'Malaysia', 'Malta', 'Martinique', 'Mauritius', 'Mayotte', 'Mexico', 'Mongolia', 'Montenegro', 'Morocco', 'Mozambique', 'Myanmar [Burma]', 'Namibia', 'Nepal', 'Netherlands', 'New Caledonia', 'New Zealand', 'Nicaragua', 'Nigeria', 'Norway', 'Oman', 'Pakistan', 'Palestine', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Poland', 'Portugal', 'Puerto Rico', 'Republic of Korea', 'Republic of Lithuania', 'Republic of Moldova', 'Romania', 'Russia', 'Saint Lucia', 'San Marino', 'Saudi Arabia', 'Senegal', 'Serbia', 'Singapore', 'Slovakia', 'Slovenia', 'South Africa', 'Spain', 'Sri Lanka', 'Sudan', 'Suriname', 'Swaziland', 'Sweden', 'Switzerland', 'Taiwan', 'Tanzania', 'Thailand', 'Trinidad and Tobago', 'Tunisia', 'Turkey', 'U.S. Virgin Islands', 'Ukraine', 'United Arab Emirates', 'United Kingdom', 'United States', 'Uruguay', 'Venezuela', 'Vietnam', 'Zambia', 'Zimbabwe']

const acceptTypes = {
    form: '.pdf',
    image: 'image/*',
    audio: 'audio/*',
    video: 'video/*',
    csv: '.csv',
    docs: '.doc, .docx, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document'
}

const responsive = {
    desktop: {
        breakpoint: { max: 3000, min: 1024 },
        items: 7,
        slidesToSlide: 3,
    },
    tablet: {
        breakpoint: { max: 1024, min: 512 },
        items: 5,
        slidesToSlide: 2,
    },
    mobile: {
        breakpoint: { max: 512, min: 0 },
        items: 1,
        slidesToSlide: 1,
    },
};

const API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2MDEwNDQ0MTgsImV4cCI6MTYwMTEzMDgxOH0.RYlt5HoXqqZN2LColZnSmQ5_pnSr5z9QuSyqn8kY2fE';

const docImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAilBMVEX///9Sj/WlxflOjfVzofZKjPfMzMzPzsult9x1pfdCh/RVkfVtoPfS4Pw+hfRGifW2zPrH1/vz9/7X4/zk7P2iw/mryfn5+//4+PivzPphl/a7z/pom/bd5/2PsOzX1tPe3t6+xdGxvtbr8v6dvvl6qfeUuPmKsvjM2/uzwuDo5+eQreKYsN95ounF4kEMAAADF0lEQVR4nO3d21IaURBGYYY5hTiJGiMYHAUxeEB9/9cLREklFyJDdfe/IWs9AO1Xu9HNXGCvR0REREREREREREQ7Nbr6YtxITfqn259FY1w7TIl42hQD64rzH+kQTxpz37J+OsSzJbBox0e25f3++VBNe2s+GIzzzLqyvyImcYpnTXFk7nsVJrKofRfgqzAN4t3YA/gmTGJR7+3fg38JUyDOfYUJLOrAWag/xcJbKCf6C9WLGiAUEyOE2gtciFD6XowRKhc1SCgkRgl1ixomlBHjhKpFDRSKTjFSqCGGCiWLGitUEIOFggtctDD+vRguDF/UeGE0USAMXlSFMJYoEYYuqkYYeYoiYSBRJYxbVJkwjKgTRi2qUBhEVApjFlUqDDlFrTCCKBYGLKpa6E+UC90/9XsJz7sQXU/RSZjfbS90XlQv4WCYCtFJmGUdgL6L6iXsdoieRLczzO+7Ed0W1U2Y5fM0iH7CLB8vf6EOt67vRHQULo1HbbF9zf3+CVfIDhV7KewQQoQI9SFEiFAfQoQI9SFEiFAfQoQI9SF0EnZ5GvhhCQqNh4YO23JoYzqsQegRQtNhCE2HrUNoOgyh6bB1//tf/Gx8eWLX5ebvwhHdS48t2zyKzxYIEepDiBChPo0w/2rZB7O4l7oMPfzPFgi7hdB02DqEpsMQmg5bh9B0WILCrH04teuh3TiLJ1FOwsAQIkSoDyFChO9M/WxZik+imtE3u0YJ3ksP/+aNsGMITYetQ2g6DKHpsHUITYclKMzaqzO7rngSJREGhhAhQn0IESJ8Z+quD532RZi3t9936naH/1C7ZzdvhAjtQrjr6yJEaBfCXV93b4QHf6c5/HtpaAgRItSHECFCfQgRItSHEOE7zRMSzl2E16Ua9qfy2kX4mJDw0UU42fzNRpGNJy7C6SyVQyxnUxfhon5Kg1g+1QsX4UVVP5f636d5+VxXFy7C3rSqb17yUlv+clNXUx9gr1dVdV3NPimbrX6Eygu43NNqhZS2+hGcdvR300rf1NG37GIxkfImC88DJCIiIiIiIiIi2r1frZDOUEogCMQAAAAASUVORK5CYII='

const audioImage = 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcT5btaZ3DCLEZM9-2eqh93Oy6IPdJDXO-GXwg&usqp=CAU'


const drawerRoutes = [
    {
        title: 'Home',
        route: `${allPaths.home}`,
        icon: <HomeOutlined />
    },
    {
        title: 'Analytics',
        route: `${allPaths.project_dashboard}`,
        icon: <DashboardOutlined />
    },
    {
        title: 'Data',
        route: `${allPaths.filemanager}`,
        icon: <DatabaseOutlined />
    },
    {
        title: 'Flow Designer',
        route: `${allPaths.flowdesignermain}`,
        icon: <AntDesignOutlined />
    },
    // {
    //   title: 'Workspaces',
    //   route: `${allPaths.workspace}`,
    //   icon: <ViewQuiltIcon />
    // },
    {
        title: 'Graph',
        route: `${allPaths.neo4jmainscreen}`,
        icon: <SiGraphql />
    },
    // {
    //   title: 'Custom Models',
    //   route: `${allPaths.custom_models}`,
    //   icon: <img src={require('../assets/icons/brain.png')} width={20} />
    // },
    {
        title: 'Project Alerts',
        route: `${allPaths.project_settings}`,
        icon: <FiSettings size={20} style={{ marginBottom: '-3px' }} />
    },
    {
        title: 'Project Activities',
        route: `${allPaths.project_activities}`,
        icon: <FiActivity size={20} style={{ marginBottom: '-3px' }} />
    },
    {
        title: 'Project Workflow',
        route: `${allPaths.project_workflow}`,
        icon: <ApartmentOutlined />
    },
    {
        title: 'Flow DataBlocks',
        route: `${allPaths?.flow_data_blocks_flows}`,
        icon: <AccountTree />
    },

    // {
    //   title: 'Approve Artifacts',
    //   route: `${allPaths.approval}`,
    //   icon: <PlaylistAddCheck style={{ fontSize: 26 }} />
    // }
    // {
    //   title: 'Help',
    //   route: `/help`,
    //   icon: <QuestionOutlined />
    // }
]

export const drawerAdminRoutes = [
    {
        title: 'Home',
        route: '/home',
        icon: <HomeOutlined />
    },
    {
        title: 'Analytics',
        route: `${allPaths.project_dashboard}`,
        icon: <DashboardOutlined />
    },
    {
        title: 'Data',
        route: '/filemanager',
        icon: <DatabaseOutlined />
    },
    {
        title: 'Flow Designer',
        route: '/flowdesigner',
        icon: <AntDesignOutlined />
    },
    {
        title: 'Workspaces',
        route: '/workspace',
        icon: <ViewQuiltIcon />
    },
    {
        title: 'Graph',
        route: '/datagraph',
        icon: <SiGraphql />
    },
    {
        title: 'Admin',
        route: '/admin',
        icon: <Security />
    },
    {
        title: 'Custom Models',
        route: '/custommodels',
        icon: <img src={require('../assets/icons/brain.png')} width={20} />
    },
    {
        title: 'User Activities',
        route: `${allPaths.project_activities}`,
        icon: <FiActivity size={20} style={{ marginBottom: '-3px' }} />
    },

    // {
    //   title: 'Help',
    //   route: '/help',
    //   icon: <QuestionOutlined />
    // }
]

export const VIDEO = 'video'
export const IMAGE = 'image'
export const TIFF = 'tiff'
export const DOCS = 'docs'
export const AUDIO = 'audio'
export const TABLE = 'table'
export const BIGQUERY = 'bigquery'
export const FORM = 'form'
export const arrayOfAllTypes = [VIDEO, IMAGE, DOCS, AUDIO, TABLE, FORM]
const api = `/api`

//APIS

//IMAGE-AI APIS

const get_image_ai = `${api}/image-ai` //Query=> ?file_name
const get_image_notes = `${api}/image-ai/notes` //query => ?artifactId
const add_image_note = `${api}/image-ai/note` //POST=> body => {artifactId, x,y,w,h,note}
const delete_image_note = `${api}/image-ai/delete_note`//POST=>body=>{id}
//PDF APIS
const get_pdf_data = `/${api}/pdf_parse/pdf-data`; //GET => query=  ?file_name=somefile.pdf
const update_key_pair = `/${api}/pdf_parse/update-key-pairs` // POST => body= {'id','validated_field_value'}  validated_field_value or validated_field_name one of these is required along with ID.
//ARTIFACT DATA PAGE APIS...
const get_all_artifacts_by_type = `${api}/artifact/get_all_artifacts_by_type/`; ///GET => Get All Artifact by Types, body => { limit, type, page }
const get_tags_by_artifact_id = `${api}/tags/get_tags_by_artifact_id/`; //GET => Get All Tags Of An Artifact. Body => {artifact_id}
const add_tag = `${api}/tags/add_tag/`; //POST => Add Tags to an Artifact. Body => {tag_name, artifact_id, user_id }
const remove_tag = `${api}/tags/remove_tag`; //POST =>  body -> {  id }  id of tag to remove
const ratings_api = `${api}/rating`; //POST => Set rating for an artifact, Body => { user_id, rating };
const get_aggregate_rating = `${api}/rating/get_aggregate_rating`; //get ratings, ==> rating/get_aggregate_rating/:artifact_id
const get_artifact_by_name = `${api}/artifact/get_artifact_data_by_name/`
const set_validate = `${api}/artifact/set_validate` // POST => body= {	'id', 'user_id'}
const search = `${api}/search`

//USER RELATED APIS
const get_user_organization_and_groups = `${api}/user/get_user_organization_and_groups/`; //get groups and organization Data on profile page  GET==> body --> {id}
const update_user = `${api}/user/update_user`;
const get_all_users = `${api}/user/get_all`; //getting all users in the system

//BOOKMARK APIS
const add_bookmarks = `${api}/bookmarks/`; // POST => Add Bookmarks , Body =>  { artifact_id, user_id }
const get_bookmarks = `${add_bookmarks}/by_userId/`; // GET => get bookmarks of particular user --->  query params: { page, limit, userId }
const bookmarks_by_artifactId = `${add_bookmarks}/by_userId_and_artifactId`; // POST => body --> {user_id, artifact_id}
const remove_bookmarks = `${add_bookmarks}/remove_bookmark`; //  POST =>  body -> {  id }, id of bookmark to remove

//WORKSPACE APIS
const add_workspace = `${api}/workspace`; // POST=> Body => {name,description,user_id}
const get_workspaces = `${api}/workspace/by_user_id`; //get workspaces by user id  Get=> Query=> ?limit=10 & page=0 & workspace_id=id
const get_shared_workspaces = `${api}/workspace/shared`; //get shared workspaces by user id  Get=> Query=> ?limit=10 & page=0 & workspace_id=id
const add_widget = `${api}/user_widget/add_update`; //adding widgets to a specific workspace by workspace id  POST==> body --> {workspaceid}
const user_widget_by_workspace_id = `${api}/user_widget/by_workspace_id`; //get widgets of a specific workspace by workspace id  GET==> body --> {workspaceid}
const update_widget_layout_by_id = `${api}/user_widget/update_multiple`; //updating layout of a widget on layout change
const share_workspace = `${api}/workspace/share_workspace`;
const search_all_artifacts_by_user_id_and_key = `${api}/artifact/by_user_id_and_key`;
const share_artifact_with_workspace = `${api}/artifact/share_with_workspace`;

//FILEMANEGER APIS
const folder_api = `${api}/folder` // POST => {name,description,user_id}
const delete_folder = `${folder_api}/delete` // POST => {id,user_id}
const update_folder = `${folder_api}/update` // POST =>  {id,name,description}
const get_folder_by_user_id = `${folder_api}/by_user_project_id` // Query => ? user_id,limit,page
const add_folder_artifacts = `${folder_api}/add_artifacts` //POST  => {folder_id,user_id, artifact_ids:[{id}]}
const get_folder_artifacts = `${folder_api}/get_artifacts` // Query = ?folder_id,limit,page
const remove_folder_artifact = `${folder_api}/remove_artifacts` //POST  => {folder_id,user_id, artifact_ids:[{id}]}

// AI FLOW APIS
const add_ai_flow = `${api}/ai_flow/add_flow` // for adding flow in database
const add_flow_props_files = `${api}/ai_flow/upload` // for uploading files of properties of nodes in flow data
const fetch_ai_flows = `${api}/ai_flow/by_user_id/` // for fetching flows of user
const update_ai_flow = `${api}/ai_flow/update_flow/` // for updating flow of user
const saving_flow_schedule = `${api}/flow_schedule` // for saving single flow schedule
const updating_flow_schedule = `${api}/flow_schedule/update_schedule`

// NEO4J GRAPH API
const neo4jgraphapi = `${api}/neo4jgraph/`

// GRAPH APIS

const graph_api = `${api}/graph_query`
const save_graph = `${graph_api}/`
const fetch_graphs_by_userid = `${graph_api}/get_graph_by_user/`
const update_graph_by_id = `${graph_api}/update_graph/`
const delete_graph_by_id = `${graph_api}/delete_graph/`
const num_of_user_types = `${api}/user/num_of_user_types`
const num_of_new_users = `${api}/user/num_of_new_users`


// CUSTOM MODELS APIS

const fetch_models_by_userid = `${api}/bigQuery/get_big_ml`
const models_traininginfo_by_name = `${api}/bigQuery/get_training_info`
const model_evaluate = `${api}/bigQuery_ml/evaluate_model/`

//Project Apis
const project_api = `${api}/project` //
const get_projects_by_user_id = `${project_api}/by_user_id` // Query => ? user_id,limit,page
const get_templates = `${project_api}/templates`
const share_project = `${project_api}/share`
const project_members = `${project_api}/project_members`
const get_all_projects = `${api}/project/get_all_projects`
const project_chat = `${project_api}/project_chat`
const upload_chat_files = `${api}/project_chat/upload_chat_files`

// PROJECT KEYWORDS TO CHECK APIS

const add_keyword_to_project = `${api}/project/add_keyword`; // POST ==> { userId, condition, keyword, type, project_id, file_type }
const update_keyword_to_project = `${api}/project/update_keyword`; //POST ==> { id, userId, condition, keyword, type, project_id }
const delete_keyword_of_project = `${api}/project/delete_keyword`; // POST ==> /delete_keyword/:id
const get_project_keywords_by_file_type = `${api}/project/get_keyword_by_file`; // GET ==> /:project_id/:file_type
const project_get_keywords_notifs = `${api}/project/get_notifications`;

// FORM TEMPLATE APIS
const create_template = `${api}/artifact/create_template/`
const update_template = `${api}/artifact/update_template_data/`
const update_template_schema = `${api}/artifact/update_template`
const upload_template_dataset = `${api}/artifact/upload_template_dataset` // POST => ;
const upload_template_graph_schema = `${api}/artifact/upload_template_graph_schema` //POST
const get_processors = `${api}/docAI/proccesors`
const add_custom_fields = `/${api}/pdf_parse/add_custom_fields`
const get_custom_fields = `/${api}/pdf_parse/get_custom_fields`
const delete_custom_field = `/${api}/pdf_parse/delete_custom_field`
const get_custom_fields_by_artifact = `/${api}/pdf_parse/get_custom_fields_by_artifact`
const add_keypairs = `/${api}/pdf_parse/add_keypairs`


//DATA ANALYTICS AND QUALITY
const data_completeness = `${api}/data_dashboard/completeness`
const get_project_analytics = `${api}/data_dashboard/get_project_data`


//Project FLOW
const get_flow_rules = `${api}/projectflow/get_flow_rules` //get
const add_flow_rule = `${api}/projectflow/add_flow_rule` //post
const get_backend_apis = `${api}/projectflow/get_backend_apis`
const get_or_add_business_function = `${api}/projectflow/bussiness_function` //get post both. Post=> {name,description,selectedRules} 
const add_business_flow = `${api}/projectflow/add_business_flow`; // POST user_id flow_name flow_json business_function_id flow_description
const get_business_flow = `${api}/projectflow/get_business_flow`; // GET 
const execute_workflow = `${api}/projectflow/execute` //Post=> {projectId}
const get_gflow = `${api}/projectflow/get_flow`//Get= ?projectId
const update_flow = `${api}/projectflow/update_flow`; // POST , id, flow_name, flow_json, flow_description

//audit apis
const overall_activities = `${api}/audit/overall_activities`
const top_ten_active = `${api}/audit/top_ten_active`


// FLOW DATA BLOCKS
const get_tables = `${api}/flow_datablocks/get_tables`;
const get_rows = `${api}/flow_datablocks/get_rows`; // POST, BODY: table_name, num_of_rows
const save_flow_db = `${api}/flow_datablocks/save_flowdatablocks`; // POST, BODY: flow_name, user_id, flow_json, project_id 
const update_flow_db = `${api}/flow_datablocks/update_flowdatablocks`; // POST, BODY: id, flow_name, flow_json
const delete_flow_db = `${api}/flow_datablocks/delete_flowdatablocks`; // POST. BODY: id
const get_flowdbflows = `${api}/flow_datablocks/get_flowdatablocks_of_project`; // POST. BODY: project_id

//APPROVAL
const approval = ` ${api}/approval`
const approvalCount = ` ${api}/approval/count`

//INSIGHTS
const getInsights = ` ${api}/insight`//?project_id=e37c4d55-1690-4085-846e-a0e87e141f0e

//ADDITIONAL PROPERTIES
const getAdditionalProperties = `${api}/project/get_all_additional_properties`
const updateAdditionalProperties = `${api}/artifact/update_additional_properties`;
const addProperties = `${api}/project/add_property`


const get_file_key_pairs_data = `${api}/artifact/get_file_key_pairs`; // POST

const get_project_files_null_fields = `${api}/artifact/project_files_null_fields`;//POST. project_id


//VIDEO AI
const get_video_json = `${api}/video-ai`

//WEB ARCHIVe
const get_web_archive = `${api}/web-archive`// query=> ?projectId=
const webarchive_schedule = `${get_web_archive}/schedule` //post body=>{projectId,web,schedule}
const run_webarchive = `${get_web_archive}/run` //post body=>{projectId,web,schedule}
const web_data = `${get_web_archive}/data`// GET. query=> ?id&projectId
const get_archive_by_id = `${get_web_archive}/archive_by_id` // GET query=> ?id
const archives_by_web = `${get_web_archive}/archives_by_web` // GET query=> ?id or web
const archive_schedules_data = `${get_web_archive}/schedules_data` // GET query=> ?id ==> project id


// MICROSERVICES

const host = 'http://localhost:8080';
const apis = `${host}/api`;

// ACCOUNTS
// POST APIS
const accounts_api = `${apis}/accounts`;
const account_registration = `${accounts_api}/register`;
const account_login = `${accounts_api}/login`;
const account_forgot_password = `${accounts_api}/forgot_password`;
const account_update_password = `${accounts_api}/update_password`;
const account_check_social_params = `${accounts_api}/check_social_params`;
const account_update_role = `${accounts_api}/update_role_by_user_id`;
const account_update_approvestatus = `${accounts_api}/update_approvestatus_by_user_id`;
const account_update_pendingstatus = `${accounts_api}/update_pendingstatus_by_user_id`;
const account_update_blockstatus_by_user_id = `${accounts_api}/update_blockstatus_by_user_id`;
const account_update_user = `${accounts_api}/update_user`;
const account_delete_user_by_email = `${accounts_api}/delete_user_by_email`;
const account_update_token = `${accounts_api}/update_token`;
const account_change_password = `${accounts_api}/change_password`;
const account_update_picture = `${accounts_api}/update_picture`;

// ACCOUNT ORGANIZATION
const accounts_org_api = `${accounts_api}/organization`;
const add_organization = `${accounts_org_api}/add_organization`;
const join_organization = `${accounts_org_api}/join_organization`;
// ORGANIZATION GET
const get_all_organizations = `${accounts_org_api}/get_all_organizations`;
// GROUP
const accounts_group_api = `${accounts_api}/group`;
const add_group = `${accounts_group_api}/add_group`;
// GROUP GET 
const accounts_get_all_groups = `${accounts_group_api}/get_all_groups`

// ACCOUNTS GET APIS
const account_verify_token = `${accounts_api}/verifytoken`;
const account_verify_email = `${accounts_api}/verifyEmail`;
const account_num_of_user_types = `${accounts_api}/num_of_user_types`;
const account_num_of_new_users = `${accounts_api}/num_of_new_users`;
const account_approve_users = `${accounts_api}/approve_users`;
const account_new_users = `${accounts_api}/new_users`;
const account_block_users = `${accounts_api}/block_users`;
const account_pending_users = `${accounts_api}/pending_users`;
const account_non_verified_users = `${accounts_api}/non_verified_users`;
const account_get_user_organization_and_groups = `${accounts_api}/get_user_organization_and_groups`;
const account_get_all = `${accounts_api}/get_all`;
const account_get_user = `${accounts_api}/get_user`;


// AUDIT
const audit_api = `${apis}/audit`;
// POST APIS
const audit_add_audit = `${audit_api}/add_audit`;
// GET APIS 
const audit_project_activities = `${audit_api}/project_activities`;
const audit_overall_activities = `${audit_api}/overall_activities`;
const audit_top_ten_active = `${audit_api}/top_ten_active`;

// NOTIFICATIONS
const notifications_api = `${apis}/notifications`;
// POST APIS
const notif_create_notification = `${notifications_api}/create_notification`;
const notif_update_notification = `${notifications_api}/update_notification`;
// GET POST
const notif_get_notification_by_user_id = `${notifications_api}/get_notification_by_user_id`;

// FOLDERS
const folders_api = `${apis}/folders`;
// POST APIS 
const folders_create_folder = `${folders_api}/create_folder`;
const folders_delete_folder = `${folders_api}/delete`;
const folders_add_artifacts = `${folders_api}/add_artifacts`;
const folders_remove_artifacts = `${folders_api}/remove_artifacts`;
const folders_update = `${folders_api}/update`;
const folders_share = `${folders_api}/share`;
// GET APIS 
const folders_get_by_user_id = `${folders_api}/by_user_id`;
const folders_get_by_user_project_id = `${folders_api}/by_user_project_id`;
const folders_get_artifacts = `${folders_api}/get_artifacts`;
const folders_shared_folders = `${folders_api}/shared_folders`;


// PROJECTS
// POST APIS 
const projects_api = `${apis}/project`;
const projects_create_project = `${projects_api}/create_project`;
const projects_create_additional_properties = `${projects_api}/create_additional_properties`;
const projects_delete_template = `${projects_api}/delete_template`;
const projects_delete_project = `${projects_api}/delete_project`;
const projects_add_property = `${projects_api}/add_property`;
const projects_delete_keyword = `${projects_api}/delete_keyword`;
const projects_add_keyword = `${projects_api}/add_keyword`;
const projects_update_keyword = `${projects_api}/update_keyword`;
const projects_share = `${projects_api}/share`;
// GET APIS
const projects_by_user_id = `${projects_api}/by_user_id`;
const projects_templates = `${projects_api}/templates`;
const projects_project_members = `${projects_api}/project_members`;
const projects_get_all_projects = `${projects_api}/get_all_projects`;
const projects_project_chat = `${projects_api}/project_chat`;
const projects_get_keyword = `${projects_api}/get_keyword`;
const projects_get_keyword_by_file = `${projects_api}/get_keyword_by_file`;
const projects_get_notifications = `${projects_api}/get_notifications`;
const projects_get_project_data = `${projects_api}/get_project_data`;
const projects_get_all_additional_properties = `${projects_api}/get_all_additional_properties`;

// BOOKMARKS
//POST APIS
const bookmarks_api = `${apis}/bookmarks`;
const bookmarks_add_bookmark = `${bookmarks_api}/add_bookmark`;
const bookmarks_by_userId = `${bookmarks_api}/by_userId`;
const bookmarks_remove_bookmark = `${bookmarks_api}/remove_bookmark`;
const bookmarks_by_userId_and_artifactId = `${bookmarks_api}/by_userId_and_artifactId`;

// DASHBOARD CHARTS
const dashboard_charts_api = `${apis}/dashboard_chart`;
//POST APIS
const dashboard_add_chart = `${dashboard_charts_api}/add_chart`;
const dashboard_charts_delete = `${dashboard_charts_api}/delete`;
const dashboard_charts_update_multiple = `${dashboard_charts_api}/update_multiple`;
// GET APIS
const dashboard_charts_find_all = `${dashboard_charts_api}/find_all`;

//ARTIFACT COMMENTS
const artifact_comments_api = `${apis}/artifact_comment`;
// POST APIS 
const artifact_add_comment = `${artifact_comments_api}/add_comment`;
// GET COMMENT
const artifact_find_all_artifact_comments = `${artifact_comments_api}/find_all_artifact_comments`;


// PROJECT FLOW 
const project_flow_api = `${apis}/projectflow`;

// POST
const p_flow_add_bussiness_function = `${project_flow_api}/add_bussiness_function`;
const p_flow_add_flow_rule = `${project_flow_api}/add_flow_rule`;
const p_flow_add_business_flow = `${project_flow_api}/add_business_flow`;
const p_flow_update_flow = `${project_flow_api}/update_flow`;
const p_flow_add_backend_apis = `${project_flow_api}/add_backend_apis`;// NOT INTEGRATED
const p_flow_execute = `${project_flow_api}/execute`;

// GET
const p_flow_get_bussiness_function = `${project_flow_api}/get_bussiness_function`;
const p_flow_get_flow_rules = `${project_flow_api}/get_flow_rules`;
const p_flow_get_flow_details = `${project_flow_api}/get_flow_details`;
const p_flow_get_business_flow = `${project_flow_api}/get_business_flow`;
const p_flow_get_backend_apis = `${project_flow_api}/get_backend_apis`;
const p_flow_get_tables = `${project_flow_api}/get_tables`;
const p_flow_get_table_columns = `${project_flow_api}/get_table_columns`;


// TAGS
const tags_api = `${apis}/tags`;

// POST
const tags_add_tag = `${tags_api}/add_tag`;
const tags_remove_tag = `${tags_api}/remove_tag`;
const tags_update_tag = `${tags_api}/update_tag`;

// GET
const tags_get_tags_by_artifact_id = `${tags_api}/get_tags_by_artifact_id`;
const tags_get_tags_by_user_id = `${tags_api}/get_tags_by_user_id`;

export const allAPIs = {
    archive_schedules_data,
    archives_by_web,
    get_archive_by_id,
    web_data,
    run_webarchive,
    webarchive_schedule,
    get_web_archive,
    get_video_json,
    addProperties,
    getAdditionalProperties,
    updateAdditionalProperties,
    getInsights,
    approvalCount,
    approval,
    get_gflow,
    execute_workflow,
    get_or_add_business_function,
    get_flow_rules,
    add_flow_rule,
    delete_image_note,
    get_image_notes,
    add_image_note,
    add_keypairs,
    get_custom_fields_by_artifact,
    get_custom_fields,
    delete_custom_field,
    add_custom_fields,
    get_processors,
    get_project_analytics,
    data_completeness,
    upload_template_dataset,
    get_image_ai,
    set_validate,
    update_key_pair,
    folder_api,
    delete_folder,
    update_folder,
    get_folder_artifacts,
    get_folder_by_user_id,
    add_folder_artifacts,
    remove_folder_artifact,
    get_pdf_data,
    get_all_artifacts_by_type,
    get_artifact_by_name,
    get_tags_by_artifact_id,
    add_tag,
    remove_tag,
    ratings_api,
    add_bookmarks,
    get_bookmarks,
    bookmarks_by_artifactId,
    get_aggregate_rating,
    remove_bookmarks,
    add_ai_flow,
    add_flow_props_files,
    fetch_ai_flows,
    get_user_organization_and_groups,
    update_user,
    update_ai_flow,
    add_workspace,
    get_workspaces,
    add_widget,
    user_widget_by_workspace_id,
    saving_flow_schedule,
    updating_flow_schedule,
    update_widget_layout_by_id,
    get_all_users,
    share_workspace,
    search_all_artifacts_by_user_id_and_key,
    share_artifact_with_workspace,
    neo4jgraphapi,
    save_graph,
    fetch_graphs_by_userid,
    update_graph_by_id,
    delete_graph_by_id,
    get_shared_workspaces,
    num_of_user_types,
    num_of_new_users,
    fetch_models_by_userid,
    models_traininginfo_by_name,
    model_evaluate,
    get_projects_by_user_id,
    get_templates,
    project_api,
    create_template,
    update_template,
    update_template_schema,
    share_project,
    project_members,
    get_all_projects,
    project_chat,
    upload_chat_files,
    upload_template_graph_schema,
    search,
    add_keyword_to_project,
    update_keyword_to_project,
    delete_keyword_of_project,
    get_project_keywords_by_file_type,
    project_get_keywords_notifs,
    get_backend_apis,
    add_business_flow,
    get_business_flow,
    overall_activities,
    top_ten_active,
    get_tables,
    get_rows,
    save_flow_db,
    update_flow_db,
    delete_flow_db,
    get_flowdbflows,
    get_file_key_pairs_data,
    get_project_files_null_fields,
    update_flow,
    account_registration,
    account_login,
    account_forgot_password,
    account_update_password,
    account_check_social_params,
    account_update_role,
    account_update_approvestatus,
    account_update_pendingstatus,
    account_update_blockstatus_by_user_id,
    account_update_user,
    account_delete_user_by_email,
    account_update_token,
    account_change_password,
    account_update_picture,
    account_verify_token,
    account_verify_email,
    account_num_of_user_types,
    account_num_of_new_users,
    add_organization,
    join_organization,
    add_group,
    accounts_api,
    account_new_users,
    account_approve_users,
    account_block_users,
    account_pending_users,
    account_non_verified_users,
    account_get_user_organization_and_groups,
    account_get_all,
    accounts_get_all_groups,
    get_all_organizations,
    account_get_user,
    audit_add_audit,
    audit_project_activities,
    audit_overall_activities,
    audit_top_ten_active,
    notif_create_notification,
    notif_update_notification,
    notif_get_notification_by_user_id,
    folders_create_folder,
    folders_delete_folder,
    folders_add_artifacts,
    folders_remove_artifacts,
    folders_update,
    folders_share,
    folders_get_by_user_id,
    folders_get_by_user_project_id,
    folders_get_artifacts,
    folders_shared_folders,
    projects_create_project,
    projects_create_additional_properties,
    projects_delete_template,
    projects_delete_project,
    projects_add_property,
    projects_delete_keyword,
    projects_add_keyword,
    projects_update_keyword,
    projects_share,
    projects_by_user_id,
    projects_templates,
    projects_project_members,
    projects_get_all_projects,
    projects_project_chat,
    projects_get_keyword,
    projects_get_keyword_by_file,
    projects_get_notifications,
    projects_get_project_data,
    projects_get_all_additional_properties,
    bookmarks_add_bookmark,
    bookmarks_by_userId,
    bookmarks_remove_bookmark,
    bookmarks_by_userId_and_artifactId,
    dashboard_add_chart,
    dashboard_charts_delete,
    dashboard_charts_update_multiple,
    dashboard_charts_find_all,
    artifact_add_comment,
    artifact_find_all_artifact_comments,
    p_flow_add_bussiness_function,
    p_flow_add_flow_rule,
    p_flow_add_business_flow,
    p_flow_update_flow,
    p_flow_add_backend_apis,
    p_flow_execute,
    p_flow_get_bussiness_function,
    p_flow_get_flow_rules,
    p_flow_get_flow_details,
    p_flow_get_business_flow,
    p_flow_get_backend_apis,
    p_flow_get_tables,
    p_flow_get_table_columns,
    tags_add_tag,
    tags_remove_tag,
    tags_update_tag,
    tags_get_tags_by_artifact_id,
    tags_get_tags_by_user_id
}


const bigQuery = 'bigQuery'
const artifactTypes = {
    [`${VIDEO}`]: {
        extensions: 'mp4',
        api: BQ_GET_VIDEO_DATA,
        type: 'video',
        user_id: ''
    },
    [`${IMAGE}`]: {
        extensions: ['jpeg', 'png', 'jpg', 'tiff', 'tif'],
        api: BQ_GET_IMAGE_DATA,
        type: 'image',
        user_id: ''
    },
    [`${DOCS}`]: {
        extensions: ['docx', 'txt', 'doc', 'ppt', 'pptx'],
        api: BQ_GET_DOC_DATA,
        type: 'doc',
        user_id: ''
    },
    [`${AUDIO}`]: {
        extensions: 'mp3',
        api: BQ_GET_AUDIO_DATA,
        type: 'audio',
        user_id: ''
    },
    [`${TABLE}`]: {
        extensions: 'csv',
        api: `${api}/${bigQuery}/get_table_data`,
        type: 'table',
        user_id: ''
    },
    [`${FORM}`]: {
        extensions: 'pdf',
        api: `${api}/${bigQuery}/get_form_data`,
        type: 'form',
        user_id: ''
    }
}

const detectType = (artifact_type, type) =>
    artifactTypes?.[`${type}`]?.extensions?.includes(
        artifact_type && artifact_type?.toLowerCase()
    )

export const isImage = (artifact_type) => (detectType(artifact_type, IMAGE) || detectType(artifact_type, TIFF));
export const isAudio = (artifact_type) => detectType(artifact_type, AUDIO)
export const isTable = (artifact_type) => detectType(artifact_type, TABLE)
export const isBigQuery = (artifact_type) => artifact_type === BIGQUERY
export const isDocs = (artifact_type) =>
    !isTable(artifact_type) && detectType(artifact_type, DOCS)
// export const isPpts = (artifact_type) => !isTable(artifact_type) && detectType(artifact_type, PPT)
export const isVideo = (artifact_type) => detectType(artifact_type, VIDEO)
export const isForm = (artifact_type) => detectType(artifact_type, FORM)
export const isPDF = (artifact_type) => {
    return artifact_type === 'pdf'
}

export const isXML = (artifact_type) => {
    return artifact_type === 'xml'
}

export const isNoMatchingType = (artifact_type) =>
    !isVideo(artifact_type) &&
    !isImage(artifact_type) &&
    !isAudio(artifact_type) &&
    !isTable(artifact_type) &&
    !isDocs(artifact_type)

const extractAPI = (type) => artifactTypes?.[`${type}`]?.api

export const getAPIbyType = (artifact_type) =>
    isImage(artifact_type)
        ? extractAPI(IMAGE)
        : isVideo(artifact_type)
            ? extractAPI(VIDEO)
            : isAudio(artifact_type)
                ? extractAPI(AUDIO)
                : isDocs(artifact_type)
                    ? extractAPI(DOCS)
                    : isTable(artifact_type)
                        ? extractAPI(TABLE)
                        : isForm(artifact_type)
                            ? extractAPI(FORM)
                            : // isPpts(artifact_type) ?
                            //     extractAPI(PPT) :
                            null

const Icon_Blue_Color = '#24a0ed'

// FLOW SIDE BAR ITEMS

const awsRegions = [
    'eu-north-1',
    'ap-south-1',
    'eu-west-3',
    'eu-west-2',
    'eu-west-1',
    'ap-northeast-3',
    'ap-northeast-2',
    'me-south-1',
    'ap-northeast-1',
    'sa-east-1',
    'ca-central-1',
    'ap-east-1',
    'ap-southeast-1',
    'ap-southeast-2',
    'eu-central-1',
    'us-east-1',
    'us-east-2',
    'us-west-1',
    'us-west-2'
]


let sourceItemss = [
    {
        id: 'SRC-UPLOAD',
        name: 'Upload',
        icon: () => (
            <img src={require('../assets/fdupload.png')} width='40px' height='30px' />
        ),
        type: 'Source',
        isCreated: false,
    },
    {
        id: 'SRC-GCS',
        name: 'GCS',
        icon: () => (
            <img
                src={require('../assets/fdgcsicon.png')}
                width='40px'
                height='30px'
            />
        ),
        type: 'Source',
        isCreated: false
    },
    {
        id: 'SRC-BIGQUERY',
        name: 'Big Query',
        icon: () => (
            <img
                src={require('../assets/fdbigqueryicon.png')}
                width='40px'
                height='30px'
            />
        ),
        type: 'Source',
        isCreated: false
    },
    {
        id: 'SRC-CSV',
        name: 'CSV',
        icon: () => <FaFileCsv size={32} color='#3176eb' />,
        type: 'Source',
        isCreated: false
    },
    {
        id: 'SRC-DATABASE',
        name: 'Database',
        icon: () => <FaDatabase size={30} color='#3176eb' />,
        type: 'Source',
        isCreated: false
    },
    // {
    //   id: 'SRC-TABLE/CSV',
    //   name: 'Table/CSV',
    //   icon: () => <BsTable size={30} color='#3176eb' />,
    //   type: 'Source',
    //   isCreated: false
    // }
]

let transformItemss = [
    {
        id: 'TRA-VIDEO',
        name: 'Video',
        icon: () => <AiTwotoneVideoCamera size={32} color='#3176eb' />,
        type: 'Transform',
        isCreated: false
    },
    {
        id: 'TRA-SPEECH',
        name: 'Speech',
        icon: () => (
            <img
                src={require('../assets/personicon.png')}
                width='40px'
                height='30px'
            />
        ),
        type: 'Transform',
        isCreated: false
    },
    {
        id: 'TRA-AUDIO',
        name: 'Audio',
        icon: () => <AiFillSound size={35} color='#3176eb' />,
        type: 'Transform',
        isCreated: false
    },
    {
        id: 'TRA-FORM',
        name: 'Form',
        icon: () => <AiOutlineForm size={35} color='#3176eb' />,
        type: 'Transform',
        isCreated: false
    },
    {
        id: 'TRA-DOCUMENT',
        name: 'Document',
        icon: () => (
            <CgFileDocument
                size={35}
                style={{ margin: '0px', padding: '0px' }}
                color='#3176eb'
            />
        ),
        type: 'Transform',
        isCreated: false
    },
    {
        id: 'TRA-MODEL',
        name: 'Model',
        icon: () => (
            <img
                src={require('../assets/modelicon.png')}
                width='40px'
                height='35px'
            />
        ),
        type: 'Transform',
        isCreated: false,
    },
    {
        id: 'TRA-VISION',
        name: 'Vision',
        icon: () => (
            <img
                src={require('../assets/modelicon.png')}
                width='40px'
                height='35px'
            />
        ),
        type: 'Transform',
        isCreated: false,
    },
];

let targetItemss = [
    {
        id: 'TAR-GCS',
        name: 'GCS',
        icon: () => (
            <img
                src={require('../assets/fdgcsicon.png')}
                width='40px'
                height='30px'
            />
        ),
        type: 'Target',
        isCreated: false,
    },
    {
        id: 'TAR-BIGQUERY',
        name: 'Big Query',
        icon: () => (
            <img
                src={require('../assets/fdbigqueryicon.png')}
                width='40px'
                height='30px'
            />
        ),
        type: 'Target',
        isCreated: false,
    },
    {
        id: 'TAR-CSV',
        name: 'CSV',
        icon: () => <FaFileCsv size={30} color='#3176eb' />,
        type: 'Target',
        isCreated: false,
    },
];
export const sideBarItems = {
    sourceItemss,
    transformItemss,
    targetItemss,
};

let graphNodescolor = [
    {
        bg: '#d92830',
        color: 'white'
    },
    {
        bg: '#f58d2c',
        color: 'white'
    },
    {
        bg: '#a35525',
        color: 'white'
    },
    {
        bg: '#98999b',
        color: 'white'
    },
    {
        bg: '#8c4b9f',
        color: 'white'
    },
    {
        bg: '#05b086',
        color: 'white'
    },
    {
        bg: '#990012',
        color: 'white'
    },
    {
        bg: '#00438b',
        color: 'white'
    },
    {
        bg: '#4c8eda',
        color: 'white'
    },
    {
        bg: '#037B94',
        color: 'white'
    },
    {
        bg: '#f16667',
        color: 'white'
    },
    {
        bg: '#e7a1ba',
        color: 'white'
    },
    {
        bg: '#ffb221',
        color: 'white'
    },
    {
        bg: '#57c7e3',
        color: 'white'
    },
    {
        bg: '#f79767',
        color: 'white'
    },
    {
        bg: '#569480',
        color: 'white'
    }
]

const uploadOptions = [
    {
        icon: <FileWordFilled style={{ fontSize: 80, color: '#1890ff' }} />,
        type: acceptTypes.docs
    },
    {
        icon: <PictureFilled style={{ fontSize: 90, color: '#1890ff', marginBottom: -10 }} />,
        type: acceptTypes.image
    },
    {
        icon: <FilePdfFilled style={{ fontSize: 80, color: '#1890ff' }} />,
        type: acceptTypes.form
    },
    {
        icon: <AudioFilled style={{ fontSize: 80, color: '#1890ff' }} />,
        type: acceptTypes.audio
    },
    {
        icon: <VideoCameraFilled style={{ fontSize: 80, color: '#1890ff' }} />,
        type: acceptTypes.video
    }
]

const actions = {
    click: 'click',
    insert: 'insert',
    update: 'update',
    delete: 'delete',
    search: 'Navigation Bar Search',
    navigation: 'Navigation',
}

const actionTypes = {
    login: 'login',
    logout: 'logout',
    signup: 'Sign Up',
    upload: 'File Upload',
    addOrganization: 'New Organization Added',
    addGroup: 'New Group Added',
    addAgency: 'New Agency Added',
    addFolder: 'New Folder Added',
    deleteFolder: 'Folder Deleted',
    updateFolder: 'Folder Updated'
}

const actionTables = {
    none: 'none',
    user: 'users',
    artifact: 'artifact',
    organization: 'organizations',
    group: 'groups',
    agency: 'agencies',
    folder: 'folders'
}

const notificationEvents = {
    uploadProgress: 'Uploading Files ...',
    uploadComplete: 'Files Uploaded Successfully!'
}

const allRoles = {
    'admin': '1',
    'collaborator': '2',
    'subscriber': '3',
    'publisher': '4'
}

const adminRoutes = ['adminsetting', 'groups', 'organization', 'users', 'docsapproval', 'addagency', 'agencyforms', 'admin']

let acceptableTypes = [
    'INT64',
    'NUMERIC',
    'BIGNUMERIC',
    'FLOAT64',
    'FLOAT',
    'INTEGER'
]

const COMPLETED = 'COMPLETED'
const PROCESSING = 'PROCESSING'
const FAILED = 'FAILED'
export const customParser = 'Custom Model'

const backEndApi = [
    {
        'name': 'Calling bigquery data',
        'url': 'https://us-central1-elaborate-howl-285701.cloudfunctions.net/Calling_bigquery_data'
    },
    {
        'name': 'Document NLP HTTP',
        'url': 'https://us-central1-elaborate-howl-285701.cloudfunctions.net/Document_NLP_HTTP'
    },
    {
        'name': 'Flow-Scheduler',
        'url': 'https://us-central1-elaborate-howl-285701.cloudfunctions.net/Flow-Scheduler'
    },
    {
        'name': 'Retrieve Info from BigQuery',
        'url': 'https://us-central1-elaborate-howl-285701.cloudfunctions.net/Retrieve_Info_from_BigQuery'
    },
    {
        'name': 'automl table batch prediction',
        'url': 'https://us-central1-elaborate-howl-285701.cloudfunctions.net/automl_table_batch_prediction'
    },
    {
        'name': 'automl table creating dataset',
        'url': 'https://us-central1-elaborate-howl-285701.cloudfunctions.net/automl_table_creating_dataset'
    },
    {
        'name': 'automl table importing data',
        'url': 'https://us-central1-elaborate-howl-285701.cloudfunctions.net/automl_table_importing_data'
    },
    {
        'name': 'automl table target column',
        'url': 'https://us-central1-elaborate-howl-285701.cloudfunctions.net/automl_table_target_column'
    },
    {
        'name': 'automl table training dataset',
        'url': 'https://us-central1-elaborate-howl-285701.cloudfunctions.net/automl_table_training_dataset'
    },
    {
        'name': 'creating dataset',
        'url': 'https://us-central1-elaborate-howl-285701.cloudfunctions.net/creating_dataset'
    },
    {
        'name': 'custom template',
        'url': 'https://us-central1-elaborate-howl-285701.cloudfunctions.net/custom_template'
    },
    {
        'name': 'custom template table generator',
        'url': 'https://us-central1-elaborate-howl-285701.cloudfunctions.net/custom_template_table_generator'
    },
    {
        'name': 'data loss prevention',
        'url': 'https://us-central1-elaborate-howl-285701.cloudfunctions.net/data_loss_prevention'
    },
    {
        'name': 'data loss prevention document',
        'url': 'https://us-central1-elaborate-howl-285701.cloudfunctions.net/data_loss_prevention_document'
    },
    {
        'name': 'de identification pdf',
        'url': 'https://us-central1-elaborate-howl-285701.cloudfunctions.net/de_identification_pdf'
    },
    {
        'name': 'dlp-redaction-js',
        'url': 'https://backend.neptunestech.com:8016'
        // 'url': 'https://dlp-redaction-api-2my7afm7yq-ue.a.run.app/api/dlp_redaction/pdf_to_dlp'
    },
    {
        'name': 'dlp javascript',
        'url': 'https://us-central1-elaborate-howl-285701.cloudfunctions.net/dlp_javascript'
    },
    {
        'name': 'doc ai v3 node http',
        'url': 'https://backend.neptunestech.com:8018'
        // 'url': 'https://us-central1-elaborate-howl-285701.cloudfunctions.net/doc_ai_v3_node_http'
    },
    {
        'name': 'document AI keys extraction',
        'url': 'https://us-central1-elaborate-howl-285701.cloudfunctions.net/document_AI_keys_extraction'
    },
    {
        'name': 'document AI v3',
        'url': 'https://us-central1-elaborate-howl-285701.cloudfunctions.net/document_AI_v3'
    },
    {
        'name': 'expense parser',
        'url': 'https://us-central1-elaborate-howl-285701.cloudfunctions.net/expense_parser'
    },
    {
        'name': 'extracting pdf',
        'url': 'https://backend.neptunestech.com:8022'
        // 'url': 'https://us-central1-elaborate-howl-285701.cloudfunctions.net/extracting_pdf'
    },
    {
        'name': 'form key pair',
        'url': 'https://us-central1-elaborate-howl-285701.cloudfunctions.net/form_key_pair'
    },
    {
        'name': 'form matching',
        'url': 'https://backend.neptunestech.com:8027'
        // 'url': 'https://us-central1-elaborate-howl-285701.cloudfunctions.net/form_matching'
    },
    {
        'name': 'function-4',
        'url': 'https://backend.neptunestech.com:8028'
        // 'url': 'https://us-central1-elaborate-howl-285701.cloudfunctions.net/function-4'
    },
    {
        'name': 'image crop vision ai',
        'url': 'https://backend.neptunestech.com:8030'
        // 'url': 'https://us-central1-elaborate-howl-285701.cloudfunctions.net/image_crop_vision_ai'
    },
    {
        'name': 'importing dataset',
        'url': 'https://backend.neptunestech.com:8031'
        // 'url': 'https://us-central1-elaborate-howl-285701.cloudfunctions.net/importing_dataset'
    },

    {
        'name': 'invoice',
        'url': 'https://us-central1-elaborate-howl-285701.cloudfunctions.net/invoice'
    },
    {
        'name': 'match schema tables',
        'url': 'https://backend.neptunestech.com:8033'
        // 'url': 'https://us-central1-elaborate-howl-285701.cloudfunctions.net/match_schema_tables'
    },
    {
        'name': 'model list',
        'url': 'https://us-central1-elaborate-howl-285701.cloudfunctions.net/model_list'
    },
    {
        'name': 'node automl status',
        'url': 'https://backend.neptunestech.com:8034'
        // 'url': 'https://us-central1-elaborate-howl-285701.cloudfunctions.net/node_automl_status'
    },
    {
        'name': 'pdf classification',
        'url': 'https://us-central1-elaborate-howl-285701.cloudfunctions.net/pdf_classification'
    },
    {
        'name': 'pdf data to neo4j',
        'url': 'https://backend.neptunestech.com:8038'
        // 'url': 'https://us-central1-elaborate-howl-285701.cloudfunctions.net/pdf_data_to_neo4j'
    },
    {
        'name': 'pdf schema table generator',
        'url': 'https://backend.neptunestech.com:8039'
        // 'url': 'https://us-central1-elaborate-howl-285701.cloudfunctions.net/pdf_schema_table_generator'
    },
    {
        'name': 'push notification',
        'url': 'https://backend.neptunestech.com:8044'
        // 'url': 'https://us-central1-elaborate-howl-285701.cloudfunctions.net/push_notification'
    },
    {
        'name': 'query5 check',
        'url': 'https://us-central1-elaborate-howl-285701.cloudfunctions.net/query5_check'
    },
    {
        'name': 'speech to text2',
        'url': 'https://us-central1-elaborate-howl-285701.cloudfunctions.net/speech_to_text2'
    },
    {
        'name': 'table updatation',
        'url': 'https://us-central1-elaborate-howl-285701.cloudfunctions.net/table_updatation'
    },
    {
        'name': 'text to speech',
        'url': 'https://us-central1-elaborate-howl-285701.cloudfunctions.net/text_to_speech'
    },
    {
        'name': 'training dataset',
        'url': 'https://us-central1-elaborate-howl-285701.cloudfunctions.net/training_dataset'
    },
    {
        'name': 'verify automl completion',
        'url': 'https://us-central1-elaborate-howl-285701.cloudfunctions.net/verify_automl_completion'
    },
    {
        'name': 'video-transform-nodejs',
        'url': 'https://us-central1-elaborate-howl-285701.cloudfunctions.net/video-transform-nodejs'
    }
]

// FLOW DATA BLOCKS 
let blocks = [
    {
        id: '1',
        name: 'Data Source',
        nodeType: 'input',
        node: 'getdata',
        sourceLimit: 0,
        isVisual: false,
        des: 'Select Postgres Data Tables',
        icon: <DiffOutlined />
    },
    {
        id: '2',
        name: 'Filter Column',
        nodeType: 'middle',
        node: 'filternode',
        sourceLimit: 1,
        isVisual: false,
        des: 'Groups a Data Set based on a given Column Name',
        icon: <FilterOutlined />
    },
    {
        id: '3',
        name: 'Merge Column',
        nodeType: 'middle',
        node: 'mergenode',
        sourceLimit: 2,
        isVisual: false,
        des: 'Merge Two Data Sets based on the given Column Name',
        icon: <PicCenterOutlined />
    },
    {
        id: '4',
        name: 'Group Column',
        nodeType: 'middle',
        node: 'groupnode',
        sourceLimit: 1,
        isVisual: false,
        des: 'Group Data Sets based on the given Column Name',
        icon: <FullscreenExitOutlined />
    },
    {
        id: '5',
        name: 'Slice Data',
        nodeType: 'middle',
        node: 'slicenode',
        sourceLimit: 1,
        isVisual: false,
        des: 'Slice a Data Set based on the Indices',
        icon: <UngroupOutlined />
    },
    {
        id: '6',
        name: 'Sort Data',
        nodeType: 'middle',
        node: 'sortnode',
        sourceLimit: 1,
        isVisual: false,
        des: 'Sort Data Set on a given Column',
        icon: <SortAscendingOutlined />
    },
    {
        id: '7',
        name: 'Javascript Node',
        nodeType: 'middle',
        node: 'javascriptnode',
        sourceLimit: null,
        isVisual: false,
        des: 'The Most Powerful node ! Takes Two inputs(can be everything) and lets you transform it with Javascript',
        icon: <CodepenOutlined />
    },
    {
        id: '8',
        name: 'Bar Chart',
        nodeType: 'middle',
        node: 'barchartnode',
        sourceLimit: 1,
        isVisual: true,
        des: 'Display a Bar Chart of given X & Y Column Names',
        icon: <BarChartOutlined />
    },
    {
        id: '9',
        name: 'Scatter Chart',
        nodeType: 'middle',
        node: 'scatterchartnode',
        sourceLimit: 1,
        isVisual: true,
        des: 'Display a Scatter Plot of given X & Y Column Names',
        icon: <DotChartOutlined />
    },
    {
        id: '10',
        name: 'Histogram Chart',
        nodeType: 'middle',
        node: 'histogramchartnode',
        sourceLimit: 1,
        isVisual: true,
        des: 'Display a Histogram of given Column Name',
        icon: <AreaChartOutlined />

    },
    {
        id: '11',
        name: 'Time Series Chart',
        nodeType: 'middle',
        node: 'timeserieschartnode',
        sourceLimit: 1,
        isVisual: true,
        des: 'Display a Line Series Line Chart of given X & Y Column Names',
        icon: <LineChartOutlined />
    }
]

const fileTypeIcons = {
    pdf: require('../assets/thumbnails/pdf.png'),
    form: require('../assets/thumbnails/pdf.png'),
    audio: require('../assets/thumbnails/audio.png'),
    image: require('../assets/thumbnails/image-thumb.jpg'),
    table: require('../assets/thumbnails/excel.png'),
    xml: require('../assets/xml.png'),
    video: require('../assets/thumbnails/video.png')
}

export {
    COMPLETED,
    PROCESSING,
    FAILED,
    artifactTypes,
    uploadIcons,
    Icon_Blue_Color,
    googleClientId,
    facebookId,
    uploadProps,
    colorsList,
    countries,
    acceptTypes,
    fadeList,
    responsive,
    API_KEY,
    docImage,
    audioImage,
    drawerRoutes,
    graphNodescolor,
    uploadOptions,
    actionTypes,
    actions,
    actionTables,
    allRoles,
    adminRoutes,
    awsRegions,
    notificationEvents,
    acceptableTypes,
    backEndApi,
    blocks,
    fileTypeIcons
}