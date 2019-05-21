/* eslint-env jest */

const { cardType } = require("../card-types");

const _ = require("lodash");
const Database = require("../database.js");
const cardsDb = new Database();
const cardsByName = _.keyBy(cardsDb.getAll(), "name");

describe("card-types", () => {
  describe("cardType", () => {
    it("determines a card's card type", () => {
      expect(cardType(cardsByName["Gravewaker"])).toEqual("Creature");
      expect(cardType(cardsByName["Vivien Reid"])).toEqual("Planeswalker");
      expect(cardType(cardsByName["Settle the Wreckage"])).toEqual("Instant");
      expect(cardType(cardsByName["Toll of the Invasion"])).toEqual("Sorcery");
      expect(cardType(cardsByName["God-Pharaoh's Statue"])).toEqual("Artifact");
      expect(cardType(cardsByName["Curious Obsession"])).toEqual("Enchantment");
      expect(cardType(cardsByName["Breeding Pool"])).toEqual("Land");
    });

    it("determines Artifact Creatures to be Creatures", () => {
      expect(cardType(cardsByName["Iron Bully"])).toEqual("Creature");
    });

    it("can determine the card type of any card except City's Blessing", () => {
      Object.values(cardsDb.getAll()).forEach(card => {
        if (!_.has(card, "name")) return; // some properties are not cards :(
        if (card.name === "City's Blessing") return; // has no type
        let act = () => cardType(card);
        expect(act).not.toThrow();
      });
    });
  });
});