export const SYSTEM_ID = 'explorers';
export const filePath = path => `systems/${SYSTEM_ID}/${path}`;
export const toModString = mod => mod >= 0 ? `+${mod}` : mod.toString();
export function toSkillString({ hash: { proficiency, modifier } }) {
  const skillValue = {
    [undefined]: 1,
    minor: 2,
    major: 3
  }[proficiency];
  return `${skillValue}d6${modifier !== 0 ? toModString(modifier) : modifier}`;
}