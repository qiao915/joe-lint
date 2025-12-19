// Vue 语言规则配置
import { baseRules, baseEnv, baseParserOptions, baseGlobals } from './base.js';

export default {
  enabled: true,
  tool: 'eslint',
  config: {
    extends: ['eslint:recommended', 'plugin:vue/vue3-recommended'],
    parser: 'vue-eslint-parser',
    parserOptions: {
      ...baseParserOptions,
      ecmaFeatures: {
        jsx: true
      }
    },
    env: baseEnv,
    globals: baseGlobals,
    rules: {
      ...baseRules,
      // Vue 特定规则
      "vue/no-parsing-error": "error", // 禁止解析错误
      "vue/no-unclosed-tags": "error", // 禁止未关闭的标签
      "vue/no-invalid-v-bind": "error", // 禁止无效的v-bind指令
      "vue/no-invalid-v-on": "error", // 禁止无效的v-on指令
      "vue/no-invalid-v-for": ["error", { "allowUsingIterationVarInIf": false }], // 禁止无效的v-for指令， 禁止在v-for中使用v-if
      "vue/no-invalid-v-model": "error", // 禁止无效的v-model指令
      "vue/no-reserved-keys": ["error", { "reservedKeys": ["key", "ref", "slot", "slot-scope", "scoped-slot"] }], // 禁止使用保留键名
      "vue/no-duplicate-attributes": ["error", { "allowCoexistClass": true, "allowCoexistStyle": true }], // 禁止重复的属性，允许class和style
      "vue/no-dupe-keys": "error", // 禁止重复的键
      "vue/no-dupe-v-else-if": "error", // 禁止重复的v-else-if指令

      // 模板规则
      "vue/valid-template-root": "error", // 禁止多个模板根元素

      //组件规则
      "vue/no-duplicate-component-names": "error", // 禁止重复的组件名
      "vue/no-empty-component-block": "error", // 禁止空的组件块
      "vue/no-reserved-component-names": ["error", { "reserved": ["component", "slot", "template"], "disallowVueBuiltInComponents": true }], // 禁止使用Vue保留的组件名
      "vue/no-unregistered-components": "error", // 禁止使用未注册的组件
      "vue/no-unused-components": "error", // 禁止未使用的组件
      "vue/no-unused-properties": "error", // 禁止定义未使用的 props/emit/attrs
      "vue/require-component-is": "off", // 不要求组件使用is属性
      "vue/require-name-property": "error", // 要求组件定义name属性
      "vue/require-prop-types": "error", // 要求组件定义props属性
      "vue/require-render-return": "error", // 要求组件定义render函数
      "vue/return-in-computed-property": "error", // 要求计算属性中必须有return语句

      //属性规则
      "vue/attribute-hyphenation": ["error", "always", {"ignore": ["vModel", "vBind", "vOn", "vSlot", "uploadUrl", "dialogVisible", "formItemLayout", "customProp"]}], // 要求组件属性使用连字符命名法
      "vue/html-quotes": ["error", "double"], // 要求HTML属性值使用双引号
      "vue/max-attributes-per-line": ["error", { "singleline": 5, "multiline": 1 }], // 要求每行最多3个属性
      "vue/no-multi-spaces": "error", // 禁止多个空格
      "vue/no-spaces-around-equal-signs-in-attribute": "error", // 禁止属性值周围有空格
      "vue/prefer-true-attribute-shorthand": "error", // 要求使用true属性简写
      "vue/require-prop-type-constructor": "error", // 要求props属性值使用构造函数
      "vue/v-bind-style": ["error", "shorthand"], // 要求v-bind指令使用简写语法
      "vue/v-on-style": ["error", "shorthand"], // 要求v-on指令使用简写语法
      "vue/no-duplicate-attrs-in-v-on": "error", // 禁止在v-on指令中重复属性  
      "vue/no-useless-v-on": "error", // 禁止在v-on指令中使用无意义的事件处理函数

      // 代码风格规则
      "vue/block-lang": ["error", { "script": { "lang": "string" }, "style": { "lang": "string" }, "template": { "lang": "string" } }], // 要求组件块使用指定的语言
      "vue/block-order": ["error", { "order": ["template", "script", "style"] }], // 要求组件块的顺序
      "vue/component-options-name-casing": ["error", "camelCase"], // 要求组件选项名使用短横线命名法
      "vue/html-end-tags": "error", // 要求HTML标签有结束标签
      "vue/no-irregular-whitespace": "error", // 禁止不规则的空白字符

      // Vue 相关规则覆盖
      "vue/require-default-prop": "off", // 不要求组件的props有默认值
      "vue/singleline-html-element-content-newline": "off", // 允许单行HTML元素内容
      "vue/multiline-html-element-content-newline": "off", // 允许多行HTML元素内容不换行
      "vue/script-setup-uses-vars": "error", // 确保在setup script中声明的变量被使用
      "vue/html-indent": ["error", 2], // HTML模板缩进使用2个空格
      "vue/html-closing-bracket-newline": ["error", {
        "singleline": "never",
        "multiline": "always"
      }], // HTML闭合括号换行规则
      "vue/html-closing-bracket-spacing": ["error", {
        "startTag": "never",
        "endTag": "never",
        "selfClosingTag": "always"
      }], // HTML闭合括号空格规则
    }
  }
};