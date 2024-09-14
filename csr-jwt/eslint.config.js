import nekoConfig from '@nekochan0122/config/eslint'
import eslintPluginQuery from '@tanstack/eslint-plugin-query'
import eslintPluginTailwind from 'eslint-plugin-tailwindcss'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  ...nekoConfig.presets.react,
  ...eslintPluginQuery.configs['flat/recommended'],
  ...eslintPluginTailwind.configs['flat/recommended'],
  {
    languageOptions: {
      globals: globals.browser,
    },
  },
  {
    ignores: [
      'dist',
      './src/route-tree.gen.ts',
    ],
  },
)
