import {
  Root,
  List,
  Blockquote,
  Block,
  Link,
  ItemLink,
  InlineItem,
  Code,
  ListItem,
  Paragraph,
  Heading,
  Node,
  Span,
  WithChildrenNode,
  InlineNode,
  NodeType,
} from './types';

import {
  headingNodeType,
  spanNodeType,
  rootNodeType,
  paragraphNodeType,
  listNodeType,
  listItemNodeType,
  blockquoteNodeType,
  blockNodeType,
  codeNodeType,
  linkNodeType,
  itemLinkNodeType,
  inlineItemNodeType,
  inlineNodeTypes,
} from './definitions';

export function hasChildren(node: Node): node is WithChildrenNode {
  return 'children' in node;
}

export function isInline(node: Node): node is InlineNode {
  return (inlineNodeTypes as NodeType[]).includes(node.type);
}

export function isHeading(node: Node): node is Heading {
  return node.type === headingNodeType;
}

export function isSpan(node: Node): node is Span {
  return node.type === spanNodeType;
}

export function isRoot(node: Node): node is Root {
  return node.type === rootNodeType;
}

export function isParagraph(node: Node): node is Paragraph {
  return node.type === paragraphNodeType;
}

export function isList(node: Node): node is List {
  return node.type === listNodeType;
}

export function isListItem(node: Node): node is ListItem {
  return node.type === listItemNodeType;
}

export function isBlockquote(node: Node): node is Blockquote {
  return node.type === blockquoteNodeType;
}

export function isBlock(node: Node): node is Block {
  return node.type === blockNodeType;
}

export function isCode(node: Node): node is Code {
  return node.type === codeNodeType;
}

export function isLink(node: Node): node is Link {
  return node.type === linkNodeType;
}

export function isItemLink(node: Node): node is ItemLink {
  return node.type === itemLinkNodeType;
}

export function isInlineItem(node: Node): node is InlineItem {
  return node.type === inlineItemNodeType;
}
