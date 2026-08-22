import { useState } from 'react'
import Presentation from "./components/Presentation.tsx"
import "./App.css"
import Main from "./components/Main.tsx"
import LanguageProvider from "./Translations.tsx"

export default function App() {
    return (
        <LanguageProvider>
            <div className="app">
                <Main/>
            </div>
        </LanguageProvider>
    );
}

