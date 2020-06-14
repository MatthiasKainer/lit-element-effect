export type LitLikeElement = {
    requestUpdate: () => void
    dispatchEvent: (e: Event) => boolean
}

export type UpdateableLitLikeElement = {
    updated(_?: any): void
}

type Effects = {
    index: number,
    count: number,
    effects: Effect[]
}

export type DecoratedLitLikeElement = LitLikeElement & {
    __registered_effects: Effects
}

export type Effect = {
    on: EffectFunction,
    observe: Observables
}

export type EffectFunction = () => void

export type Observables = unknown[]