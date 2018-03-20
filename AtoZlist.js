import React from 'react';
import { View, Text, SectionList, TouchableOpacity } from 'react-native';
import sectionListGetItemLayout from 'react-native-section-list-get-item-layout';
import TouchableAlphabet from './touchableAlphabet';

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

function getFirstLetterFrom(value) {
  return /^[a-z]/i.test(value.description) ? value.description.slice(0, 1).toUpperCase() : '#';
}

function convert(data) {
  const dataSource = data.reduce((list, dataItem) => {
    const listItem = list.find(item => item.letter && item.letter === getFirstLetterFrom(dataItem));
    if (!listItem) {
      list.push({ letter: getFirstLetterFrom(dataItem), data: [dataItem] });
    } else {
      listItem.data.push(dataItem);
    }
    return list;
  }, []);
  return dataSource;
}
type Props = {
  +data: Object[], // alphabetically sorted
  +renderItem: () => React.Node,
  +getItemHeight: (rowData: any, sectionIndex: number, rowIndex: number) => number,
  +containerStyle?: {},
  +viewOffset?: number,
  +renderSectionHeader?: () => React.Node,
  +getSectionSeparatorHeight?: (sectionIndex: number, rowIndex: number) => number,
  +getSectionHeaderHeight?: (sectionIndex: number) => number,
  +getSectionFooterHeight?: (sectionIndex: number) => number,
  +listHeaderHeight?: number | (() => number),
};
class AtoZlist extends React.Component<Props> {
  static defaultProps = {
    renderSectionHeader: () => null,
    viewOffset: 0,
    letterStyle: {},
    containerStyle: {},
  };
  constructor(props) {
    super(props);
    this.state = { dataSource: convert(props.data) };
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.data !== nextProps.data) {
      this.setState({ dataSource: convert(nextProps.data) });
    }
  }
  handleOnPress = (letter) => {
    if (letter) {
      let sectionIndex = 0;
      while (
        this.state.dataSource.length - 1 !== sectionIndex &&
        this.state.dataSource[sectionIndex].letter !== letter &&
        this.state.dataSource[sectionIndex].letter < letter
      ) {
        sectionIndex += 1;
      }
      this.sectionListRef.scrollToLocation({
        animated: true,
        itemIndex: 0,
        sectionIndex,
        viewOffset: this.props.viewOffset,
      });
    }
  };
  renderLetters = () => (
    <View style={{ flexDirection: 'column', width: 20, justifyContent: 'center' }}>
      {LETTERS.map(letter => (
        <TouchableOpacity
          onPress={() => {
            this.handleOnPress(letter);
          }}
          key={letter}
        >
          <Text style={[{ fontSize: 15, textAlign: 'center' }, this.props.letterStyle]}>
            {letter}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
  render() {
    return (
      <View style={[{ flexDirection: 'row', flex: 1 }, this.props.containerStyle]}>
        <SectionList
          ref={(ref) => {
            this.sectionListRef = ref;
          }}
          renderItem={this.props.renderItem}
          renderSectionHeader={this.props.renderSectionHeader}
          sections={this.state.dataSource}
          getItemLayout={sectionListGetItemLayout({
            getItemHeight: this.props.getItemHeight,
          })}
        />
        <TouchableAlphabet
          onTapLetter={this.handleOnPress}
          containerStyle={{ position: 'absolute', right: 0 }}
          letterStyle={{ color: '#38f' }}
          highlightedLetterStyle={{ color: '#248', fontWeight: 'bold' }}
        />
      </View>
    );
  }
}
export default AtoZlist;
