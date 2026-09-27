import * as React from "react"
import { createRoot } from "react-dom/client"
import ImageCardStack from "./ImageCardStack"

function App() {
    return (
        <ImageCardStack
            loop={false}
            onSwipe={(index, direction) => console.log("swiped", index, direction)}
            onEmpty={() => console.log("empty!")}
        />
    )
}

createRoot(document.getElementById("root")!).render(<App />)
