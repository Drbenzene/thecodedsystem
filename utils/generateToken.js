import JWT from "jsonwebtoken";

const generateToken = async (id) => {
    return await JWT.sign({ id }, process.env.JWTSECRET, { expiresIn: '2hrs' })
}

export default generateToken