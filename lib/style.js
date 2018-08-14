import { StyleSheet } from 'react-native';
// import { colors, fonts } from '../../style';
const colors = {
  darkBlue: 'darkblue',
  red: 'red',
};

const fonts = {
  playFairBold: 'Arial',
};

const textStyles = [
  'textShadowOffset', 'color', 'fontSize', 'fontStyle', 'fontWeight', 'lineHeight',
  'textAlign', 'textDecorationLine', 'textShadowColor', 'fontFamily', 'textShadowRadius',
  'includeFontPadding', 'textAlignVertical', 'fontVariant', 'letterSpacing',
  'textDecorationColor', 'textDecorationStyle', 'textTransform', 'writingDirection',
];

export function isTextStyle(key) {
  return textStyles.indexOf(key) !== -1;
}

export function textStyle(styles) {
  const flatStyle = StyleSheet.flatten(styles);
  const fixedStyle = {};
  Object.keys(flatStyle).forEach((key) => {
    if (isTextStyle(key)) fixedStyle[key] = flatStyle[key];
  });
  return fixedStyle;
}

export function viewStyle(styles) {
  const flatStyle = StyleSheet.flatten(styles);
  const fixedStyle = {};
  Object.keys(flatStyle).forEach((key) => {
    if (!isTextStyle(key)) fixedStyle[key] = flatStyle[key];
  });
  return fixedStyle;
}

export const htmlStyle = {
  div: {
    marginBottom: 10,
  },
  p: {
    marginBottom: 10,
  },
  'a-text': {
    color: colors.red,
    textDecorationLine: 'underline',
  },
  'b-text': {
    fontWeight: 'bold',
  },
  'strong-text': {
    fontWeight: 'bold',
  },
  h1: {
    marginVertical: 10,
  },
  'h1-text': {
    fontSize: 32,
    lineHeight: 32 * 1.4,
    fontFamily: fonts.playFairBold,
    color: colors.darkBlue,
    fontWeight: 'bold',
  },
  h2: {
    marginVertical: 10,
  },
  'h2-text': {
    fontSize: 22,
    lineHeight: 22 * 1.4,
    fontFamily: fonts.playFairBold,
    color: colors.darkBlue,
    fontWeight: 'bold',
  },
  h3: {
    marginVertical: 10,
  },
  'h3-text': {
    fontSize: 18,
    lineHeight: 18 * 1.4,
    fontFamily: fonts.playFairBold,
    color: colors.darkBlue,
    fontWeight: 'bold',
  },
  h4: {
    marginVertical: 10,
  },
  'h4-text': {
    fontSize: 16,
    lineHeight: 16 * 1.4,
    fontFamily: fonts.playFairBold,
    color: colors.darkBlue,
    fontWeight: 'bold',
  },
  li: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  ul: {
    marginBottom: 20,
  },
  ol: {
    marginBottom: 20,
  },
  ulBullet: {
    marginHorizontal: 10,
  },
  'ulBullet-text': {
    fontWeight: 'bold',
  },
  olBullet: {
    marginHorizontal: 10,
  },
  liContent: {
    flex: 1,
  },
};
