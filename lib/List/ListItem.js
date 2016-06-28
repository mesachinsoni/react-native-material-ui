import {
    StyleSheet,
    View,
    Text,
    TouchableWithoutFeedback,
    TouchableNativeFeedback
} from 'react-native';
import { TYPO, COLOR } from '../config';
import Icon from '../Icon';
import IconToggle from '../IconToggle';
import React, { Component, PropTypes } from 'react';

const propTypes = {
    // generally
    dense: PropTypes.bool,
    onPress: PropTypes.func,
    onPressValue: PropTypes.any,
    lines: React.PropTypes.oneOf([1, 2, 3, 'dynamic']),
    style: PropTypes.object,

    // left side
    leftElement: PropTypes.oneOfType([
        PropTypes.element,
        PropTypes.string,
    ]),
    onLeftElementPress: PropTypes.func,

    // center side
    centerElement: PropTypes.oneOfType([
        PropTypes.shape({
            primaryText: PropTypes.string.isRequired,
            secondaryText: PropTypes.string,
        })
    ]),

    // right side
    rightElement: PropTypes.oneOfType([
        PropTypes.element,
        PropTypes.string,
    ]),
    onRightElementPress: PropTypes.func
};
const defaultProps = {
    lines: 1,
    style: {},
};

const defaultStyles = StyleSheet.create({
    listItemContainer: {
        backgroundColor: '#ffffff',
        flex: 1,
        flexDirection: 'row',
        paddingVertical: 8,
    },

    contentViewContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },


    leftElementContainer: {
        flexDirection: 'column',
        width: 56,
    },

    centerElementContainer: {
        flex: 1,
    },


    textViewContainer: {
        flex: 1,
    },
    primaryText: {
        color: 'rgba(0,0,0,.87)',
        lineHeight: 24,
        ...TYPO.paperFontSubhead,
    },
    firstLine: {
        flexDirection: 'row'
    },
    primaryTextContainer: {
        flex: 1
    },
    secondaryText: Object.assign({}, TYPO.paperFontBody1, {
        lineHeight: 22,
        fontSize: 14,
        color: 'rgba(0,0,0,.54)',
    }),

    rightElementContainer: {
        paddingLeft: 16,
    },
    icon: {
        margin: 16,
    },
});

/**
* Please see this: https://material.google.com/components/lists.html#lists-specs
*/
const getListItemHeight = ({ leftElement, dense, numberOfLines }) => {
    if (numberOfLines === 'dynamic') {
        return null;
    }

    if (!leftElement && numberOfLines === 1) {
        return dense ? 40 : 48;
    }

    if (numberOfLines === 1) {
        return dense ? 48 : 56;
    } else if (numberOfLines === 2) {
        return dense ? 60 : 72;
    } else if (numberOfLines === 3) {
        return dense ? 80 : 88;
    }

    return null;
};

class ListItem extends Component {
    onListItemPressed = () => {
        const { onPress, onPressValue } = this.props;

        if (onPress) {
            onPress(onPressValue);
        }
    };
    onLeftElementPressed = () => {
        const { onLeftElementPress, onPress, onPressValue } = this.props;

        if (onLeftElementPress) {
            onLeftElementPress(onPressValue);
        }
        if (onPress) {
            onPress(onPressValue);
        }
    };
    onRightElementPressed = () => {
        const { onRightElementPress, onPressValue } = this.props;

        if (onRightElementPress) {
            onRightElementPress(onPressValue);
        }
    };
    getDynamicStyle = (key) => {
        const {
            dense,
            lines,
            leftElement,
            centerElement,
            rightElement,
        } = this.props;

        const result = {};

        if (key === 'listItemContainer' || key === 'contentViewContainer') {
            let numberOfLines = lines;

            if (centerElement && centerElement.secondaryText && (!lines || lines < 2)) {
                numberOfLines = 2;
            }

            result.contentViewContainer = {};
            result.listItemContainer = {
                height: getListItemHeight({ dense, leftElement, numberOfLines })
            };

            if (numberOfLines === 3) {
                result.listItemContainer.alignItems = 'center';
            } else if (numberOfLines === 2) {
                result.contentViewContainer.alignItems = 'center';
            } else if (numberOfLines === 1) {
                result.contentViewContainer.alignItems = 'center';
            } else if (numberOfLines === 'dynamic') {
                result.listItemContainer = {
                    alignItems: 'center',
                    paddingTop: 16,
                    paddingBottom: 16
                };
            }

            if (typeof leftElement !== 'string') {
                result.listItemContainer.paddingLeft = 16;
            }
            if (typeof rightElement !== 'string') {
                result.listItemContainer.paddingRight = 16;
            }
        }

        return result;
    }
    getStyle = (key) => {
        const { style } = this.props;

        const dynamicStyles = this.getDynamicStyle(key);

        return [
            defaultStyles[key],
            dynamicStyles[key],
            style[key],
        ];
    }
    renderLeftElement = () => {
        const { leftElement } = this.props;

        if (!leftElement) {
            return null;
        }

        let content = null;

        if (typeof leftElement === 'string') {
            content = (
                <TouchableWithoutFeedback onPress={this.onLeftElementPressed}>
                    <Icon name={leftElement} size={24} style={this.getStyle('icon')} />
                </TouchableWithoutFeedback>
            );
        } else {
            content = (
                <TouchableWithoutFeedback onPress={this.onLeftElementPressed}>
                    <View>
                        {leftElement}
                    </View>
                </TouchableWithoutFeedback>
            );
        }

        return (
            <View style={this.getStyle('leftElementContainer')}>
                {content}
            </View>
        );
    }
    renderCenterElement = () => {
        const {
            lines,
            centerElement
        } = this.props;

        const primaryText = centerElement && centerElement.primaryText;
        const secondaryText = centerElement && centerElement.secondaryText;
        let content = null;

        content = (
            <View style={this.getStyle('textViewContainer')}>
                <View style={this.getStyle('firstLine')}>
                    <View style={this.getStyle('primaryTextContainer')}>
                        <Text
                          numberOfLines={lines && lines === 'dynamic' ? null : 1}
                          style={this.getStyle('primaryText')}
                        >
                            {primaryText}
                        </Text>
                    </View>
                </View>
                {secondaryText &&
                    <View>
                        <Text style={this.getStyle('secondaryText')}>
                            {secondaryText}
                        </Text>
                    </View>
                }
            </View>
        );


        return (
            <View style={this.getStyle('centerElementContainer')}>
                {content}
            </View>
        );
    }
    renderRightElement = () => {
        const { rightElement } = this.props;

        let content = null;

        if (typeof rightElement === 'string') {
            content = (
                <IconToggle color={COLOR.paperGrey500.color} onPress={this.onRightElementPressed}>
                    <Icon name={rightElement} size={24} style={this.getStyle('icon')} />
                </IconToggle>
            );
        } else {
            content = (
                <TouchableWithoutFeedback onPress={this.onRightElementPressed}>
                    <View>
                        {rightElement}
                    </View>
                </TouchableWithoutFeedback>
            );
        }

        return (
            <View style={this.getStyle('rightElementContainer')}>
                {content}
            </View>
        );
    }
    render() {
        const { onPress } = this.props;

        const content = (
                <View style={this.getStyle('listItemContainer')}>
                    <View style={this.getStyle('contentViewContainer')}>
                        {this.renderLeftElement()}
                        {this.renderCenterElement()}
                        {this.renderRightElement()}
                    </View>
                </View>
        );

        if (onPress) {
            return (
                <TouchableNativeFeedback onPress={this.onListItemPressed}>
                    {content}
                </TouchableNativeFeedback>
            );
        }

        return content;
    }
}

ListItem.propTypes = propTypes;
ListItem.defaultProps = defaultProps;

export default ListItem;