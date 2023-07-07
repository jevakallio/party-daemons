import { PartyKitServer } from "partykit/server";
import { formatResponse, getSample } from "../matchers";
import { getChatCompletionResponse } from "../openai";
import differenceInSeconds from "date-fns/differenceInSeconds";

const DAEMON = "nitpicker";

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
        You are a nit-picker. Write a short, obnoxious, nit-picky, one-sentence rebuttal to the phrase "LLMs are capable of ${sample}", starting with the words "Well, actually"
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
