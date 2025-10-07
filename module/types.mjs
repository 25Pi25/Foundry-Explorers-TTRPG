export const proficiencies = {
  major: "SYSTEM.Character.Proficiency.Major",
  minor: "SYSTEM.Character.Proficiency.Minor"
};
export const types = {
  normal: "SYSTEM.Types.Normal",
  fighting: "SYSTEM.Types.Fighting",
  flying: "SYSTEM.Types.Flying",
  poison: "SYSTEM.Types.Poison",
  ground: "SYSTEM.Types.Ground",
  rock: "SYSTEM.Types.Rock",
  bug: "SYSTEM.Types.Bug",
  ghost: "SYSTEM.Types.Ghost",
  steel: "SYSTEM.Types.Steel",
  fire: "SYSTEM.Types.Fire",
  water: "SYSTEM.Types.Water",
  grass: "SYSTEM.Types.Grass",
  electric: "SYSTEM.Types.Electric",
  psychic: "SYSTEM.Types.Psychic",
  ice: "SYSTEM.Types.Ice",
  dragon: "SYSTEM.Types.Dragon",
  dark: "SYSTEM.Types.Dark",
  fairy: "SYSTEM.Types.Fairy"
};
export const typeChart = {
  normal: { se: [], nve: ['rock', 'steel'], immune: ['ghost'] },
  fighting: { se: ['normal', 'ice', 'rock', 'dark', 'steel'], nve: ['poison', 'flying', 'psychic', 'bug', 'fairy'], immune: ['ghost'] },
  flying: { se: ['grass', 'fighting', 'bug'], nve: ['electric', 'rock', 'steel'], immune: [] },
  poison: { se: ['grass', 'fairy'], nve: ['poison', 'ground', 'rock', 'ghost'], immune: ['steel'] },
  ground: { se: ['fire', 'electric', 'poison', 'rock', 'steel'], nve: ['grass', 'bug'], immune: ['flying'] },
  rock: { se: ['fire', 'ice', 'flying', 'bug'], nve: ['fighting', 'ground', 'steel'], immune: [] },
  bug: { se: ['grass', 'psychic', 'dark'], nve: ['fire', 'fighting', 'poison', 'flying', 'ghost', 'steel', 'fairy'], immune: [] },
  ghost: { se: ['psychic', 'ghost'], nve: ['dark'], immune: ['normal'] },
  steel: { se: ['ice', 'rock', 'fairy'], nve: ['fire', 'water', 'electric', 'steel'], immune: [] },
  fire: { se: ['grass', 'ice', 'bug', 'steel'], nve: ['fire', 'water', 'rock', 'dragon'], immune: [] },
  water: { se: ['fire', 'ground', 'rock'], nve: ['water', 'grass', 'dragon'], immune: [] },
  grass: { se: ['water', 'ground', 'rock'], nve: ['fire', 'grass', 'poison', 'flying', 'bug', 'dragon', 'steel'], immune: [] },
  electric: { se: ['water', 'flying'], nve: ['grass', 'electric', 'dragon'], immune: ['ground'] },
  psychic: { se: ['fighting', 'poison'], nve: ['psychic', 'steel'], immune: ['dark'] },
  ice: { se: ['grass', 'ground', 'flying', 'dragon'], nve: ['fire', 'water', 'ice', 'steel'], immune: [] },
  dragon: { se: ['dragon'], nve: ['steel'], immune: ['fairy'] },
  dark: { se: ['psychic', 'ghost'], nve: ['dark', 'fairy'], immune: [] },
  fairy: { se: ['fighting', 'dragon', 'dark'], nve: ['fire', 'poison', 'steel'], immune: [] },
};
export const abilities = {
  atk: "SYSTEM.Abilities.Attack",
  def: "SYSTEM.Abilities.Defense",
  spatk: "SYSTEM.Abilities.SpecialAttack",
  spdef: "SYSTEM.Abilities.SpecialDefense",
  spe: "SYSTEM.Abilities.Speed",
  iq: "SYSTEM.Abilities.IQ"
};
export const skills = {
  endurance: "SYSTEM.Skills.Endurance",
  strength: "SYSTEM.Skills.Strength",
  physicalStatusResistance: "SYSTEM.Skills.PhysicalStatusResistance",
  awareness: "SYSTEM.Skills.Awareness",
  specialStatusResistance: "SYSTEM.Skills.SpecialStatusResistance",
  movement: "SYSTEM.Skills.Movement",
  influence: "SYSTEM.Skills.Influence",
  deceive: "SYSTEM.Skills.Deceive",
  intuition: "SYSTEM.Skills.Intuition",
  tracking: "SYSTEM.Skills.Tracking",
  ecology: "SYSTEM.Skills.Ecology",
  sneak: "SYSTEM.Skills.Sneak",
  memory: "SYSTEM.Skills.Memory",
  logic: "SYSTEM.Skills.Logic",
  traps: "SYSTEM.Skills.Traps",
};
export const sizes = {
  tiny: "SYSTEM.Character.Sizes.Tiny",
  small: "SYSTEM.Character.Sizes.Small",
  medium: "SYSTEM.Character.Sizes.Medium",
  large: "SYSTEM.Character.Sizes.Large",
  huge: "SYSTEM.Character.Sizes.Huge"
};
export const classes = {
  explorer: "SYSTEM.Character.Class.Explorer",
  missionExpert: "SYSTEM.Character.Class.MissionExpert",
  strategist: "SYSTEM.Character.Class.Strategist",
  icon: "SYSTEM.Character.Class.Icon",
  guardian: "SYSTEM.Character.Class.Guardian",
  brawler: "SYSTEM.Character.Class.Brawler",
  specialist: "SYSTEM.Character.Class.Specialist"
};
export const specializations = {
  survivalist: "SYSTEM.Character.Specializations.Survivalist",
  treasureHunter: "SYSTEM.Character.Specializations.TreasureHunter",
  firstResponder: "SYSTEM.Character.Specializations.FirstResponder",
  bountyHunter: "SYSTEM.Character.Specializations.BountyHunter",
  tactician: "SYSTEM.Character.Specializations.Tactician",
  sharpshooter: "SYSTEM.Character.Specializations.Sharpshooter",
  teamLeader: "SYSTEM.Character.Specializations.TeamLeader",
  silverTongued: "SYSTEM.Character.Specializations.SilverTongued",
  aegis: "SYSTEM.Character.Specializations.Aegis",
  ward: "SYSTEM.Character.Specializations.Ward",
  rapid: "SYSTEM.Character.Specializations.Rapid",
  fury: "SYSTEM.Character.Specializations.Fury",
  swift: "SYSTEM.Character.Specializations.Swift",
  patient: "SYSTEM.Character.Specializations.Patient"
};
export const categories = {
  physical: "SYSTEM.Moves.Categories.Physical",
  special: "SYSTEM.Moves.Categories.Special",
  physicalStatus: "SYSTEM.Moves.Categories.PhysicalStatus",
  specialStatus: "SYSTEM.Moves.Categories.SpecialStatus",
};
export const targets = {
  foe: "SYSTEM.Moves.Targets.Foe",
  foes: "SYSTEM.Moves.Targets.Foes",
  ally: "SYSTEM.Moves.Targets.Ally",
  allies: "SYSTEM.Moves.Targets.Allies",
  self: "SYSTEM.Moves.Targets.Self",
  selfAllies: "SYSTEM.Moves.Targets.SelfAllies",
  selfOrAlly: "SYSTEM.Moves.Targets.SelfOrAlly",
  all: "SYSTEM.Moves.Targets.All"
};
export const ranges = {
  front: "SYSTEM.Moves.Ranges.Front",
  ahead: "SYSTEM.Moves.Ranges.Ahead",
  away: "SYSTEM.Moves.Ranges.Away",
  range: "SYSTEM.Moves.Ranges.Range",
  room: "SYSTEM.Moves.Ranges.Room",
  floor: "SYSTEM.Moves.Ranges.Floor",
  path: "SYSTEM.Moves.Ranges.Path",
  special: "SYSTEM.Moves.Ranges.Special",
};
export const conditions = {
  atkUp: "SYSTEM.Conditions.atk.Up",
  atkDown: "SYSTEM.Conditions.atk.Down",
  defUp: "SYSTEM.Conditions.def.Up",
  defDown: "SYSTEM.Conditions.def.Down",
  spatkUp: "SYSTEM.Conditions.spatk.Up",
  spatkDown: "SYSTEM.Conditions.spatk.Down",
  spdefUp: "SYSTEM.Conditions.spdef.Up",
  spdefDown: "SYSTEM.Conditions.spdef.Down",
  speUp: "SYSTEM.Conditions.spe.Up",
  speDown: "SYSTEM.Conditions.spe.Down",
  iqUp: "SYSTEM.Conditions.iq.Up",
  iqDown: "SYSTEM.Conditions.iq.Down",
  paralyzed: "SYSTEM.Conditions.Paralyzed",
  burned: "SYSTEM.Conditions.Burned",
  poisoned: "SYSTEM.Conditions.Poisoned",
  badlyPoisoned: "SYSTEM.Conditions.BadlyPoisoned",
  frozen: "SYSTEM.Conditions.Frozen",
  asleep: "SYSTEM.Conditions.Asleep",
  flinched: "SYSTEM.Conditions.Flinched",
  confused: "SYSTEM.Conditions.Confused",
  restrained: "SYSTEM.Conditions.Restrained",
  blinded: "SYSTEM.Conditions.Blinded",
  yawning: "SYSTEM.Conditions.Yawning",
  trapped: "SYSTEM.Conditions.Trapped",
  frightened: "SYSTEM.Conditions.Frightened",
  silenced: "SYSTEM.Conditions.Silenced",
  invisible: "SYSTEM.Conditions.Invisible",
  infatuated: "SYSTEM.Conditions.Infatuated",
  taunted: "SYSTEM.Conditions.Taunted",
  counter: "SYSTEM.Conditions.Counter",
  mirrorCoat: "SYSTEM.Conditions.MirrorCoat",
  magicCoat: "SYSTEM.Conditions.MagicCoat",
  eyedrop: "SYSTEM.Conditions.Eyedrop",
  insomnia: "SYSTEM.Conditions.Insomnia",
  invulnerable: "SYSTEM.Conditions.Invulnerable"
};