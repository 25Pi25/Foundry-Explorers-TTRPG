import { skillToAbility } from './module/types.mjs';

export const SYSTEM_ID = 'explorers';
export const filePath = path => `systems/${SYSTEM_ID}/${path}`;
export const toModString = mod => mod >= 0 ? `+${mod}` : mod.toString();
export function getSkillDie(thisContext, skill) {
  const proficiency = thisContext.document.system.skills[skill];
  const abilityName = skillToAbility[skill];
  const ability = abilityName === "hp" ? thisContext.document.system.hp : thisContext.document.system.abilities[abilityName];
  const skillValue = {
    untrained: 1,
    minor: 2,
    major: 3
  }[proficiency];
  return { sides: skillValue, modifier: ability.mod }
}
export function toSkillString(skill) {
  const { sides, modifier } = getSkillDie(this, skill);
  return `${sides}d6x${modifier !== 0 ? toModString(modifier) : ""}`;
}
export function toFormGroup(object) {
  return Object.entries(object).map(([value, label]) => ({ value, label }));
}