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

export function decorate(litElement: LitLikeElement) {
  const decoratedLitElement = litElement as DecoratedLitLikeElement;
  if (decoratedLitElement.__registered_effects) return decoratedLitElement;

  const updateableLitLikeElement = asUpdateableLitElement(litElement);

  const oldUpdated = updateableLitLikeElement.updated;
  decoratedLitElement.__registered_effects = {
    index: 0,
    count: 0,
    effects: [],
  };
  updateableLitLikeElement.updated = (args) => {
    decoratedLitElement.__registered_effects.index = 0;
    return oldUpdated(args);
  };
  return decoratedLitElement;
}

export function withEffect(litElement: LitLikeElement, effect: Effect) {
  const decoratedLitElement = decorate(litElement);
  const { index, count } = decoratedLitElement.__registered_effects;
  if (index === count) {
    decoratedLitElement.__registered_effects.index++;
    decoratedLitElement.__registered_effects.count++;
    decoratedLitElement.__registered_effects.effects.push(effect);
    return effect;
  }

  decoratedLitElement.__registered_effects.index++;
  return decoratedLitElement.__registered_effects.effects[index];
}
