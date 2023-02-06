import User from '../models/UserModel.js'
import generateToken from '../utils/generateToken.js'

/**
 * @method POST
 * @body {businessName, email, password}
 * @description: A Endpoint to create User Account
 * @access: Public
 */

const createUser = async (req, res) => {
  const { businessName, email, password } = req.body

  //Check if the User Already Exists
  const userExist = await User.findOne({ email: email })
  console.log('userexist', userExist)
  if (userExist) {
    throw new Error(
      'Account already exist. Please login to continue Usinf Recallo ',
    )
  }

  //Save User To Database

  try {
    const user = await User.create({
      businessName,
      email,
      password,
    })

    res.status(200).json({
      status: 'success',
      user: {
        _id: user._id,
        businessName: user.businessName,
        email: user.email,
      },
    })
  } catch (err) {
    console.log(err)
    res.status(401).json({
      status: 'fail',
      error: err.message,
    })
  }
}

/**
 * @method POST
 * @body {email, password}
 * @description: A Endpoint to login existing user account
 * @access: Public
 */
const loginUser = async (req, res) => {
  const { email, password } = req.body

  // if (!email || !password) {
  //   res.status(401)
  //   throw new Error('Please provide email and password to login. ')
  // }

  //Check if the account already exists
  try {
    const user = await User.findOne({ email: email })
    if (!user) {
      res.status(401)
      throw new Error(
        `Account doesn't exist. Please register to continue using Recallo`,
      )
    }

    //Verify the user password and sign token
    if (user && (await user.MatchPassword(password))) {
      res.status(200).json({
        status: 'success',
        user: {
          token: await generateToken(user._id),
          _id: user._id,
          email: user.email,
          role: user.role,
        },
      })
    } else {
      res.status(402)
      throw new Error('Invalid login details. Please try again. ')
    }
  } catch (err) {
    console.log(err)
    res.status(401).json({
      status: 'failed',
      error: err.message,
    })
  }
}

export { createUser, loginUser }
