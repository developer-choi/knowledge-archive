"""
Transforms knowledge/ files to remove AI/User Annotation blocks.

Rules:
1. `> #### AI Annotation:` blocks → DELETE entirely
2. `> #### User Annotation:` blocks with content → move to ### User Answer (create if absent)
3. `> #### User Annotation:` empty blocks → DELETE
4. `### AI Answer` → `### Additional Answer`
"""

import re
import os
import sys

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def extract_blockquote_content(lines, start_idx):
    """
    Given lines and start index of `> #### XYZ Annotation:`, extract:
    - inline_content: text on the same line after the colon
    - body_lines: subsequent `> ` lines (stripped of leading `> `)
    - end_idx: index of first line NOT part of this blockquote
    """
    first_line = lines[start_idx]
    # Get inline content after `> #### AI Annotation:` or `> #### User Annotation:`
    colon_pos = first_line.index(':')
    inline = first_line[colon_pos + 1:].strip()

    body = []
    i = start_idx + 1
    while i < len(lines):
        line = lines[i]
        # A blockquote continuation can be `> text` or `>` (empty blockquote line)
        if line.startswith('>'):
            # Strip leading `> ` or `>`
            stripped = line[1:]
            if stripped.startswith(' '):
                stripped = stripped[1:]
            body.append(stripped)
            i += 1
        else:
            break

    return inline, body, i


def has_content(inline, body):
    """Returns True if the blockquote has any actual content."""
    if inline:
        return True
    for line in body:
        if line.strip():
            return True
    return False


def format_annotation_content(inline, body):
    """Format extracted annotation content as plain text lines."""
    result = []
    if inline:
        result.append(inline)
    result.extend(body)
    # Remove trailing empty lines
    while result and not result[-1].strip():
        result.pop()
    return result


def process_qa_block(block_lines):
    """
    Process a single Q&A block (between --- separators).
    Returns transformed lines.
    """
    lines = block_lines
    result = []
    i = 0

    # Collect User Annotation content pieces to add to User Answer
    user_annotation_contents = []

    while i < len(lines):
        line = lines[i]

        # Rename AI Answer → Additional Answer
        if line.strip() == '### AI Answer':
            result.append('### Additional Answer\n')
            i += 1
            continue

        # AI Annotation block → DELETE
        if re.match(r'^> #### AI Annotation:', line):
            inline, body, end_i = extract_blockquote_content(lines, i)
            # Just skip (delete) the entire block
            i = end_i
            # Skip trailing blank line if present
            if i < len(lines) and lines[i].strip() == '':
                i += 1
            continue

        # User Annotation block
        if re.match(r'^> #### User Annotation:', line):
            inline, body, end_i = extract_blockquote_content(lines, i)
            i = end_i
            # Skip trailing blank line if present
            if i < len(lines) and lines[i].strip() == '':
                i += 1
            if has_content(inline, body):
                content_lines = format_annotation_content(inline, body)
                user_annotation_contents.append(content_lines)
            # else: empty, just delete
            continue

        result.append(line)
        i += 1

    if not user_annotation_contents:
        return result

    # We have User Annotation content to merge into ### User Answer
    # Find insertion point: before ### Reference, or at end (before final blank line)
    merged = []
    for content_piece in user_annotation_contents:
        merged.extend(content_piece)

    # Find ### User Answer in result
    ua_idx = None
    for idx, line in enumerate(result):
        if line.strip() == '### User Answer':
            ua_idx = idx
            break

    ref_idx = None
    for idx, line in enumerate(result):
        if line.strip() == '### Reference':
            ref_idx = idx
            break

    if ua_idx is not None:
        # Find end of User Answer section (before next ### heading or ### Reference)
        insert_after = ua_idx + 1
        while insert_after < len(result):
            l = result[insert_after].strip()
            if l.startswith('###') or l.startswith('##'):
                break
            insert_after += 1
        # Remove trailing blank lines before insertion point
        while insert_after > 0 and result[insert_after - 1].strip() == '':
            insert_after -= 1
        # Insert content with blank line separator
        insertion = [''] + merged
        result = result[:insert_after] + [l + '\n' for l in insertion] + result[insert_after:]
    else:
        # Create ### User Answer before ### Reference or at end
        insert_pos = ref_idx if ref_idx is not None else len(result)
        # Find last non-blank line before insert_pos to place after
        while insert_pos > 0 and result[insert_pos - 1].strip() == '':
            insert_pos -= 1
        new_section = ['### User Answer\n'] + [l + '\n' for l in merged] + ['\n']
        result = result[:insert_pos] + ['\n'] + new_section + result[insert_pos:]

    return result


def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    original = content

    # Split by Q&A separators (lines with just `---`)
    # We split into: frontmatter+questions, then Q&A blocks
    # Actually let's split on lines that are exactly `---\n`
    lines = content.splitlines(keepends=True)

    # Find separator positions
    sep_indices = [i for i, l in enumerate(lines) if l.strip() == '---']

    if not sep_indices:
        # No separators, process whole file as one block
        result = process_qa_block(lines)
        new_content = ''.join(result)
        if new_content != original:
            with open(filepath, 'w', encoding='utf-8', newline='') as f:
                f.write(new_content)
            return True
        return False

    # Build segments: [before_first_sep, block1, block2, ...]
    segments = []
    prev = 0
    for sep_i in sep_indices:
        segments.append(lines[prev:sep_i])  # lines before this separator
        segments.append([lines[sep_i]])     # the separator itself
        prev = sep_i + 1
    segments.append(lines[prev:])  # remaining

    # Process each segment that is a Q&A block (not separator, not frontmatter)
    # Frontmatter is between first two `---` lines
    # Strategy: process all non-separator segments except the frontmatter block
    # Frontmatter = segments[0] (before first ---) and segments[1] (first ---) and segments[2] (frontmatter body) and segments[3] (second ---)
    # Actually let's just check: if a segment has `> #### AI Annotation` or `> #### User Annotation` or `### AI Answer`, process it

    result_parts = []
    for seg in segments:
        seg_text = ''.join(seg)
        if ('> #### AI Annotation' in seg_text or
            '> #### User Annotation' in seg_text or
            '### AI Answer' in seg_text):
            processed = process_qa_block(seg)
            result_parts.append(''.join(processed))
        else:
            result_parts.append(seg_text)

    new_content = ''.join(result_parts)

    # Clean up: remove triple+ blank lines
    new_content = re.sub(r'\n{3,}', '\n\n', new_content)

    if new_content != original:
        with open(filepath, 'w', encoding='utf-8', newline='') as f:
            f.write(new_content)
        return True
    return False


def main():
    knowledge_dir = os.path.join(BASE, 'knowledge')
    changed = 0
    skipped = 0
    errors = []

    for root, dirs, files in os.walk(knowledge_dir):
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
    for f, e in errors:
        print(f'  ERROR {f}: {e}')


if __name__ == '__main__':
    main()
