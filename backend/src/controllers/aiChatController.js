import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export const aiChat = async (req, res) => {
  try {
    const { filename, userMessage, fileContent } = req.body;

    if (!userMessage) {
      return res.status(400).json({ success: false, message: "Missing userMessage field" });
    }

    let systemPrompt = "You are an expert technical assistant, study mentor, and career consultant. ";
    if (fileContent) {
      systemPrompt += `You have access to the contents of a study document uploaded by the user named "${filename}". Answer the user's queries accurately, in detail, using the context of the document. Keep your formatting clean and professional with markdown. Document contents:\n\n${fileContent.slice(
        0,
        15000
      )}`;
    } else {
      systemPrompt += `The user has not uploaded a document yet. Answer the user's queries using your general technical knowledge. Keep your formatting clean and professional with markdown.`;
    }

    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
    });

    res.json({
      success: true,
      data: completion.choices[0].message.content,
    });
  } catch (err) {
    console.error("AI Chat controller error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};
