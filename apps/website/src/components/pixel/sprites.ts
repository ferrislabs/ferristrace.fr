/**
 * The site's sprites, drawn by hand on a grid: one string per row of pixels,
 * one character per pixel, "." for transparent. The palette maps each
 * character to a colour.
 *
 * The comet crab is the one FerrisTrace wears on ferrislabs.fr. Every other
 * sprite reuses its indigo so the set reads as one family.
 */
export interface Sprite {
  rows: string[]
  palette: Record<string, string>
}

/** Indigo ramp of the comet crab, plus the three service colours of its tail. */
const INK = {
  D: '#3730a3',
  O: '#6366f1',
  Y: '#a5b4fc',
  E: '#0c0c0e',
  B: '#2fb394',
  C: '#e8893c',
  R: '#e11d48',
  W: '#f5f5f4',
}

/** FerrisTrace: the comet crab, with its trail of spans. */
export const cometCrab: Sprite = {
  rows: [
    '.............',
    '......D...D..',
    '.....DD...DD.',
    '.....D.E.E.D.',
    'YYY..DOOOOOD.',
    '.BBBOOOOOOOOO',
    'CCC..OOOOOOO.',
    '.....D.OOO.D.',
  ],
  palette: INK,
}

/** The Ferrislabs crab, in rust, for the footer signature. */
export const rustCrab: Sprite = {
  rows: [
    '.........',
    '..D...D..',
    '.DD...DD.',
    '.D.E.E.D.',
    '.DOOOOOD.',
    'OOOOOOOOO',
    '.OOOOOOO.',
    'D.OOOOO.D',
  ],
  palette: { D: '#a83e08', O: '#f2670f', E: '#1c1917' },
}

/** FerrisKey: the golden key, the same one as on ferriskey.rs. */
export const key: Sprite = {
  rows: ['.GGG.......', 'GYYYG......', 'GY.YGGGGGGG', 'GYYYGYYYYYG', '.GGG...G.GG', '.......G.G.'],
  palette: { G: '#b7791f', Y: '#f3b544' },
}

/** Traces, logs and metrics: a waterfall of spans. */
export const tracesSprite: Sprite = {
  rows: [
    'OOOOOOOOO',
    '.........',
    '.DDDDD...',
    '.........',
    '..BBB....',
    '.........',
    '...CCCCC.',
    '.........',
    '....YY...',
  ],
  palette: INK,
}

/** Infrastructure: three nodes of a cluster. */
export const infraSprite: Sprite = {
  rows: [
    '..DDDDD..',
    '..DOYOD..',
    '..DDDDD..',
    '....O....',
    '..OOOOO..',
    '..O...O..',
    'DDDDDDDDD',
    'DOYDDDOYD',
    'DDDDDDDDD',
  ],
  palette: INK,
}

/** Incident response: the siren. */
export const incidentSprite: Sprite = {
  rows: [
    'Y...R...Y',
    '.Y.....Y.',
    '...RRR...',
    '..RRWRR..',
    '..RRWRR..',
    '..RRRRR..',
    '..RRRRR..',
    '.DDDDDDD.',
    'DDDDDDDDD',
  ],
  palette: INK,
}

/** AI observability: a model chip with a spark. */
export const aiObsSprite: Sprite = {
  rows: [
    '.O.O.O.O.',
    'DDDDDDDDD',
    'D.......D',
    'D..YYY..D',
    'D.YYOYY.D',
    'D..YYY..D',
    'D.......D',
    'DDDDDDDDD',
    '.O.O.O.O.',
  ],
  palette: INK,
}

/** AI agents: a small robot that investigates. */
export const agentSprite: Sprite = {
  rows: [
    '....Y....',
    '....O....',
    '.DDDDDDD.',
    '.DOOOOOD.',
    '.DOEOEOD.',
    '.DOOOOOD.',
    '.DDDDDDD.',
    '..D...D..',
    '.DD...DD.',
  ],
  palette: INK,
}

/** Startups: a rocket. */
export const rocketSprite: Sprite = {
  rows: [
    '....O....',
    '...OOO...',
    '...OYO...',
    '...OOO...',
    '..DOOOD..',
    '.DDOOODD.',
    '....C....',
    '...CCC...',
    '....C....',
  ],
  palette: INK,
}

/** Enterprises: an office building. */
export const buildingSprite: Sprite = {
  rows: [
    '.DDDDDDD.',
    '.DYDYDYD.',
    '.DDDDDDD.',
    '.DYDYDYD.',
    '.DDDDDDD.',
    '.DYDYDYD.',
    '.DDDDDDD.',
    '.DDDODDD.',
    'OOOOOOOOO',
  ],
  palette: INK,
}

/** Platform and SRE teams: a server rack. */
export const rackSprite: Sprite = {
  rows: [
    'DDDDDDDDD',
    'DOOOOOBYD',
    'DDDDDDDDD',
    'DOOOOOBYD',
    'DDDDDDDDD',
    'DOOOOOCYD',
    'DDDDDDDDD',
    '.D.....D.',
    '.D.....D.',
  ],
  palette: INK,
}

/** AI product teams: a speech bubble with a spark. */
export const bubbleSprite: Sprite = {
  rows: [
    '.OOOOOOO.',
    'O.......O',
    'O..Y.Y..O',
    'O.YYYYY.O',
    'O..Y.Y..O',
    'O.......O',
    '.OOOOOOO.',
    '..OO.....',
    '..O......',
  ],
  palette: INK,
}
