import { useLanguage } from "../Translations.tsx"
import { useState } from "react";
import type { Song } from "../types.ts"
import Tabbar from "./common/tabbar.tsx"
import styles from "./Presentation.module.css"
import "../common.css"

export default function Presentation(props: { song: Song, onBackPressed: () => void }) {
    const { t } = useLanguage();
    const [tabbarSelected, setTabbarSelected] = useState(0);
    const pageNames = []
    props.song.pages.map((page) => {
        pageNames.push(page.name);
    });
    return (
        <div className={styles.flexContainer}>
            <div className={styles.song}>
                <Tabbar selected={tabbarSelected} onSelected={setTabbarSelected} items={pageNames}/>
                <div className={styles.songTextWrap}>
                <div className={styles.songText}>
                    {props.song.pages[tabbarSelected].text}
                </div>
                </div>
                <div className={styles.songCredits}>
                    {props.song.credits}
                </div>
            </div>
            <div className={styles.sideImage}>
                <img src="/assets/p1.png" className={styles.sideImage}/>
                <div className={styles.sideTitle}>
                    {props.song.title}
                </div>
                <div className={`commonBox ${styles.sideBack}`} onClick={props.onBackPressed}>
                {t.back}
                </div>
            </div>
        </div>
    );
}

function tabbarOnSelected(id: number) {
    setTabbarSelected(id);
}
