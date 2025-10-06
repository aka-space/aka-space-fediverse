'use client';
import { Editor, useEditorState } from '@tiptap/react';
import { BrushCleaning, Link, Redo, Undo } from 'lucide-react';
import React from 'react';
import './content-editor.css';
import ToolbarButton from './editor-toolbar-button';

interface MenuBarProps {
    editor: Editor | null;
}
const MenuBar: React.FC<MenuBarProps> = ({ editor }) => {
    const editorState = useEditorState({
        editor,
        selector: (ctx) => {
            return {
                isBold: ctx.editor?.isActive('bold') ?? false,
                canBold: ctx.editor?.can().chain().toggleBold().run() ?? false,
                isItalic: ctx.editor?.isActive('italic') ?? false,
                canItalic:
                    ctx.editor?.can().chain().toggleItalic().run() ?? false,
                isStrike: ctx.editor?.isActive('strike') ?? false,
                canStrike:
                    ctx.editor?.can().chain().toggleStrike().run() ?? false,
                isCode: ctx.editor?.isActive('code') ?? false,
                canCode: ctx.editor?.can().chain().toggleCode().run() ?? false,
                isLink: ctx.editor?.isActive('link') ?? false,
                canLink:
                    ctx.editor?.can().chain().toggleStrike().run() ?? false,
                canClearMarks:
                    ctx.editor?.can().chain().unsetAllMarks().run() ?? false,
                isParagraph: ctx.editor?.isActive('paragraph') ?? false,
                isHeading1:
                    ctx.editor?.isActive('heading', { level: 1 }) ?? false,
                isHeading2:
                    ctx.editor?.isActive('heading', { level: 2 }) ?? false,
                isHeading3:
                    ctx.editor?.isActive('heading', { level: 3 }) ?? false,
                isHeading4:
                    ctx.editor?.isActive('heading', { level: 4 }) ?? false,
                isHeading5:
                    ctx.editor?.isActive('heading', { level: 5 }) ?? false,
                isHeading6:
                    ctx.editor?.isActive('heading', { level: 6 }) ?? false,
                isBulletList: ctx.editor?.isActive('bulletList') ?? false,
                isOrderedList: ctx.editor?.isActive('orderedList') ?? false,
                isCodeBlock: ctx.editor?.isActive('codeBlock') ?? false,
                isBlockquote: ctx.editor?.isActive('blockquote') ?? false,
                canUndo: ctx.editor?.can().chain().undo().run() ?? false,
                canRedo: ctx.editor?.can().chain().redo().run() ?? false,
            };
        },
    });

    return (
        <div className="flex flex-wrap items-center gap-1 p-2 border-b border-gray-200 bg-white rounded-t-lg">
            {/* MARK Controls */}
            <ToolbarButton
                onClick={() => editor?.chain().focus().toggleBold().run()}
                isActive={editorState?.isBold}
                disabled={!editorState?.canBold}
                title="Bold"
            >
                <span className="font-bold">B</span>
            </ToolbarButton>
            <ToolbarButton
                onClick={() => editor?.chain().focus().toggleItalic().run()}
                isActive={editorState?.isItalic}
                disabled={!editorState?.canItalic}
                title="Italic"
            >
                <span className="italic">I</span>
            </ToolbarButton>
            <ToolbarButton
                onClick={() => editor?.chain().focus().toggleStrike().run()}
                isActive={editorState?.isStrike}
                disabled={!editorState?.canStrike}
                title="Strike"
            >
                <span className="line-through">S</span>
            </ToolbarButton>
            <ToolbarButton
                onClick={() => editor?.chain().focus().toggleCode().run()}
                isActive={editorState?.isCode}
                disabled={!editorState?.canCode}
                title="Code"
            >
                {'</>'}
            </ToolbarButton>
            <ToolbarButton
                onClick={() => editor?.chain().focus().toggleLink().run()}
                isActive={editorState?.isLink}
                disabled={!editorState?.canLink}
                title="Link"
            >
                <Link />
            </ToolbarButton>
            <div className="border-l border-gray-200 h-6 mx-1"></div>
            {/* HEADING Controls */}
            <ToolbarButton
                onClick={() =>
                    editor?.chain().focus().toggleHeading({ level: 1 }).run()
                }
                isActive={editorState?.isHeading1}
                title="Heading 1"
            >
                H1
            </ToolbarButton>
            <ToolbarButton
                onClick={() =>
                    editor?.chain().focus().toggleHeading({ level: 2 }).run()
                }
                isActive={editorState?.isHeading2}
                title="Heading 2"
            >
                H2
            </ToolbarButton>
            <ToolbarButton
                onClick={() =>
                    editor?.chain().focus().toggleHeading({ level: 3 }).run()
                }
                isActive={editorState?.isHeading3}
                title="Heading 3"
            >
                H3
            </ToolbarButton>

            <div className="border-l border-gray-200 h-6 mx-1"></div>

            {/* LIST/BLOCK Controls */}
            <ToolbarButton
                onClick={() => editor?.chain().focus().toggleBulletList().run()}
                isActive={editorState?.isBulletList}
                title="Bullet List"
            >
                {/* Giả định: <ListIcon className="h-4 w-4" /> */}
                UL
            </ToolbarButton>
            <ToolbarButton
                onClick={() =>
                    editor?.chain().focus().toggleOrderedList().run()
                }
                isActive={editorState?.isOrderedList}
                title="Ordered List"
            >
                {/* Giả định: <ListOrderedIcon className="h-4 w-4" /> */}
                OL
            </ToolbarButton>
            <ToolbarButton
                onClick={() => editor?.chain().focus().toggleCodeBlock().run()}
                isActive={editorState?.isCodeBlock}
                title="Code Block"
            >
                {'</>'}
            </ToolbarButton>
            <ToolbarButton
                onClick={() => editor?.chain().focus().toggleBlockquote().run()}
                isActive={editorState?.isBlockquote}
                title="Blockquote"
            >
                {'" "'}
            </ToolbarButton>
            <div className="border-l border-gray-200 h-6 mx-1"></div>

            <ToolbarButton
                onClick={() =>
                    editor?.chain().focus().clearNodes().unsetAllMarks().run()
                }
                title="Clear Format"
            >
                <BrushCleaning />
            </ToolbarButton>
            <ToolbarButton
                onClick={() => editor?.chain().focus().undo().run()}
                isActive={false}
                disabled={!editorState?.canUndo}
                title="Undo"
            >
                <Undo />
            </ToolbarButton>
            <ToolbarButton
                onClick={() => editor?.chain().focus().redo().run()}
                isActive={false}
                disabled={!editorState?.canRedo}
                title="Redo"
            >
                <Redo />
            </ToolbarButton>
        </div>
    );
};

export default MenuBar;
