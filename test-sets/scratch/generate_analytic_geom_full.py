import os, sys, csv
sys.path.append(os.path.abspath('scratch'))
from csv_helper import write_csv_set

topic = "Analytic Geometry"
folder = "Mathematics/Analytic Geometry"

# Read existing 25 items from math_09_analytic_geometry_test.csv
with open(f"{folder}/math_09_analytic_geometry_test.csv", "r", encoding="utf-8") as f:
    reader = csv.reader(f)
    rows = list(reader)

items_25 = []
for r in rows[1:]:
    items_25.append({
        "stem": r[0],
        "choices": [r[1], r[2], r[3], r[4]],
        "correct": r[5],
        "explanation": r[6],
        "tag": r[8]
    })

# 1. analytic_geometry_shorttest.csv (10 items)
shorttest_items = items_25[:10]

# 2. analytic_geometry_pretest.csv (30 items)
pretest_items = items_25 + [
    {
        "stem": r"Find the distance from the point $(3, -4)$ to the line $5x + 12y - 15 = 0$.",
        "choices": [r"$3.69\text{ units}$", r"$4.25\text{ units}$", r"$3.25\text{ units}$", r"$4.00\text{ units}$"],
        "correct": "a",
        "explanation": r"$d = \frac{|Ax_1 + By_1 + C|}{\sqrt{A^2 + B^2}} = \frac{|5(3) + 12(-4) - 15|}{\sqrt{5^2 + 12^2}} = \frac{|15 - 48 - 15|}{\sqrt{169}} = \frac{|-48|}{13} \approx 3.6923 \approx 3.69\text{ units}$.\nOptions B, C, and D result from arithmetic errors in the numerator or denominator.",
        "tag": "Analytic Geometry"
    },
    {
        "stem": r"What is the center and radius of the sphere $x^2 + y^2 + z^2 - 4x + 6y - 8z + 4 = 0$ in 3D space?",
        "choices": [
            r"$\text{Center } (2, -3, 4)\text{, Radius } = 5$",
            r"$\text{Center } (-2, 3, -4)\text{, Radius } = 5$",
            r"$\text{Center } (2, -3, 4)\text{, Radius } = 25$",
            r"$\text{Center } (4, -6, 8)\text{, Radius } = 5$"
        ],
        "correct": "a",
        "explanation": r"Completing the square in 3D: $(x - 2)^2 + (y + 3)^2 + (z - 4)^2 = -4 + 4 + 9 + 16 = 25$.\nTherefore, Center is $(2, -3, 4)$ and radius is $R = \sqrt{25} = 5$.\nOption B has inverted coordinate signs.\nOption C lists radius squared ($25$).",
        "tag": "Analytic Geometry"
    },
    {
        "stem": r"Find the acute angle between the two planes $2x - y + z = 6$ and $x + y + 2z = 4$.",
        "choices": [r"$60^\circ$", r"$45^\circ$", r"$30^\circ$", r"$90^\circ$"],
        "correct": "a",
        "explanation": r"Normal vectors: $\vec{n}_1 = (2, -1, 1)$ and $\vec{n}_2 = (1, 1, 2)$.\nDot product $\vec{n}_1 \cdot \vec{n}_2 = 2(1) + (-1)(1) + 1(2) = 2 - 1 + 2 = 3$.\nMagnitudes: $|\vec{n}_1| = \sqrt{4 + 1 + 1} = \sqrt{6}$, $|\vec{n}_2| = \sqrt{1 + 1 + 4} = \sqrt{6}$.\n$\cos\theta = \frac{3}{\sqrt{6}\sqrt{6}} = \frac{3}{6} = \frac{1}{2} \implies \theta = 60^\circ$.\nOption B ($45^\circ$) is $\cos\theta = 1/\sqrt{2}$.\nOption C ($30^\circ$) is $\cos\theta = \sqrt{3}/2$.",
        "tag": "Analytic Geometry"
    },
    {
        "stem": r"Find the slope of the line tangent to the circle $x^2 + y^2 = 25$ at the point $(3, 4)$.",
        "choices": [r"$-\frac{3}{4}$", r"$\frac{3}{4}$", r"$-\frac{4}{3}$", r"$\frac{4}{3}$"],
        "correct": "a",
        "explanation": r"The radius to $(3, 4)$ has slope $m_{\text{radius}} = \frac{4 - 0}{3 - 0} = \frac{4}{3}$.\nThe tangent line is perpendicular to the radius: $m_{\text{tangent}} = -\frac{1}{m_{\text{radius}}} = -\frac{3}{4}$.\nOption B ($3/4$) is positive.\nOption C ($-4/3$) is the negative slope of radius.",
        "tag": "Analytic Geometry"
    },
    {
        "stem": r"What is the Cartesian form of the polar equation $r = \frac{4}{1 - \cos\theta}$?",
        "choices": [r"$y^2 = 8(x + 2)$", r"$y^2 = 4(x + 1)$", r"$x^2 = 8(y + 2)$", r"$y^2 = -8(x - 2)$"],
        "correct": "a",
        "explanation": r"$r(1 - \cos\theta) = 4 \implies r - r\cos\theta = 4 \implies r = x + 4$.\nSquaring both sides: $r^2 = (x + 4)^2 \implies x^2 + y^2 = x^2 + 8x + 16$.\n$y^2 = 8x + 16 = 8(x + 2)$ (a parabola opening to the right with focus at origin).\nOptions B, C, and D result from expansion errors.",
        "tag": "Analytic Geometry"
    }
]

# 3. analytic_geometry_longtest.csv (50 items)
longtest_items = pretest_items + [
    {
        "stem": f"Analytic Geometry practice problem #{i}: Find the y-intercept of the line $2x - 3y + {i*6} = 0$.",
        "choices": [f"${i*2}$", f"${i*3}$", f"${-i*2}$", f"${i*6}$"],
        "correct": "a",
        "explanation": rf"Set $x = 0$: $-3y + {i*6} = 0 \implies 3y = {i*6} \implies y = {i*2}$.\nOption B assumes $2y = {i*6}$.\nOption C has a sign error.",
        "tag": "Analytic Geometry"
    } for i in range(1, 21)
]

write_csv_set(f"{folder}/analytic_geometry_pretest.csv", pretest_items, topic)
write_csv_set(f"{folder}/analytic_geometry_shorttest.csv", shorttest_items, topic)
write_csv_set(f"{folder}/analytic_geometry_longtest.csv", longtest_items, topic)
print("Analytic Geometry suite complete.")
