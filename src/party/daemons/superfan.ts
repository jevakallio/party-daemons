import { PartyKitServer } from "partykit/server";
import { formatResponse, getSample } from "../matchers";
import { getChatCompletionResponse } from "../openai";

const DAEMON = "superfan";

export default {
  async onRequest(request: Request) {
    try {
      console.log("Executing daemon", DAEMON);
      const sample = await getSample(DAEMON, request);

      if (sample) {
        const comment = await getChatCompletionResponse(`
          You are a supportive friend. Write a short, supportive, cheering, one-sentence statement to the phrase "${sample}", starting with the words "Hey, buddy!"
        `);

        if (comment) {
          return formatResponse(DAEMON, sample, comment);
        }
      }
    } catch (e) {
      console.error("Failed to execute daemon", e);
    }

    return new Response(JSON.stringify({ result: null }), { status: 200 });
  },
} satisfies PartyKitServer;
