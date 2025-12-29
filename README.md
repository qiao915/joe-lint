# joe-lint

[中文文档 (Chinese Documentation)](README.CN.md)

A comprehensive front-end code quality control tool that integrates multiple third-party tools, providing a unified command-line interface and report format. It also supports being used as a dependency package in projects.

## Features

- ✅ **Multi-file type support**: HTML, CSS, JS, TS, Vue, React, Markdown, EJS, JSX, TSX, Less, Scss, etc.
- ✅ **Integrates multiple checking tools**: ESLint, Stylelint, Prettier, commitlint, etc.
- ✅ **Full scanning**: Scan entire project code or specified directories, output detailed Markdown reports.
- ✅ **Git Hook support**: Configure with husky hooks to validate committed files.
- ✅ **Custom rules**: Support custom validation rules through JSON configuration files.
- ✅ **Commit message validation**: Support validating Git commit message format.
- ✅ **Bilingual reports**: Generate Markdown reports with both Chinese and English versions.
- ✅ **Dependency usage**: Support being used as a dependency package in Node.js projects.
- ✅ **Framework integration**: Seamlessly integrate with Vue, React, and Node.js projects.

## System Requirements

- **Node.js**: v14.13.0 or higher (supports ES modules)

## Installation

### Global Installation

```bash
npm install -g joe-lint
```

### Local Installation (Recommended)

```bash
npm install joe-lint --save-dev
```

## Quick Start

### Basic Usage

```bash
# Scan all files in the current directory
joe-lint

# Scan a specified directory
joe-lint /path/to/your/project
```

### Notes
- The default maximum number of files that can be checked in a single scan is **500** to avoid memory issues. You can customize this limit with the `--max-files` option.

### Framework Integration

#### Vue Project Integration

Add to the scripts section in `package.json`:

```json
"scripts": {
  "lint": "joe-lint",
  "lint-staged": "joe-lint --staged",
  "dev": "joe-lint && vite",
  "build": "joe-lint && vite build"
}
```

#### React Project Integration

Add to the scripts section in `package.json`:

```json
"scripts": {
  "lint": "joe-lint",
  "lint-staged": "joe-lint --staged",
  "start": "joe-lint && react-scripts start",
  "build": "joe-lint && react-scripts build"
}
```

#### Node.js Project Integration

Add to the scripts section in `package.json`:

```json
"scripts": {
  "lint": "joe-lint",
  "lint-staged": "joe-lint --staged",
  "start": "joe-lint && node index.js",
  "dev": "joe-lint && nodemon index.js"
}
```

### Check Staged Files

```bash
# Only check Git staged files
joe-lint --staged
```

### Custom Output File

```bash
# Scan and output results to a specified file
joe-lint --output my-lint-report.md
```

### Configure Git Hook

### Automatic Configuration

Use the `joe-lint --setup` command to automatically configure Git hooks:

```bash
joe-lint --setup
```

### Manual Configuration

Create hook files in the project's `.husky` directory:

#### pre-commit Hook

```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

joe-lint --staged
```

#### commit-msg Hook

```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

joe-lint --commitlint "$1"
```

```bash
# Configure Git hooks (pre-commit and commit-msg)
joe-lint --setup
```

## Command Parameters

| Parameter | Short | Description |
|-----------|-------|-------------|
| `--config <path>` | `-c` | Custom configuration file path |
| `--output <file>` | `-o` | Specify the output report filename |
| `--staged` | `-s` | Only check Git staged files |
| `--dir <paths...>` | `-d` | Check specified folders or files |
| `--setup` | | Configure Git hooks |
| `--commitlint <file>` | | Check commit message format |
| `--max-files <number>` | | Customize maximum number of files to check |
| `--version` | `-v` | Show current version |
| `--help` | `-h` | Show help information |

## Configuration File

### Default Configuration

joe-lint provides a default configuration file `.joelintrc.json` which includes recommended rules for all supported file types. You can use this file as a starting point for your custom configuration.

### Create Custom Configuration

Create a `.joelintrc.json` file in the project root directory. You can refer to the detailed configuration structure below:

```json
{
  "fileTypes": ["js", "ts", "vue", "react", "css", "less", "scss", "html", "ejs"],
  "maxFiles": 500,
  "linters": {
    "js": {
      "enabled": true,
      "rules": {
        "no-console": "warn",
        "semi": ["error", "always"]
      }
    },
    "ts": {
      "enabled": true,
      "rules": {
        "no-unused-vars": "error"
      }
      /* Other custom rules configuration */
    }
  },
  "commitlint": {
    "enabled": true,
    "config": {
      "extends": ["@commitlint/config-conventional"]
    }
  },
  "ignore": [
    "node_modules",
    "dist",
    "build",
    ".git"
  ],
  "output": {
    "format": "markdown",
    "file": "joe-lint-result.md"
  },
  "gitHook": {
    "enabled": true,
    "hooks": {
      "pre-commit": "lint",
      "commit-msg": "commitlint"
    }
  }
}
```

### Configuration Options

joe-lint supports the following configuration options:

| Option | Description |
|--------|-------------|
| **fileTypes** | List of file types to check (supports: js, javascript, ts, typescript, jsx, tsx, css, less, scss, html, vue, ejs) |
| **maxFiles** | Maximum number of files to check in a single scan (default: 500) |
| **linters** | Configuration for each file type's checker |
| **enabled** | Whether to enable this checker (true/false) |
| **rules** | Custom rules for this file type (rules will be merged with built-in default rules) |
| **commitlint** | Commit message format checking configuration |
| **ignore** | List of paths or patterns to ignore during linting |
| **output** | Output format and file configuration |
| **gitHook** | Git hook configuration |

### Built-in Default Rules

joe-lint provides built-in default rules for each file type. If no custom rules are provided, these default rules will be used. Here are the configurable rules for each file type with detailed explanations:

#### Markdown (MD)
- Default Rules:
  ```json
  "markdown": {
    "enabled": true,
    "tool": "markdownlint",
    "config": {
      "default": true,
      "rules": {
        "MD001": true, // First heading should be h1, single occurrence
        "MD002": true, // Headings should increment by one level at a time
        "MD003": { "style": "atx" }, // Headings must be atx style
        "MD004": { "style": "dash" }, // Unordered list items must use dashes
        "MD007": { "indent": 2 }, // Unordered list indentation is 2 spaces
        "MD013": false, // Line length limit (disabled by default)
        "MD047": true // Files must end with a newline
      }
    }
  }
  ```

#### JavaScript (JS)
- Extends: `eslint:recommended`
- Parser Options: ES2022
- Environments: Browser, Node.js
- Example Configurable Rules:
  ```json
  "js": {
    "enabled": true,
    "rules": {
      "no-unused-vars": "error", // Disallow unused variables, values: error/warn/off
      "no-undef": "error", // Disallow undefined variables, values: error/warn/off
      "no-console": "warn", // Disallow console statements, values: error/warn/off
      "no-alert": "error", // Disallow alert, confirm, and prompt, values: error/warn/off
      "no-debugger": "error", // Disallow debugger statements, values: error/warn/off
      "semi": ["error", "always"], // Require or disallow semicolons, values: ["error", "always"]/["error", "never"]
      "quotes": ["error", "single"], // Require single or double quotes, values: ["error", "single"]/["error", "double"]
      "comma-dangle": ["error", "never"], // Require or disallow trailing commas, values: ["error", "never"]/["error", "always"]
      "indent": ["error", 2], // Indentation rule, values: ["error", 2]/["error", "tab"]
      "no-multi-spaces": "error", // Disallow multiple spaces, values: error/warn/off
      "no-trailing-spaces": "error", // Disallow trailing spaces, values: error/warn/off
      "eol-last": ["error", "always"], // Require newline at end of file, values: ["error", "always"]/["error", "never"]
      "camelcase": "error", // Require camelcase naming convention, values: error/warn/off
      "no-var": "error", // Disallow var keyword, require let or const, values: error/warn/off
      "prefer-const": "error", // Require const for variables not reassigned, values: error/warn/off
      "arrow-parens": ["error", "as-needed"] // Require parentheses around arrow function arguments, values: ["error", "always"]/["error", "as-needed"]
    }
  }
  ```

#### TypeScript (TS)
- Extends: `eslint:recommended`, `@typescript-eslint/recommended`
- Parser: `@typescript-eslint/parser`
- Default Rules:
  ```json
  "ts": {
    "enabled": true,
    "rules": {
      "@typescript-eslint/no-unused-vars": "error", // Disallow unused variables
      "@typescript-eslint/explicit-function-return-type": "error" // Require explicit function return types
    }
  }
  ```
- Example Extended Rules:
  ```json
  "ts": {
    "enabled": true,
    "rules": {
      "@typescript-eslint/no-unused-vars": "error", // Disallow unused variables, values: error/warn/off
      "@typescript-eslint/explicit-function-return-type": "warn", // Require explicit function return types, values: error/warn/off
      "@typescript-eslint/explicit-module-boundary-types": "warn", // Require explicit module boundary types, values: error/warn/off
      "@typescript-eslint/no-explicit-any": "error", // Disallow any type, values: error/warn/off
      "@typescript-eslint/interface-name-prefix": ["error", "never"], // Interface name prefix rule, values: ["error", "never"]/["error", "always"]
      "@typescript-eslint/no-empty-function": "warn", // Disallow empty functions, values: error/warn/off
      "@typescript-eslint/no-namespace": "error", // Disallow namespaces, values: error/warn/off
      "@typescript-eslint/prefer-interface": "error", // Prefer interface over type for object types, values: error/warn/off
      "@typescript-eslint/semi": ["error", "always"] // Require or disallow semicolons, values: ["error", "always"]/["error", "never"]
    }
  }
  ```

#### CSS
- Extends: `stylelint-config-standard`
- Example Configurable Rules:
  ```json
  "css": {
    "enabled": true,
    "rules": {
      "indentation": 2, // Indentation size, values: 2/4/"tab"
      "at-rule-semicolon-newline-after": "always", // Require newline after at-rule semicolon, values: always/never
      "block-closing-brace-newline-before": "always", // Require newline before block closing brace, values: always/never
      "block-closing-brace-newline-after": "always", // Require newline after block closing brace, values: always/never
      "block-opening-brace-newline-after": "always-multi-line", // Require newline after block opening brace, values: always-multi-line/never
      "declaration-block-trailing-semicolon": "always", // Require trailing semicolon in declaration block, values: always/never
      "declaration-colon-space-after": "always", // Require space after declaration colon, values: always/never
      "declaration-colon-space-before": "never", // Disallow space before declaration colon, values: always/never
      "selector-combinator-space-after": "always", // Require space after selector combinator, values: always/never
      "selector-combinator-space-before": "always", // Require space before selector combinator, values: always/never
      "property-no-unknown": "error", // Disallow unknown properties, values: error/warn/off
      "selector-class-pattern": "^[a-zA-Z][a-zA-Z0-9\\-_]*$" // Require class names to start with letter, allow lowercase letters, numbers, underscores and dashes, values: regex pattern
      "color-no-invalid-hex": "error", // Disallow invalid hex colors, values: error/warn/off
      "comment-no-empty": "warn", // Disallow empty comments, values: error/warn/off
      "no-duplicate-selectors": "error", // Disallow duplicate selectors, values: error/warn/off
      "no-empty-source": "error" // Disallow empty source files, values: error/warn/off
    }
  }
  ```

#### Less
- Extends: `stylelint-config-standard`
- Custom Syntax: `postcss-less`
- Example Configurable Rules (similar to CSS, with Less-specific rules):
  ```json
  "less": {
    "enabled": true,
    "rules": {
      "indentation": 2, // Indentation size, values: 2/4/"tab"
      "at-rule-semicolon-newline-after": "always", // Require newline after at-rule semicolon
      "block-closing-brace-newline-before": "always", // Require newline before block closing brace
      "declaration-block-trailing-semicolon": "always", // Require trailing semicolon in declaration block
      "less/at-variable-pattern": "^[a-z-]+$", // Less variable naming pattern, values: regex
      "less/no-duplicate-variables": "error", // Disallow duplicate Less variables, values: error/warn/off
      "selector-class-pattern": "^[a-zA-Z][a-zA-Z0-9\\-_]*$" // Require class names to start with letter, allow lowercase letters, numbers, underscores and dashes, values: regex pattern
    }
  }
  ```

#### SCSS
- Extends: `stylelint-config-standard-scss`
- Example Configurable Rules:
  ```json
  "scss": {
    "enabled": true,
    "rules": {
      "scss/at-rule-no-unknown": "error", // Disallow unknown at-rules, values: error/warn/off
      "scss/dollar-variable-pattern": "^[a-z-]+$", // Dollar variable naming pattern, values: regex
      "scss/selector-no-redundant-nesting-selector": "error", // Disallow redundant nesting selectors, values: error/warn/off
      "scss/no-duplicate-dollar-variables": "error", // Disallow duplicate dollar variables, values: error/warn/off
      "scss/no-duplicate-mixins": "error", // Disallow duplicate mixins, values: error/warn/off
      "scss/at-import-partial-extension": ["error", "never"], // Require or disallow file extensions in imports, values: ["error", "always"]/["error", "never"]
      "scss/mixin-name-pattern": "^[a-z-]+$", // Mixin naming pattern, values: regex
      "scss/function-name-pattern": "^[a-z-]+$", // Function naming pattern, values: regex
      "scss/at-mixin-pattern": "^[a-z-]+$", // At-mixin naming pattern, values: regex
      "scss/at-function-pattern": "^[a-z-]+$", // At-function naming pattern, values: regex
      "selector-class-pattern": "^[a-zA-Z][a-zA-Z0-9\\-_]*$" // Require class names to start with letter, allow lowercase letters, numbers, underscores and dashes, values: regex pattern
    }
  }
  ```

#### HTML
- Extends: `eslint:recommended`
- Plugin: `html`
- Example Configurable Rules (similar to JavaScript, focused on inline scripts):
  ```json
  "html": {
    "enabled": true,
    "rules": {
      "no-unused-vars": "warn", // Disallow unused variables, values: error/warn/off
      "no-undef": "error", // Disallow undefined variables, values: error/warn/off
      "no-console": "warn", // Disallow console statements, values: error/warn/off
      "semi": ["error", "always"], // Require or disallow semicolons
      "quotes": ["error", "single"] // Require single or double quotes
    }
  }
  ```

#### Vue
- Extends: `eslint:recommended`, `plugin:vue/vue3-recommended`
- Parser: `vue-eslint-parser`
- Example Configurable Rules:
  ```json
  "vue": {
    "enabled": true,
    "rules": {
      "vue/no-unused-vars": "error", // Disallow unused variables, values: error/warn/off
      "vue/no-unused-components": "error", // Disallow unused components, values: error/warn/off
      "vue/require-default-prop": "warn", // Require default prop values, values: error/warn/off
      "vue/require-prop-types": "error", // Require prop types, values: error/warn/off
      "vue/html-indent": ["error", 2], // HTML template indentation, values: ["error", 2]/["error", "tab"]
      "vue/max-attributes-per-line": ["error", {
        "singleline": 3, // Maximum attributes per line for single-line elements
        "multiline": {
          "max": 1, // Maximum attributes per line for multi-line elements
          "allowFirstLine": false // Disallow attributes on first line for multi-line elements
        }
      }],
      "vue/singleline-html-element-content-newline": "off", // Require newline for single-line HTML element content, values: error/warn/off
      "vue/multiline-html-element-content-newline": ["error", { // Require newline for multi-line HTML element content, values: error/warn/off
        "minAttributes": 6,
        "ignoreWhenEmpty": true,
        "ignores": ["input", "el-button", "el-input"]
      }],
      "vue/html-self-closing": ["error", {
        "html": {
          "void": "always",
          "normal": "never",
          "component": "always"
        }
      }], // Require self-closing HTML elements, values: object config
      "vue/attribute-hyphenation": ["error", "always"], // Require hyphenated HTML attributes, values: ["error", "always"]/["error", "never"]
      "vue/order-in-components": ["error", {
        "order": [
          "el",
          "name",
          "key",
          "parent",
          "functional",
          ["delimiters", "comments"],
          ["components", "directives", "filters"],
          "extends",
          "mixins",
          ["provide", "inject"],
          "ROUTER_GUARDS",
          "layout",
          "middleware",
          "validate",
          "scrollToTop",
          "transition",
          "loading",
          "inheritAttrs",
          "model",
          "props",
          "emits",
          "setup",
          "asyncData",
          "data",
          "computed",
          "watch",
          "watchQuery",
          "LIFECYCLE_HOOKS",
          "methods",
          "head"
        ]
      }] // Require component options order, values: array config
    }
  }
  ```

#### React (JSX/TSX)
- Extends: `eslint:recommended`, `@typescript-eslint/recommended` (for TSX), `plugin:react/recommended`
- Parser Options: JSX enabled
- Example Configurable Rules:
  ```json
  "jsx": {
    "enabled": true,
    "rules": {
      "react/prop-types": "off", // Require prop types for components, values: error/warn/off
      "react/react-in-jsx-scope": "off", // Require React in scope for JSX (not needed in React 17+), values: error/warn/off
      "react/jsx-indent": ["error", 2], // JSX indentation, values: ["error", 2]/["error", "tab"]
      "react/jsx-indent-props": ["error", 2], // JSX props indentation, values: ["error", 2]/["error", "tab"]
      "react/jsx-quotes": ["error", "single"], // Require single quotes for JSX attributes, values: ["error", "single"]/["error", "double"]
      "react/jsx-semi": ["error", "always"], // Require or disallow semicolons in JSX, values: ["error", "always"]/["error", "never"]
      "react/jsx-uses-vars": "error", // Prevent unused variables in JSX, values: error/warn/off
      "react/jsx-uses-react": "error", // Prevent unused React in JSX, values: error/warn/off
      "react/no-deprecated": "error", // Disallow deprecated React features, values: error/warn/off
      "react/prefer-es6-class": ["error", "always"], // Require ES6 classes over React.createClass, values: ["error", "always"]/["error", "never"]
      "react/self-closing-comp": "error", // Require self-closing components, values: error/warn/off
      "react/jsx-no-undef": "error", // Disallow undefined components in JSX, values: error/warn/off
      "react/jsx-no-bind": "warn" // Disallow arrow functions or bind in JSX attributes, values: error/warn/off
    }
  }
  ```

#### EJS
- Extends: `eslint:recommended`
- Plugin: `ejs`
- Example Configurable Rules (similar to JavaScript):
  ```json
  "ejs": {
    "enabled": true,
    "rules": {
      "no-unused-vars": "warn", // Disallow unused variables, values: error/warn/off
      "no-undef": "error", // Disallow undefined variables, values: error/warn/off
      "no-console": "warn", // Disallow console statements, values: error/warn/off
      "semi": ["error", "always"], // Require or disallow semicolons
      "quotes": ["error", "single"] // Require single or double quotes
    }
  }
  ```

#### Markdown
- Uses: `markdownlint` with default rules
- Example Configurable Rules:
  ```json
  "markdown": {
    "enabled": true,
    "rules": {
      "MD001": true, // Heading levels should only increment by one level at a time, values: true/false
      "MD002": true, // First heading should be a top-level heading, values: true/false
      "MD003": { "style": "atx" }, // Heading style, values: atx/setext
      "MD004": { "style": "dash" }, // List marker style, values: dash/asterisk/plus
      "MD005": true, // List items should be consistently indented, values: true/false
      "MD007": { "indent": 2 }, // List items should be indented by 2 spaces, values: 2/4
      "MD009": { "br_spaces": 2 }, // Trailing spaces should be removed, values: object config
      "MD010": true, // Hard tabs should not be used, values: true/false
      "MD011": true, // Reversed link syntax should not be used, values: true/false
      "MD012": true, // Multiple consecutive blank lines should be avoided, values: true/false
      "MD013": { "line_length": 100 }, // Line length should be no more than 100 characters, values: number/false
      "MD014": true, // Dollar signs used before commands without showing output, values: true/false
      "MD018": true, // Header should be surrounded by blank lines, values: true/false
      "MD019": true, // Multiple consecutive spaces should be avoided, values: true/false
      "MD020": true, // No space after hash on atx style heading, values: true/false
      "MD021": true, // Multiple top-level headings in the same document, values: true/false
      "MD022": true, // Headings should be surrounded by blank lines, values: true/false
      "MD023": true, // Headings must start at the beginning of the line, values: true/false
      "MD024": true, // Multiple headings with the same content, values: true/false
      "MD025": { "level": 1 }, // Multiple top-level headings in the same document, values: object config
      "MD026": { "punctuation": ".;:!" }, // Trailing punctuation in heading, values: object config
      "MD027": true, // Multiple spaces after blockquote symbol, values: true/false
      "MD028": true, // Blank line inside blockquote, values: true/false
      "MD029": { "style": "ordered" }, // Ordered list item prefix, values: object config
      "MD030": { "br_spaces": 2 }, // Spaces after list markers, values: object config
      "MD031": true, // Fenced code blocks should be surrounded by blank lines, values: true/false
      "MD032": true, // Lists should be surrounded by blank lines, values: true/false
      "MD033": { "allowed_elements": ["br", "hr"] }, // Inline HTML should be allowed, values: object config
      "MD034": true, // Bare URL used, values: true/false
      "MD035": { "style": "---" }, // Horizontal rule style, values: object config
      "MD036": true, // Emphasis used instead of a heading, values: true/false
      "MD037": true, // Spaces inside emphasis markers, values: true/false
      "MD038": true, // Spaces inside code span elements, values: true/false
      "MD039": true, // Spaces inside link text, values: true/false
      "MD040": true, // Fenced code blocks should have a language specified, values: true/false
      "MD041": true, // First line in file should be a top-level heading, values: true/false
      "MD042": true, // No empty links, values: true/false
      "MD043": { "allowed_elements": ["br", "hr"] }, // Required spaces before and after code span elements, values: object config
      "MD044": { "names": ["TODO"] }, // Proper names should have the correct capitalization, values: object config
      "MD045": true, // Images should have alternate text (alt text), values: true/false
      "MD046": { "style": "fenced" }, // Code block style, values: object config
      "MD047": true, // Files should end with a single newline character, values: true/false
      "MD048": { "style": "consistent" } // Code fence style consistency, values: object config
    }
  }
  ```

> Note: For more detailed rule configurations, refer to the official documentation of each linting tool:
> - ESLint: https://eslint.org/docs/rules/
> - Stylelint: https://stylelint.io/user-guide/rules/
> - TypeScript ESLint: https://typescript-eslint.io/rules/
> - Vue ESLint: https://eslint.vuejs.org/rules/
> - React ESLint: https://github.com/yannickcr/eslint-plugin-react#list-of-supported-rules
> - Markdownlint: https://github.com/DavidAnson/markdownlint/blob/main/doc/Rules.md

### Commit Message Format Configuration

joe-lint also provides a default commit message format configuration file `.commitlintrc.json` based on the `@commitlint/config-conventional` preset. This file helps ensure consistent commit message formatting across your project.

## Git Hook Configuration

### Automatic Configuration

Use the `joe-lint --setup` command to automatically configure Git hooks:

```bash
joe-lint --setup
```

### Manual Configuration

Create hook files in the project's `.husky` directory:

#### pre-commit Hook

```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

joe-lint --staged
```

#### commit-msg Hook

```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

joe-lint --commitlint "$1"
```

## Supported File Types

| File Type | Extension | Checking Tool |
|-----------|-----------|---------------|
| HTML | .html | ESLint |
| CSS | .css | Stylelint |
| JavaScript | .js | ESLint |
| TypeScript | .ts | ESLint |
| Vue | .vue | ESLint |
| React | .jsx, .tsx | ESLint |
| Markdown | .md | markdownlint |
| EJS | .ejs | ESLint |
| Less | .less | Stylelint |
| Scss | .scss | Stylelint |

## Third-party Tool Integration

- **ESLint**: JavaScript/TypeScript/JSX/TSX/HTML/Vue/EJS checking
- **Stylelint**: CSS/Less/Scss checking
- **commitlint**: Git commit message checking
- **markdownlint**: Markdown file checking

## Using as Node.js Dependency

joe-lint supports being used as a dependency package in Node.js projects, allowing for customized calls in code.

### Install Dependency

```bash
npm install @qiao915/joe-lint --save-dev
```

### API Reference

#### lint(options)

Execute code quality check

- **options**: Configuration options
  - **files**: Paths of files or directories to check, can be string or array
  - **staged**: Whether to only check Git staged files
  - **config**: Custom configuration object
  - **outputFile**: Filename for output report

- **Return value**: Array of check results

#### lintCommitMessage(commitMessage, config)

Check commit message format

- **commitMessage**: Commit message string
- **config**: Configuration object (optional)

- **Return value**: Check result object

#### getConfig(configPath)

Get configuration information

- **configPath**: Configuration file path (optional)

- **Return value**: Configuration object

#### setupGitHooks()

Set up Git hooks

- **Return value**: Promise

### Usage Examples

```javascript
import { lint, lintCommitMessage, getConfig, setupGitHooks } from 'joe-lint';

// Example 1: Full scan of a specified directory
async function scanDirectory() {
  const result = await lint({
    files: './src', // Scan the src directory
    config: {}
  });
  console.log('Scan result:', result.length, 'issues');
}

// Example 2: Scan specified files
async function scanFiles() {
  const result = await lint({
    files: ['index.js', 'styles.css', 'README.md'], // Scan specified files
    config: {}
  });
  console.log('Scan result:', result.length, 'issues');
}

// Example 3: Check commit message
async function checkCommit() {
  const result = await lintCommitMessage('feat: add new feature', {});
  console.log('Commit message check:', result);
}

// Example 4: Set up Git hooks
async function setupHooks() {
  await setupGitHooks();
  console.log('Git hooks have been set up');
}

// Example 5: Get configuration
function getLintConfig() {
  const config = getConfig('./.joelintrc.json');
  console.log('Configuration info:', config);
}

// Execute examples
scanDirectory();
```

## Example Output

### Report File Naming Convention

The generated Markdown report files follow the naming format: `joe-lint-result-YYYYMMDDHHmmss.md`, which includes a timestamp to ensure unique filenames.

### Bilingual Markdown Report Example

```markdown
[toc]

# Code Quality Check Report

## Summary
- **Generated at:** 2025/12/11 17:55:46
- **Total Issues:** 4
- **Files Involved:** 1
- **Error Count:** 4
- **Warning Count:** 0


## File: /Users/wuqiao/myCode/前端审计/joe-lint/test-config.js
- **Error Count:** 4
- **Warning Count:** 0

### Problem Details

- **Line 2, Column 7**

  ```
  const unusedVariable = 'This should trigger no-unused-vars'; // Unused variable
  ```
  'unusedVariable' is assigned a value but never used.


- **Line 3, Column 5**

  ```
  var age = 25; // Using var instead of let/const
  ```
  'age' is assigned a value but never used.


- **Line 12, Column 1**

  ```
  testVariable = 'This is a test'
  ```
  'testVariable' is not defined.


- **Line 15, Column 1**

  ```
  unusedFunction();
  ```
  'unusedFunction' is not defined.




---

# 编码质量检查报告

## 摘要
- **生成时间:** 2025/12/11 17:55:46
- **问题总数:** 4
- **涉及文件数:** 1
- **错误数量:** 4
- **警告数量:** 0


## 文件: /Users/wuqiao/myCode/前端审计/joe-lint/test-config.js
- **错误数量:** 4
- **警告数量:** 0

### 问题详情

- **第2行, 第7列**

  ```
  const unusedVariable = 'This should trigger no-unused-vars'; // 未使用的变量
  ```
  'unusedVariable' is assigned a value but never used.


- **第3行, 第5列**

  ```
  var age = 25; // 使用var而不是let/const
  ```
  'age' is assigned a value but never used.


- **第12行, 第1列**

  ```
  testVariable = 'This is a test'
  ```
  'testVariable' is not defined.


- **第15行, 第1列**

  ```
  unusedFunction();
  ```
  'unusedFunction' is not defined.
```

## License

ISC

## Contribution

Welcome to submit Issues and Pull Requests to help improve this tool!

## Feedback

If you encounter any problems during use, please submit an Issue in the GitHub repository:
[https://github.com/qiao915/joe-lint/issues](https://github.com/qiao915/joe-lint/issues)