module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [2, 'always', ['feat', 'fix', 'refactor', 'audit']],
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
  },
};
