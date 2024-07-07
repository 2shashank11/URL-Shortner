const jwt = require('jsonwebtoken')
const secretKey = "shashank@211"

// const sessionIdtoUserMap = new Map()

// function setUser(id, user) {
//     sessionIdtoUserMap.set(id, user)
// }

function setUser(user){
    return jwt.sign(
        {
            _id: user._id,
            email: user.email,
            role: user.role,
        }, 
        secretKey
    )
}

function getUser(token) {
    // return sessionIdtoUserMap.get(id)
    if (!token) return null
    try {
        return jwt.verify(token, secretKey)
    } catch (error) {
        return null
    }

}

module.exports = {
    setUser,
    getUser,
}

