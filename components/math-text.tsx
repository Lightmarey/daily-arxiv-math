import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { normalizeMathText } from '@/lib/math-text';

export function MathText({
  children,
  className = '',
  inline = false,
}: {
  children: string;
  className?: string;
  inline?: boolean;
}) {
  const markdown = (
    <ReactMarkdown
      remarkPlugins={[remarkMath]}
      rehypePlugins={[rehypeKatex]}
      components={
        inline ? { p: ({ children: content }) => <>{content}</> } : undefined
      }
      skipHtml
    >
      {normalizeMathText(children)}
    </ReactMarkdown>
  );
  if (inline)
    return <span className={`math-text inline ${className}`}>{markdown}</span>;
  return <div className={`math-text ${className}`}>{markdown}</div>;
}
