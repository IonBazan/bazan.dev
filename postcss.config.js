import purgeCSSPlugin from '@fullhuman/postcss-purgecss';

const purgecss = purgeCSSPlugin({
    content: ["./hugo_stats.json"],
    defaultExtractor: (content) => {
        const els = JSON.parse(content).htmlElements;
        return [...(els.tags || []), ...(els.classes || []), ...(els.ids || [])];
    },
    // hugo_stats.json only tracks tags/classes/ids — Hugo's build stats don't
    // capture attributes at all — so PurgeCSS's extractor can never see the
    // `data-theme` attribute Bulma uses for its light/dark theme scoping.
    // `dynamicAttributes` tells PurgeCSS to always keep any selector on this
    // attribute regardless of what the extractor observed, which is exactly
    // what it's designed for (see purgecss.com/configuration.html#dynamic-attributes).
    dynamicAttributes: ["data-theme"],
    safelist: [],
});

export default {
    plugins: [
        ...(process.env.HUGO_ENVIRONMENT === "production" ? [purgecss] : []),
    ],
};
