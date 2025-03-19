const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

exports.handler = async function (event, context) {
  try {
    console.log("Incoming Event:", event); // Debugging

    if (!event.body) {
      console.error("Missing request body");
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Request body is missing" }),
      };
    }

    const { email } = JSON.parse(event.body);

    if (!email) {
      console.error("Email field missing");
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Email is required" }),
      };
    }

    const { data, error } = await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",  
      to: [email],  
      subject: "Hello World",  
      html: "<strong>It works!</strong>",
    });

    if (error) {
      console.error("Resend API Error:", error);
      return {
        statusCode: 500,
        body: JSON.stringify({ error }),
      };
    }

    console.log("Email sent successfully:", data);

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, data }),
    };
  } catch (error) {
    console.error("Unexpected Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to send email", details: error.message }),
    };
  }
};
