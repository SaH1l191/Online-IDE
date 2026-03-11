import Groq from "groq-sdk";

const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Only send last 20 lines
function trimContext(code: string, lines = 20): string {
  return code.split("\n").slice(-lines).join("\n");
}

export async function POST(req: Request) {
  try {
    const { code, language } = await req.json();
    const context = trimContext(code);

    const response = await client.chat.completions.create({
      model: "llama-3.1-8b-instant",
      max_tokens: 60, 
      messages: [
        {
          role: "system",
          content: "You are a code autocomplete engine. Return ONLY the next completion — no explanation, no markdown, no backticks, no repeated code.",
        },
        {
          role: "user",
          content: `Language: ${language}\n\nComplete the code from where it ends:\n\n${context}`,
        }
      ],
      temperature: 0.1,  
      stop: ["\n\n", "```"],  
    });

    const completion = response.choices[0]?.message?.content?.trim() ?? "";
    return Response.json({ completion });
  } catch (err: any) {
    console.error("Autocomplete error:", err?.message);
    return Response.json({ completion: "" }, { status: 500 });
  }
}