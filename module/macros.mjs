import { MoveRollDialog } from './roll-dialog.mjs';

const { fromUuid } = foundry.utils;

export default {
  async openRoll(userId, moveId) {
    new MoveRollDialog({ userId, moveId }).render({ force: true });
  }
}