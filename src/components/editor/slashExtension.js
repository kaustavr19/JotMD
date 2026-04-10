import { Extension } from '@tiptap/core'
import Suggestion from '@tiptap/suggestion'
import { ReactRenderer } from '@tiptap/react'
import tippy from 'tippy.js'
import SlashMenu from './SlashMenu'

const COMMANDS = [
  {
    title: 'Heading 1',
    description: 'Large section heading',
    command: ({ editor, range }) =>
      editor.chain().focus().deleteRange(range).setNode('heading', { level: 1 }).run(),
  },
  {
    title: 'Heading 2',
    description: 'Medium section heading',
    command: ({ editor, range }) =>
      editor.chain().focus().deleteRange(range).setNode('heading', { level: 2 }).run(),
  },
  {
    title: 'Heading 3',
    description: 'Small section heading',
    command: ({ editor, range }) =>
      editor.chain().focus().deleteRange(range).setNode('heading', { level: 3 }).run(),
  },
  {
    title: 'Bullet List',
    description: 'Unordered list of items',
    command: ({ editor, range }) =>
      editor.chain().focus().deleteRange(range).toggleBulletList().run(),
  },
  {
    title: 'Numbered List',
    description: 'Ordered list of items',
    command: ({ editor, range }) =>
      editor.chain().focus().deleteRange(range).toggleOrderedList().run(),
  },
  {
    title: 'Blockquote',
    description: 'Capture a quote or callout',
    command: ({ editor, range }) =>
      editor.chain().focus().deleteRange(range).setBlockquote().run(),
  },
  {
    title: 'Code Block',
    description: 'Display a code snippet',
    command: ({ editor, range }) =>
      editor.chain().focus().deleteRange(range).setCodeBlock().run(),
  },
  {
    title: 'Divider',
    description: 'Insert a horizontal divider',
    command: ({ editor, range }) =>
      editor.chain().focus().deleteRange(range).setHorizontalRule().run(),
  },
]

export const slashExtension = Extension.create({
  name: 'slashCommands',

  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        char: '/',
        items: ({ query }) =>
          COMMANDS.filter(item =>
            item.title.toLowerCase().includes(query.toLowerCase())
          ),
        command: ({ editor, range, props }) => {
          props.command({ editor, range })
        },
        render: () => {
          let component
          let popup

          return {
            onStart: props => {
              component = new ReactRenderer(SlashMenu, {
                props,
                editor: props.editor,
              })

              popup = tippy('body', {
                getReferenceClientRect: props.clientRect,
                appendTo: () => document.body,
                content: component.element,
                showOnCreate: true,
                interactive: true,
                trigger: 'manual',
                placement: 'bottom-start',
                offset: [0, 8],
                flipOnUpdate: true,
                popperOptions: {
                  modifiers: [
                    { name: 'flip', options: { fallbackPlacements: ['top-start'] } },
                  ],
                },
              })
            },

            onUpdate: props => {
              component.updateProps(props)
              popup[0].setProps({
                getReferenceClientRect: props.clientRect,
              })
            },

            onKeyDown: props => {
              if (props.event.key === 'Escape') {
                popup[0].hide()
                return true
              }
              return component.ref?.onKeyDown(props) ?? false
            },

            onExit: () => {
              popup[0].destroy()
              component.destroy()
            },
          }
        },
      }),
    ]
  },
})
