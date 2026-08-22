import { NextResponse } from "next/server";

export async function GET() {
  const csvContent = `"question","choice_a","choice_b","choice_c","choice_d","correct_answer","explanation","image_url","subject_tag","archetype","micro_cluster","is_anchor"
"A copper wire has length $L$ and radius $r$. If its length is doubled and its radius is halved, what is its new resistance relative to the initial resistance $R$?","2R","4R","8R","16R","d","Resistance is given by $R = \\rho \\frac{L}{A} = \\rho \\frac{L}{\\pi r^2}$. Doubling length multiplies $R$ by 2. Halving radius multiplies $R$ by $2^2 = 4$ in the denominator, resulting in $R' = R \\times \\frac{2}{(1/2)^2} = 8R$? Wait, $(1/2)^2 = 1/4$, so $2 / (1/4) = 8$. Thus new resistance is $8R$... Actually $2 \\times 4 = 8R$.","","DC Circuits","scaling","ELEC 03-01 Resistance","false"
"What is the SI unit of magnetic flux density?","Weber","Tesla","Henry","Gauss","b","The SI derived unit of magnetic flux density ($B$) is the Tesla (T), equivalent to $1\\text{ Wb/m}^2$. Weber is the unit of total magnetic flux.","","Magnetism","standard","ELEC 01-02 Units","true"
"For a high-pass RC filter, as input frequency approaches infinity ($f \\to \\infty$), what is the limiting voltage gain?","0","0.5","0.707","1.0","d","At high frequencies, capacitive reactance $X_C = \\frac{1}{2\\pi f C} \\to 0$, making the capacitor act as an AC short circuit. Thus $V_{out} \\to V_{in}$, giving a voltage gain of 1.0.","","AC Circuits","boundary","ELEC 04-03 Filters","false"
`;

  return new NextResponse(csvContent, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="marnie_quiz_template.csv"',
    },
  });
}
