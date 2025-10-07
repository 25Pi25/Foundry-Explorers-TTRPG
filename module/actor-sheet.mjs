import { filePath } from '../constants.mjs';
import { classes, specializations, types } from './types.mjs'

const { HandlebarsApplicationMixin } = foundry.applications.api;
const { ActorSheetV2 } = foundry.applications.sheets;

// TODO: move this somewhere more convenient
const toFormGroup = obj => Object.entries(obj).map(([value, label]) => ({ value, label }));

export class CharacterSheet extends HandlebarsApplicationMixin(ActorSheetV2) {
  static DEFAULT_OPTIONS = {
    tag: "form",
    form: {
      submitOnChange: true
    }
  }

  static PARTS = {
    header: { template: filePath("templates/actor-sheet.hbs") }
  }

  async _prepareContext(options) {
    return {
      ...await super._prepareContext(options),
      types: toFormGroup(types),
      classes: toFormGroup(classes),
      specializations: toFormGroup(specializations),
      systemFields: this.document.system.schema.fields
    };
  }

  static async formHandler(event, form, formData) {

  }
}