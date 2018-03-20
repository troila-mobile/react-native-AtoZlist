import React from 'react';
import { View, Text, PanResponder } from 'react-native';

const LETTERS = [
  '#',
  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
  'G',
  'H',
  'I',
  'J',
  'K',
  'L',
  'M',
  'N',
  'O',
  'P',
  'Q',
  'R',
  'S',
  'T',
  'U',
  'V',
  'W',
  'X',
  'Y',
  'Z',
];

const styles = {
  container: {
    backgroundColor: 'transparent',
    width: 40,
    alignItems: 'flex-end',
    paddingRight: 3,
  },
  letter: {
    textAlign: 'center',
    fontSize: 14,
    height: 15,
    width: 20,
  },
};
type LetterProps = {
  +letter: string,
  +style: {},
  +highlighted: boolean,
  +highlightedStyle: {},
};
const Letter = ({ letter, style, highlighted, highlightedStyle = {} }: LetterProps) => (
  <Text style={[styles.letter, style, highlighted ? highlightedStyle : {}]}>{letter}</Text>
);

type AlphabetProps = {
  +alphabet?: string[],
  +containerStyle?: {},
  +letterStyle?: {},
  +highlightedLetterStyle?: {},
  +onTapLetter: () => any,
};
class TouchableAlphabet extends React.PureComponent<AlphabetProps> {
  static defaultProps = {
    containerStyle: {},
    letterStyle: {},
    alphabet: LETTERS,
    highlightedLetterStyle: {},
  };
  state = { touchedLetter: null };
  componentWillMount() {
    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt, gestureState) => {
        this.tapTimeout = setTimeout(() => {
          const letter = this.findTappedLetter(gestureState.y0);
          this.setState({ touchedLetter: letter }, () => {});
          this.props.onTapLetter(letter);
        }, 100);
      },
      onPanResponderMove: (evt, gestureState) => {
        clearTimeout(this.tapTimeout);
        const letter = this.findTappedLetter(gestureState.moveY);
        if (letter !== this.state.touchedLetter) this.setState({ touchedLetter: letter });
        this.props.onTapLetter(letter);
      },
      onPanResponderRelease: () => {
        setTimeout(() => {
          this.setState({ touchedLetter: null });
        }, 200);
      },
      onPanResponderTerminate: () => {
        setTimeout(() => {
          this.setState({ touchedLetter: null });
        }, 200);
      },
    });
  }
  onInitLayout = () => {
    this.container.measure((x, y, width, height, offX, offY) => {
      this.containerOffset = offY;
      this.containerHeight = height;
    });
  };

  panResponder = {};
  tapTimeout = null;
  container = null;
  containerHeight = 0;
  containerTopOffset = 0;

  findTappedLetter = (y0) => {
    const offset = y0 - (this.containerOffset || 0);
    if (offset >= 1 && offset <= this.containerHeight) {
      const index = Math.floor(offset / 15); // 15 - Letter height
      return this.props.alphabet[index];
    }
    return null;
  };

  render() {
    return (
      <View
        style={[
          styles.container,
          this.props.containerStyle,
          { height: (this.props.alphabet.length + 1) * 15 },
        ]}
        ref={(r) => {
          this.container = r;
        }}
        onLayout={this.onInitLayout}
        {...this.panResponder.panHandlers}
      >
        {this.props.alphabet.map(l => (
          <Letter
            letter={l}
            style={this.props.letterStyle}
            key={l}
            highlighted={l === this.state.touchedLetter}
            highlightedStyle={this.props.highlightedLetterStyle}
          />
        ))}
      </View>
    );
  }
}

export default TouchableAlphabet;
