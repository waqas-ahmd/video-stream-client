import { useState } from "react";
import Stream from "./components/Stream";
import View from "./components/View";
import { styles } from "./styles";

function App() {
  const [page, setPage] = useState(null);

  if (page === "stream") {
    return <Stream home={() => setPage(null)} />;
  }
  if (page === "view") {
    return <View home={() => setPage(null)} />;
  }
  return (
    <div style={styles.screen}>
      <button onClick={() => setPage("stream")} style={styles.button}>
        STREAM
      </button>
      <button onClick={() => setPage("view")} style={styles.button}>
        VIEW
      </button>
    </div>
  );
}

export default App;
