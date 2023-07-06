import { Configuration, OpenAIApi } from "openai-edge";

// @ts-expect-error process not defined
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

export async function getChatCompletionResponse(prompt: string) {
  const openai = new OpenAIApi(
    new Configuration({
      apiKey: OPENAI_API_KEY,
    })
  );

  const openaiResponse = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    stream: false,
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  const openaiResult = await openaiResponse.json();
  if (openaiResult) {
    const comment = openaiResult.choices[0]?.message?.content;
    return comment;
  }

  return null;
}
