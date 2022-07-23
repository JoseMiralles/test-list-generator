import React, { useEffect, useState } from 'react';
import "./reset.css";
import "./app.css";
import Generator from './Generator';

function App() {

  const [csvString, setCsvString] = useState("");

  useEffect(() => {
    (async () => {
      const csv_text = await fetch("/problems.csv").then(r => r.text());
      setCsvString(csv_text);
    })();
  }, []);

  const totals = {
    hard: "test"
  };

  return (
    <div className="App">
      {csvString ? <Generator csvString={csvString}/> : <p>"Loading..."</p>}
    </div>
  );
}

export default App;
