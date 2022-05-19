import * as React from 'react';
import { View, Text, StatusBar, TextInput, Pressable, FlatList, TouchableHighlight } from 'react-native';
import { IconButton, Divider } from 'react-native-paper';
import SafeAreaView from 'react-native-safe-area-view';
import { Base, Typography, Forms, Unique } from "../styles"

export default function Hitta({ navigation, stations }) {
  const [travel, setTravel] = React.useState({})
  const [from, setFrom] = React.useState({})
  const [to, setTo] = React.useState({})
  const [autoCompleteTo, setAutoCompleteTo] = React.useState()

  function swap() {
    setTravel({ from: travel.to, to: travel.from })
  }

  fromFocus = () => setFrom({ color: true })
  fromBlur = () => {
    setFrom({ color: false })
  }
  toFocus = () => setTo({ color: true })
  toBlur = () => {
    setTo({ color: false })
    setAutoCompleteTo([])
  }

  function handleToEvent(toChange) {
    if (toChange != "") {
      let list = []
      stations.forEach((station) => {
        if (station.name.toLowerCase().includes(toChange.toLowerCase())) {
          list.push(station.name)
        }
      })
      setAutoCompleteTo(list)
    } else {
      setAutoCompleteTo([])
    }
  }

  return (
    <SafeAreaView style={[{ ...Base.center }, { marginBottom: 20 }]}>
      <StatusBar barStyle="light-content" backgroundColor="rgb(55, 0, 180)" />
      <Text style={[{ ...Typography.header }, { ...Typography.center }]}>
        För vilken sträcka vill du hitta försenade tåg?
      </Text>
      <View style={{ ...Base.row }}>
        <View style={{ ...Base.column }}>
          <TextInput
            onFocus={fromFocus}
            onBlur={fromBlur}
            style={[{ ...Forms.input }, {
              borderBottomColor: from.color
                ? 'rgb(20, 210, 190)'
                : 'rgb(0, 0, 0)',
              borderBottomWidth: from.color
                ? 2
                : 1,
            }]}
            selectionColor={'rgb(20, 210, 190)'}
            onChangeText={(fromChange) => {
              setTravel({ ...travel, from: fromChange })
            }}
            value={travel?.from}
            placeholder="Avg. station"
            blurOnSubmit={true}
          />
          <TextInput
            onFocus={toFocus}
            onBlur={toBlur}
            style={[{ ...Forms.input }, {
              borderBottomColor: to.color
                ? 'rgb(20, 210, 190)'
                : 'rgb(0, 0, 0)',
              borderBottomWidth: to.color
                ? 2
                : 1,
            }]}
            selectionColor={'rgb(20, 210, 190)'}
            onChangeText={(toChange) => {
              setTravel({ ...travel, to: toChange }),
              handleToEvent(toChange)
            }}
            value={travel?.to}
            placeholder="Ank. station"
            blurOnSubmit={true}
          />
          <FlatList
            data={autoCompleteTo}
            style={{position: 'absolute', zIndex: 1, top: '100%', width: '100%', backgroundColor: "rgba(0, 0, 0, 0.1)"}}
            renderItem={({ item }) => (
              <TouchableHighlight
                style={{ ...Forms.flatListItem }}
                onPress={() => console.log(item)}
              >
                <Text>
                  {item}
                </Text>
              </TouchableHighlight>
            )}
          />
        </View>
        <View
          style={{ width: 50 }}
        >
          <IconButton
            icon="swap-vertical"
            style={{ ...Unique.swap }}
            onPress={() => swap()}
          />
        </View>
        <View
          style={{ width: 90 }}
        >
          <Pressable
            style={[{ ...Unique.sok }, { ...Base.center }]}
            onPress={() => {
              navigation.navigate("Sena")
            }}
          >
            <Text
              style={{ fontWeight: '500' }}
            >
              SÖK
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}