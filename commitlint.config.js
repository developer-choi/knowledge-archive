module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'scope-enum': [
      2,
      'always',
      [
        // local/skills/
        'add-note',
        'convert',
        'digest',
        'review',
        'skill',
        // local/contexts/
        'contexts',
        // knowledge/
        'knowledge',
        'explained',
        'techniques',
        'tips',
        'archives',
        // scripts/
        'scripts',
        // 전체
        'global',
      ],
    ],
    'scope-empty': [2, 'never'],
    'subject-case': [0],
    'body-max-line-length': [2, 'always', 200],
  },
};
