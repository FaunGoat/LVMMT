const { SessionsClient } = require("@google-cloud/dialogflow");
require("dotenv").config();

const projectId = process.env.DIALOGFLOW_PROJECT_ID;
const clientEmail = process.env.DIALOGFLOW_CLIENT_EMAIL;
const privateKey = process.env.DIALOGFLOW_PRIVATE_KEY.replace(/\\n/g, "\n") // Chuyển \n thành xuống dòng thật
  .replace(/^"|"$/g, ""); // Xóa dấu " ở đầu và cuối (nếu có)

const sessionClient = new SessionsClient({
  projectId,
  credentials: {
    client_email: clientEmail,
    private_key: privateKey,
  },
});

module.exports = sessionClient;
