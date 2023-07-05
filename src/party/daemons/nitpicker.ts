import { PartyKitServer } from "partykit/server";

export default {
  async onRequest(request: Request, room) {
    const body = await request.text();
    return new Response("Nit: " + body, { status: 200 });
  },
} satisfies PartyKitServer;
