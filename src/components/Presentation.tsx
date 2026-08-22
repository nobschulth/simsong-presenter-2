import { useLanguage } from "../Translations.tsx"
import { useState } from "react";
import type { Song } from "../types.ts"
import Tabbar from "./common/tabbar.tsx"
import styles from "./Presentation.module.css"
import "../common.css"

export default function Presentation(props: { song: Song, onBackPressed: () => void }) {
    const { t } = useLanguage();
    const [tabbarSelected, setTabbarSelected] = useState(0);
    const pageNames: string[] = [];
    props.song.pages.map((page) => {
        pageNames.push(page.name);
    });

    function tabbarOnSelected(id: number) {
        setTabbarSelected(id);
    }
     
    return (
        <div className={styles.flexContainer}>
            <div className={styles.song}>
                <Tabbar default={tabbarSelected} onSelected={tabbarOnSelected} items={pageNames}/>
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
                <img src={`${import.meta.env.BASE_URL}assets/image.png`} className={styles.sideImage}/>
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

