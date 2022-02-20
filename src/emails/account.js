const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: "parmvir.shergill@gmail.com",
        subject: "Welcome To The Task Manager",
        html: `Hello <strong>${name}</strong>, Let me know how you are getting along with the app`
    })
}

const sendLeavingEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: "parmvir.shergill@gmail.com",
        subject: "Sorry To See You Leave",
        html: `Hello <strong>${name}</strong>, please provide feedback to improve the app`
    })
}


module.exports = {
    sendWelcomeEmail,
    sendLeavingEmail
}