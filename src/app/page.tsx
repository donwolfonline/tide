"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import styles from "./page.module.css";

const SUGGESTIONS = [
    "tide search engine",
    "tide ocean discovery",
    "how tides work",
    "tide predictions today",
    "tide pools near me",
    "high tide low tide",
    "tide charts 2026",
    "lunar tide cycles",
    "tide surfing conditions",
    "king tide phenomenon",
];

export default function Home() {
    const [query, setQuery] = useState("");
    const [focused, setFocused] = useState(false);
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const inputRef = useRef<HTMLInputElement>(null);

    // Filter suggestions
    useEffect(() => {
        if (query.trim().length === 0) {
            setSuggestions([]);
            setSelectedIndex(-1);
            return;
        }
        const filtered = SUGGESTIONS.filter((s) =>
            s.toLowerCase().includes(query.toLowerCase())
        ).slice(0, 8);
        setSuggestions(filtered);
        setSelectedIndex(-1);
    }, [query]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "ArrowDown") {
            e.preventDefault();
            setSelectedIndex((i) => Math.min(i + 1, suggestions.length - 1));
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setSelectedIndex((i) => Math.max(i - 1, -1));
        } else if (e.key === "Enter") {
            const searchTerm = selectedIndex >= 0 ? suggestions[selectedIndex] : query;
            if (searchTerm.trim()) {
                window.open(`https://www.google.com/search?q=${encodeURIComponent(searchTerm)}`, "_blank");
                setSuggestions([]);
            }
        } else if (e.key === "Escape") {
            setSuggestions([]);
            inputRef.current?.blur();
        }
    };

    const handleSearch = () => {
        if (query.trim()) {
            window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, "_blank");
            setSuggestions([]);
        }
    };

    const handleSuggestionClick = (s: string) => {
        setQuery(s);
        setSuggestions([]);
        window.open(`https://www.google.com/search?q=${encodeURIComponent(s)}`, "_blank");
    };

    return (
        <div className={styles.page}>
            {/* Nav */}
            <nav className={styles.nav}>
                <div className={styles.navLinks}>
                    <a href="#" className={styles.navLink}>Web</a>
                    <a href="#" className={styles.navLink}>Images</a>
                    <a href="#" className={styles.navLink}>News</a>
                    <a href="#" className={styles.navLink}>Maps</a>
                </div>
                <div className={styles.navRight}>
                    <button className={styles.signInBtn}>Sign In</button>
                </div>
            </nav>

            {/* Main content */}
            <main className={styles.main}>
                {/* Logo */}
                <div className={styles.logoWrap}>
                    <Image
                        src="/tide-logo.png"
                        alt="Tide"
                        width={320}
                        height={100}
                        priority
                        className={styles.logo}
                    />
                </div>

                {/* Tagline */}
                <p className={styles.tagline}>Search the world&apos;s information</p>

                {/* Search box */}
                <div className={styles.searchContainer}>
                    <div className={`${styles.searchBox} ${focused ? styles.searchBoxFocused : ""}`}>
                        {/* Search icon */}
                        <svg className={styles.searchIcon} viewBox="0 0 24 24" fill="none" aria-hidden="true">
                            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
                            <path d="M16.5 16.5l4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>

                        <input
                            ref={inputRef}
                            id="tide-search-input"
                            type="text"
                            className={styles.searchInput}
                            placeholder="Search with Tide…"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onFocus={() => setFocused(true)}
                            onBlur={() => setTimeout(() => setFocused(false), 150)}
                            onKeyDown={handleKeyDown}
                            autoComplete="off"
                            aria-label="Search"
                            aria-autocomplete="list"
                        />

                        {/* Clear button */}
                        {query && (
                            <button
                                className={styles.clearBtn}
                                onClick={() => { setQuery(""); setSuggestions([]); inputRef.current?.focus(); }}
                                aria-label="Clear search"
                            >
                                <svg viewBox="0 0 24 24" fill="none" width="20" height="20">
                                    <path d="M6 6l12 12M6 18L18 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                </svg>
                            </button>
                        )}

                        {/* Voice icon */}
                        <div className={styles.divider} aria-hidden="true" />
                        <button className={styles.voiceBtn} aria-label="Search by voice">
                            <svg viewBox="0 0 24 24" fill="none" width="22" height="22">
                                <rect x="9" y="2" width="6" height="12" rx="3" stroke="currentColor" strokeWidth="2" />
                                <path d="M5 10a7 7 0 0014 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                <line x1="12" y1="19" x2="12" y2="22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                        </button>
                    </div>

                    {/* Suggestions dropdown */}
                    {focused && suggestions.length > 0 && (
                        <div className={styles.suggestions} role="listbox">
                            {suggestions.map((s, i) => (
                                <div
                                    key={s}
                                    role="option"
                                    aria-selected={i === selectedIndex}
                                    className={`${styles.suggestion} ${i === selectedIndex ? styles.suggestionActive : ""}`}
                                    onMouseDown={() => handleSuggestionClick(s)}
                                >
                                    <svg className={styles.suggestionIcon} viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                        <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.5" />
                                        <path d="M16.5 16.5l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                    </svg>
                                    <span>
                                        {s.split(new RegExp(`(${query})`, "i")).map((part, j) =>
                                            part.toLowerCase() === query.toLowerCase()
                                                ? <strong key={j}>{part}</strong>
                                                : <span key={j}>{part}</span>
                                        )}
                                    </span>
                                    <svg className={styles.suggestionArrow} viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                        <path d="M7 17L17 7M17 7H7M17 7v10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* CTA Buttons */}
                <div className={styles.ctaRow}>
                    <button className={styles.ctaBtn} onClick={handleSearch}>
                        Tide Search
                    </button>
                    <button className={styles.ctaBtn} onClick={() => {
                        const random = SUGGESTIONS[Math.floor(Math.random() * SUGGESTIONS.length)];
                        window.open(`https://www.google.com/search?q=${encodeURIComponent(random)}`, "_blank");
                    }}>
                        I&apos;m Feeling Tidal
                    </button>
                </div>
            </main>

            {/* Footer */}
            <footer className={styles.footer}>
                <div className={styles.footerBottom}>
                    <div className={styles.footerLeft}>
                        <a href="#" className={styles.footerLink}>About Tide</a>
                        <a href="#" className={styles.footerLink}>Advertising</a>
                        <a href="#" className={styles.footerLink}>Business</a>
                        <a href="#" className={styles.footerLink}>Global</a>
                    </div>
                    <div className={styles.footerRight}>
                        <a href="#" className={styles.footerLink}>Privacy</a>
                        <a href="#" className={styles.footerLink}>Terms</a>
                        <a href="#" className={styles.footerLink}>Settings</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
