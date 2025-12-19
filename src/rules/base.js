// JavaScript/TypeScript 基础规则配置
export const baseRules = {
  // 条件语法/循环语法
  "for-direction": "off", // 不要求for循环中的迭代变量在循环体之前声明
  "getter-return": "off", // 不要求getter方法必须有返回值
  "no-async-promise-executor": "off", // 不要求异步Promise执行器中使用async/await
  "no-await-in-loop": "off", // 不要求循环中使用await
  "no-compare-neg-zero": "off", // 不要求比较负数和零
  "no-cond-assign": "off", // 不要求条件语句中使用赋值操作符
  "no-console": "off", // 不禁止使用console
  "no-constant-condition": "error", // 要求条件语句中不使用常量表达式
  "no-control-regex": "off", // 不要求正则表达式中使用控制字符
  "no-debugger": "error", // 要求禁止使用debugger语句
  "no-dupe-args": "error", // 要求函数参数中不重复
  "no-dupe-keys": "error", // 要求对象字面量中不重复的键
  "no-duplicate-case": "error", // 要求switch语句中不重复的case标签
  "no-empty": "error", // 禁止空的代码块
  "no-empty-character-class": "error", // 要求正则表达式中不使用空字符类
  "no-ex-assign": "error", // 禁止在 catch 中重新赋值错误对象
  "no-extra-boolean-cast": "error", // 要求在布尔上下文中不使用多余的布尔转换
  "no-extra-parens": "error", // 要求在表达式中不使用多余的括号
  "no-extra-semi": "error", // 要求在语句中不使用多余的分号
  "no-func-assign": "error", // 要求函数赋值语句中不使用赋值操作符
  "no-import-assign": "error", // 要求导入赋值语句中不使用赋值操作符
  "no-inner-declarations": "error", // 要求函数和块级作用域中不使用声明语句
  "no-invalid-regexp": "error", // 要求正则表达式字面量中不包含无效的正则表达式
  "no-irregular-whitespace": "error", // 要求字符串和注释中不包含不规则的空白字符
  "no-loss-of-precision": "error", // 要求在数值计算中不丢失精度
  "no-misleading-character-class": "error", // 要求正则表达式中不使用误导性的字符类
  "no-obj-calls": "error", // 要求对象作为函数调用时不使用call或apply方法
  "no-prototype-builtins": "error", // 禁止直接调用 Object.prototype 的方法
  "no-regex-spaces": "error", // 要求正则表达式中不使用多个空格
  "no-sparse-arrays": "error", // 要求数组中不使用稀疏元素
  "no-template-curly-in-string": "off", // 不禁止字符串中出现模板字符串的花括号
  "no-unexpected-multiline": "error", // 要求多行表达式中不使用意外的换行符
  "no-unreachable": "error", // 要求不可达代码
  "no-unreachable-loop": "error", // 禁止不可达的循环
  "no-unsafe-finally": "error", // 要求finally块中不使用可能导致异常的代码
  "no-unsafe-negation": "error", // 要求在布尔上下文中不使用不安全的取反操作符
  "require-atomic-updates": "error", // 要求在循环中使用原子更新
  "use-isnan": "error", // 要求使用 isNaN() 而非 == NaN
  "valid-typeof": "error", // 要求 typeof 操作符的操作数为字符串字面量

  //代码风格与最佳实践规则
  "accessor-pairs": "error", // 要求对象的getter和setter方法成对出现
  "array-callback-return": "error", // 检查回调函数是否有返回值
  "no-var": "error", // 禁止使用var关键字
  "block-scoped-var": "error", // 禁止在块级作用域内使用 var 声明变量
  "class-methods-use-this": ["error", { "exceptMethods": ["staticMethod"] }], // 要求类方法中使用 this 关键字, 但允许静态方法不使用 this
  "complexity": ["error", { "max": 5 }], // 要求函数的圈复杂度不超过5
  "consistent-return": "off", // 不要求函数中每个分支都有返回值
  "curly": ["error", "multi-line"], // 要求使用大括号包裹多行语句
  "default-case": "error", // 要求 switch 语句中必须有 default 分支
  "default-param-last": "off", // 不要求默认参数出现在参数列表的最后
  "dot-location": ["error", "property"], // 要求点号操作符出现在属性名之前
  "dot-notation": ["error", { "allowKeywords": true }], // 要求使用点号操作符访问属性, 但允许使用关键字作为属性名
  "eqeqeq": ["error", "smart"], // 要求使用严格相等运算符（===和!==）, 但允许使用==和!=
  "grouped-accessor-pairs": ["error", "getBeforeSet"], // 要求对象的 getter/setter 相邻声明（getter 在 setter 前）
  "guard-for-in": "off", // 不要求使用 for-in 循环时必须有 if 语句保护
  "max-classes-per-file": ["error", { "max": 1 }], // 要求每个文件最多只有一个类
  "no-alert": "error", // 禁止使用 alert/confirm/prompt
  "no-caller": "error", // 禁止使用 arguments.callee/caller
  "no-case-declarations": "error", // 禁止在 switch 语句中使用 case 声明变量
  "no-constructor-return": "error", // 禁止构造函数返回非对象值
  "no-div-regex": "error", // 禁止使用除法运算符（/）作为正则表达式的开始或结束字符
  "no-else-return": "off", // 不要求在 else 分支中使用 return 语句
  "no-empty-function": ["error", { "allow": ["arrowFunctions"] }], //禁止空函数（允许空箭头函数）
  "no-empty-pattern": "error", // 禁止空的解构模式
  "no-eq-null": "error", // 禁止与 null 比较（应使用 === null）
  "no-eval": "error", // 禁止使用 eval() 函数
  "no-extend-native": "error", // 禁止扩展原生对象
  "no-extra-bind": "error", // 禁止使用多余的 bind 调用
  "no-extra-label": "error", // 禁止使用多余的标签
  "no-fallthrough": ["error", { "commentPattern": "// fallthrough" }], // 禁止 switch 的 case 穿透（无 break 时）, 但允许使用注释 // fallthrough 来表示意图
  "no-floating-decimal": "error", // 禁止浮点数字面量省略整数 / 小数部分
  "no-global-assign": "error", // 禁止对全局对象进行赋值
  "no-implicit-coercion": "off", // 不禁止使用隐式类型转换
  "no-implicit-globals": "error", // 禁止在全局作用域中使用未声明的变量
  "no-implied-eval": "error", // 禁止使用隐含的 eval() 函数
  "no-invalid-this": "error", // 禁止在非对象上下文中使用 this 关键字
  "no-iterator": "error", // 禁止使用 __iterator__ 属性
  "no-labels": "error", // 禁止使用标签语句
  "no-lone-blocks": "error", // 禁止使用单独的代码块
  "no-loop-func": "error", // 禁止在循环内声明函数（易导致闭包问题）
  "no-magic-numbers":"off", // 禁止使用魔术数字（0和1除外）, 但要求将其他数字声明为常量
  "no-multi-spaces": ["error", { "ignoreEOLComments": true }], // 禁止使用多个空格, 但允许在注释中使用
  "no-multi-str": "error", // 禁止使用多行字符串字面量
  "no-new": "error", // 禁止使用 new 关键字创建对象实例（应使用对象字面量或类构造函数）
  "no-new-func": "error", // 禁止使用 new 关键字创建函数实例（应使用函数表达式或箭头函数）
  "no-new-wrappers":"error", // 禁止使用 new String/Number/Boolean，但允许 new Arrary/Object
  "no-nonoctal-decimal-escape": "off", // 不禁止使用非八进制转义序列
  "no-octal": "error", // 禁止使用八进制字面量
  "no-octal-escape": "error", // 禁止使用八进制转义序列
  "no-param-reassign": "error", // 禁止修改函数参数
  "no-proto": "error", // 禁止使用 __proto__ 属性，使用getPrototypeOf/setPrototypeOf代替
  "no-redeclare": "error", // 禁止重复声明变量
  "no-restricted-properties": ["error", { "object": "arguments", "property": "callee", "message": "arguments.callee is deprecated" }], // 禁止使用 arguments.callee/caller
  "no-return-assign": "off", // 允许在 return 语句中赋值
  "no-script-url": "off", // 禁止使用 javascript: 协议的 URL
  "no-self-assign": "error", // 禁止将变量赋值给自己
  "no-self-compare": "error", // 禁止将变量与自身比较
  "no-sequences": "error", // 禁止使用逗号运算符
  "no-throw-literal": "off", // 不禁止抛出非 Error 对象
  "no-unmodified-loop-condition": "error", // 禁止循环条件未修改（循环条件变量未在循环内更新，导致死循环 / 永不执行）
  "no-unused-expressions": "error", // 禁止未使用的表达式
  "no-unused-labels": "error", // 禁止未使用的标签
  "no-useless-call": "error", // 禁止无意义的函数调用
  "no-useless-catch": "error", // 禁止无意义的 catch 块
  "no-useless-concat": "error", // 禁止无意义的字符串拼接
  "no-useless-escape": "error", // 禁止无意义的转义字符
  "no-useless-return": "error", // 禁止无意义的 return 语句
  "no-void": ["error", { "allowAsStatement": false }], // 禁止使用 void 运算符
  "no-warning-comments":"off", // 不禁止使用警告注释（如 // TODO: 或 // FIXME:）
  "no-with": "error", // 禁止使用 with 语句
  "prefer-named-capture-group": "error", // 要求使用命名捕获组
  "prefer-promise-reject-errors": ["error", { "allowEmptyReject": false }], // 要求在 Promise 拒绝时使用 Error 对象
  "prefer-regex-literals": "off", // 不要求使用正则表达式字面量
  "radix": ["error", "as-needed"], // parseInt()在需要的时候指定基数（如parseInt("10", 10)）
  "require-await": "error", // 要求在异步函数中使用 await 关键字
  "require-unicode-regexp": "error", // 要求在正则表达式中使用 Unicode 转义序列
  "vars-on-top": "error", // 要求变量声明放在作用域顶部（提升可读性，避免变量提升问题）
  "wrap-iife": ["error", "any"], // 要求将立即调用的函数表达式（IIFE）包裹在括号中
  "yoda":["error", "never", { "exceptRange": true }], // 要求在条件语句中使用 Yoda 条件（如 if (x === 5)）

  // 代码风格规范
  "array-bracket-newline":"off", // 不要求数组括号换行
  "array-bracket-spacing": "off", // 不要求数组括号内没有空格
  "array-element-newline": "off", // 不要求数组元素换行
  "block-spacing": "off", // 不要求块级语句周围有空格
  "brace-style": "off", // 要求大括号风格为1tbs
  "camelcase": "error", // 要求使用驼峰命名法
  "capitalized-comments": "off", // 不要求注释首字母大写
  "comma-dangle": "off", // 不要求拖尾逗号
  "comma-spacing": ["error", { "before": false, "after": true }], // 逗号前面不能有空格，逗号后面必须有空格
  "comma-style": ["error", "last"], // 要求逗号放在行尾（而非行首）
  "computed-property-spacing": "off", // 不要求计算属性的方括号内没有空格
  "consistent-this": ["error", "self"], // 要求this关键字在方法中保持一致的引用
  "eol-last": "off", // 不要求文件末尾有换行符
  "func-call-spacing": "off", // 不要求函数调用时的空格
  "func-name-matching": ["error", "never"], // 要求函数名与赋值变量名匹配
  "func-names": "off", // 不要求函数表达式的名称
  "func-style": "off", // 不要求函数风格
  "function-call-argument-newline": "off", // 不要求函数调用时的参数换行
  "function-paren-newline": "off", // 不要求函数圆括号内换行
  "id-blacklist": "off", // 禁用旧版的id-blacklist规则
  "id-denylist": "error", // 禁用不推荐使用的标识符名称
  "id-length": "off", // 不限制标识符的长度
  "id-match": ["error", "^[a-z]+([A-Z][a-z0-9]*)*$"], // 要求变量名匹配驼峰命名法
  "implicit-arrow-linebreak": ["error", "beside"], // 不要求隐式箭头函数换行
  "indent": ["error", 2], // 缩进使用2个空格
  "jsx-quotes": ["error", "prefer-double"], // 要求JSX属性值使用双引号
  "key-spacing": ["error", { "beforeColon": false, "afterColon": true }], // 要求对象字面量属性名和值之间有空格
  "keyword-spacing": ["error", {
    "before": true,  // 关键字（catch/if/for 等）前必须有1个空格
    "after": true,   // 关键字后必须有1个空格（如 catch (error) 中 ( 前的空格）
    "overrides": {
      // 单独约束 for/if：前面无空格（覆盖默认的 before: true）
      "if": { "before": false },
      "for": { "before": false },
      // else if 无需单独配置：else/if 分别遵循各自规则（else 前有空格、if 前无空格 → else if 自动符合）
      "else": { "before": true }, // 兜底：确保 else 前有空格
      "catch": { "before": true } // 兜底：确保 catch 前有空格
    }
  }], // 要求关键字周围有空格
  "line-comment-position": "off", // 要求行注释在代码行上方
  "linebreak-style": "off", // 不要求换行符风格
  "lines-around-comment": "off", // 不要求注释周围有空行
  "lines-between-class-members": "off", // 不要求类成员之间有空行
  "max-depth": ["error", 5], // 要求最大嵌套深度为5层
  "max-len": ["error", 120], // 要求每行字符长度不超过120个字符
  "max-lines": ["error", 800], // 要求文件最大行数为800行
  "max-params": ["error", 5], // 要求函数最多有5个参数
  "max-nested-callbacks": ["error", 3], // 要求最大嵌套回调层数为3层
  "max-statements": ["error", 100], // 要求每个函数最多有20条语句
  "max-statements-per-line": ["error", { "max": 1 }], // 要求每行最多有1条语句
  "multiline-comment-style": "off", // 不要求多行注释风格
  "multiline-ternary": "off", // 不要求多行三元表达式
  "new-cap": ["error", { "newIsCap": true, "capIsNew": false }], // 要求构造函数名首字母大写，普通函数名首字母小写
  "new-parens": ["error", "always"], // 要求在调用构造函数时使用圆括号
  "newline-per-chained-call": ["error", { "ignoreChainWithDepth": 3 }], // 要求每个链式调用前换行，最大深度为3层
  "no-array-constructor": "off", // 不要求使用数组构造函数
  "no-bitwise": "off", // 不要求使用按位运算符 | & ^
  "no-continue": "error", // 禁止使用continue语句
  "no-inline-comments": "off", // 可以使用行内注释
  "no-lonely-if": "error", // 禁止孤立的 if（else 内的独立 if）
  "no-mixed-operators": "error", // 禁止混合使用操作符
  "no-mixed-spaces-and-tabs": "off", // 不要求混合使用空格和制表符缩进
  "no-multi-assign": "error", // 禁止使用多个赋值语句
  "no-multiple-empty-lines": ["error", { "max": 1, "maxEOF": 0 }], // 要求最多有1个空行，文件末尾可以有0个空行
  "no-negated-condition":"off", // 不要求使用否定条件
  "no-nested-ternary": "off", // 不禁止嵌套的三元表达式
  "no-new-object": "off", // 不禁止使用对象构造函数
  "no-plusplus": "off", // 不禁止使用++和--运算符
  "no-restricted-syntax":"off", // 不禁止使用特定的语法
  "no-tabs": "off", // 不禁止使用制表符缩进
  "no-ternary": "off", // 不禁止使用三元表达式
  "no-trailing-spaces": "off", // 不禁止行尾空格
  "no-underscore-dangle": ["error", { "allow": ["_id"] }], // 禁止标识符结尾有下划线
  "no-unneeded-ternary": "off", // 不禁止不必要的三元表达式
  "no-whitespace-before-property": "error", // 要求属性名前有空格
  "nonblock-statement-body-position": "off", // 不要求非块语句体位置
  "object-curly-spacing": ["error", "always"], // 要求对象字面量的大括号内有空格
  // "object-curly-newline": ["error", { "multiline": true, "minProperties": 3, "consistent": true }], // 要求对象字面量多行时，每个属性占一行，最少3个属性
  "object-curly-newline":"off", // 要求对象字面量多行时，每个属性占一行，最少3个属性
  "object-property-newline": "error", // 要求对象字面量的属性换行时，每个属性占一行
  "object-shorthand": "error", // 要求对象字面量使用简写形式
  "one-var": "off", // 不要求每个变量声明语句只声明一个变量
  "one-var-declaration-per-line": "off", // 不要求每个变量声明语句占一行
  "operator-assignment": "off", // 不要求使用赋值运算符
  "operator-linebreak": "off", // 不要求运算符换行
  "padded-blocks": ["error", "never"], // 要求块语句内有空格
  "padding-line-between-statements": "off", // 不要求语句之间有空格
  "prefer-exponentiation-operator": "off", // 不要求使用指数运算符
  "prefer-object-spread": "off", // 不要求使用对象展开运算符
  "quote-props": ["error", "as-needed"], // 要求对象字面量属性名使用双引号，只有在必要时才使用单引号
  "quotes": "off", // 要求字符串使用双引号
  "semi": ["error", "always"], // 要求语句结束时使用分号
  "semi-spacing": ["error", { "before": false, "after": true }], // 要求分号前无空格，分号后有空格
  "semi-style": ["error", "last"], // 要求分号在语句末尾
  "sort-keys": "off", // 不要求对象字面量属性按字母顺序排序
  "sort-vars": "off", // 不要求变量按字母顺序排序
  "space-before-blocks": "off", // 要求块语句前有空格
  "space-before-function-paren": "off", // 不要求函数名前有空格
  "space-in-parens": "off", // 不要求圆括号内有空格
  "space-infix-ops": ["error", { "int32Hint": true }], // 要求中缀操作符周围有空格
  "space-unary-ops": "off", // 不要求一元操作符周围有空格
  "spaced-comment": "off", // 不要求注释前有空格
  "switch-colon-spacing": ["error", { "after": false, "before": false }], // 要求switch语句冒号周围有空格
  "template-tag-spacing": "off", // 不要求模板标签周围有空格
  "unicode-bom": "off", // 不要求文件开头有字节顺序标记
  "wrap-regex": "off", // 不要求正则表达式字面量周围有空格
};

export const baseEnv = {
  node: true,
  browser: true,
  es2022: true
};

export const baseGlobals = {
  console: true,
  require: true,
  module: true,
  __dirname: true,
  __filename: true,
  process: true,
  setTimeout: true,
  clearTimeout: true,
  setInterval: true,
  clearInterval: true,
  Buffer: true
};

export const baseParserOptions = {
  ecmaVersion: 'latest',
  sourceType: 'module'
};