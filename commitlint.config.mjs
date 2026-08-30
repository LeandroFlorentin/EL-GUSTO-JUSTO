export default {
  extends: ['@commitlint/config-conventional'],

  rules: {
    // Tipos de commit permitidos
    'type-enum': [
      2,
      'always',
      ['feat', 'fix', 'refactor', 'perf', 'test', 'docs', 'style', 'build', 'ci', 'chore', 'revert'],
    ],

    // El tipo siempre en minúsculas
    'type-case': [2, 'always', 'lower-case'],

    // El tipo es obligatorio
    'type-empty': [2, 'never'],

    // La descripción es obligatoria
    'subject-empty': [2, 'never'],

    // Sin punto al final
    'subject-full-stop': [2, 'never', '.'],

    // Máximo 100 caracteres en el encabezado
    'header-max-length': [2, 'always', 100],

    // Si usamos scope, debe estar en minúsculas
    'scope-case': [2, 'always', 'lower-case'],
  },
};
