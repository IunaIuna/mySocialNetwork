function reducer(oldState = {}, action) {
    if (action.type == "UPDATE:BIO") {
        const newState = {
            ...oldState,
            user: {
                ...state.user,
                bio: action.bio
            }
        };
        return newState;
    }
    if (action.type == "SHOW_BIO_EDITOR_TEXTAREA") {
        return {
            ...oldState,
            bioEditorTextareaIsVisbile: true
        };
    }
    return oldState;
    //If I dont do anything else I receive the old object
}
