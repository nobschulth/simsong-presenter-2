import { useLanguage } from "../Translations.tsx"
import { useEffect, useState } from "react";
import styles from "./Main.module.css"
import SongbookList from "./SongbookList.tsx"
import Presentation from "./Presentation.tsx"
import Start from "./Start.tsx"
import * as types from "../types.ts"

export default function Main() {
    const { t } = useLanguage();
    const [currentPage, setCurrentPage] = useState<types.Page>(types.Page.Start);
    const [isFullscreen, setIsFullscreen] = useState(false);
    useEffect(() => {
        const update = () => {
            setIsFullscreen(document.fullscreenElement !== null);
        };

        document.addEventListener("fullscreenchange", update);

        return () => {
            document.removeEventListener("fullscreenchange", update);
        };
    }, []);

    const [songbook, setSongbook] = useState<types.Songbook | null>((): types.Songbook | null => {
        let stored = localStorage.getItem("songbook");

        if (stored == null) { return null; }

        const json = JSON.parse(stored) as types.Songbook;
        if (json) {
            setCurrentPage(types.Page.SongbookList);
            return json;
        }
        return null;
    });

    const [songIndex, setSongIndex] = useState<number>(0);

    function onSongbookCreated() {
        const newSongbook: types.Songbook = {
            songs: [],
            name: "",
            settings: null,
        }
        setSongbook(newSongbook);
        localStorage.setItem("songbook", JSON.stringify(newSongbook));
        setCurrentPage(types.Page.SongbookList);
    }

    function onSongSelected(index: number) {
        if (!songbook || index >= songbook.songs.length) return;
        setSongIndex(index);
        setCurrentPage(types.Page.Presentation);
    }

    async function onFileSelect(file: File) {
        const content = await file.text();
        const data = JSON.parse(content) as types.Songbook;
        localStorage.setItem("songbook", content); 
        setSongbook(data);
        setCurrentPage(types.Page.SongbookList);
    }

    function onPresentationBackPressed() {
        setCurrentPage(types.Page.SongbookList);
    }

    function onSongbookListBackPressed() {
        setCurrentPage(types.Page.Start);
        localStorage.removeItem("songbook");
        setSongbook(null);
    }

    function onSongbookListAddPressed(text: string) {
        if (!songbook) return;
        const song = parseSong(text);
        if (!song) return;
        const newSongbook: types.Songbook = {
            ...songbook,
            songs: [...songbook.songs, song],
        };
        localStorage.setItem("songbook", JSON.stringify(newSongbook)); 
        setSongbook(newSongbook);
    }


    let page: React.ReactNode;
    switch (currentPage) {
        case types.Page.Start:
            page = <Start onFileSelect={onFileSelect} onSongbookCreated={onSongbookCreated}/>;
            break;
        case types.Page.Presentation:
            if (!songbook) {
                setCurrentPage(types.Page.Start);
                break;
            }
            page = <Presentation song={songbook.songs[songIndex]} onBackPressed={onPresentationBackPressed}/>;
            break;
        case types.Page.SongbookList:
            if (!songbook) {
                setCurrentPage(types.Page.Start);
                break;
            }
            page = <SongbookList 
                    songbook={songbook} 
                    onSongSelected={onSongSelected} 
                    onBackPressed={onSongbookListBackPressed} 
                    onAddPressed={onSongbookListAddPressed}/>;
            break;
        default:
            break;
    }

    let fullscreenPrompt: React.ReactNode;

    if (!isFullscreen){
        fullscreenPrompt = (
            <div className={styles.fullscreenPrompt} onClick={enterFullscreen}>
                {t.fullscreenPrompt}
            </div>
        );
    }

    return (
        <div className={styles.overlay} >
                {page}
                {fullscreenPrompt}
        </div>
    );
}

const enterFullscreen = async () => {
    await document.documentElement.requestFullscreen();
};

function parseSong(text: string) {
    const song: types.Song = {
        title: "",
        credits: "",
        pages: [],
    };
    if (!text) { console.error("Can't parse Song due to empty text!"); return null; }
    const blocks = text.split("\n\n");
    for (let i = 0; i < blocks.length; i++) {
        const lines = blocks[i].split("\n");
        if (!song.title) {
            song.title = lines[0].trim();
            continue;
        }
        //assuming no verses have the © symbol
        if (blocks[i].includes("©")) {
            song.credits = blocks[i].trim();
            break;
        }
        
        const name = lines[0].trim();
        const songpage: types.SongPage = {
            name: name,
            text: blocks[i].slice(name.length),
        };
        song.pages.push(songpage);
    }
    if (song.pages.length > 0 &&
        song.title &&
        song.credits
       ) 
    return song;
    return null;
}
