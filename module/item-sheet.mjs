import { filePath, hasEffectCount, toFormGroup } from '../constants.mjs';
import { itemCategories } from './types.mjs';

const { HandlebarsApplicationMixin } = foundry.applications.api;
const { ItemSheetV2 } = foundry.applications.sheets;
const { ChatMessage } = foundry.documents;

export class ItemSheet extends HandlebarsApplicationMixin(ItemSheetV2) {
  static DEFAULT_OPTIONS = {
    tag: "form",
    form: {
      submitOnChange: true,
    }
  }

  static PARTS = {
    item: { template: filePath("templates/item/item.hbs") }
  }

  async _prepareContext(options) {
    const context = await super._prepareContext(options);
    context.systemFields = this.document.system.schema.fields;
    context.itemCategories = itemCategories;
    return context;
  }
}