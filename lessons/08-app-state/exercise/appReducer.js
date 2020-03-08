const initialState = { authAttempted: false, auth: null, user: null, fetchingUser: false }

const appStateReducer = (state, action) => {
  switch (action.type) {
    case "AUTH_CHANGE": {
      return { ...state, auth: action.auth, authAttempted: true }
    }
    case "FETCH_USER": {
      return { ...state, fetchingUser: true }
    }
    case "FETCH_USER_SUCCEEDED": {
      return { ...state, fetchingUser: false, user: action.payload }
    }
    default:
      return state
  }
}

export { initialState }
export default appStateReducer
