const { NumberField, SchemaField, StringField, ArrayField } = foundry.data.fields;

const proficiencies = {
  major: "CHARACTER.Proficiency.Major",
  minor: "CHARACTER.Proficiency.Minor"
};
const types = {
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
const typeChart = {
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
const abilities = {
  atk: "ABILITIES.Attack",
  def: "ABILITIES.Defense",
  spatk: "ABILITIES.SpecialAttack",
  spdef: "ABILITIES.SpecialDefense",
  spe: "ABILITIES.Speed",
  iq: "ABILITIES.IQ"
};
const skills = {
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
const sizes = {
  tiny: "CHARACTER.Sizes.Tiny",
  small: "CHARACTER.Sizes.Small",
  medium: "CHARACTER.Sizes.Medium",
  large: "CHARACTER.Sizes.Large",
  huge: "CHARACTER.Sizes.Huge"
};
export class CharacterDataModel extends foundry.abstract.TypeDataModel {

  get tileVisibility() {
    let result = Math.floor(this.abilities.spatk.mod / 2) + 4
    if (result % 10 === 8) result--; // I have no idea why the visibility table was like this
    if (this.skills.awareness === 'major') result += 2;
    else if (this.skills.awareness === 'minor') result += 1;
    return result;
  }

  get tileMovement() {
    let result = Math.floor(this.abilities.spe.mod / 2) + 1
    if (this.skills.movement === 'major') result += 4;
    else if (this.skills.movement === 'minor') result += 2;
    return result;
  }

  async _preCreate(data, options, user) {
    const isAllowed = await super._preCreate(data, options, user);
    if (isAllowed === false) return false;

    this.parent.updateSource({
      prototypeToken: {
        actorLink: true,
        disposition: CONST.TOKEN_DISPOSITIONS.FRIENDLY,
        sight: {
          enabled: true,
          range: this.tileVisibility * game.scenes.viewed.grid.distance
        }
      }
    });
  }

  static defineSchema() {
    const skills = {};
    for (const skill in skills) {
      skills[skill] = new StringField({ choices: proficiencies });
    }
    const abilities = {};
    for (const ability in abilities) {
      abilities[ability] = new SchemaField({ raw: new NumberField({ required: true, integer: true, min: 0, max: 305, initial: 5 }) });
      // Each ability has a raw/modifier/value attribute. Use value for calculations, use raw for actor sheets.
    }
    return {
      species: new StringField({ required: true }),
      type1: new StringField({ required: true, choices: types, initial: 'normal' }),
      type2: new StringField({ required: true, nullable: true, choices: types }),
      heldItem: new StringField({ required: true, nullable: true, initial: null }),
      size: new StringField({ required: true, choices: sizes, initial: 'medium' }),
      hp: new SchemaField({
        value: new NumberField({ required: true, integer: true, min: 0, initial: 25 }),
        max: new NumberField({ required: true, integer: true, min: 0, initial: 25 })
      }),
      abilities: new SchemaField(abilities),
      skills: new SchemaField(skills),
      moves: new ArrayField(new StringField({ required: true }), { max: 4 }),
      abilities: new ArrayField(new StringField({ required: true }))
    };
  }

  prepareDerivedData() {
    this.hp.mod = Math.floor(Math.ceil(this.hp.max / 5) / 2)
    for (const ability in this.abilities) {
      this.abilities[ability].mod = Math.ceil(this.abilities[ability].value / 5);
      this.abilities[ability].value = this.abilities[ability].raw; // TODO: add stat up/stat down penalties
    }
  }

  getTypeMatchup(attackType) {
    let result = 1;
    const attackChart = typeChart[attackType];
    for (const defendType of [this.type1, this.type2]) {
      if (defendType === null) continue;
      if (attackChart.se.includes(defendType)) result *= 2;
      else if (attackChart.nve.includes(defendType)) result *= 0.5;
      else if (attackChart.immune.includes(defendType)) return 0;
    }
    return result;
  }
}
const classes = {
  explorer: "CHARACTER.Class.Explorer",
  missionExpert: "CHARACTER.Class.MissionExpert",
  strategist: "CHARACTER.Class.Strategist",
  icon: "CHARACTER.Class.Icon",
  guardian: "CHARACTER.Class.Guardian",
  brawler: "CHARACTER.Class.Brawler",
  specialist: "CHARACTER.Class.Specialist"
};
const specializations = {
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
export class PlayerDataModel extends CharacterDataModel {
  static defineSchema() {
    return {
      ...super.defineSchema(),
      class: new StringField({ required: true, choices: classes, initial: 'explorer' }),
      specialization: new StringField({ required: true, nullable: true, choices: specializations }),
      nature: new StringField({ required: true }),
      origin: new StringField({ required: true }),
      level: new NumberField({ required: true, integer: true, min: 1, max: 10, initial: 1 })
    };
  }
}
const categories = {
  physical: "MOVES.Categories.Physical",
  special: "MOVES.Categories.Special",
  physicalStatus: "MOVES.Categories.PhysicalStatus",
  specialStatus: "MOVES.Categories.SpecialStatus",
};
const targets = {
  foe: "MOVES.Targets.Foe",
  foes: "MOVES.Targets.Foes",
  ally: "MOVES.Targets.Ally",
  allies: "MOVES.Targets.Allies",
  self: "MOVES.Targets.Self",
  selfAllies: "MOVES.Targets.SelfAllies",
  selfOrAlly: "MOVES.Targets.SelfOrAlly",
  all: "MOVES.Targets.All"
};
const ranges = {
  front: "MOVES.Ranges.Front",
  ahead: "MOVES.Ranges.Ahead",
  away: "MOVES.Ranges.Away",
  range: "MOVES.Ranges.Range",
  room: "MOVES.Ranges.Room",
  floor: "MOVES.Ranges.Floor",
  path: "MOVES.Ranges.Path",
  special: "MOVES.Ranges.Special",
};
const conditions = {
  statUp: "MOVES.Conditions.StatUp",
  statDown: "MOVES.Conditions.StatDown",
  paralyzed: "MOVES.Conditions.Paralyzed",
  burned: "MOVES.Conditions.Burned",
  poisoned: "MOVES.Conditions.Poisoned",
  badlyPoisoned: "MOVES.Conditions.BadlyPoisoned",
  frozen: "MOVES.Conditions.Frozen",
  asleep: "MOVES.Conditions.Asleep",
  flinched: "MOVES.Conditions.Flinched",
  confused: "MOVES.Conditions.Confused",
  restrained: "MOVES.Conditions.Restrained",
  blinded: "MOVES.Conditions.Blinded",
  yawning: "MOVES.Conditions.Yawning",
  trapped: "MOVES.Conditions.Trapped",
  frightened: "MOVES.Conditions.Frightened",
  silenced: "MOVES.Conditions.Silenced",
  invisible: "MOVES.Conditions.Invisible",
  infatuated: "MOVES.Conditions.Infatuated",
  taunted: "MOVES.Conditions.Taunted",
  counter: "MOVES.Conditions.Counter",
  mirrorCoat: "MOVES.Conditions.MirrorCoat",
  magicCoat: "MOVES.Conditions.MagicCoat",
  eyedrop: "MOVES.Conditions.Eyedrop",
  insomnia: "MOVES.Conditions.Insomnia",
  invulnerable: "MOVES.Conditions.Invulnerable"
};
export class MoveDataModel extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return {
      name: new StringField({ required: true }),
      type: new StringField({ required: true, choices: types }),
      category: new StringField({ required: true, choices: categories }),
      power: new NumberField({ required: true, integer: true, min: 0, initial: 0 }),
      pp: new NumberField({ required: true, integer: true, min: 0, initial: 20 }),
      effects: new ArrayField(new SchemaField({
        triggerType: new StringField({ required: true, nullable: true }),
        effect: new StringField({ required: true, choices: conditions }),
        ability: new StringField({ choices: abilities }),
        offensiveCheck: new StringField({ choices: skills }),
        defensiveCheck: new StringField({ choices: skills }),
        count: new NumberField({ integer: true, min: 1 })
      }), { required: true }),
      target: new StringField({ required: true, nullable: true, choices: targets }),
      range: new StringField({ required: true, nullable: true, choices: ranges }),
      rangeCount: new NumberField({ required: true, nullable: true, integer: true, min: 1 }),
      level: new NumberField({ required: true, integer: true, min: 1, max: 5, initial: 1 })
    };
  }
  static validateJoint(data) {
    if (['away', 'ahead', 'range'].includes(data.range) === (data.rangeCount === null)) {
      throw new Error("Attribute \"rangeCount\" is either being specified when it shouldn't, or not being specified when it should.");
    }
    if (data.effects.some(effect => ['statUp', 'statDown'].includes(effect.effect) === (!effect.ability || !effect.count))) {
      throw new Error("Attribute \"ability\" and \"count\" should only be specified for Stat Up/Stat Down.");
    }
    if ((data.range === null) === (data.target !== 'self')) {
      throw new Error("You can only have no range if you are targeting yourself.");
    }
    if ((data.target === null) === (data.target !== 'special')) {
      throw new Error("You can only have no target if your move is special.");
    }
  }
}

export class FeatDataModel extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return {
      effect: new StringField({ required: true }),
      prerequisite: new StringField({ required: true, nullable: true }),
      prerequisiteLevel: new NumberField({ required: true, nullable: true, integer: true, min: 1, max: 10 }),
    }
  }
}