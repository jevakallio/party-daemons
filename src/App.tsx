import { Daemons } from "./Daemons";
import { Editor } from "./Editor";

function App() {
  return (
    <main className="flex w-full bg-gray-100 justify-center">
      <section className="w-40 p-4 hidden md:block"></section>
      <section className="flex-1 max-w-xl bg-white md:mx-8 px-6 py-4 rounded">
        <Editor />
      </section>
      <section className="w-40 p-4 hidden md:block">
        <Daemons />
      </section>
    </main>
  );
}

export default App;
