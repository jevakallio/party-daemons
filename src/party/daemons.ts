const daemons = {
  nitpicker: "Nitpicker",
  superfan: "Supporter",
  someguy: "Todd",
};

const prompts = {
  nitpicker: (input: string) => `
    You are a nit-picker. Write a short, obnoxious, nit-picky, one-sentence rebuttal to the phrase "LLMs are capable of ${input}", starting with the words "Well, actually"
  `,
  superfan: (input: string) => `
    You are a supportive friend. Write a short, supportive, cheering, one-sentence statement to the phrase "${input}", starting with the words "Hey, buddy!"
  `,
  someguy: (_input: string) => `
    Your name is Todd, and you're a frat guy from a 2000s college comedy film. Please say a short, irrelevant bro-ey statement that's friendly and wholesome, but also annoying and dumb.
  `,
};

const colors = {
  nitpicker: "#f87171",
  superfan: "#38bdf8",
  someguy: "#ffa452",
};

export type Daemon = keyof typeof daemons;

export const getPrompt = (daemon: Daemon, input: string) => {
  return prompts[daemon](input);
};

export const getDaemons = () => {
  return Object.keys(daemons) as Daemon[];
};

export const getName = (daemon: Daemon) => {
  return daemons[daemon];
};

export const getColor = (daemon: Daemon) => {
  return colors[daemon];
};
