import { decorate, withEffect, asUpdateableLitElement } from "./decorator";
import { LitLikeElement, DecoratedLitLikeElement, Effect } from "./types";

function createEffect() {
  return {
    on: jest.fn(),
    observe: [],
  } as Effect;
}

describe("decorator", () => {
  let litElement: LitLikeElement;

  beforeEach(() => {
    jest.resetAllMocks();
    litElement = ({
      requestUpdate: jest.fn(),
      dispatchEvent: jest.fn(),
      updated: () => jest.fn(),
    } as unknown) as LitLikeElement;
  });

  it("failes for a element without required functions", () => {
    expect(() => decorate({} as LitLikeElement)).toThrowError(
      "Element missing required functions (dispatchEvent/requestUpdate)"
    );
  });

  it("decorates a litelement with a list for the effects", () => {
    decorate(litElement);
    expect(
      (litElement as DecoratedLitLikeElement).__registered_effects
    ).toBeDefined();
  });
  it("does not re-decorate a litelement if already decorated", () => {
    const decorated = decorate(litElement);
    decorated.__registered_effects.index = 5;
    decorate(decorated);
    expect(
      (decorated as DecoratedLitLikeElement).__registered_effects.index
    ).toBe(5);
  });

  describe("with effects", () => {
    it("correctly adds the effect to the decoration", () => {
      const effect = createEffect();
      withEffect(litElement, effect);
      expect(
        (litElement as DecoratedLitLikeElement).__registered_effects.effects
      ).toHaveLength(1);
      expect(
        (litElement as DecoratedLitLikeElement).__registered_effects.count
      ).toBe(1);
      expect(
        (litElement as DecoratedLitLikeElement).__registered_effects.index
      ).toBe(1);
    });

    it("resets the effects on updated, returning the first element again", () => {
      const effect = createEffect();
      withEffect(litElement, effect);
      expect(
        (litElement as DecoratedLitLikeElement).__registered_effects.index
      ).toBe(1);

      asUpdateableLitElement(litElement).updated();
      expect(
        (litElement as DecoratedLitLikeElement).__registered_effects.index
      ).toBe(0);
      const resolvedEffect = withEffect(litElement, createEffect());
      expect(
        (litElement as DecoratedLitLikeElement).__registered_effects.count
      ).toBe(1);
      expect(effect).toBe(resolvedEffect);
    });

    it("resets the effects on updated, returning the correct effects on future calls", () => {
      const firstEffect = createEffect();
      const secondEffect = createEffect();
      const thirdEffect = createEffect();
      withEffect(litElement, firstEffect);
      withEffect(litElement, secondEffect);
      withEffect(litElement, thirdEffect);
      expect(
        (litElement as DecoratedLitLikeElement).__registered_effects.index
      ).toBe(3);

      asUpdateableLitElement(litElement).updated();
      expect(
        (litElement as DecoratedLitLikeElement).__registered_effects.index
      ).toBe(0);
      expect(firstEffect).toBe(withEffect(litElement, createEffect()));
      expect(secondEffect).toBe(withEffect(litElement, createEffect()));
      expect(thirdEffect).toBe(withEffect(litElement, createEffect()));
    });
  });
});
