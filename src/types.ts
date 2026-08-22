export type Songbook = {
    name: string,
    settings: SongbookSettings,
    songs: Song[],
}

export type SongbookSettings = {
    showImage: boolean,
    showTitle: boolean,
}

export type Song = {
    title: string,
    credits: string,
    pages: SongPage[],
}

export type SongPage = {
    name: string,
    text: string,
}

export enum Page {
    Presentation,
    SongbookList,
    Start,
    SongbookEdit,
}
