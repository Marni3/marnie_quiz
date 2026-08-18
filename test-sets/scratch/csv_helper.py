import csv
import os
import re

def quote_cell(val):
    escaped = str(val).replace('"', '""')
    return f'"{escaped}"'

def write_csv_set(filepath, items, subject_tag):
    os.makedirs(os.path.dirname(filepath), exist_ok=True)
    header = ["question", "choice_a", "choice_b", "choice_c", "choice_d", "correct_answer", "explanation", "image_url", "subject_tag"]
    rows = [",".join(header)]
    for item in items:
        q = quote_cell(item["stem"])
        ca = quote_cell(item["choices"][0])
        cb = quote_cell(item["choices"][1])
        cc = quote_cell(item["choices"][2])
        cd = quote_cell(item["choices"][3])
        ans = quote_cell(item["correct"].lower())
        exp = quote_cell(item["explanation"])
        img = quote_cell("")
        tag = quote_cell(subject_tag)
        rows.append(f"{q},{ca},{cb},{cc},{cd},{ans},{exp},{img},{tag}")
    
    with open(filepath, "w", encoding="utf-8", newline="\n") as f:
        for r in rows:
            f.write(r + "\n")
    
    # Validation
    with open(filepath, "r", encoding="utf-8") as f:
        reader = csv.reader(f)
        parsed = list(reader)
    
    assert len(parsed) == len(items) + 1, f"Row count mismatch for {filepath}: expected {len(items)+1}, got {len(parsed)}"
    for idx, row in enumerate(parsed):
        assert len(row) == 9, f"Column count mismatch at row {idx} in {filepath}: expected 9, got {len(row)}"
        if idx > 0:
            assert row[5] in ['a', 'b', 'c', 'd'], f"Invalid answer key '{row[5]}' at row {idx} in {filepath}"
    
    print(f"Successfully generated and validated {filepath} ({len(items)} questions).")
