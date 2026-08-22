import { getLangID, useLanguage } from "../Translations.tsx"
import Tabbar from "./common/tabbar.tsx"
import styles from "./Start.module.css"
import "../common.css"
import FileDialog from "./common/filedialog.tsx"

export default function Start(props: { onFileSelect: (file: File) => void, onSongbookCreated: () => void }) {
    const langState = useLanguage();
    const { t } = langState;

    function onLanguageSelected(id: number) {
        if (!langState.setLanguage) return;
        switch (id) {
            case 0:
                langState.setLanguage("en");
                break;
            case 1:
                langState.setLanguage("de");
                break;
        
            default:
                break;
        }
    }

    return (
        <div className={styles.container}>
            <div className={styles.title}>Simsong Presenter</div>
            <div className={`${styles.songbookButton} commonBox`}>
                <FileDialog infoText={t.select} onFileSelect={props.onFileSelect}/>
            </div>
            <div className={`${styles.songbookButton} commonBox`} onClick={props.onSongbookCreated}><p>{t.new}</p></div>
            <div className={styles.tabbar}>
                <Tabbar default={getLangID(langState.language)} items={["en", "de"]} onSelected={onLanguageSelected}/>
            </div>
        </div>
    );

}
