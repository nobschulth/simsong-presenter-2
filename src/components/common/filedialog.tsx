import { useRef } from "react"
import styles from "./filedialog.module.css"
import "../../common.css"

export default function FileDialog(props: { infoText: string, onFileSelect: (file: File) => void }) {
    const inputRef = useRef<HTMLInputElement>(null);

    function setFile(file: File | undefined) {
        if (!file) return;
        props.onFileSelect(file);
    }

    function onClick() {
        inputRef.current?.click();
    }

    return (
        <div style={{height:"100%"}}>
        <div 
            className={`${styles.textDiv} commonBox`}
            onClick={onClick}>
            <p> {props.infoText} </p>
        </div>
        <input
            ref={inputRef}
            type="file"
            style={{display:"none"}}
            accept=".json"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setFile(e.target.files?.[0]); } }
            />
        </div>
    );
}
