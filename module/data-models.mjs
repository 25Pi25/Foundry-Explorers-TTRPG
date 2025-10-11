import { proficiencies, types, typeChart, abilities, skills, sizes, classes, specializations, categories, targets, ranges, conditions } from './types.mjs';

const { NumberField, SchemaField, StringField, ArrayField } = foundry.data.fields;

export class CharacterDataModel extends foundry.abstract.TypeDataModel {

  static LOCALIZATION_PREFIXES = ["SYSTEM.Models.Character"];

  get tileVisibility() {
    let result = Math.floor(this.abilities.spatk.mod / 2) + 4;
    if (result % 10 === 8) result--; // I have no idea why the visibility table was like this
    if (this.skills.awareness === 'major') result += 2;
    else if (this.skills.awareness === 'minor') result += 1;
    return result;
  }

  get tileMovement() {
    let result = Math.floor(this.abilities.spe.mod / 2) + 1;
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
          range: 20,
          // range: this.tileVisibility * game.scenes.viewed.grid.distance
          // TODO: add tile visibility into sight when the derived attribute is computed
        }
      }
    });
  }

  static defineSchema() {
    const skillFields = {};
    for (const skill in skills) {
      skillFields[skill] = new StringField({ choices: proficiencies });
    }
    const abilityFields = {};
    for (const ability in abilities) {
      abilityFields[ability] = new SchemaField({ raw: new NumberField({ required: true, integer: true, min: 0, max: 999, initial: 5 }) });
    }
    return {
      species: new StringField({ required: true }),
      type1: new StringField({ required: true, choices: types, initial: 'normal' }),
      type2: new StringField({ required: true, nullable: true, choices: types }),
      heldItem: new StringField({ required: true, nullable: true, initial: null }),
      size: new StringField({ required: true, choices: sizes, initial: 'medium' }),
      hp: new SchemaField({
        raw: new NumberField({ required: true, integer: true, min: 0, initial: 25, max: 3000 }),
        max: new NumberField({ required: true, integer: true, min: 0, initial: 25 })
      }),
      abilities: new SchemaField(abilityFields),
      skills: new SchemaField(skillFields),
      moves: new ArrayField(new StringField({ required: true }), { max: 4 }),
      feats: new ArrayField(new StringField({ required: true }))
    };
  }

  prepareDerivedData() {
    this.hp.mod = Math.floor(Math.ceil(this.hp.max / 5) / 2)
    for (const ability in this.abilities) {
      const abilitySettings = this.abilities[ability];
      abilitySettings.mod = Math.ceil(abilitySettings.raw / 5);
      abilitySettings.value = abilitySettings.raw; // TODO: add stat up/stat down penalties
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

export class PlayerDataModel extends CharacterDataModel {
  static defineSchema() {
    return {
      ...super.defineSchema(),
      class: new StringField({ required: true, choices: classes, initial: 'explorer' }),
      specialization: new StringField({ required: true, nullable: true, choices: specializations }),
      nature: new StringField({ required: true }),
      origin: new StringField({ required: true }),
      item: new StringField({ required: true, nullable: true }),
      level: new NumberField({ required: true, integer: true, min: 1, max: 10, initial: 1 })
    };
  }
}

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
        defensiveCheck: new StringField({ choices: skills })
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
    if (data.effects.some(effect => ['statUp', 'statDown'].includes(effect.effect) === !effect.ability)) {
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
    };
  }
}