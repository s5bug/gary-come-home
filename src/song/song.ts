export type Song = {
    title: string,
    audio?: string,
    copyright: string,
    lyrics: Lyrics
}

export type Lyrics = {
    verses: Verse[]
}

export type Verse = {
    lines: Line[]
}

export type Line = {
    words: Word[]
}

export type Word = {
    syllables: Syllable[]
}

export type Syllable = {
    begin: number,
    content: string,
    end?: number
}
