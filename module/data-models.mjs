import { ArrayField } from '@client/data/fields.mjs';

const { HTMLField, NumberField, SchemaField, StringField } = foundry.data.fields;

class CharacterData extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    const proficiencies = ['major', 'minor'];
    const types = ['normal', 'fighting', 'flying', 'poison', 'ground', 'rock', 'bug', 'ghost', 'steel', 'fire', 'water', 'grass', 'electric', 'psychic', 'ice', 'dragon', 'dark', 'fairy'];
    const classes = ['explorer', 'mission_expert', 'strategist', 'icon', 'guardian', 'brawler', 'specialist'];
    const categories = ['physical', 'special', 'physical_status', 'special_status']
    return {
      name: new StringField({ required: true }),
      species: new StringField({ required: true }),
      type1: new StringField({ required: true, choices: types }),
      type2: new StringField({ required: true, nullable: true, choices: types }),
      class: new StringField({ required: true, choices: classes }),
      specialization: new StringField({ required: true, nullable: true }),
      nature: new StringField({ required: true }),
      origin: new StringField({ required: true }),
      heldItem: new StringField({ required: true, nullable: true }),

      ability: new SchemaField({
        hp: new NumberField({ required: true, integer: true, min: 0, initial: 25 }),
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
      }),

      moves: new ArrayField({
        name: new StringField({ required: true }),
        type: new StringField({ required: true, choices: types }),
        category: new StringField({ required: true, choices: categories }),
        power: new NumberField({ required: true, integer: true, min: 0, initial: 0 }),
        pp: new NumberField({ required: true, integer: true, min: 0, initial: 20 }),
        conditions: new StringField({ required: true }), // TODO: add status condition field??
        effectType: new StringField({ required: true }), // TODO: add effect types
        range: new StringField({ required: true }) // TODO: range choices
      }, { required: true })
    }
  }
}