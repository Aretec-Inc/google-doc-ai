const host = 'https://context-api-2my7afm7yq-ue.a.run.app'
// const host = 'https://backend.neptunestech.com:8008'
const api = `${host}/api`

const bookmarks_api = `${api}/bookmarks`

const BOOKMARKS_APIS = {
  POST: {
    BOOKMARKS_ADD_BOOKMARK: `${bookmarks_api}/add_bookmark`,
    BOOKMARKS_BY_USERID: `${bookmarks_api}/by_userId`,
    BOOKMARKS_REMOVE_BOOKMARK: `${bookmarks_api}/remove_bookmark`,
    BOOKMARKS_BY_USERID_AND_ARTIFACTID: `${bookmarks_api}/by_userId_and_artifactId`
  }
}

export default BOOKMARKS_APIS