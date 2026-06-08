import type { Rarity } from "../../common";
import FRAMES_DATA from "./frames.json";

export type Frame = {
    id: string,
    name: string,
    rarity: Rarity,

    category: string,
    source: string,
    sourceLink: string,

    releaseDate: string,
}

export const FRAMES = () => FRAMES_DATA as Frame[];

export function getAllPropertyValues(property: keyof Frame) {
    const values = new Set<string>();
    FRAMES().forEach(frame =>
        frame?.[property] ? values.add(frame[property]) : null
    );

    return Array.from(values);
}