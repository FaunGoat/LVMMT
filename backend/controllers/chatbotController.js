const sessionClient = require("../config/dialogflow");

exports.sendMessage = async (req, res) => {
  const { message, sessionId = "12345" } = req.body;

  if (!message) return res.status(400).json({ error: "Tin nhắn trống" });

  try {
    const sessionPath = sessionClient.projectAgentSessionPath(
      process.env.DIALOGFLOW_PROJECT_ID,
      sessionId
    );

    const request = {
      session: sessionPath,
      queryInput: {
        text: { text: message, languageCode: "vi" },
      },
    };

    const [response] = await sessionClient.detectIntent(request);
    const reply = response.queryResult.fulfillmentText || "Tôi chưa hiểu.";

    res.json({ reply });
  } catch (error) {
    console.error("Dialogflow Error:", error);
    res.status(500).json({ error: "Lỗi chatbot" });
  }
};
