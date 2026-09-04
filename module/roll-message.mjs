import { ExplorersRoll } from './explorers-roll.mjs';

const { TypeDataModel } = foundry.abstract;

export default class BaseMessageModel extends TypeDataModel {
  static get metadata() {
    return {
      ...super.metadata,
      type: "base",
    };
  }

  static defineSchema() {
    const fields = foundry.data.fields;
    return {
      targets: new fields.SetField(
        new fields.DocumentUUIDField({ nullable: false }),
        { initial: () => Array.from(game.user.targets.map(t => t.document.uuid)) },
      ),
    };
  }

  get targetTokens() {
    return this.targets.map(uuid => fromUuidSync(uuid)).filter(_ => _);
  }

  get targetActors() {
    return ds.utils.tokensToActors(Array.from(this.targetTokens));
  }

  async alterMessageHTML(html) {
    const footerButtons = await this._constructFooterButtons();
    if (footerButtons.length) {
      const footer = html.ownerDocument.createElement("footer");
      footer.append(...footerButtons);
      html.insertAdjacentElement("beforeend", footer);
    }
  }

  async _constructFooterButtons() {
    return [...this._constructDamageFooterButtons()];
  }

  /* -------------------------------------------------- */

  /**
   * Create an array of damage buttons based on each {@linkcode DamageRoll} in this message's rolls.
   * @returns {HTMLButtonElement[]}
   * @protected
   */
  _constructDamageFooterButtons() {
    /** @type {HTMLButtonElement[]} */
    const buttons = [];
    for (let i = 0; i < this.parent.rolls.length; i++) {
      const roll = this.parent.rolls[i];
      // if (roll instanceof ExplorersRoll) buttons.push(roll.toRollButton(i));
    }

    return buttons;
  }

  /* -------------------------------------------------- */

  /**
   * Add event listeners. Guaranteed to run after all alterations in {@linkcode alterMessageHTML}
   * Called by the renderChatMessageHTML hook.
   * @param {HTMLLIElement} html The pending HTML.
   */
  addListeners(html) {
    const damageButtons = html.querySelectorAll(".apply-damage");
    for (const damageButton of damageButtons) damageButton.addEventListener("click", (event) => DamageRoll.applyDamageCallback(event));
  }
}
