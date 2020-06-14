import { useEffect, useOnce } from "./effect";
import { LitLikeElement } from "./types";
import { asUpdateableLitElement } from "./decorator";

describe("useEffect", () => {
  let litElement: LitLikeElement;

  beforeEach(() => {
    jest.resetAllMocks()
    litElement = {
        dispatchEvent: jest.fn(),
        requestUpdate: jest.fn(),
        updated: jest.fn()
    } as LitLikeElement
})

  it("executes the effect the first time", () => {
    let observe = "";
    const spy = jest.fn();
    useEffect(litElement, spy, [observe]);
    expect(spy).toBeCalledTimes(1);
  });

  it("runs the `once` convience method only once", () => {
    const spy = jest.fn();
    useOnce(litElement, spy);
    asUpdateableLitElement(litElement).updated();
    useOnce(litElement, spy);
    expect(spy).toBeCalledTimes(1);
  })

  it("does not execute the effect again if the observed elements doesn't change between updates", () => {
    let observe = "";
    const spy = jest.fn();
    useEffect(litElement, spy, [observe]);
    asUpdateableLitElement(litElement).updated();
    useEffect(litElement, spy, [observe]);
    expect(spy).toBeCalledTimes(1);
  });

  it("executes the effect every time one the observables change", () => {
    let observe = "";
    let other = {};
    const spy = jest.fn();
    useEffect(litElement, spy, [observe, other]);
    expect(spy).toBeCalledTimes(1);

    asUpdateableLitElement(litElement).updated();
    observe = "bla";
    useEffect(litElement, spy, [observe, other]);
    asUpdateableLitElement(litElement).updated();
    expect(spy).toBeCalledTimes(2);
    other = { observe };
    useEffect(litElement, spy, [observe, other]);
    asUpdateableLitElement(litElement).updated();
    expect(spy).toBeCalledTimes(3);
  });
});
