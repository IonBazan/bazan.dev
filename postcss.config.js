import purgeCSSPlugin from '@fullhuman/postcss-purgecss';

const purgecss = purgeCSSPlugin({
    content: ["./hugo_stats.json"],
    defaultExtractor: (content) => {
        const els = JSON.parse(content).htmlElements;
        return [...(els.tags || []), ...(els.classes || []), ...(els.ids || [])];
    },
    safelist: [],
});

// This site is light-only. Bulma ships an automatic dark theme via
// `@media (prefers-color-scheme: dark)`; strip those blocks so dark mode is
// never applied (and isn't shipped at all), regardless of the visitor's OS.
const stripDarkScheme = () => ({
    postcssPlugin: "strip-prefers-color-scheme-dark",
    AtRule: {
        media(atRule) {
            if (/prefers-color-scheme\s*:\s*dark/i.test(atRule.params)) {
                atRule.remove();
            }
        },
    },
});
stripDarkScheme.postcss = true;

export default {
    plugins: [
        stripDarkScheme(),
        ...(process.env.HUGO_ENVIRONMENT === "production" ? [purgecss] : []),
    ],
};
