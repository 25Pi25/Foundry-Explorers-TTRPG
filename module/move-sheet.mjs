import { filePath } from '../constants.mjs';
import { MoveDataModel } from './data-models.mjs';
import { ranges, targets, types } from './types.mjs';

const { HandlebarsApplicationMixin } = foundry.applications.api;
const { ItemSheetV2 } = foundry.applications.sheets;
const { ChatMessage } = foundry.documents;

export class ItemSheet extends HandlebarsApplicationMixin(ItemSheetV2) {
  static DEFAULT_OPTIONS = {
    tag: "form",
    form: {
      submitOnChange: true,
      scroll
    },
    actions: {
      addEffect: ItemSheet.addEffect,
      deleteEffect: ItemSheet.deleteEffect,
    }
  }

  static PARTS = {
    move: { template: filePath("templates/move/move.hbs") },
    options: { template: filePath("templates/move/move-options.hbs") },
  }

  async _prepareContext(options) {
    // const itemEffects = [];
    // for (const [id, values] of Object.entries(this.document.system.effects)) {
    //   itemEffects.push({
    //     namePrefix: `system.effects.${id}.`,
    //     fields: this.document.system.schema.fields.effects.element.fields,
    //     values,
    //     id,
    //   });
    // }
    return {
      ...await super._prepareContext(options),
      systemFields: this.document.system.schema.fields,
      types,
      targets,
      ranges,
      // itemEffects
    };
  }

  // static addEffect() {
  //   this.document.update({
  //     system: {
  //       effects: {
  //         [foundry.utils.randomID()]: this.document.system.schema.fields.effects.element.getInitialValue()
  //       }
  //     }
  //   });
  // }

  // static deleteEffect(event, target) {
  //   const id = target.dataset.effectId;
  //   this.document.update({ [`system.effects.-=${id}`]: null });
  // }
}