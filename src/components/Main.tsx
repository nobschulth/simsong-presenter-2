import { useState } from "react";
import SongbookList from "./SongbookList.tsx"
import * as fs from "fs"
import Presentation from "./Presentation.tsx"
import Start from "./Start.tsx"
import * as types from "../types.ts"

export default function Main() {
    const [currentPage, setCurrentPage] = useState<types.Page>(types.Page.Start);
    const [songbook, setSongbook] = useState<types.Songbook>(() => {
        let stored = localStorage.getItem("songbook");

        if (stored == null) { return null; }

        const json = JSON.parse(stored) as types.Songbook;
        if (json && json != "") {
            setCurrentPage(types.Page.SongbookList);
            return json;
        }

    });
    const [songIndex, setSongIndex] = useState<number>(0);

    function onSongbookCreated() {
        const newSongbook: Songbook = {
            songs: []
        }
        setSongbook(newSongbook);
        localStorage.setItem("songbook", newSongbook);
        setCurrentPage(types.Page.SongbookList);
    }

    function onSongSelected(index: number) {
        if (index >= songbook.songs.length) return;
        console.log(index);
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
        const song = parseSong(text);
        if (song) {
            setSongbook({
                ...songbook,
                songs: [...songbook.songs, song],
            });
            localStorage.setItem("songbook", JSON.stringify(songbook)); 
        }
    }

    switch (currentPage) {
        case types.Page.Start:
            return (<Start onFileSelect={onFileSelect} onSongbookCreated={onSongbookCreated}/>);
        case types.Page.Presentation:
            return (<Presentation song={songbook.songs[songIndex]} onBackPressed={onPresentationBackPressed}/>);
        case types.Page.SongbookList:
            return (<SongbookList 
                    songbook={songbook} 
                    onSongSelected={onSongSelected} 
                    onBackPressed={onSongbookListBackPressed} 
                    onAddPressed={onSongbookListAddPressed}/>);
        default:
            break;
    }
}

function parseSong(text: string) {
    const song: types.Song = {};
    song.pages = []
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
        
        const songpage: types.Songpage = {};
        songpage.name = lines[0].trim();
        songpage.text = blocks[i].slice(songpage.name.length);
        song.pages.push(songpage);
    }
    if (song.pages.length > 0 &&
        song.title &&
        song.credits
       ) 
    return song;
    return null;
}
