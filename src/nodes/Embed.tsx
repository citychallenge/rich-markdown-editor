import * as React from "react";
import Node from "./Node";
import { NodeSelection, TextSelection } from "prosemirror-state";
import { safeInsert } from "prosemirror-utils";
export default class Embed extends Node {
  get name() {
    return "embed";
  }

  get schema() {
    return {
      content: "inline*",
      group: "block",
      attrs: {
        href: {},
        component: {},
        matches: {},
      },
      editable: false,
      selectable: true,
      parseDOM: [{ tag: "iframe" }],
      toDOM: node => [
        "iframe",
        { src: node.attrs.href, contentEditable: false },
        0,
      ],
    };
  }

  parentSelection(element: HTMLDivElement) {
    const { view } = this.editor;
    const { state } = view;

    // Find the position
    const pos = view.posAtDOM(element, 0);
    const resolvedDOM = state.doc.resolve(pos);
    // Resolve the direct parent position
    const resolved = state.doc.resolve(resolvedDOM.before());
    return new NodeSelection(resolved);
  }

  removeEmbed(element: HTMLDivElement) {
    const { view } = this.editor;
    const { state } = view;

    const tr = state.tr.setSelection(this.parentSelection(element));
    view.dispatch(tr.deleteSelection());
  }

  insertParagraphAfter(element: HTMLDivElement) {
    const { view, schema } = this.editor;
    const { state } = view;

    const parent = this.parentSelection(element);

    let tr = state.tr.setSelection(parent);

    tr = safeInsert(schema.node("paragraph").type.create())(tr);

    const resolvedPos = tr.doc.resolve(parent.anchor + parent.node.nodeSize);
    view.dispatch(tr.setSelection(new TextSelection(resolvedPos)));
    view.focus();
  }

  component = ({ isEditable, isSelected, theme, node }) => {
    const Component = node.attrs.component;

    return (
      <div
        className="embed"
        contentEditable={false}
        tabIndex={0}
        onKeyUp={({ currentTarget, key }) => {
          if (key === "Delete" || key === "Backspace") {
            this.removeEmbed(currentTarget);
          }
          if (key === "Enter") {
            this.insertParagraphAfter(currentTarget);
          }
        }}
      >
        <div className="embed-inner">
          <Component
            attrs={node.attrs}
            isEditable={isEditable}
            isSelected={isSelected}
            theme={theme}
          />
        </div>
      </div>
    );
  };

  commands({ type }) {
    return attrs => (state, dispatch) => {
      dispatch(
        state.tr.replaceSelectionWith(type.create(attrs)).scrollIntoView()
      );
      return true;
    };
  }

  toMarkdown(state, node) {
    state.ensureNewLine();
    state.write(
      "[" + state.esc(node.attrs.href) + "](" + state.esc(node.attrs.href) + ")"
    );
    state.write("\n\n");
  }

  parseMarkdown() {
    return {
      node: "embed",
      getAttrs: token => ({
        href: token.attrGet("href"),
        matches: token.attrGet("matches"),
        component: token.attrGet("component"),
      }),
    };
  }
}
