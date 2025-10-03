'use client';

import ReactMarkdown from 'react-markdown';
import {
    Prism as SyntaxHighlighter,
    SyntaxHighlighterProps,
} from 'react-syntax-highlighter';
import vscDarkPlus from 'react-syntax-highlighter/dist/esm/styles/prism/vsc-dark-plus';

interface MarkdownContentProps {
    content: string;
}

export function MarkdownContent({ content }: MarkdownContentProps) {
    return (
        <div className="prose prose-sm max-w-none dark:prose-invert">
            <ReactMarkdown
                components={{
                    code(
                        props: React.HTMLAttributes<HTMLElement> & {
                            children?: React.ReactNode;
                        },
                    ) {
                        const { className, children } = props;
                        const match = /language-(\w+)/.exec(className || '');
                        const codeString = String(children).replace(/\n$/, '');
                        const inline = !match;
                        return !inline && match ? (
                            <div className="relative rounded-lg overflow-hidden my-4 bg-black">
                                <SyntaxHighlighter
                                    language={match[1]}
                                    PreTag="div"
                                    showLineNumbers
                                    customStyle={{
                                        margin: 0,
                                        padding: '1rem',
                                        fontSize: '0.875rem',
                                        background: 'hsl(var(--muted))',
                                    }}
                                    lineNumberStyle={{
                                        minWidth: '2.5em',
                                        paddingRight: '1em',
                                        color: 'hsl(var(--muted-foreground))',
                                        userSelect: 'none',
                                    }}
                                    {...props}
                                    style={
                                        vscDarkPlus as SyntaxHighlighterProps['style']
                                    }
                                >
                                    {codeString}
                                </SyntaxHighlighter>
                            </div>
                        ) : (
                            <code
                                className="px-1.5 py-0.5 rounded bg-muted font-mono text-xs"
                                {...props}
                            >
                                {children}
                            </code>
                        );
                    },
                    p({ children }) {
                        return (
                            <p className="text-sm leading-relaxed mb-4">
                                {children}
                            </p>
                        );
                    },
                    h1({ children }) {
                        return (
                            <h1 className="text-2xl font-bold mb-4 text-balance">
                                {children}
                            </h1>
                        );
                    },
                    h2({ children }) {
                        return (
                            <h2 className="text-xl font-bold mb-3 text-balance">
                                {children}
                            </h2>
                        );
                    },
                    h3({ children }) {
                        return (
                            <h3 className="text-lg font-semibold mb-2">
                                {children}
                            </h3>
                        );
                    },
                    ul({ children }) {
                        return (
                            <ul className="list-disc list-inside mb-4 space-y-1">
                                {children}
                            </ul>
                        );
                    },
                    ol({ children }) {
                        return (
                            <ol className="list-decimal list-inside mb-4 space-y-1">
                                {children}
                            </ol>
                        );
                    },
                    a({ href, children }) {
                        return (
                            <a
                                href={href}
                                className="text-primary hover:underline cursor-pointer"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {children}
                            </a>
                        );
                    },
                    blockquote({ children }) {
                        return (
                            <blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground my-4">
                                {children}
                            </blockquote>
                        );
                    },
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
}
