import assert from 'node:assert/strict';
import { normalizeMathText } from '../lib/math-text';

assert.equal(normalizeMathText('设 \\(u\\in H^1\\)。'), '设 $u\\in H^1$。');
assert.equal(
  normalizeMathText('结论 \\[ -\\Delta u=f \\] 成立'),
  '结论 \n\n$$-\\Delta u=f$$\n\n 成立',
);
assert.equal(
  normalizeMathText('\\begin{equation*} E=mc^2 \\end{equation*}'),
  '\n\n$$E=mc^2$$\n\n',
);
assert.equal(
  normalizeMathText('\\begin{multline} a=b \\\\ c=d \\end{multline}'),
  '\n\n$$\\begin{aligned} a=b \\\\ c=d \\end{aligned}$$\n\n',
);
assert.equal(
  normalizeMathText('已有 $x^2$ 和 $$y^2$$'),
  '已有 $x^2$ 和 $$y^2$$',
);
assert.equal(
  normalizeMathText('定义 $u$ 时有 D²ρ−θI∈Γ2。'),
  '定义 $u$ 时有 $D^{2}\\rho -\\theta I\\in \\Gamma _{2}$。',
);
assert.equal(
  normalizeMathText('由 Ld≤−θ tr a；得到 C³。'),
  '由 $Ld\\le -\\theta tr a$；得到 $C^{3}$。',
);
assert.equal(
  normalizeMathText(
    `$-\\partial_tL_T-${String.fromCharCode(8)}eta L_T\\ge0$`,
  ),
  '$-\\partial_tL_T-\\beta L_T\\ge0$',
);
assert.equal(
  normalizeMathText('$\\lambda \u0304_T+\\delta \u0303+\\tau \u0302$'),
  '$\\bar{\\lambda}_T+\\tilde{\\delta}+\\hat{\\tau}$',
);
assert.equal(
  normalizeMathText('$A#B+L\\infty$'),
  '$A\\#B+L\\infty$',
);
assert.equal(
  normalizeMathText("$U^\\beta '+L_\\hat{Q}$"),
  "$U^{\\beta'}+L_{\\hat{Q}}$",
);
assert.equal(
  normalizeMathText('$|\nabla $u^q|^p$$ 与 $$u^{q+1}$$'),
  '$|\\nabla u^q|^p$ 与 $u^{q+1}$',
);

console.log('math text tests passed');
