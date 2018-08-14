import React from 'react';
import { View, Linking, Text, StyleSheet } from 'react-native';

import { htmlStyle, textStyle, viewStyle } from './style';
import { isInline } from './parser';

let nodeId = 0;
let options = {};

const defaultOptions = {
  textComponent: Text,
  blockComponent: View,
  htmlStyle,
  onLinkPress: (href) => {
    console.log('LINK PRESSED', href);
  },
};

const renderers = {
  block: element => {
    const BlockComponent = options.blockComponent;
    return (
      <BlockComponent {...element.props}>
        {element.children}
      </BlockComponent>
    );
  },

  inline: element => {
    const TextComponent = options.textComponent;
    return (
      <TextComponent {...element.props}>
        {element.children}
      </TextComponent>
    );
  },

  br: (element) => {
    const TextComponent = options.textComponent;
    return <TextComponent {...element.props}>{`\n`}</TextComponent>;
  },

  a: (element, node) => {
    let onPress = null;
    if (node.attributes && node.attributes.href) {
      if (typeof options.onLinkPress === 'function') {
        onPress = () => {
          options.onLinkPress(node.attributes.href);
        };
      }
    }
    

    const TextComponent = options.textComponent;
    return (
      <TextComponent {...element.props} onPress={onPress}>
        {element.children}
      </TextComponent>
    );
  },

  ul: (element, node, parentNode) => {
    const BlockComponent = options.blockComponent;

    if (parentNode.tag === 'li') {
      return (
        <BlockComponent
          {...element.props}
          style={{
            marginTop: node.index === 0 ? 20 : 0,
            marginBottom: 0,
          }}
        >
          {element.children}
        </BlockComponent>
      );
    }
    return (
      <BlockComponent {...element.props}>
        {element.children}
      </BlockComponent>
    );
  },

  li: (element, node, parentNode) => {
    const TextComponent = options.textComponent;
    const BlockComponent = options.blockComponent;

    let bullet = (
      <TextComponent style={options.htmlStyle.ulBullet}>
        &bull;
      </TextComponent>
    );

    if (parentNode.tag === 'ol') {
      bullet = (
        <TextComponent style={options.htmlStyle.olBullet}>
          {`${node.index+1}.`}
        </TextComponent>
      );
    }

    return (
      <BlockComponent {...element.props}>
        {bullet}
        <BlockComponent style={options.htmlStyle.liContent}>
          {element.children}
        </BlockComponent>
      </BlockComponent>
    );
  },
};

function renderText(textNode, node, parentNode, styleChain) {
  nodeId += 1;  

  let parsedText = textNode.text;
  // parsedText = parsedText.replace(/\n/g, ''); // remove newlines
  // parsedText = parsedText.replace(/\t/g, ' '); // change tabs to spaces
  // parsedText = parsedText.replace(/ +/g, ' '); // remove multiple spaces
  // if(parsedText !== ' ') {
  //   if(textNode.firstChild) parsedText = parsedText.replace(/^[ \t\n]+/, '');
  //   if(textNode.lastChild) parsedText = parsedText.replace(/[ \t\n]+$/, '');
  // }
  if(!parsedText) return null;

  const TextComponent = options.textComponent;
  return (
    <TextComponent key={`text=${nodeId}`} style={styleChain}>
      {parsedText}
    </TextComponent>
  );
}

function renderNode(node, parentNode = null, parentStyleChain = []) {
  nodeId += 1;

  let renderer = node.tag;

  const element = {
    props: {
      key: `node-${nodeId}`,
      style: options.htmlStyle[node.tag] || {},
    },
    children: [],
  };

  if (typeof renderers[renderer] !== 'function') {
    // console.log('NO RENDERER FOR', node);
    renderer = node.inline ? 'inline' : 'block';
  }

  const styleChain = [...parentStyleChain, options.htmlStyle[`${node.tag}-text`]];

  if (node.children) {
    element.children = node.children.map(child => {
      if(child.tag === 'TEXT') {
        return renderText(child, node, parentNode, styleChain);
      }
      return renderNode(child, node, styleChain);
    });
  }

  return renderers[renderer](element, node, parentNode);
}

export default function render(xml, userOptions) {
  nodeId = 0;
  options = Object.assign({}, defaultOptions, userOptions);
  return renderNode(xml);
}
