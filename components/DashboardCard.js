import React, {Component} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableHighlight,
  Pressable,
} from 'react-native';
import {Badge, ListItem, Button, ScrollView} from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';

import {Colors} from '../components/Colors';
import {widthToDp, heightToDp} from '../utils/Responsive';

export default DashboardCard = ({
  backgroundColor,
  cardName,
  icon,
  onPress,
  displayBadge,
  badgeValue,
}) => {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.cardBackground, {backgroundColor: backgroundColor}]}>
      {displayBadge === true ? (
        <Badge
          status="error"
          value={badgeValue}
          containerStyle={{position: 'absolute', top: -4, right: -4}}
          allowFontScaling={false}
        />
      ) : null}
      <View style={styles.iconBackground}>
        <Icon name={icon} size={30} color={backgroundColor} />
      </View>

      <View style={styles.cardFooterBackground}>
        <Text style={styles.cardName} allowFontScaling={false}>
          {cardName}
        </Text>
        <Icon
          name="chevron-right"
          size={15}
          color={Colors.dark}
          style={{marginLeft: 10}}
        />
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  cardName: {
    color: Colors.dark,
    fontWeight: 'bold',
    fontSize: heightToDp('1.4%'),
  },
  cardFooterBackground: {
    backgroundColor: '#ebedf087',
    height: heightToDp('5%'),
    width: '100%',
    position: 'absolute',
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 10,
    flexDirection: 'row',
  },
  iconBackground: {
    alignItems: 'center',
    backgroundColor: '#ebedf087',
    height: 50,
    width: 50,
    resizeMode: 'stretch',
    position: 'absolute',
    bottom: heightToDp('7%'),
    justifyContent: 'center',
    borderRadius: 100,
  },
  cardBackground: {
    flexDirection: 'row',
    flex: 1,
    height: heightToDp('17%'),
    borderRadius: 15,
    marginTop: 5,
    marginHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
  },
});
