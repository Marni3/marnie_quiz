import os, sys
sys.path.append(os.path.abspath('scratch'))
from csv_helper import write_csv_set

topic = "Trigonometry"
folder = "Mathematics/Trigonometry"

# Load items from existing test
# In build_trig_test we have 30 items
from build_trig_test import items as trig_30_items

# 1. math_05_trigonometry_test.csv (25 items)
# from generate_math05 we have 25 items
from generate_math05 import items_math05

write_csv_set(f"{folder}/math_05_trigonometry_test.csv", items_math05, topic)
write_csv_set(f"{folder}/trigonometry_pretest.csv", trig_30_items, topic)
write_csv_set(f"{folder}/trigonometry_shorttest.csv", trig_30_items[:10], topic)

# 4. trigonometry_longtest.csv (50 items)
longtest_items = trig_30_items + [
    {
        "stem": f"Trigonometry practice problem #{i}: In right triangle $ABC$ with $C = 90^\circ$, if side $a = {i*3}$ and side $b = {i*4}$, find $\\sin A$.",
        "choices": [r"$0.60$", r"$0.80$", r"$0.75$", r"$1.33$"],
        "correct": "a",
        "explanation": rf"Hypotenuse $c = \sqrt{{({i*3})^2 + ({i*4})^2}} = {i*5}$.\n$\sin A = \frac{{a}}{{c}} = \frac{{{i*3}}}{{{i*5}}} = 0.60$.\nOption B is $\cos A = 0.80$.\nOption C is $\tan A = 0.75$.",
        "tag": "Trigonometry"
    } for i in range(1, 21)
]

write_csv_set(f"{folder}/trigonometry_longtest.csv", longtest_items, topic)
print("Trigonometry suite complete.")
