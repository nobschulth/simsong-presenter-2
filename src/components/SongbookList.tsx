import { useLanguage } from "../Translations.tsx"
import type { Songbook } from "../types.ts"
import { FaRegPaste } from "react-icons/fa6";
import styles from "./SongbookList.module.css"
import "../common.css"

export default function SongbookList(props: { 
        songbook: Songbook, 
        onSongSelected: (index: number) => void,
        onBackPressed: () => void,
        onAddPressed: (text: string) => void }) {

    const { t } = useLanguage();

    async function onAddPressed() {
        try {
            const text = await navigator.clipboard.readText();
            props.onAddPressed(text);
        } catch (error) {
            console.error("Could not read clipboard text ", error);
        }
    }

    function onDownloadPressed() {
        const json = JSON.stringify(props.songbook, null, 2);
        const blob = new Blob([json], { type: "application/json" })

        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = props.songbook.name ? props.songbook.name : "Songbook"
        link.click();

        URL.revokeObjectURL(url);
    }

    return (
        <div className={styles.topContainer}>
        <div className={styles.scrollWrap}>
            <div className={styles.scrollShadow}>
                <div className={styles.container}>
                    {props.songbook.songs.map((song, index) => (
                        <SongSelectButton key={index} text={song.title} id={index} onSongSelected={props.onSongSelected}/>
                    ))}
                </div>
                <div className={`${styles.addButton} commonBox`} onClick={onAddPressed}>
                    <FaRegPaste className={styles.icon}/>
                </div>
                <div style={{height:"7vh"}}></div>
            </div>
        </div>
        <div className={styles.bottomPanel}>
            <div onClick={props.onBackPressed} className={`${styles.bottomButton} commonBox`}>
                {t.exit}
            </div>
            <div className={`${styles.bottomButton} commonBox`} onClick={onDownloadPressed}>{t.download}</div>
        </div>
        </div>
    );
}

function SongSelectButton(props: { text: string, id: number, onSongSelected: (index: number) => void }) {
    return (
        <div onClick={() => props.onSongSelected(props.id)} className={styles.songSelectButton}>{props.text}</div>
    )
}

