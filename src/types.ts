export type Songbook = {
    name: string,
    settings: SongbookSettings | null,
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

export const Page = {
    Presentation: "p",
    SongbookList: "l",
    Start: "s",
} as const;
export type Page = typeof Page[keyof typeof Page];
