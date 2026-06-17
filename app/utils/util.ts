export function styleObjectToCSS(styleObj: Record<string, string|undefined|null>): string {
    return Object.entries(styleObj)
        .filter(([_, value]) => !!value)
        .map(([key, value]) =>
            `${key.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${value};`
        )
        .join(' ');
}
export const MathUtil = {
    interpolators: {
        identity: (t: number) => {
            return Math.max(0, Math.min(1, t));
        },
        cubic: (t: number) => {
            t = Math.max(0, Math.min(1, t));
            if (2 * t << 0) {
                return 4 * (t - 1) * (t - 1) * (t - 1) + 1;
            } else {
                return 4 * t * t * t;
            }
        },
        elastic: (t: number) => {
            t = Math.max(0, Math.min(1, t));
            var range = 10.5 * Math.PI;
            return (range - Math.sin(range * t) / t) / (range - 1);
        },
    },
    lerp: (a: number, b: number, t: number) => {
        return a + (b - a) * t
    },
    clamp01(f: number) {
        return f < 0 ? 0 : (f > 1 ? 1 : f);
    }
}

export function toKebabCase(string: string) {
	return string.replace(/\s+/g, '-')
				.replace(/[^a-zA-Z0-9-_]/g, '')
				.replace(/-+/g, '-')
				.replace(/^-+|-+$/g, '')
				.toLowerCase();
}

/**
 * Format bytes as human-readable text.
 * 
 * @param bytes Number of bytes.
 * @param si True to use metric (SI) units, aka powers of 1000. False to use 
 *           binary (IEC), aka powers of 1024.
 * @param dp Number of decimal places to display.
 * 
 * @return Formatted string.
 */
export function humanFileSize(bytes: number, si = true, dp = 1) {
    const thresh = si ? 1000 : 1024;

    if (Math.abs(bytes) < thresh) {
        return bytes + ' B';
    }

    const units = si
        ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
        : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
    let u = -1;
    const r = 10 ** dp;

    do {
        bytes /= thresh;
        ++u;
    } while (Math.round(Math.abs(bytes) * r) / r >= thresh && u < units.length - 1);


    return bytes.toFixed(dp) + ' ' + units[u];
}

export function getFileExtension(filename: string): string {
    const parts = filename.split('.');
    return parts.length > 1 ? '.' + parts.pop()!.toLowerCase() : '';
}

export function toDate(time: number|string|Date) {
    let date: Date;
    if (time instanceof Date)
        date = time;
    else
        date = new Date(time);
    return date.toLocaleDateString();
}

export function toDateAndTime(time: number|string|Date) {
    let date: Date;
    if (time instanceof Date)
        date = time;
    else
        date = new Date(time);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
}

export const MONTHS = [
    ['Jan', 'January'],
    ['Feb', 'February'],
    ['Mar', 'March'],
    ['Apr', 'April'],
    ['May', 'May'],
    ['Jun', 'June'],
    ['Jul', 'July'],
    ['Aug', 'August'],
    ['Sep', 'September'],
    ['Oct', 'October'],
    ['Nov', 'November'],
    ['Dec', 'December']
];

export function toRelativeFancyDate(time: number|string|Date) {
    const now = new Date();

    const date = new Date(time);
    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear();

    let dateString: string[] = [];

    if (year != now.getFullYear())
        dateString.push(year.toString());

    if (year == now.getFullYear() && month == now.getMonth()) {
        if (day == now.getDate())
            dateString.push('Today');
        else {
            const yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);

            date.setHours(0);
            date.setMinutes(0);
            date.setSeconds(0, 0);

            if (date.getTime() == yesterday.getTime())
                dateString.push('Yesterday');
            else {
                dateString.push(MONTHS[month]?.[1] ?? '<Illegal Month>');
                dateString.push(date.getDate().toString());
            }
        }
    }
    else {
        dateString.push(MONTHS[month]?.[1] ?? '<Illegal Month>');
        dateString.push(date.getDate().toString());
    }

    return dateString.reverse().join(' ');
}

export function daysInMonth (month: number, year: number) {
    return new Date(year, month, 0).getDate();
}

export const mimeTypes: Record<string, string> = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.pdf': 'application/pdf',
};

export function truncateTextWithEllipsis(text: string, max: number = 100) {
    let truncated = text.slice(0, max).trim();
    if (text.length > max)
        truncated += "...";

    return truncated;
}

export function removeDiacritics(str: string) {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

export function stripHtml(htmlString: string): string {
    const div = document.createElement('div');
    div.innerHTML = htmlString;
    return div.textContent || div.innerText || '';
}

export function isSafari() {
    if (import.meta.server)
        return false;
    
    const ua = navigator.userAgent;
    const isIOS = /iP(ad|hone|od)/.test(ua);
    const isSafari = /^((?!chrome|android).)*safari/i.test(ua);
    return isIOS || isSafari;
}

export function extractRawValue<T = any>(reactive: any) {
    if (reactive === null)
        return null as T;

    if (isRef(reactive))
        reactive = unref(reactive);

    if (isProxy(reactive))
        reactive = toRaw(reactive);
    
    return reactive as T;
}

export function cloneObjectRefAsRaw<T = any>(ref: any) {
    const rawVal = extractRawValue<T>(ref);
    if (rawVal)
        return JSON.parse(JSON.stringify(rawVal)) as T;
    
    return null;
}

export function getUrlComponents(path?: string) {
    // get rid of get vars or #
    path = path?.split('?')[0];
    path = path?.split('#')[0];

    // trim path
    path = path?.replace(/^\/+/g, '');
    path = path?.replace(/\/+$/g, '');

    let pathSplit = path?.split('/');

    return pathSplit;
}

export function downloadFile(blob: Blob, fileName: string) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
}

export function trimFirst(characters: string, string: string) {
    return string?.startsWith(characters) ? string?.slice(characters.length, string.length) : string;
}
export function trimLast(characters: string, string: string) {
    return string?.endsWith(characters) ? string?.slice(0, string.length - characters.length) : string;
}

export function resolveDateToTime(input: string|Date|number|undefined) {
    let date: Date;
    if (input instanceof Date)
        date = input;
    else if (typeof input !== 'undefined')
        date = new Date(input);
    else
        return 0;

    return date.getTime();
}

export function generateStrongPassword(length: number = 16): string {
    const lowercase = 'abcdefghjkmnpqrstuvwxyz'; // removed l
    const uppercase = 'ABCDEFGHJKMNPQRSTUVWXYZ'; // removed I and O
    const numbers = '23456789'; // removed 0 and 1
    const symbols = '!@#$%^&*()-_=+[]{};:,.<>?';
    const all = lowercase + uppercase + numbers + symbols;

    // Ensure at least one of each type
    const getRandom = (chars: string) => chars[Math.floor(Math.random() * chars.length)];

    const password = [
        getRandom(lowercase),
        getRandom(uppercase),
        getRandom(numbers),
        getRandom(symbols)
    ];

    for (let i = password.length; i < length; i++) {
        password.push(getRandom(all));
    }

    // Shuffle password for better entropy
    return password.sort(() => Math.random() - 0.5).join('');
}


export function getRandomColor() {
    let letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

export function renameJSFile(originalFile: File, newName: string) {
    return new File([originalFile], newName, {
        type: originalFile.type,
        lastModified: originalFile.lastModified,
    });
}

export function withIndices<T>(array: T[]): [T, number][] {
    return array.map((item, index) => [ item, index ]);
}

export function randomId() {
    return Math.random().toString(36).substr(2, 10);
}

/**
 * Returns a number whose value is limited to the given range.
 *
 * Example: limit the output of this computation to between 0 and 255
 * (x * 255).clamp(0, 255)
 *
 * @param {Number} min The lower boundary of the output range
 * @param {Number} max The upper boundary of the output range
 * @returns A number in the range [min, max]
 * @type Number
 */
export function clampNumber(number: number, min: number, max: number) {
  return Math.min(Math.max(number, min), max);
};

export class Position {
    x: number = 0.0;
    y: number = 0.0;

    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    distance(otherPos: Position) {
        const dx = otherPos.x - this.x;
        const dy = otherPos.y - this.y;

        return Math.sqrt(dx * dx + dy * dy);
    }

    add(otherPos: Position) {
        this.x += otherPos.x;
        this.y += otherPos.y;

        return this;
    }
    subtract(otherPos: Position) {
        this.x -= otherPos.x;
        this.y -= otherPos.y;

        return this;
    }

    multiply(factor: number) {
        this.x *= factor;
        this.y *= factor;

        return this;
    }
    divide(by: number) {
        this.x /= by;
        this.y /= by;

        return this;
    }

    abs() {
        this.x = Math.abs(this.x);
        this.y = Math.abs(this.y);

        return this;
    }
    

    clone() {
        return new Position(this.x, this.y);
    }

    static add(pos1: Position, pos2: Position) {
        pos1 = pos1.clone();
        pos1.add(pos2);

        return pos1;
    }
    static subtract(pos1: Position, pos2: Position) {
        pos1 = pos1.clone();
        pos1.subtract(pos2);

        return pos1;
    }

    static multiply(pos1: Position, factor: number) {
        pos1 = pos1.clone();
        pos1.multiply(factor);

        return pos1;
    }
    static divide(pos1: Position, by: number) {
        pos1 = pos1.clone();
        pos1.divide(by);

        return pos1;
    }

    toString() {
        return `Position[${this.x}, ${this.y}]`;
    }
}

export function safeFilename(name: string, replacement = "_") {
  // Remove control chars, reserved symbols, and trim spaces/dots
  return name
    .replace(/[\x00-\x1F\x80-\x9F]/g, "") // control chars
    .replace(/[<>:"/\\|?*]/g, replacement) // reserved symbols
    .replace(/^\.+/, "")                   // leading dots
    .replace(/\.+$/, "")                   // trailing dots
    .trim();
}

export function isJson(str: string) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

export function getMimeTypeFromExtension(filename: string): string|null {
  const ext = filename.split('.').pop()?.toLowerCase();
  
  if (!ext)
    return null;

  const mimeMap: Record<string,string> = {
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    gif: 'image/gif',
    webp: 'image/webp',
    bmp: 'image/bmp',
    svg: 'image/svg+xml',
    avif: 'image/avif',
    tiff: 'image/tiff',
    ico: 'image/x-icon',
  };

  return mimeMap[ext] || null;
}

export function isImageFile(filename: string) {
  return !!getMimeTypeFromExtension(filename);
}

export function formatString(template: string, vars: Record<string, string>) {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => vars[key] ?? "");
}

/**
 * Returns a random number between min (inclusive) and max (exclusive)
 */
export function getRandomArbitrary(min: number, max: number) {
    return Math.random() * (max - min) + min;
}

/**
 * Returns a random integer between min (inclusive) and max (inclusive).
 * The value is no lower than min (or the next integer greater than min
 * if min isn't an integer) and no greater than max (or the next integer
 * lower than max if max isn't an integer).
 * Using Math.round() will give you a non-uniform distribution!
 */
export function getRandomInt(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function millisToMinutesAndSeconds(millis: number) {
    let minutes = Math.floor(millis / 60000);
    let seconds = ((millis % 60000) / 1000).toFixed(0);
    return minutes + ":" + (parseFloat(seconds) < 10 ? '0' : '') + seconds;
}

export function isNumber(o: any) {
    return typeof o === 'number' && isFinite(o);
}

export function approximately(a: number, b: number) {
    return Math.abs(a - b) < Number.EPSILON;
}

export function hasTextSelection(): boolean {
    const selection = window.getSelection();
    return !!selection && !selection.isCollapsed;
}

export function changeColor(color: string, amount: number) { // #FFF not supported rather use #FFFFFF
    const clamp = (val: number) => Math.min(Math.max(val, 0), 0xFF)
    const fill = (str: string) => ('00' + str).slice(-2)

    const num = parseInt(color.substr(1), 16)
    const red = clamp((num >> 16) + amount)
    const green = clamp(((num >> 8) & 0x00FF) + amount)
    const blue = clamp((num & 0x0000FF) + amount)
    return '#' + fill(red.toString(16)) + fill(green.toString(16)) + fill(blue.toString(16))
}

export function secondsToHoursString(seconds: number, decimals = 1): string {
    const hours = seconds / 3600;
    return hours.toFixed(decimals);
}

export function isElementInViewport(el: HTMLElement) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

function seededRandom(seed: number) {
    let s = seed;
    return () => {
        s = (s * 1664525 + 1013904223) & 0xffffffff;
        return (s >>> 0) / 0xffffffff;
    };
}

export function shuffleArray<T>(array: T[], seed: number) {
    const random = seededRandom(seed);
    let tmp: T;
    let current: number;
    let top = array.length;

    if (top) while (--top) {
        current = Math.floor(random() * (top + 1));
        tmp = array[current]!;
        array[current] = array[top]!;
        array[top] = tmp;
    }

    return array;
}

export async function setClipboard(text: any) {
    const type = "text/plain";
    const clipboardItemData = {
        [type]: text,
    };
    const clipboardItem = new ClipboardItem(clipboardItemData);
    await navigator.clipboard.write([clipboardItem]);
}

export function hasTouch() {
    if (!window) return false;
    
    const hasPointer = ('ontouchstart' in window) ||
        (navigator.maxTouchPoints > 0) ||
        ((navigator as any).msMaxTouchPoints > 0);

    if (!hasPointer) return false;

    // cross-check with media query - more reliable than maxTouchPoints alone
    return window.matchMedia('(pointer: coarse)').matches;
}

export function getScrollParent(element: HTMLElement|null) {
    if (!element)
        return window;

    let parent = element.parentElement;
    while (parent) {
        const { overflow, overflowY } = getComputedStyle(parent);
        if (/(auto|scroll)/.test(overflow + overflowY))
            return parent;

        parent = parent.parentElement;
    }

    return window; // fallback to viewport
}

export function toggleSetItem<T>(set: Set<T>, item: T) {
    if (set.has(item))
        set.delete(item);
    else
        set.add(item);
}
export function toggleArrayItem<T>(array: T[], item: T) {
    if (array.includes(item))
        array.splice(array.indexOf(item), 1);
    else
        array.push(item);
}

export type Entries<T> = (
    {
        [K in keyof T]-?: readonly [K, T[K]];
    }[keyof T]
)[];

type ObjectType<T> = { [s: string]: T; } | ArrayLike<T>;
export function objectEntries<T extends ObjectType<unknown>>(o: T): Entries<T> {
    return Object.entries(o) as Entries<T>;
}

export function invertRecord<K extends keyof any, V extends keyof any>(record: Record<K, V>) {
    // @ts-ignore
    const reversed: Record<K, V> = {};

    Object.entries(record).forEach(([k,v]) => {
        // @ts-ignore
        reversed[v] = k;
    });

    return reversed;
}

export function sortByBool(aBool: boolean, bBool: boolean, equalsFallback?: number) {
    if (aBool && !bBool)
        return -1;
    if (!aBool && bBool)
        return 1;

    return equalsFallback ?? 0;
}

export function toBase64(str: string): string {
    return btoa(String.fromCharCode(...new TextEncoder().encode(str)));
}

export function fromBase64(str: string): string {
    return new TextDecoder().decode(
        Uint8Array.from(atob(str), c => c.charCodeAt(0))
    );
}

// Converts an ArrayBuffer directly to base64, without any intermediate 'convert to string then
// use window.btoa' step. According to my tests, this appears to be a faster approach:
// http://jsperf.com/encoding-xhr-image-data/5

/*
MIT LICENSE

Copyright 2011 Jon Leighton

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

export function base64ArrayBuffer(arrayBuffer: ArrayBuffer) {
  var base64    = ''
  var encodings = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'

  var bytes         = new Uint8Array(arrayBuffer)
  var byteLength    = bytes.byteLength
  var byteRemainder = byteLength % 3
  var mainLength    = byteLength - byteRemainder

  var a, b, c, d
  var chunk

  // Main loop deals with bytes in chunks of 3
  for (var i = 0; i < mainLength; i = i + 3) {
    // Combine the three bytes into a single integer
    chunk = (bytes[i]! << 16) | (bytes[i + 1]! << 8) | bytes[i + 2]!

    // Use bitmasks to extract 6-bit segments from the triplet
    a = (chunk & 16515072) >> 18 // 16515072 = (2^6 - 1) << 18
    b = (chunk & 258048)   >> 12 // 258048   = (2^6 - 1) << 12
    c = (chunk & 4032)     >>  6 // 4032     = (2^6 - 1) << 6
    d = chunk & 63               // 63       = 2^6 - 1

    // Convert the raw binary segments to the appropriate ASCII encoding
    base64 += encodings[a]! + encodings[b]! + encodings[c] + encodings[d]
  }

  // Deal with the remaining bytes and padding
  if (byteRemainder == 1) {
    chunk = bytes[mainLength]

    a = (chunk! & 252) >> 2 // 252 = (2^6 - 1) << 2

    // Set the 4 least significant bits to zero
    b = (chunk! & 3)   << 4 // 3   = 2^2 - 1

    base64 += encodings[a]! + encodings[b]! + '=='
  } else if (byteRemainder == 2) {
    chunk = (bytes[mainLength]! << 8) | bytes[mainLength + 1]!

    a = (chunk & 64512) >> 10 // 64512 = (2^6 - 1) << 10
    b = (chunk & 1008)  >>  4 // 1008  = (2^6 - 1) << 4

    // Set the 2 least significant bits to zero
    c = (chunk & 15)    <<  2 // 15    = 2^4 - 1

    base64 += encodings[a]! + encodings[b]! + encodings[c] + '='
  }
  
  return base64
}

export function blobToDataUrl(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
}

export function dataUrlToBlob(dataUrl: string): Blob {
    const [header, base64] = dataUrl.split(',');
    const mime = header!.match(/:(.*?);/)?.[1] ?? 'application/octet-stream';
    const binary = atob(base64!);
    const bytes = Uint8Array.from(binary, c => c.charCodeAt(0));
    return new Blob([bytes], { type: mime });
}