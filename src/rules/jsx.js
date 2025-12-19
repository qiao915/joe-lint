// JSX 语言规则配置
import { baseRules, baseEnv, baseParserOptions } from './base.js';

export default {
  enabled: true,
  tool: 'eslint',
  config: {
    extends: ['eslint:recommended', 'plugin:react/recommended'],
    parserOptions: {
      ...baseParserOptions,
      ecmaFeatures: {
        jsx: true
      }
    },
    env: baseEnv,
    plugins: ['react'],
    settings: {
      react: {
        version: 'detect'
      }
    },
    rules: {

      "jsx-quotes": ["error", "prefer-double"], // 要求JSX属性值使用双引号
      "no-unused-expressions": "error", // 禁止未使用的表达式
      "no-useless-concat": "error", // 禁止不必要的字符串拼接
      "no-useless-escape": "error", // 禁止不必要的转义字符
      "react/checked-requires-onchange-or-readonly": "error", // 要求checked属性的元素同时包含onChange或readonly属性
      "react/conditionally-render-components": "error", // 要求条件渲染组件时使用逻辑运算符而不是if语句
      "react/display-name": "error", // 要求组件有displayName属性
      // "react/forbid-component-props": ["error", {"forbid": ["style"]}], // 禁止使用style属性
      // "react/forbid-dom-props": ["error", {"forbid": ["style", "id"]}], // 禁止节点使用id和style属性
      "react/hook-use-state": "error", // 要求使用useState Hook时包含初始值
      "react/html-For": "error", // 要求使用htmlFor属性而不是for属性
      "react/iframe-missing-sandbox": "error", // 要求iframe元素包含sandbox属性
      "react/iframe-title": "error", // 要求iframe元素包含title属性
      "react/img-redundant-alt": "off", // 不要求img元素包含alt属性
      "react/inline-comment-style": ["error", "block"], // 要求行内注释使用块注释风格
      "react/jsx-boolean-value": "error", // 强制布尔属性简写（如 `disabled` 而非 `disabled={true}`）
      "react/jsx-child-element-spacing": "error", // 要求JSX子元素之间有空格
      "react/jsx-closing-bracket-location": ["error", {
        "nonEmpty": "after-props", // 非空标签（有属性）：> 跟在最后一个属性同一行
        "selfClosing": "after-props", // 自闭合标签（如 <Input />）：/> 跟在最后一个属性同一行
        "allowMultiline": false // 禁止多行属性时，> 单独换行（进一步强化约束）
      }],
      "react/jsx-curly-brace-presence": ["error", {
        "props": "never",       // 属性值：禁止不必要的 {}
        "children": "never",    // 子元素：禁止不必要的 {}
        "propElementValues": "ignore" // 元素类型属性值（如 <Foo bar={<Baz />}>）：忽略管控（避免无意义报错）
      }],
      "react/jsx-curly-newline": ["error", {
        "multiline": "always",    // 多行表达式强制换行
        "singleline": "never",    // 单行表达式禁止换行
        "ignoreEmpty": true       // 忽略空花括号
      }],
      "react/jsx-equals-spacing": ["error", "never"], // 属性值等号周围不允许有空格
      "react/jsx-filename-extension": ["error", { "extensions": [".jsx", ".tsx"] }], // 要求JSX文件扩展名仅为.jsx 或 .tsx
      "react/jsx-handler-names": ["error", {
        "eventHandlerPrefix": "handle", // 事件处理器前缀（默认 "handle"）
        "eventHandlerPropPrefix": "on", // JSX 属性名前缀（默认 "on"，如 onClick/onChange）
        "checkLocalVariables": true,    // 校验局部变量形式的处理器（如 const fn = () => {}; <button onClick={fn} />）
        "checkInlineFunction": false    // 是否校验内联函数（如 onClick={() => {}}，默认 false，推荐保持）
      }],
      "react/jsx-key": "error", // 要求JSX元素有key属性
      "react/jsx-max-depth": ["error", { "max": 8 }], // 限制JSX嵌套深度（默认8层）
      "react/jsx-max-props-per-line": ["error", { 
        "singleline": { "max": 5 },  // 单行最多5个属性
        "multiline": { "max": 1 }    // 多行时每行仅允许1个属性
      }], 
      "react/jsx-newline": ["error", {
        "prevent": false,        // 禁止不必要的换行（极少用，默认 false）
        "allowMultilines": true, // 允许多行 JSX 元素（默认 true，核心参数）
        "before": false,         // 表达式块前强制换行（如 { ... } 前换行）
        "after": false           // 表达式块后强制换行（如 { ... } 后换行）
      }],
      "react/jsx-no-comment-textnodes": "error", // 禁止在JSX中使用注释文本节点
      "react/jsx-no-constructed-context-values": "error", // 禁止在JSX中使用构造的上下文值
      "react/jsx-no-duplicate-props": "error", // 禁止在JSX中重复属性
      "react/jsx-no-leaked-render": "error", // 禁止在JSX中使用未被渲染的表达式
      "react/jsx-no-undef": "error", // 禁止在JSX中使用未定义的变量
      "react/jsx-no-useless-fragment": "error", // 禁止在JSX中使用无意义的片段
      "react/jsx-pascal-case": "error", // 要求JSX组件名使用帕斯卡命名法（首字母大写）
      "react/jsx-props-no-multi-spaces": "error", // 禁止在JSX属性中使用多个空格
      "react/jsx-uses-react": "off", // 不要求在JSX中使用React
      "react/jsx-uses-vars": "error", // 要求在JSX中使用变量
      "react/no-access-state-in-setstate": "error", // 禁止在setState中访问state
      "react/no-deprecated": "error", // 禁止使用已弃用的API
      "react/no-direct-mutation-state": "error", // 禁止直接修改state
      "react/no-invalid-html-attribute": "error", // 禁止在JSX中使用无效的HTML属性
      "react/no-multi-comp": "error", // 禁止在一个文件中定义多个组件
      // "react/no-set-state": "error", // 禁止使用setState方法, 强制使用函数是组件 HOOK
      "react/no-this-in-sfc": "error", // 禁止在函数组件中使用this
      "react/no-unused-class-component-methods": "error", // 禁止在类组件中使用未使用的方法
      "react/no-unused-state": "error", // 禁止在类组件中使用未使用的state
      "react/prefer-es6-class": "error", // 强制使用 ES6 类组件而非 `React.createClass`
      "react/prefer-read-only-props": "error", // 要求组件的 props 是只读的
      "react/prefer-stateless-function": "error", // 强制无状态组件使用函数式写法
      "react/require-render-return": "error", // 强制 `render` 函数有返回值
      "react/self-closing-comp": ["error", {
        "component": true,  // 管控自定义组件（如 Button/Input）
        "html": true        // 管控原生 HTML 元素（如 div/input）
      }],
      "react/state-in-constructor": ["error", "never"], // 要求state在构造函数中初始化（默认 "never"，核心参数）
      "react/style-prop-object": "error", // 强制 `style` 属性为对象
      "react/void-dom-elements-no-children": "error", // 禁止无内容的 DOM 元素有子节点（如 `<img>`/`<br>`）
      "react-hooks/rules-of-hooks": "error", // 强制遵守 React Hooks 规则

      // 基础语法校验
      "no-undef": "error", // 禁止使用未声明的变量
      "no-unused-vars": "error", // 禁止声明后未使用的变量 / 函数 / 参数
      "no-extra-semi": "off", // 可以使用多余的分号
      "semi": ["error", "always"], // 强制语句末尾加分号
      "no-extra-parens": "off", // 可以多余的圆括号
      "no-dupe-keys": "error", // 禁止对象字面量中重复的键
      "no-duplicate-case": "error", // 禁止switch语句中重复的case标签
      "no-unreachable": "error", // 禁止不可达代码后的代码

      // 代码风格规范
      "indent": ["error", 2], // 缩进使用2个空格
      "space-infix-ops": "off", // 不要求操作符周围有空格
      "space-before-function-paren": "off", // 不要求函数圆括号前没有空格
      "comma-spacing": ["error", { "before": false, "after": false }], // 不要求逗号前后的空格
      "comma-style": ["error", "last"], // 要求逗号放在行尾（而非行首）

      "no-console": "warn", // 禁止使用console（警告级别）
      "no-alert": "error", // 禁止使用alert、confirm和prompt
      "no-debugger": "error", // 禁止使用debugger
      "quotes": ["error", "single"], // 要求使用单引号
      "comma-dangle": ["error", "never"], // 禁止使用拖尾逗号
      "no-multi-spaces": "error", // 禁止多个空格
      "no-trailing-spaces": "error", // 禁止行尾空格
      "eol-last": ["error", "always"], // 要求文件末尾有换行符
      "camelcase": "error", // 要求使用驼峰命名法
      "no-var": "error", // 禁止使用var，要求使用let或const
      "prefer-const": "error", // 要求使用const声明不会被重新赋值的变量
      "arrow-parens": ["error", "as-needed"], // 箭头函数参数仅在需要时使用圆括号
      
      // React 相关规则
      "react/prop-types": "off", // 关闭 prop-types 检查
      "react/react-in-jsx-scope": "off", // React 17+ 不需要在 JSX 中导入 React
      "react/jsx-indent": ["error", 2], // JSX 缩进使用2个空格
      "react/jsx-indent-props": ["error", 2], // JSX 属性缩进使用2个空格
      "react/jsx-tag-spacing": "error" // JSX 标签间距
    }
  }
};