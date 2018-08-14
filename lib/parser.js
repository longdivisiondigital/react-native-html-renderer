import { inlineElements, blockElements, isInline } from './constants';

/* eslint-disable no-param-reassign */
function setChildIndices(node) {
  node.numChildren = node.children.length;
  for (let i = 0; i < node.numChildren; i += 1) {
    node.children[i].index = i;
    if (i === 0) node.children[i].firstChild = true;
    if (i === node.numChildren - 1) node.children[i].lastChild = true;
  }
}
/* eslint-enable no-param-reassign */

function stackChildren(node, parsedNode) {

    const stacks = [];
    const nodeChildren = [];

    let stack = null;

    node.$$.forEach((childNode, childIndex) => {
      const child = parseNode(childNode, parsedNode, childIndex);
      if(!child) return;
      if (parsedNode.inline) {
        // simple, just add as a child;
        nodeChildren.push(child);
        return;
      }

      if (!child.inline) {
        stacks.push(child);
        stack = null;
        return;
      }

      // Ok, we have to stack up
      if (!stack) {
        stack = {
          stack: true,
          children: [],
        };
        stacks.push(stack);
      }

      stack.children.push(child);
    });

    return [stacks, nodeChildren];
}

function parseNode(node, parentNode, index) {

  if(inlineElements.indexOf(node['#name']) === -1
    && blockElements.indexOf(node['#name']) === -1
    && node['#name'] !== '__text__') {
    console.log('Unsupported tag:', node['#name']);
    return null;
  }

  const parsedNode = {
    tag: node['#name'],
    index,
  };

  if ((parentNode && parentNode.inline) || inlineElements.indexOf(node['#name']) !== -1) parsedNode.inline = true;

  if (node.$) {
    parsedNode.attributes = node.$;
  }

  if (node['#name'] === '__text__') {
    parsedNode.tag = 'TEXT';
    parsedNode.text = node._;
    if (index === 0) parsedNode.text = parsedNode.text.replace(/^ +/, '');
    if (parsedNode.text === '') return null;
    parsedNode.inline = true;
    return parsedNode;
  }

  if (node.$$) {
    parsedNode.children = [];

    const [stacks, nodeChildren] = stackChildren(node, parsedNode);

    if (!parsedNode.inline) {
      // collect stacks
      stacks.forEach((stackChild, outerIndex) => {
        if (!stackChild.stack) {
          parsedNode.children.push(Object.assign(stackChild, { index: outerIndex }));
          return;
        }

        if (stackChild.children.length === 1) {
          parsedNode.children.push(Object.assign(stackChild.children[0], { index: outerIndex }));
          return;
        }

        const stackNode = {
          tag: 'span',
          inline: true,
          index: outerIndex,
          children: stackChild.children,
        };
        setChildIndices(stackNode);

        parsedNode.children.push(stackNode);
      });
    }
    else {
      parsedNode.children = nodeChildren;
    }

    // now update parent / sibling situation
    setChildIndices(parsedNode);
  }

  return parsedNode;
}


export default function parse(xml) {
  // console.log(xml);

  const parsedXML = parseNode(xml.div, null, 0);

  // console.log(parsedXML);

  return parsedXML;
}
