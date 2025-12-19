// Less 语言规则配置
export default {
  enabled: true,
  tool: 'stylelint',
  config: {
    extends: ['stylelint-config-standard'],
    customSyntax: 'postcss-less',
    rules: {
      // 基础规则扩展
      // 允许的单位列表
      'unit-no-unknown': [true, { ignoreUnits: ['rpx'] }],
      // 允许特定的伪元素
      'selector-pseudo-element-no-unknown': [true, { ignorePseudoElements: ['v-deep', 'v-global', '/deep/'] }],
      // 允许特定的选择器类型
      'selector-type-no-unknown': [true, { ignoreTypes: ['custom-tag'], ignoreNamespaces: ['svg', 'canvas'] }],
      // 允许特定的属性
      'property-no-unknown': [true, { ignoreProperties: ['-webkit-appearance'], ignoreSelectors: [/^::-webkit-/] }],
      // 颜色函数使用旧版表示法
      'color-function-notation': 'legacy',
      // alpha 值使用数字表示法
      'alpha-value-notation': 'number',
      // 颜色十六进制值允许3位或6位
      'color-hex-length': 'any',
      // 数字最大精度为2
      'number-max-precision': 2,
      // 允许使用 rgba() 函数别名
      'color-function-alias-notation': null,
      // 声明前不需要空行
      'declaration-empty-line-before': null,
      // 规则前只允许一个空行
      'rule-empty-line-before': ['always', {
        'except': ['first-nested'],
        'max-empty-lines': 1
      }],
      // 不要求通用字体族
      'font-family-no-missing-generic-family-keyword': null,
      // CSS样式名不作限制，允许驼峰大小写横线共用
      'selector-class-pattern': null
    }
  }
};