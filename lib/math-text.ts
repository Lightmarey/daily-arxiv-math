const displayEnvironments: Record<string, string | null> = {
  equation: null,
  'equation*': null,
  align: 'aligned',
  'align*': 'aligned',
  gather: 'gathered',
  'gather*': 'gathered',
  multline: 'aligned',
  'multline*': 'aligned',
};

const bareMathSignal = /[=≠≈≤≥∈∉∂∇∆±∓×÷∪∩⊂⊃√∞^_⁰¹²³⁴⁵⁶⁷⁸⁹₀₁₂₃₄₅₆₇₈₉α-ωΑ-Ω]/u;
const mathWords = new Set([
  'argmax',
  'argmin',
  'cos',
  'cosh',
  'det',
  'dim',
  'div',
  'exp',
  'inf',
  'ker',
  'lim',
  'log',
  'max',
  'min',
  'rank',
  'sin',
  'sinh',
  'span',
  'sup',
  'tan',
  'tr',
]);
const greek = new Map([
  ['α', '\\alpha'], ['β', '\\beta'], ['γ', '\\gamma'], ['δ', '\\delta'],
  ['ε', '\\epsilon'], ['ζ', '\\zeta'], ['η', '\\eta'], ['θ', '\\theta'],
  ['ι', '\\iota'], ['κ', '\\kappa'], ['λ', '\\lambda'], ['μ', '\\mu'],
  ['ν', '\\nu'], ['ξ', '\\xi'], ['ο', 'o'], ['π', '\\pi'], ['ρ', '\\rho'],
  ['σ', '\\sigma'], ['τ', '\\tau'], ['υ', '\\upsilon'], ['φ', '\\phi'],
  ['χ', '\\chi'], ['ψ', '\\psi'], ['ω', '\\omega'], ['Α', 'A'],
  ['Β', 'B'], ['Γ', '\\Gamma'], ['Δ', '\\Delta'], ['Ε', 'E'], ['Ζ', 'Z'],
  ['Η', 'H'], ['Θ', '\\Theta'], ['Ι', 'I'], ['Κ', 'K'], ['Λ', '\\Lambda'],
  ['Μ', 'M'], ['Ν', 'N'], ['Ξ', '\\Xi'], ['Ο', 'O'], ['Π', '\\Pi'],
  ['Ρ', 'P'], ['Σ', '\\Sigma'], ['Τ', 'T'], ['Υ', '\\Upsilon'],
  ['Φ', '\\Phi'], ['Χ', 'X'], ['Ψ', '\\Psi'], ['Ω', '\\Omega'],
]);
const superscripts = new Map([
  ['⁰', '0'], ['¹', '1'], ['²', '2'], ['³', '3'], ['⁴', '4'],
  ['⁵', '5'], ['⁶', '6'], ['⁷', '7'], ['⁸', '8'], ['⁹', '9'],
  ['⁺', '+'], ['⁻', '-'], ['⁼', '='], ['⁽', '('], ['⁾', ')'],
]);
const subscripts = new Map([
  ['₀', '0'], ['₁', '1'], ['₂', '2'], ['₃', '3'], ['₄', '4'],
  ['₅', '5'], ['₆', '6'], ['₇', '7'], ['₈', '8'], ['₉', '9'],
  ['₊', '+'], ['₋', '-'], ['₌', '='], ['₍', '('], ['₎', ')'],
]);

function replaceScript(value: string, symbols: Map<string, string>, marker: string) {
  return value.replace(
    new RegExp(`[${Array.from(symbols.keys()).join('')}]+`, 'g'),
    (run) =>
      `${marker}{${Array.from(run)
        .map((symbol) => symbols.get(symbol))
        .join('')}}`,
  );
}

function latexForBareMath(value: string): string {
  const withGreekSubscripts = value.replace(
    /([α-ωΑ-Ω])(\d+)/g,
    '$1_{$2}',
  );
  const withScripts = replaceScript(
    replaceScript(withGreekSubscripts, superscripts, '^'),
    subscripts,
    '_',
  );
  return Array.from(withScripts)
    .map((symbol) => {
      const replacement = greek.get(symbol);
      return replacement?.startsWith('\\') ? `${replacement} ` : replacement ?? symbol;
    })
    .join('')
    .replaceAll('Ω', '\\Omega')
    .replaceAll('ℓ', '\\ell')
    .replaceAll('ℝ', '\\mathbb{R}')
    .replaceAll('ℂ', '\\mathbb{C}')
    .replaceAll('ℕ', '\\mathbb{N}')
    .replaceAll('∂', '\\partial ')
    .replaceAll('∇', '\\nabla ')
    .replaceAll('∆', '\\Delta ')
    .replaceAll('≤', '\\le ')
    .replaceAll('≥', '\\ge ')
    .replaceAll('≠', '\\ne ')
    .replaceAll('≈', '\\approx ')
    .replaceAll('∈', '\\in ')
    .replaceAll('∉', '\\notin ')
    .replaceAll('±', '\\pm ')
    .replaceAll('∓', '\\mp ')
    .replaceAll('×', '\\times ')
    .replaceAll('÷', '\\div ')
    .replaceAll('∪', '\\cup ')
    .replaceAll('∩', '\\cap ')
    .replaceAll('⊂', '\\subset ')
    .replaceAll('⊃', '\\supset ')
    .replaceAll('√', '\\sqrt ')
    .replaceAll('∞', '\\infty ')
    .replaceAll('→', '\\to ')
    .replaceAll('↦', '\\mapsto ')
    .replaceAll('·', '\\cdot ')
    .replaceAll('−', '-')
    .replaceAll('′', "'")
    .replace(/\s{2,}/g, ' ');
}

function bareMathWord(value: string): boolean {
  return /^[A-Za-z]$/.test(value) || mathWords.has(value) || /^(?:arg)?(?:max|min)\(.+\)$/.test(value);
}

function wrapBareMath(value: string): string {
  return value.replace(/[^\p{Script=Han}\r\n]+/gu, (segment) => {
    const parts = segment.split(/(\s+)/);
    for (let index = 0; index < parts.length; index += 1) {
      if (!parts[index] || /^\s+$/.test(parts[index])) continue;
      const core = parts[index].replace(/[,.，。；：、!?]+$/u, '');
      if (!bareMathSignal.test(core)) continue;
      let end = index;
      while (
        end + 2 < parts.length &&
        /^\s+$/.test(parts[end + 1]) &&
        bareMathWord(parts[end + 2].replace(/[,.，。；：、!?]+$/u, ''))
      )
        end += 2;
      const endCore = parts[end].replace(/[,.，。；：、!?]+$/u, '');
      const suffix = parts[end].slice(endCore.length);
      const formula = parts.slice(index, end + 1);
      formula[formula.length - 1] = endCore;
      parts[index] = `$${latexForBareMath(formula.join(''))}$${suffix}`;
      parts.splice(index + 1, end - index);
    }
    return parts.join('');
  });
}

function sanitizeLatexMath(value: string): string {
  return value
    .replaceAll(`${String.fromCharCode(7)}lpha`, '\\alpha')
    .replaceAll(`${String.fromCharCode(8)}ar`, '\\bar')
    .replaceAll(`${String.fromCharCode(8)}eta`, '\\beta')
    .replaceAll(`${String.fromCharCode(11)}arepsilon`, '\\varepsilon')
    .replaceAll(`${String.fromCharCode(11)}arnothing`, '\\varnothing')
    .replaceAll(`${String.fromCharCode(11)}arphi`, '\\varphi')
    .replaceAll(`${String.fromCharCode(11)}arrho`, '\\varrho')
    .replaceAll(`${String.fromCharCode(11)}artheta`, '\\vartheta')
    .replaceAll(`${String.fromCharCode(12)}rac`, '\\frac')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/(\\[A-Za-z]+|[A-Za-z0-9α-ωΑ-Ω])\s*\u0304/gu, '\\bar{$1}')
    .replace(/(\\[A-Za-z]+|[A-Za-z0-9α-ωΑ-Ω])\s*\u0303/gu, '\\tilde{$1}')
    .replace(/(\\[A-Za-z]+|[A-Za-z0-9α-ωΑ-Ω])\s*\u0302/gu, '\\hat{$1}')
    .replace(/(\\[A-Za-z]+|[A-Za-z0-9α-ωΑ-Ω])\s*\u030a/gu, '\\mathring{$1}')
    .replace(/(?<!\\)#/g, '\\#')
    .replace(/\^(\\[A-Za-z]+)\s*'/g, "^{$1'}")
    .replace(/_\\hat\{([^{}]+)\}/g, '_{\\hat{$1}}')
    .replace(/\\\(/g, '(')
    .replace(/\\\)/g, ')');
}

export function normalizeMathText(value: string): string {
  const normalized = value
    .replaceAll(`${String.fromCharCode(7)}symp`, '\\asymp')
    .replaceAll(`${String.fromCharCode(9)}heta`, '\\theta')
    .replaceAll(`${String.fromCharCode(9)}au`, '\\tau')
    .replaceAll(`${String.fromCharCode(9)}ext`, '\\text')
    .replaceAll(`${String.fromCharCode(10)}abla`, '\\nabla')
    .replaceAll(`${String.fromCharCode(13)}ho`, '\\rho')
    .replace(
      /\$\|\\nabla\s*\$u\^q\|\^p\$\$\s*与\s*\$\$u\^\{q\+1\}\$\$/g,
      '$|\\nabla u^q|^p$ 与 $u^{q+1}$',
    )
    .replace(
      /\\begin\{(equation\*?|align\*?|gather\*?|multline\*?)\}([\s\S]*?)\\end\{\1\}/g,
      (_match, environment: string, body: string) => {
        const katexEnvironment = displayEnvironments[environment];
        const content = katexEnvironment
          ? `\\begin{${katexEnvironment}}${body}\\end{${katexEnvironment}}`
          : body;
        return `\n\n$$${content.trim()}$$\n\n`;
      },
    )
    .replace(
      /\\\[([\s\S]*?)\\\]/g,
      (_match, body: string) => `\n\n$$${body.trim()}$$\n\n`,
    )
    .replace(
      /\\\(([\s\S]*?)\\\)/g,
      (_match, body: string) => `$${body.trim()}$`,
    );
  return normalized
    .split(/(\$\$[\s\S]*?\$\$|\$[^$\n]*?\$)/g)
    .map((part) => {
      if (!part.startsWith('$')) return wrapBareMath(part);
      const delimiter = part.startsWith('$$') ? '$$' : '$';
      return `${delimiter}${sanitizeLatexMath(part.slice(delimiter.length, -delimiter.length))}${delimiter}`;
    })
    .join('');
}
