import { Daemon } from "./daemons";

const matchers: Record<Daemon, string> = {
  nitpicker: "reasoning",
  superfan: "I don't know",
  someguy: "Todd",
};

export const getMatcher = (daemon: Daemon) => {
  return matchers[daemon];
};

export const getSample = async (
  daemon: Daemon,
  request: Request
): Promise<string | null> => {
  const matcher = getMatcher(daemon);
  if (matcher) {
    const body = await request.json();
    const text = body?.text;
    if (typeof text === "string") {
      if (text.toLowerCase().includes(matcher.toLowerCase())) {
        return matcher;
      }
    }
  }

  return null;
};

export const formatResponse = (
  daemon: Daemon,
  matcher: string,
  comment: string
) => {
  return new Response(
    JSON.stringify({
      result: {
        id: new Date().getTime(),
        type: daemon,
        comment,
        matcher,
        createdAt: new Date().toISOString(),
      },
    }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};
