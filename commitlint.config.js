module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'scope-enum': [
      2,
      'always',
      [
        // .claude/skills/
        'add-note',
        'convert',
        'digest',
        'review',
        // .claude/contexts/
        'contexts',
        // knowledge/
        'knowledge',
        // 전체
        'global',
      ],
    ],
    'scope-empty': [2, 'never'],
    'subject-case': [0],
  },
};
