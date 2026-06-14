"""
Cleans up stale AI/User Annotation attribution references in explained/ files.
These were written when Annotation blocks existed in knowledge/ files.
Now that Annotations are removed, the attribution phrases are stale.
"""

import re
import os

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
EXPLAINED_DIR = os.path.join(BASE, 'explained')


def clean_line(line):
    """
    Remove Annotation attribution prefixes from a single line.
    Returns the cleaned line.
    """
    # Pattern: "AI Annotation이 짚듯, " or "User Annotation이 짚듯, " etc.
    line = re.sub(r'^(AI|User) Annotation이 (짚듯|짚은|짚는|확인했듯),?\s*', '', line)
    # Pattern: "**AI Annotation:**" or "**User Annotation:**"
    line = re.sub(r'\*\*(AI|User) Annotation:\*\*\s*', '', line)
    # Inline attribution in middle of sentence: "AI Annotation이 짚듯 xxx"
    line = re.sub(r'(AI|User) Annotation이 (짚듯|짚은|짚는|확인했듯),?\s*', '', line)
    return line


def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    original = ''.join(lines)
    result = []
    i = 0
    changed = False

    while i < len(lines):
        line = lines[i]

        # "User Annotation:" label line (content on same line)
        # e.g., "User Annotation: 기존 번들러..."
        if re.match(r'^(AI|User) Annotation:\s+\S', line):
            new_line = re.sub(r'^(AI|User) Annotation:\s+', '', line)
            result.append(new_line)
            changed = True
            i += 1
            continue

        # "User Annotation:" alone on a line (content on next lines)
        if re.match(r'^(AI|User) Annotation:\s*$', line):
            # Skip this line (the heading), keep following content
            changed = True
            i += 1
            continue

        # "User Annotation 예시 1 — xxx" → "예시 1 — xxx"
        if re.match(r'^(AI|User) Annotation\s+', line):
            new_line = re.sub(r'^(AI|User) Annotation\s+', '', line)
            result.append(new_line)
            changed = True
            i += 1
            continue

        # Regular line - clean any inline Annotation references
        cleaned = clean_line(line)
        if cleaned != line:
            changed = True
        result.append(cleaned)
        i += 1

    if not changed:
        return False

    new_content = ''.join(result)
    with open(filepath, 'w', encoding='utf-8', newline='') as f:
        f.write(new_content)
    return True


def main():
    changed = 0
    skipped = 0
    errors = []

    for root, dirs, files in os.walk(EXPLAINED_DIR):
        for fname in files:
            if not fname.endswith('.md'):
                continue
            fpath = os.path.join(root, fname)
            try:
                if process_file(fpath):
                    changed += 1
                    print(f'CHANGED: {os.path.relpath(fpath, BASE)}')
                else:
                    skipped += 1
            except Exception as e:
                errors.append((fpath, str(e)))
                print(f'ERROR: {fpath}: {e}')

    print(f'\nDone: {changed} changed, {skipped} unchanged, {len(errors)} errors')


if __name__ == '__main__':
    main()
