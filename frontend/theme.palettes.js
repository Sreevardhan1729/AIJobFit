// The two palettes of the paper-and-ink design, read by tailwind.config.js and the contrast test.
// Green, yellow and red are only ever skill marks: have, close and missing.
module.exports = {
  light: {
    paper: "#F5F5F2",
    sheet: "#FFFFFF",
    ink: "#1C1C1F",
    ink2: "#45464D",
    rule: "#DCDBD5",
    ruleSoft: "#E6E5E0",
    have: "#C8EDB9",
    close: "#FBE38A",
    miss: "#C8412B",
    missText: "#A8321F",
    missSoft: "#F6D3CB",
    scrim: "#1C1C1F", // dims the page behind a modal
  },
  // Warm charcoal with off-white ink; the highlighter marks become muted tints so long posts stay calm.
  dark: {
    paper: "#151514",
    sheet: "#1D1D1B",
    ink: "#ECEAE4",
    ink2: "#AAA9A2",
    rule: "#363531",
    ruleSoft: "#2A2927",
    have: "#2F4D27",
    close: "#5C4B12",
    miss: "#E5694F",
    missText: "#F08C76",
    missSoft: "#4A2A23",
    scrim: "#000000",
  },
};
