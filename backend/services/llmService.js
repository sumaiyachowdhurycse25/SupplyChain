const OpenAI = require("openai");
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function askLLM(question, data, systemPrompt) {
  const messages = [];

  // System prompt (optional)
  if (typeof systemPrompt === "string" && systemPrompt.trim() !== "") {
    messages.push({
      role: "system",
      content: systemPrompt,
    });
  }

  // User question (required)
  if (typeof question !== "string" || question.trim() === "") {
    throw new Error("askLLM: question must be a non-empty string");
  }

  let userContent = `Question:\n${question}`;

  // Attach data ONLY if present
  if (data !== undefined && data !== null) {
    userContent += `\n\nData:\n${JSON.stringify(data, null, 2)}`;
  }

  messages.push({
    role: "user",
    content: userContent,
  });

  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages,
    temperature: 0.2,
  });

  return response.choices[0].message.content;
}

module.exports = { askLLM };
