import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { terminalDefaultOptions, type TerminalOptions, ScrollbackSizes, DensityModes, TimestampModes } from "./xtermOptions";


/**
 * Storage Factory
 */
const createValidatedStorage = <T>(validator: (value: unknown) => T, defaultValue: T) => {
    return {
        getItem: (key: string): T => {
            const storedValue = localStorage.getItem(key);
            if (!storedValue) return defaultValue;
            try {
                const parsedValue = JSON.parse(storedValue);
                return validator(parsedValue);
            } catch (error) {
                return defaultValue;
            }
        },
        setItem: (key: string, value: T): void => {
            const validatedValue = validator(value);
            localStorage.setItem(key, JSON.stringify(validatedValue));
        },
        removeItem: (key: string): void => {
            localStorage.removeItem(key);
        },
    };
};


/**
 * Validation
 */
const validateTerminalOptions = (options: unknown): TerminalOptions => {
    const defaultOpts = terminalDefaultOptions;

    // If not an object or null, return defaults
    if (!options || typeof options !== 'object') {
        return defaultOpts;
    }

    const typedOptions = options as Partial<TerminalOptions>;
    const validatedOptions: TerminalOptions = {
        density: defaultOpts.density,
        scrollback: defaultOpts.scrollback,
        timestamp: defaultOpts.timestamp,
        copyTimestamp: defaultOpts.copyTimestamp,
        copyChannel: defaultOpts.copyChannel,
    };

    // Validate density
    if (
        typeof typedOptions.density === 'string' &&
        Object.keys(DensityModes).includes(typedOptions.density)
    ) {
        validatedOptions.density = typedOptions.density;
    }

    // Validate scrollback
    if (
        typeof typedOptions.scrollback === 'number' &&
        Object.values(ScrollbackSizes).includes(typedOptions.scrollback)
    ) {
        validatedOptions.scrollback = typedOptions.scrollback;
    }

    // Validate timestamp
    if (
        typeof typedOptions.timestamp === 'string' &&
        Object.keys(TimestampModes).includes(typedOptions.timestamp)
    ) {
        validatedOptions.timestamp = typedOptions.timestamp;
    }

    // Validate copyTimestamp & copyChannel
    if (typeof typedOptions.copyTimestamp === 'boolean') {
        validatedOptions.copyTimestamp = typedOptions.copyTimestamp;
    }
    if (typeof typedOptions.copyChannel === 'boolean') {
        validatedOptions.copyChannel = typedOptions.copyChannel;
    }

    return validatedOptions;
};

const validateStringArray = (value: unknown): string[] => {
    if (!Array.isArray(value)) return [];
    return value.filter((item): item is string => typeof item === 'string');
};


/**
 * Atoms
 */
const terminalOptionsAtom = atomWithStorage<TerminalOptions>(
    'liveConsoleOptions',
    terminalDefaultOptions,
    createValidatedStorage(validateTerminalOptions, terminalDefaultOptions)
);

const liveConsoleHistoryAtom = atomWithStorage<string[]>(
    'liveConsoleCommandHistory',
    [],
    createValidatedStorage(validateStringArray, [])
);

const liveConsoleBookmarksAtom = atomWithStorage<string[]>(
    'liveConsoleCommandBookmarks',
    [],
    createValidatedStorage(validateStringArray, [])
);

const historyMaxLength = 50;


/**
 * Hooks
 */
export const useTerminalOptions = () => {
    const [options, setOptions] = useAtom(terminalOptionsAtom);
    return {
        options,
        updateOptions: (newOptions: Partial<TerminalOptions>) => {
            setOptions(prev => ({ ...prev, ...newOptions }));
        }
    };
};

export const useLiveConsoleHistory = () => {
    const [history, setHistory] = useAtom(liveConsoleHistoryAtom);
    return {
        history,
        setHistory,
        appendHistory: (cmd: string) => {
            const newHistory = history.filter((h) => h !== cmd);
            if (newHistory.unshift(cmd) > historyMaxLength) newHistory.pop();
            setHistory(newHistory);
        },
        wipeHistory: () => {
            setHistory([]);
        }
    };
};

export const useLiveConsoleBookmarks = () => {
    const [bookmarks, setBookmarks] = useAtom(liveConsoleBookmarksAtom);
    return {
        bookmarks,
        addBookmark: (cmd: string) => {
            if (!bookmarks.includes(cmd)) {
                setBookmarks([cmd, ...bookmarks]);
            }
        },
        removeBookmark: (cmd: string) => {
            setBookmarks(bookmarks.filter((b) => b !== cmd));
        }
    };
}
