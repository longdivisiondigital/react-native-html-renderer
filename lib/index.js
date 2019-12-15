import React from 'react';
import PropTypes from 'prop-types';
import { View, Text } from 'react-native';
import { parseString } from 'react-native-xml2js';

import parse from './parser';
import render from './renderer';

export default class HTMLView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      xml: null,
      error: null,
    };
  }

  componentDidMount() {
    const { html } = this.props;
    if (html) this.parseHTML(html);
  }

  componentDidUpdate(newProps) {
    const { html } = this.props;
    if (newProps.html !== html) this.parseHTML(newProps.html);
  }

  parseHTML(html) {
    if (!html) return;

    // strip newlines to make parsing easier
    let sanitizedHTML = html;
    sanitizedHTML = sanitizedHTML.replace(/\t/g, ' '); // change tabs to spaces
    sanitizedHTML = sanitizedHTML.replace(/^ +/gm, ''); // remove indentation
    sanitizedHTML = sanitizedHTML.replace(/\n/g, ''); // remove newlines
    sanitizedHTML = sanitizedHTML.replace(/ +/g, ' '); // remove multiple spaces

    parseString(
      `<div>${sanitizedHTML}</div>`,
      {
        normalizeTags: true,
        explicitChildren: true,
        charsAsChildren: true,
        includeWhiteChars: true,
        preserveChildrenOrder: true,
      },
      (error, xml) => {
        if (error) {
          console.log('FAILED TO PARSE HTML', error);
          this.setState({ xml: null, error });
          return;
        }

        const parsedXML = parse(xml);
        if(xml && !parsedXML) {
          console.log('FAILED TO PARSE XML');
          this.setState({ xml: null, error: 'Failed to parse HTML' });
          return;
        }

        this.setState({
          xml: parsedXML,
          error: null
        });
      },
    );
  }


  render() {
    const { style, options } = this.props;
    const { error, xml } = this.state;

    if (error) {
      return (
        <Text style={{
          backgroundColor: 'red',
          color: 'white',
        }}
        >
          {error}
        </Text>
      );
    }

    if (!xml) return null;

    return (
      <View style={style}>
        {render(xml, options)}
      </View>
    );
  }
}

HTMLView.propTypes = {
  html: PropTypes.string,
  style: PropTypes.any,
  options: PropTypes.object,
};

HTMLView.defaultProps = {
  html: '',
  style: null,
  options: {},
};
