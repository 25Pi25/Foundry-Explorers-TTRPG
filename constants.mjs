import { effects, skillToAbility, statConditions, valueEffects } from './module/types.mjs';

export const SYSTEM_ID = 'explorers';
export const skillToDie = {
  untrained: 1,
  minor: 2,
  major: 3
}
export const filePath = path => `systems/${SYSTEM_ID}/${path}`;
export const toModString = mod => mod >= 0 ? `+${mod}` : mod.toString();
export function getSkillDie(thisContext, skill) {
  const proficiency = thisContext.document.system.skills[skill];
  const abilityName = skillToAbility[skill];
  const ability = abilityName === "hp" ? thisContext.document.system.hp : thisContext.document.system.abilities[abilityName];
  return { sides: skillToDie[proficiency], modifier: ability.mod }
}
export function toSkillString(skill) {
  const { sides, modifier } = getSkillDie(this, skill);
  return `${sides}d6x${modifier !== 0 ? toModString(modifier) : ""}`;
}
export function getMoveDie(thisContext, move) { // TODO: add targeting & player context
  const isPhysical = move.system.category === "physical" || move.system.category === "physicalStatus";
  const isStatus = move.system.category === "physicalStatus" || move.system.category === "specialStatus";
  const character = thisContext.system;
  let baseModifier = isPhysical ? character.abilities.atk.mod : character.abilities.spatk.mod;
  let sides = move.system.power;
  if (!sides) {
    const hitEffect = Object.values(move.system.effects).find(effect => effect.triggerType === "hit");
    if (!hitEffect) return null;
    return { sides: isStatus ? move.system.offensiveCheck ? skillToDie[character.skills[move.system.offensiveCheck]] ?? 1 : 2 : 1, modifier: baseModifier };
  }
  return { sides, modifier: baseModifier };
}
export function toMoveString(move) {
  const moveDie = getMoveDie(this.document, move);
  if (!moveDie) return "Use";
  const { sides, modifier } = moveDie;
  return `${sides}d6x${modifier !== 0 ? toModString(modifier) : ""}`;
}
export function toFormGroup(object) {
  return Object.entries(object).map(([value, label]) => ({ value, label }));
}
export function hasEffectCount(effectName) {
  return isStatCondition(effectName) || valueEffects.has(effectName);
}
export function isStatCondition(effectName) {
  return !!statConditions[effectName];
}
export function isEffect(effectName) {
  return !!effects[effectName];
}