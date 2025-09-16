import { ArrayField } from '@client/data/fields.mjs';

const { HTMLField, NumberField, SchemaField, StringField } = foundry.data.fields;

export class CharacterDataModel extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    const proficiencies = ['major', 'minor'];
    const types = ['normal', 'fighting', 'flying', 'poison', 'ground', 'rock', 'bug', 'ghost', 'steel', 'fire', 'water', 'grass', 'electric', 'psychic', 'ice', 'dragon', 'dark', 'fairy'];
    return {
      name: new StringField({ required: true }),
      species: new StringField({ required: true }),
      type1: new StringField({ required: true, choices: types }),
      type2: new StringField({ required: true, nullable: true, choices: types }),
      heldItem: new StringField({ required: true, nullable: true, initial: null }),

      hp: new SchemaField({
        value: new NumberField({ required: true, integer: true, min: 0, initial: 25 }),
        max: new NumberField({ required: true, integer: true, min: 0, initial: 25 })
      }, { required: true }),
      ability: new SchemaField({
        atk: new NumberField({ required: true, integer: true, min: 0, max: 300, initial: 5 }),
        def: new NumberField({ required: true, integer: true, min: 0, max: 300, initial: 5 }),
        spatk: new NumberField({ required: true, integer: true, min: 0, max: 300, initial: 5 }),
        spdef: new NumberField({ required: true, integer: true, min: 0, max: 300, initial: 5 }),
        spe: new NumberField({ required: true, integer: true, min: 0, max: 300, initial: 5 }),
        iq: new NumberField({ required: true, integer: true, min: 0, max: 300, initial: 5 }),
      }),

      skill: new SchemaField({
        endurance: new StringField({ choices: proficiencies }),
        strength: new StringField({ choices: proficiencies }),
        physicalStatusResistance: new StringField({ choices: proficiencies }),
        awareness: new StringField({ choices: proficiencies }),
        specialStatusResistance: new StringField({ choices: proficiencies }),
        movement: new StringField({ choices: proficiencies }),
        influence: new StringField({ choices: proficiencies }),
        deceive: new StringField({ choices: proficiencies }),
        intuition: new StringField({ choices: proficiencies }),
        tracking: new StringField({ choices: proficiencies }),
        ecology: new StringField({ choices: proficiencies }),
        sneak: new StringField({ choices: proficiencies }),
        memory: new StringField({ choices: proficiencies }),
        logic: new StringField({ choices: proficiencies }),
        traps: new StringField({ choices: proficiencies })
      }, { required: true }),

      moves: new ArrayField(new StringField({ required: true }), { required: true, max: 4 }),

      abilities: new ArrayField(new StringField({ required: true }), { required: true })
    };
  }
}

export class PlayerDataModel extends CharacterDataModel {
  static defineSchema() {
    const classes = ['explorer', 'missionExpert', 'strategist', 'icon', 'guardian', 'brawler', 'specialist'];
    const specializations = ['survivalist', 'treasureHunter', 'firstResponder', 'bountyHunter', 'tactician', 'sharpshooter', 'teamLeader', 'silverTongued', 'aegis', 'ward', 'rapid', 'fury', 'swift', 'patient']
    return {
      ...super.defineSchema(),
      class: new StringField({ required: true, choices: classes }),
      specialization: new StringField({ required: true, nullable: true, choices: specializations }),
      nature: new StringField({ required: true }),
      origin: new StringField({ required: true }),
      level: new NumberField({ required: true, integer: true, min: 1, max: 10, initial: 1 })
    };
  }
}

export class MoveDataModel extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    const categories = ['physical', 'special', 'physicalStatus', 'specialStatus'];
    const types = ['normal', 'fighting', 'flying', 'poison', 'ground', 'rock', 'bug', 'ghost', 'steel', 'fire', 'water', 'grass', 'electric', 'psychic', 'ice', 'dragon', 'dark', 'fairy'];
    const ranges = ['foeFront', 'foesFront', 'foeAhead', 'foeRange', 'room', 'self', 'allyAway', 'selfAllyAway', 'path', 'currentFloor', 'special'];
    const conditions = ['statUp', 'statDown', 'paralyzed', 'burned', 'poisoned', 'badlyPoisoned', 'frozen', 'asleep', 'flinched', 'confused', 'restrained', 'blinded', 'yawning', 'trapped', 'frightened', 'silenced', 'invisible', 'infatuated', 'taunted', 'counter', 'mirrorCoat', 'magicCoat', 'eyedrop', 'insomnia', 'invulnerable']
    const abilities = ['atk', 'def', 'spatk', 'spdef', 'spe', 'iq'];
    const skills = ['endurance', 'strength', 'physicalStatusResistance', 'awareness', 'specialStatusResistance', 'movement', 'influence', 'deceive', 'intuition', 'tracking', 'ecology', 'sneak', 'memory', 'logic', 'traps',]
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
      range: new StringField({ required: true, choices: ranges }),
      rangeCount: new NumberField({ required: true, nullable: true, integer: true, min: 1 }),
      level: new NumberField({ required: true, integer: true, min: 1, max: 5, initial: 1 })
    };
  }
  static validateJoint(data) {
    if (['foeAhead', 'foeRange', 'allyAway', 'selfAllyAway'].includes(data.range) === (data.rangeCount === null)) {
      throw new Error("Attribute \"rangeCount\" is either being specified when it shouldn't, or not being specified when it should.");
    }
    if (data.effects.some(effect => ['statUp', 'statDown'].includes(effect.effect) === (!effect.ability || !effect.count))) {
      throw new Error("Attribute \"ability\" and \"count\" are either being specified when they shouldn't, or not being specified when it should.");
    }
  }
}