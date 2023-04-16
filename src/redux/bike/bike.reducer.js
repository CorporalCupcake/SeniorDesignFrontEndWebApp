const INITIAL_STATE = {
    user: null
};

const authReducer = (store = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'SET_USER':
            return {
                ...store,
                user: action.payload
            }
        case "CLEAR_USER":
            return {
                ...store,
                user: null
            }
        default:
            return store
    }
}

export default authReducer;