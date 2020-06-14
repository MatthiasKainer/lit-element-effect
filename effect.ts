import { LitLikeElement, EffectFunction, Observables } from "./types";
import { withEffect } from "./decorator";

export function useEffect(
  element: LitLikeElement,
  on: EffectFunction,
  observe: Observables
) {
  const effect = withEffect(element, {
    on,
    observe: ["__initial__dirty"],
  });
  effect.observe.some((o, index) => observe[index] !== o) && effect.on();
  effect.observe = observe;
}

export const useOnce = (element: LitLikeElement, on: EffectFunction) =>
  useEffect(element, on, []);
