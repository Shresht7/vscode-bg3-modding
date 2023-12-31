# `BG3 Modding` support for Visual Studio Code

This VS Code extension contains useful tools, snippets and helpers for creating mods for [**Baldur's Gate 3**](https://baldursgate3.game/).

<details>

<summary>
    <b>Table of Contents</b>
</summary>

- [⚡ Activation Events](#-activation-events)
- [⭐ Features](#-features)
  - [📄 Snippets](#-snippets)
  - [⌨️ Commands](#️-commands)
    - [`Generate UUID`](#generate-uuid)
    - [`Generate Handle`](#generate-handle)
    - [`Copy Mod UUID`](#copy-mod-uuid)
    - [`Convert Version Number`](#convert-version-number)
    - [`Bump Version Number`](#bump-version-number)
  - [✅ JSON Validation](#-json-validation)
  - [⚙️ Default Configurations](#️-default-configurations)
    - [`files.associations`](#filesassociations)
    - [`search.exclude`](#searchexclude)
- [⚙️ Extension Settings](#️-extension-settings)
- [📄 License](#-license)

</details>


## ⚡ Activation Events

- `workspaceContains:/**/meta.lsx`
  
  The extension activates for a workspace that contains the `meta.lsx` file.

## ⭐ Features

<!-- no toc -->
- [📄 Snippets](#-snippets)
- [⌨️ Commands](#️-commands)
- [✅ JSON Validation](#-json-validation)
- [⚙️ Default Configurations](#️-default-configurations)

<!-- 
`TODO`

Describe specific features of your extension including screenshots of your extension in action. Image paths are relative to this README file.

For example if there is an image subfolder under your extension project workspace:

\!\[feature X\]\(images/feature-x.png\)

> Tip: Many popular extensions utilize animations. This is an excellent way to show off your extension! We recommend short, focused animations that are easy to follow.
-->

### 📄 Snippets

The extension contributes the following snippets:

| Name                            |           Activation | Description                                               |
| ------------------------------- | -------------------: | --------------------------------------------------------- |
| BG3 UUID                        |               `uuid` | Generate a random UUID                                    |
| BG3 Handle                      |             `handle` | Generates a random UUID handle used in localization files |
| `Ext.Utils.Print()`             |       `print`, `eup` | `Ext.Utils.Print()`                                       |
| `Ext.Osiris.RegisterListener()` |  `rl`, `orl`, `eorl` | `Ext.Osiris.RegisterListener()`                           |
| Override Stat Entry             |    `new`, `override` | Create an override for an existing Stat Entry             |
| Script-Extender Config          | `cfg`, `Config.json` | Generates the boilerplate Script-Extender `Config.json`   |
| `meta.lsx`                      |               `meta` | Generates the boilerplate template for `meta.lsx`         |

<div align="right">

  [Back to Top ⬆️](#bg3-modding-support-for-visual-studio-code)

</div>

### ⌨️ Commands

The extension contributes the following commands:

<!-- no toc -->
- [`Generate UUID`](#generate-uuid)
- [`Generate Handle`](#generate-handle)
- [`Copy Mod UUID`](#copy-mod-uuid)
- [`Convert Version Number`](#convert-version-number)
- [`Bump Version Number`](#bump-version-number)

#### `Generate UUID`

Generate a random UUID and insert at the current selection.

```
b7b98e25-ff34-40dd-b019-ab25521ae5a0
```

#### `Generate Handle`

Generate Handle and insert at the current selection.

```
hb7b98e25gff34g40ddgb019gab25521ae5a0
```

#### `Copy Mod UUID`

Copies the Mod's UUID to the clipboard.

#### `Convert Version Number`

Convert between BG3 version numbers.

```
1.0.0.0 --> 36028797018963968
36028797018963968 --> 1.0.0.0
```

##### Input: Version Number

Takes the version number as input in either the string format (e.g. `1.0.0.0`) or bigint format (e.g. `36028797018963968`).

#### `Bump Version Number`

Bumps the version number in the `meta.lsx` by the specified type.

```
1.0.0.0 --- Bump Minor Version --> 1.1.0.0
1.2.0.7 --- Bump Major Version --> 2.0.0.0
```

##### Input: Kind

- `Major`
- `Minor`
- `Revision`
- `Build`

<div align="right">

  [Back to Top ⬆️](#bg3-modding-support-for-visual-studio-code)

</div>

### ✅ JSON Validation

The extension contributes JSON validation schemas for:
- [`ScriptExtender/Config.json`](./schema/Config.schema.json)
- [`ScriptExtenderSettings.json`](./schema/ScriptExtenderSettings.schema.json)

This will enable intellisense and provide validation for these files.

<div align="right">

  [Back to Top ⬆️](#bg3-modding-support-for-visual-studio-code)

</div>

### ⚙️ Default Configurations

The extension provides default configuration settings for:

#### `files.associations`

```json
"files.associations": {
    "*.lsx": "xml",
    "*.lsj": "json"
},
```

#### `search.exclude`

```json
"search.exclude": {
    "**/*.raw": true,
    "**/Story/*.div": true,
    "**/*.osi": true,
    "**/*.dat": true
}
```

<div align="right">

  [Back to Top ⬆️](#bg3-modding-support-for-visual-studio-code)

</div>

---

## ⚙️ Extension Settings

Include if your extension adds any VS Code settings through the `contributes.configuration` extension point.

For example:

This extension contributes the following settings:

* `myExtension.enable`: Enable/disable this extension.
* `myExtension.thing`: Set to `blah` to do something.

<div align="right">

  [Back to Top ⬆️](#bg3-modding-support-for-visual-studio-code)

</div>

---

## 📄 License

This project is licensed under the [MIT License](./LICENSE).
