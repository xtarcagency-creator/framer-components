import * as React from "react"
import { createRoot } from "react-dom/client"
import WipeReveal from "./WipeReveal"

function App() {
    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 40 }}>
            <div style={{ height: "100vh", display: "flex", alignItems: "center", color: "#888" }}>
                Scroll down
            </div>
            <div style={{ display: "flex", gap: 24, flexWrap: "wrap", justifyContent: "center" }}>
                <WipeReveal direction="left" />
                <WipeReveal direction="right" />
                <WipeReveal direction="top" />
                <WipeReveal direction="bottom" />
            </div>
            <div style={{ height: "100vh" }} />
        </div>
    )
}

createRoot(document.getElementById("root")!).render(<App />)
