import {
  LitLikeElement,
  DecoratedLitLikeElement,
  UpdateableLitLikeElement,
  Effect,
} from "./types";

export function asUpdateableLitElement(element: LitLikeElement) {
  if (!element.dispatchEvent || !element.requestUpdate)
    throw new Error(
      "Element missing required functions (dispatchEvent/requestUpdate)"
    );
  return (element as unknown) as UpdateableLitLikeElement;
}

const reservedKeyword = "__registered_effects";

export function decorate(litElement: LitLikeElement) {
  const decoratedLitElement = litElement as DecoratedLitLikeElement;
  if (decoratedLitElement[reservedKeyword]) return decoratedLitElement;

  const updateableLitLikeElement = asUpdateableLitElement(litElement);

  const oldUpdated = updateableLitLikeElement.updated;
  decoratedLitElement[reservedKeyword] = {
    index: 0,
    count: 0,
    effects: [],
  };
  updateableLitLikeElement.updated = (args) => {
    decoratedLitElement[reservedKeyword].index = 0;
    return oldUpdated(args);
  };
  return decoratedLitElement;
}

export function withEffect(litElement: LitLikeElement, effect: Effect) {
  const decoratedLitElement = decorate(litElement);
  const { index, count } = decoratedLitElement[reservedKeyword];
  if (index === count) {
    decoratedLitElement[reservedKeyword].index++;
    decoratedLitElement[reservedKeyword].count++;
    decoratedLitElement[reservedKeyword].effects.push(effect);
    return effect;
  }

  decoratedLitElement[reservedKeyword].index++;
  return decoratedLitElement[reservedKeyword].effects[index];
}
