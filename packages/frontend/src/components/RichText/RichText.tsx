import { Fragment, type ReactNode } from 'react';

type LexicalNode = {
  type?: string;
  text?: string;
  format?: number | string;
  tag?: string;
  listType?: string;
  children?: LexicalNode[];
  url?: string;
  fields?: { url?: string; newTab?: boolean };
};

type RichTextValue = string | Record<string, unknown> | null | undefined;

type RichTextProps = {
  value: RichTextValue;
  className?: string;
};

function isLexicalNode(value: unknown): value is LexicalNode {
  return typeof value === 'object' && value !== null;
}

function safeLinkUrl(url: string | undefined): string | undefined {
  if (!url) return undefined;
  if (url.startsWith('/') || url.startsWith('#')) return url;

  try {
    const parsed = new URL(url);
    return ['http:', 'https:', 'mailto:', 'tel:'].includes(parsed.protocol)
      ? url
      : undefined;
  } catch {
    return undefined;
  }
}

function formattedText(node: LexicalNode, key: string): ReactNode {
  let content: ReactNode = node.text ?? '';
  const format = typeof node.format === 'number' ? node.format : 0;

  if (format & 16) content = <code key={`${key}-code`}>{content}</code>;
  if (format & 8) content = <u key={`${key}-underline`}>{content}</u>;
  if (format & 4) content = <s key={`${key}-strike`}>{content}</s>;
  if (format & 2) content = <em key={`${key}-italic`}>{content}</em>;
  if (format & 1) content = <strong key={`${key}-bold`}>{content}</strong>;

  return content;
}

function renderNode(node: LexicalNode, key: string): ReactNode {
  if (node.type === 'text') return formattedText(node, key);
  if (node.type === 'linebreak') return <br key={key} />;

  const children = (node.children ?? []).map((child, index) =>
    renderNode(child, `${key}-${index}`),
  );

  switch (node.type) {
    case 'paragraph':
      return <p key={key}>{children}</p>;
    case 'heading': {
      const tag = node.tag;
      if (tag === 'h1') return <h1 key={key}>{children}</h1>;
      if (tag === 'h2') return <h2 key={key}>{children}</h2>;
      if (tag === 'h3') return <h3 key={key}>{children}</h3>;
      if (tag === 'h4') return <h4 key={key}>{children}</h4>;
      if (tag === 'h5') return <h5 key={key}>{children}</h5>;
      if (tag === 'h6') return <h6 key={key}>{children}</h6>;
      return <p key={key}>{children}</p>;
    }
    case 'list':
      return node.listType === 'number' ? (
        <ol key={key} className="list-decimal pl-6">
          {children}
        </ol>
      ) : (
        <ul key={key} className="list-disc pl-6">
          {children}
        </ul>
      );
    case 'listitem':
      return <li key={key}>{children}</li>;
    case 'quote':
      return <blockquote key={key}>{children}</blockquote>;
    case 'link':
    case 'autolink': {
      const href = safeLinkUrl(node.fields?.url ?? node.url);
      return href ? (
        <a key={key} href={href}>
          {children}
        </a>
      ) : (
        <span key={key}>{children}</span>
      );
    }
    default:
      return <Fragment key={key}>{children}</Fragment>;
  }
}

export const RichText: React.FC<RichTextProps> = ({
  value,
  className = '',
}) => {
  if (!value) return null;
  if (typeof value === 'string')
    return <div className={className}>{value}</div>;

  const root = value.root;
  if (!isLexicalNode(root) || !Array.isArray(root.children)) return null;

  const nodes = root.children.filter(isLexicalNode);
  return (
    <div className={`space-y-4 ${className}`}>
      {nodes.map((node, index) => renderNode(node, `rich-text-${index}`))}
    </div>
  );
};
