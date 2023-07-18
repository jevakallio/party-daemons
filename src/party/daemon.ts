import { PartyKitRoom, PartyKitServer } from "partykit/server";
import { formatResponse, getSample } from "./matchers";
import { getChatCompletionResponse } from "./openai";
import differenceInSeconds from "date-fns/differenceInSeconds";
import { Daemon, getPrompt } from "./daemons";

const lastRuns = new WeakMap<PartyKitRoom, Date | null>();

export default {
  async onRequest(request, room) {
    try {
      const daemon = room.id as Daemon;

      const sample = await getSample(daemon, request);
      if (!sample) {
        return empty();
      }

      const lastRun = lastRuns.get(room);

      if (lastRun && differenceInSeconds(new Date(), lastRun) < 60) {
        // only run once per minute max
        console.log(`${daemon} is still cooling down after last execution...`);
        return empty();
      } else {
        // keep track of last execution
        console.log(`${daemon} is executing...`);
        lastRuns.set(room, new Date());
      }

      const comment = await getChatCompletionResponse(
        getPrompt(daemon, sample)
      );

      if (comment) {
        return formatResponse(daemon, sample, comment);
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
