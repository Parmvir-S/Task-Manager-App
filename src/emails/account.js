const sgMail = require("@sendgrid/mail");

//put api key in env
//sgMail.setApiKey(sendgridAPIKey);

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