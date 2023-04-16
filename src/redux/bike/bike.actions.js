

/** Structure of USER Object

BAND: {S: "admin"}
EMAIL: {S: "b00085065@aus.edu"}
FULL_NAME: {S: "ameen ayub"}
PASSWORD: {S: "450853c01ee1fe1db4dec358f1b6e9ff"}
*/

export const signInAction = user => ({
    type: 'SET_USER',
    payload: user
})


export const signOutAction = () => ({
    type: 'CLEAR_USER'
})