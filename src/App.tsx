import { Daemons } from "./Daemons";
import { Editor } from "./Editor";

function App() {
  return (
    <main className="flex space-x-8 w-full">
      <section className="flex-1 max-w-3xl">
        <Editor />
      </section>
      <section>
        <Daemons />
      </section>
    </main>
  );
}

export default App;
