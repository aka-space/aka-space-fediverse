'use client';
import { Dropcursor } from '@tiptap/extension-dropcursor';
import { HorizontalRule } from '@tiptap/extension-horizontal-rule';
import { Image } from '@tiptap/extension-image';
import { Link } from '@tiptap/extension-link';
import { Placeholder } from '@tiptap/extension-placeholder';
import { TextStyle } from '@tiptap/extension-text-style';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import React, { useEffect } from 'react';
import './content-editor.css';
import MenuBar from './menu-bar';

const extensions = [
    TextStyle,
    StarterKit.configure({}),
    Link.configure({
        openOnClick: false,
        autolink: true,
        defaultProtocol: 'https',
    }),
    Image.configure({
        inline: true,
        allowBase64: true,
    }),
    HorizontalRule,
    Placeholder.configure({
        placeholder: 'Bắt đầu viết bài viết của bạn...',
    }),
    Dropcursor.configure({
        color: '#ffc107',
        width: 2,
    }),
];

export interface ContentEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

export const ContentEditor: React.FC<ContentEditorProps> = ({
    value,
    onChange,
    placeholder,
}) => {
    const editor = useEditor({
        extensions,
        content: value,
        immediatelyRender: false,
        onUpdate: ({ editor }) => {
            onChange(editor?.getHTML());
        },
        editorProps: {
            attributes: {
                class: 'prose dark:prose-invert min-h-[200px] p-4 focus:outline-none tiptap',
            },
        },
    });

    useEffect(() => {
        if (editor && editor?.getHTML() !== value) {
            editor?.commands.setContent(value, {
                parseOptions: { preserveWhitespace: true },
            });
        }
    }, [value, editor]);

    return (
        <div className="border border-gray-300 rounded-lg overflow-hidden shadow-sm">
            <MenuBar editor={editor} />
            <EditorContent editor={editor} placeholder={placeholder} />
        </div>
    );
};
