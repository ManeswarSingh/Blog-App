const jwt = require('jsonwebtoken')
const secret = "abcd"

function createTokenForUser(user){
    const payload = {
        _id : user._id,
        email : user.email,
        userProfile : user.userProfile,
        role : user.role
    }

    const token = jwt.sign(payload,secret)
    return token;

}

function validateToken(token){
    const payload = jwt.verify(token,secret)
    return payload;

}

module.exports = {createTokenForUser,validateToken}