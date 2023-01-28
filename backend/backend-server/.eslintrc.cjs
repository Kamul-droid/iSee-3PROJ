module.exports = {
  'env' : {
    'node'     : true,
    'commonjs' : true,
    'es2021'   : true
  },
  'extends'       : 'eslint:recommended',
  'overrides'     : [],
  'parserOptions' : {
    'ecmaVersion' : 'latest',
    'sourceType'  : 'module'
  },
  'rules' : {
    'array-bracket-spacing' : [
      2,
      'always'
    ],
    'array-bracket-newline' : [
      'error',
      {
        'multiline' : true,
        'minItems'  : 2
      }
    ],
    'array-element-newline' : [
      'error',
      {
        'multiline' : true,
        'minItems'  : 2
      }
    ],
    'prefer-template' : 0,
    'no-console'      : 'off',
    'quotes'          : [
      2,
      'single'
    ],
    'keyword-spacing' : [
      'error',
      { 'before' : true }
    ],
    'newline-after-var'       : 2,
    'no-multiple-empty-lines' : [
      'error',
      {
        'max'    : 1,
        'maxEOF' : 0
      }
    ],
    'comma-spacing' : [
      'error',
      {
        'before' : false,
        'after'  : true
      }
    ],
    'no-trailing-spaces' : 'error',
    'indent'             : [
      'error',
      2
    ],
    'multiline-ternary' : [
      'error',
      'always-multiline'
    ],
    'object-curly-newline' : [
      'error',
      {
        'ObjectExpression' : {
          'multiline'     : true,
          'minProperties' : 2
        },
        'ObjectPattern' : {
          'multiline'     : true,
          'minProperties' : 2
        },
        'ImportDeclaration' : {
          'multiline'     : true,
          'minProperties' : 2
        },
        'ExportDeclaration' : {
          'multiline'     : true,
          'minProperties' : 2
        }
      }
    ],
    'object-curly-spacing' : [
      'error',
      'always'
    ],
    'operator-linebreak' : [
      'error',
      'before'
    ],
    'object-property-newline' : 'error',
    'arrow-spacing'           : 'error',
    'brace-style'             : [
      'error',
      'stroustrup'
    ],
    'block-spacing' : 'error',
    'comma-dangle'  : [
      'error',
      {
        'arrays'  : 'only-multiline',
        'objects' : 'only-multiline'
      }
    ],
    'comma-style' : [
      'error',
      'last'
    ],
    'key-spacing' : [
      'error',
      {
        'beforeColon' : true,
        'afterColon'  : true,
        'align'       : 'colon'
      }
    ]
  },
  'ignorePatterns' : [
    '.eslintrc.js',
    'node_modules'
  ]
}
