import Groq from "groq-sdk";

export default async function handler(req, res) {
  // CORS configuration
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,PATCH,DELETE,POST,PUT");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method Not Allowed" });
  }

  try {
    const { filename, userMessage, fileContent } = req.body;

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      throw new Error("GROQ_API_KEY is not defined in Vercel environment variables.");
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

    const groq = new Groq({ apiKey });
    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
    });

    res.status(200).json({
      success: true,
      data: completion.choices[0].message.content,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
}
