/* eslint-disable class-methods-use-this */
import { Extension, Plugin } from 'tiptap';
import { Decoration, DecorationSet } from 'prosemirror-view';

export default class Cursors extends Extension {
  get name() {
    return 'cursors';
  }

  get defaultOptions() {
    return {
    };
  }

  getDecorations({ doc, selections }) {
    const { clientID } = this.editor.extensions.options.collaboration;
    const decorations = selections
      .filter((selection) => selection.clientID !== clientID)
      .map((selection) => {
        const decors = [];
        if (selection.selection) {
          const { from, to } = selection.selection;
          const span = document.createElement('span');
          span.className = `cursor client-${selection.clientID}`;
          decors.push(Decoration.widget(to, span));
          if (from !== to) {
            decors.push(Decoration.inline(from, to, {
              nodeName: 'span',
              class: `selection client-${selection.clientID}`,
            }));
          }
        }
        return decors;
      })
      .flat();

    return DecorationSet.create(doc, decorations);
  }

  get plugins() {
    return [
      new Plugin({
        state: {
          init: (_, { doc }) => this.getDecorations({ doc, selections: [] }),
          apply: (transaction, decorationSet) => {
            const { mapping, doc } = transaction;
            const selections = transaction.getMeta('selections');

            if (selections) {
              return this.getDecorations({ doc, selections });
            }

            return decorationSet.map(mapping, doc);
          },
        },
        props: {
          decorations(state) {
            return this.getState(state);
          },
        },
      }),
    ];
  }

  update(selections) {
    const { tr } = this.editor.state;
    const transaction = tr
      .setMeta('selections', selections)
      .setMeta('addToHistory', false);

    this.editor.view.dispatch(transaction);
  }
}
