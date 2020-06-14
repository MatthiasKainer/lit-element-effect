# Effect hooks for Lit-Elements

[![Version](https://img.shields.io/npm/v/lit-element-effect?style=for-the-badge)](https://www.npmjs.com/package/lit-element-effect)
[![Size](https://img.shields.io/bundlephobia/minzip/lit-element-effect?style=for-the-badge)](https://bundlephobia.com/result?p=lit-element-effect)
[![vulnerabilities](https://img.shields.io/snyk/vulnerabilities/npm/lit-element-effect?style=for-the-badge)](https://snyk.io/test/github/MatthiasKainer/lit-element-effect?targetFile=package.json)
[![dependencies](https://img.shields.io/badge/dependencies-0-brightgreen?style=for-the-badge)](https://bundlephobia.com/result?p=lit-element-effect)
[![code quality](https://img.shields.io/codeclimate/maintainability/MatthiasKainer/lit-element-effect?style=for-the-badge)](https://codeclimate.com/github/MatthiasKainer/lit-element-effect)
![Statements](badges/badge-statements.svg)
![Branch](badges/badge-branches.svg)
![Functions](badges/badge-functions.svg)
![Lines](badges/badge-lines.svg)

Two effect hooks, `useOnce` and `useEffect`, that can be used to trigger something only on first render, or when specific things change.

## Installation

```sh
npm install lit-element-effect
```

## Usage

```ts
@property()
prop: string | undefined;

render() {
    useOnce(this, () => {
        console.log("triggered once")
    })

    useEffect(this, () => {
        console.log("triggered each time this.prop changes.");
        console.log("Current Value: ", this.prop)
    }, [this.prop])
}
```
