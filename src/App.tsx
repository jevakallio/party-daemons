import { Daemons } from "./Daemons";
import { Editor } from "./Editor";
import { useActiveDaemon } from "./store";

function App() {
  const activeDaemon = useActiveDaemon((s) => s.activeDaemon);
  const focusedDaemon = useActiveDaemon((s) => s.focusedDaemon);
  const focusedDaemonClassName = focusedDaemon ? `focus-${focusedDaemon}` : "";
  return (
    <main className="flex w-full bg-gray-100 justify-center">
      <section className="p-4 hidden md:block"></section>
      <section
        className={`flex-1 max-w-xl bg-white md:mx-8 px-6 py-4 rounded ${focusedDaemonClassName}`}
      >
        <Editor />
      </section>
      <section className="w-52 p-4 hidden md:flex">
        <Daemons activeDaemon={activeDaemon} />
      </section>
    </main>
  );
}

export default App;
