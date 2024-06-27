const User = require('../../model/user');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const jwtConfig = require('../../config/jwtConfig');
const bcrypt = require('bcryptjs');


// Generate a six-digit OTP
const generateOTP = () => {
    const digits = '0123456789';
    let OTP = '';
    for (let i = 0; i < 4; i++) {
        OTP += digits[Math.floor(Math.random() * 10)];
    }
    return OTP;
}

// Register User 
module.exports.Register_User = async (req, res) => {
    try {
        if (!req.body.name || !req.body.email || !req.body.password) {
            res.json({ success: false, message: 'Please Fill All The Field', data: [] })
        } else {
            let user = await User.create({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password
            })
            if (user) {
                const user_id = user.id
                let userData = { id: user_id, email: user.email };
                let token = jwt.sign(userData, jwtConfig.secret, { expiresIn: '365d' });
                user.isActive = true;
                last_login = new Date();
                const userUpadte = await User.update({
                    token: token
                }, {
                    where: {
                        id: user_id
                    }
                })
                let findUser = await User.findOne({
                    where: {
                        id: user_id
                    }
                })
                res.json({ success: true, message: "Wellcome to Todify", data: findUser })
            } else {
                res.json({ success: false, message: 'Registration Failed', data: [] })
            }
        }

    } catch (error) {
        res.status(500).json({ success: false, message: `Something Is Wrong. ${error}`, data: [] })
    }
}

// Login User 
module.exports.Login_User = async (req, res, next) => {
    try {
        passport.authenticate('user', async function (err, user, info) {
            if (err) {
                console.log(err);
                return res.json({ 'success': false, data: null, message: '', err });
            }

            // Generate a JSON response reflecting authentication status
            if (!user) {
                return res.json({ 'success': false, data: null, message: 'User not Found : ' + info });

            }

            req.login(user, loginErr => {

                if (loginErr) {
                    return res.json({ 'success': false, data: null, message: '' + loginErr.message });
                }
                let userData = { id: user.id, email: user.email };
                // expiresIn time
                let token = jwt.sign(userData, jwtConfig.secret, { expiresIn: '365d' });
                user.isActive = true;
                user.token = token;

                user.last_login = new Date();
                user.save();

                let data = {
                    token: token,
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    contact: user.contact,
                    provider: user.provider
                    //image: user.image,
                }
                return res.json({
                    data: data,
                    success: true,
                    message: "User Login Successfully"

                })

            });
        })(req, res, next);
    } catch (error) {
        res.status(500).json({ success: false, message: `Something Is Wrong. ${error}`, data: [] })
    }
}

//Forget Password
module.exports.forgetPassword = async (req, res) => {
    try {
        const { email } = req.body;

        // Check if user with given email exists
        const user = await User.findOne({ where: { email } });
        if (!user) {
            res.send({ success: false, message: 'User with this email does not exist' });
        }

        const options = {
            expiresIn: '2d',
            audience: process.env.AUDIENCE
        }

        // Generate OTP
        let resetOTP = generateOTP();

        // Update user with reset token
        await user.update({ verify_otp: resetOTP });
        user.verify_otp = resetOTP;
        user.save();
        return res.send({
            success: true,
            message: `Password Reset OTP has been sent ${resetOTP}`
        });

        // Send email here
        // const msg = {
        //     from: {
        //         email: 'email@gmail.com',
        //         name: 'Todify'
        //     },
        //     to: user.username, // list of receivers
        //     subject: 'Password Reset Request.', // Subject line
        //     html: `<table style="background-color:#eaeaea;border:0;border-collapse:collapse;border-spacing:0;box-sizing:inherit;font:inherit;font-family:Whitney-SSm-A,Whitney-SSm-B,Whitney,Helvetica Neue,Helvetica,Arial,sans-serif;font-size:100%;font-weight:300;line-height:100%;margin:0;padding:0;text-align:center;vertical-align:baseline;width:100%"><tbody style="border:0;box-sizing:inherit;font:inherit;font-size:100%;margin:0;padding:0;vertical-align:baseline"><tr style="border:0;box-sizing:inherit;font:inherit;font-size:100%;margin:0;padding:0;vertical-align:baseline"><td style="border:0;box-sizing:inherit;font:inherit;font-size:100%;height:20px;margin:0;padding:0;vertical-align:middle"></td></tr><tr style="border:0;box-sizing:inherit;font:inherit;font-size:100%;margin:0;padding:0;vertical-align:baseline"><td style="border:0;box-sizing:inherit;font:inherit;font-size:100%;margin:0;padding:0;vertical-align:top"><table style="background-color:#fff;border:0;border-collapse:collapse;border-color:#ddd;border-spacing:0;border-style:solid;border-width:1px;box-sizing:inherit;font:inherit;font-size:100%;margin:0 auto;max-width:680px;padding:0;text-align:center;vertical-align:baseline;width:100%"><tbody style="border:0;box-sizing:inherit;font:inherit;font-size:100%;margin:0;padding:0;vertical-align:baseline"><tr style="border:0;box-sizing:inherit;font:inherit;font-size:100%;margin:0;padding:0;vertical-align:baseline"><td style="border:0;border-bottom-color:#ddd;border-bottom-style:solid;border-bottom-width:1px;box-sizing:inherit;font:inherit;font-size:100%;margin:0;padding:0;vertical-align:middle" align="left"><div style="border:0;box-sizing:inherit;font:inherit;font-size:100%;margin:20px;padding:0;vertical-align:baseline"><img width="119" height="35" style="border:0;border-style:none;box-sizing:inherit;font:inherit;font-size:100%;margin:0;outline:none;padding:0;text-decoration:none;vertical-align:baseline" src="https://staging-admin.kptourism.com/uploads/admin/setting/1675077209.202-kpcta_logo_new.png" class="CToWUd" data-bit="iit"></div></td></tr><tr style="border:0;box-sizing:inherit;font:inherit;font-size:100%;margin:0;padding:0;vertical-align:baseline"><td style="border:0;box-sizing:inherit;font:inherit;font-size:100%;margin:0;padding:0;vertical-align:middle"><table style="border:0;border-collapse:collapse;border-spacing:0;box-sizing:inherit;display:inline-block;font:inherit;font-size:100%;margin:0;padding:10px 20px;text-align:center;vertical-align:baseline;width:unset"><tbody style="border:0;box-sizing:inherit;font:inherit;font-size:100%;margin:0;padding:0;vertical-align:baseline"><tr style="border:0;box-sizing:inherit;font:inherit;font-size:100%;margin:0;padding:0;vertical-align:baseline"><td style="border:0;box-sizing:inherit;font:inherit;font-size:100%;margin:0;padding:0;vertical-align:middle"><table style="border:0;border-collapse:collapse;border-spacing:0;box-sizing:inherit;font:inherit;font-size:100%;margin:0;max-width:558px;padding:0;text-align:center;vertical-align:baseline;width:100%"><tbody style="border:0;box-sizing:inherit;font:inherit;font-size:100%;margin:0;padding:0;vertical-align:baseline"><tr style="border:0;box-sizing:inherit;font:inherit;font-size:100%;margin:0;padding:0;vertical-align:baseline"><td style="border:0;box-sizing:inherit;font:inherit;font-size:100%;height:50px;margin:0;padding:0;vertical-align:middle" align="left"><p style="border:0;box-sizing:inherit;color:rgb(34,34,34);font:inherit;font-size:14px;font-weight:300;line-height:20px;margin:0;padding:0;vertical-align:baseline">Hi,</p></td></tr><tr style="border:0;box-sizing:inherit;font:inherit;font-size:100%;margin:0;padding:0;vertical-align:baseline"><td style="border:0;box-sizing:inherit;font:inherit;font-size:100%;height:50px;margin:0;padding:0;vertical-align:middle" align="left"><p style="border:0;box-sizing:inherit;color:rgb(34,34,34);font:inherit;font-size:14px;font-weight:300;line-height:20px;margin:0;padding:0;vertical-align:baseline">We have received a request to reset your password. If you did not make this request, please ignore this email.<br style="box-sizing:inherit"><br style="box-sizing:inherit">To reset your password, please use following OTP: <br style="box-sizing:inherit"></p></td></tr><tr style="border:0;box-sizing:inherit;font:inherit;font-size:100%;margin:0;padding:0;vertical-align:baseline"><td style="border:0;box-sizing:inherit;font:inherit;font-size:100%;height:100px;margin:0;padding:0;vertical-align:middle" align="center"><b>` + resetOTP + `</b></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table><table style="border:0;border-collapse:collapse;border-spacing:0;box-sizing:inherit;display:inline-block;font:inherit;font-size:100%;margin:0;margin-bottom:20px;margin-top:15px;padding:0;text-align:center;vertical-align:baseline;width:unset"><tbody style="border:0;box-sizing:inherit;font:inherit;font-size:100%;margin:0;padding:0;vertical-align:baseline"><tr style="border:0;box-sizing:inherit;font:inherit;font-size:100%;margin:0;padding:0;vertical-align:baseline"><td style="border:0;box-sizing:inherit;font:inherit;font-size:100%;margin:0;padding:0;vertical-align:middle"><p style="border:0;box-sizing:inherit;color:#555;font:inherit;font-size:12px;font-weight:normal;margin:0;padding:0;padding-bottom:3px;vertical-align:baseline">This system email was sent to ` + user.name + ` (<a href="mailto:` + user.username + `" target="_blank">` + user.username + `</a>) regarding your Todify Account</p></td></tr></tbody></table></td></tr></tbody></table>`,
        // }
        // await sgMail
        //     .send(msg)
        //     .then(async (data) => {
        //         user.verify_otp = resetOTP
        //         user.save();

        //         return res.send({
        //             success: true,
        //             message: 'Password Reset OTP has been sent to your email.'
        //         });
        //     })
        //     .catch((error) => {
        //         return res.send({ success: false, message: 'Someting went wrong. Please try again!' });
        //     })

    } catch (error) {
        console.log(error)
        return res.send({ success: false, message: 'Internal server error' });
    }
}

// verify OTP
module.exports.verifyOTP = async (req, res) => {
    let { otp } = req.body;

    if (otp == undefined || otp == '') {
        return res.send({ success: false, message: 'OTP Required.' });
    }
    let findUser = await User.findOne({
        where: {
            verify_otp: otp
        }
    });
    if (findUser) {
        return res.send({ success: true, message: 'OTP Verified..!' });
    } else {
        return res.send({
            success: false,
            message: 'Invalid OTP'
        })
    }
}