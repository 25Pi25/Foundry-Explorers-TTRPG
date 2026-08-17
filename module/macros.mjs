import { RollDialog } from './roll-dialog.mjs';

const { fromUuid } = foundry.utils;

export default {
  async openRoll(userId, moveId) {
    new RollDialog({ userId, moveId }).render({ force: true });
  }
}