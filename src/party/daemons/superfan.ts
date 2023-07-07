import { PartyKitServer } from "partykit/server";
import { formatResponse, getSample } from "../matchers";
import { getChatCompletionResponse } from "../openai";
import differenceInSeconds from "date-fns/differenceInSeconds";

const DAEMON = "superfan";

let lastRun: Date | null = null;

export default {
  async onRequest(request: Request) {
    try {
      const sample = await getSample(DAEMON, request);
      if (!sample) {
        return empty();
      }

      // only run once per minute max
      if (lastRun && differenceInSeconds(new Date(), lastRun) < 60) {
        console.log("Still cooling down after last execution...");
        return empty();
      }

      // keep track of last execution
      lastRun = new Date();

      const comment = await getChatCompletionResponse(`
        You are a supportive friend. Write a short, supportive, cheering, one-sentence statement to the phrase "${sample}", starting with the words "Hey, buddy!"
      `);

      if (comment) {
        return formatResponse(DAEMON, sample, comment);
      }
    } catch (e) {
      console.error("Failed to execute daemon", e);
    }

    return empty();
  },
} satisfies PartyKitServer;

function empty() {
  return new Response(JSON.stringify({ result: null }), { status: 200 });
}
