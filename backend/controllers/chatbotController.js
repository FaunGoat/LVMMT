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

    // Lấy payload từ webhook response (nếu có)
    const payload =
      response.queryResult.webhookPayload?.fields?.data?.structValue;

    res.json({
      reply,
      payload: payload ? convertStructToJSON(payload) : null,
    });
  } catch (error) {
    console.error("Dialogflow Error:", error);
    res.status(500).json({ error: "Lỗi chatbot" });
  }
};

// Helper function để convert Struct sang JSON
function convertStructToJSON(struct) {
  if (!struct || !struct.fields) return null;

  const result = {};
  for (const [key, value] of Object.entries(struct.fields)) {
    result[key] = convertValueToJSON(value);
  }
  return result;
}

function convertValueToJSON(value) {
  if (value.nullValue !== undefined) return null;
  if (value.numberValue !== undefined) return value.numberValue;
  if (value.stringValue !== undefined) return value.stringValue;
  if (value.boolValue !== undefined) return value.boolValue;
  if (value.structValue) return convertStructToJSON(value.structValue);
  if (value.listValue) {
    return value.listValue.values.map((v) => convertValueToJSON(v));
  }
  return null;
}
