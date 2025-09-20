export const proficiencies = {
  major: "CHARACTER.Proficiency.Major",
  minor: "CHARACTER.Proficiency.Minor"
};
export const types = {
  normal: "TYPES.Normal",
  fighting: "TYPES.Fighting",
  flying: "TYPES.Flying",
  poison: "TYPES.Poison",
  ground: "TYPES.Ground",
  rock: "TYPES.Rock",
  bug: "TYPES.Bug",
  ghost: "TYPES.Ghost",
  steel: "TYPES.Steel",
  fire: "TYPES.Fire",
  water: "TYPES.Water",
  grass: "TYPES.Grass",
  electric: "TYPES.Electric",
  psychic: "TYPES.Psychic",
  ice: "TYPES.Ice",
  dragon: "TYPES.Dragon",
  dark: "TYPES.Dark",
  fairy: "TYPES.Fairy"
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
  atk: "ABILITIES.Attack",
  def: "ABILITIES.Defense",
  spatk: "ABILITIES.SpecialAttack",
  spdef: "ABILITIES.SpecialDefense",
  spe: "ABILITIES.Speed",
  iq: "ABILITIES.IQ"
};
export const skills = {
  endurance: "SKILLS.Endurance",
  strength: "SKILLS.Strength",
  physicalStatusResistance: "SKILLS.PhysicalStatusResistance",
  awareness: "SKILLS.Awareness",
  specialStatusResistance: "SKILLS.SpecialStatusResistance",
  movement: "SKILLS.Movement",
  influence: "SKILLS.Influence",
  deceive: "SKILLS.Deceive",
  intuition: "SKILLS.Intuition",
  tracking: "SKILLS.Tracking",
  ecology: "SKILLS.Ecology",
  sneak: "SKILLS.Sneak",
  memory: "SKILLS.Memory",
  logic: "SKILLS.Logic",
  traps: "SKILLS.Traps",
};
export const sizes = {
  tiny: "CHARACTER.Sizes.Tiny",
  small: "CHARACTER.Sizes.Small",
  medium: "CHARACTER.Sizes.Medium",
  large: "CHARACTER.Sizes.Large",
  huge: "CHARACTER.Sizes.Huge"
};
export const classes = {
  explorer: "CHARACTER.Class.Explorer",
  missionExpert: "CHARACTER.Class.MissionExpert",
  strategist: "CHARACTER.Class.Strategist",
  icon: "CHARACTER.Class.Icon",
  guardian: "CHARACTER.Class.Guardian",
  brawler: "CHARACTER.Class.Brawler",
  specialist: "CHARACTER.Class.Specialist"
};
export const specializations = {
  survivalist: "CHARACTER.Specialization.Survivalist",
  treasureHunter: "CHARACTER.Specialization.TreasureHunter",
  firstResponder: "CHARACTER.Specialization.FirstResponder",
  bountyHunter: "CHARACTER.Specialization.BountyHunter",
  tactician: "CHARACTER.Specialization.Tactician",
  sharpshooter: "CHARACTER.Specialization.Sharpshooter",
  teamLeader: "CHARACTER.Specialization.TeamLeader",
  silverTongued: "CHARACTER.Specialization.SilverTongued",
  aegis: "CHARACTER.Specialization.Aegis",
  ward: "CHARACTER.Specialization.Ward",
  rapid: "CHARACTER.Specialization.Rapid",
  fury: "CHARACTER.Specialization.Fury",
  swift: "CHARACTER.Specialization.Swift",
  patient: "CHARACTER.Specialization.Patient"
};
export const categories = {
  physical: "MOVES.Categories.Physical",
  special: "MOVES.Categories.Special",
  physicalStatus: "MOVES.Categories.PhysicalStatus",
  specialStatus: "MOVES.Categories.SpecialStatus",
};
export const targets = {
  foe: "MOVES.Targets.Foe",
  foes: "MOVES.Targets.Foes",
  ally: "MOVES.Targets.Ally",
  allies: "MOVES.Targets.Allies",
  self: "MOVES.Targets.Self",
  selfAllies: "MOVES.Targets.SelfAllies",
  selfOrAlly: "MOVES.Targets.SelfOrAlly",
  all: "MOVES.Targets.All"
};
export const ranges = {
  front: "MOVES.Ranges.Front",
  ahead: "MOVES.Ranges.Ahead",
  away: "MOVES.Ranges.Away",
  range: "MOVES.Ranges.Range",
  room: "MOVES.Ranges.Room",
  floor: "MOVES.Ranges.Floor",
  path: "MOVES.Ranges.Path",
  special: "MOVES.Ranges.Special",
};
export const conditions = {
  atkUp: "CONDITIONS.atk.Up",
  atkDown: "CONDITIONS.atk.Down",
  defUp: "CONDITIONS.def.Up",
  defDown: "CONDITIONS.def.Down",
  spatkUp: "CONDITIONS.spatk.Up",
  spatkDown: "CONDITIONS.spatk.Down",
  spdefUp: "CONDITIONS.spdef.Up",
  spdefDown: "CONDITIONS.spdef.Down",
  speUp: "CONDITIONS.spe.Up",
  speDown: "CONDITIONS.spe.Down",
  iqUp: "CONDITIONS.iq.Up",
  iqDown: "CONDITIONS.iq.Down",
  paralyzed: "CONDITIONS.Paralyzed",
  burned: "CONDITIONS.Burned",
  poisoned: "CONDITIONS.Poisoned",
  badlyPoisoned: "CONDITIONS.BadlyPoisoned",
  frozen: "CONDITIONS.Frozen",
  asleep: "CONDITIONS.Asleep",
  flinched: "CONDITIONS.Flinched",
  confused: "CONDITIONS.Confused",
  restrained: "CONDITIONS.Restrained",
  blinded: "CONDITIONS.Blinded",
  yawning: "CONDITIONS.Yawning",
  trapped: "CONDITIONS.Trapped",
  frightened: "CONDITIONS.Frightened",
  silenced: "CONDITIONS.Silenced",
  invisible: "CONDITIONS.Invisible",
  infatuated: "CONDITIONS.Infatuated",
  taunted: "CONDITIONS.Taunted",
  counter: "CONDITIONS.Counter",
  mirrorCoat: "CONDITIONS.MirrorCoat",
  magicCoat: "CONDITIONS.MagicCoat",
  eyedrop: "CONDITIONS.Eyedrop",
  insomnia: "CONDITIONS.Insomnia",
  invulnerable: "CONDITIONS.Invulnerable"
};