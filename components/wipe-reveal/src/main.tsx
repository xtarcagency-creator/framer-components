import * as React from "react"
import { createRoot } from "react-dom/client"
import WipeReveal from "./WipeReveal"

function App() {
    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, paddingTop: 80 }}>
            <p style={{ color: "#888" }}>Press and drag across the panel to scratch it away</p>
            <WipeReveal onReveal={() => console.log("revealed!")} />
        </div>
    )
}

createRoot(document.getElementById("root")!).render(<App />)
