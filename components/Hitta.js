import * as React from 'react';
import { View, Text, StatusBar, TextInput, Pressable, FlatList, TouchableOpacity } from 'react-native';
import { IconButton } from 'react-native-paper';
import SafeAreaView from 'react-native-safe-area-view';
import { Base, Typography, Forms, Unique } from "../styles"

export default function Hitta({ navigation, stations, getTimeTable }) {
  const [travel, setTravel] = React.useState({})
  const [color, setColor] = React.useState({})
  const [autoCompleteTo, setAutoCompleteTo] = React.useState()
  const [autoCompleteFrom, setAutoCompleteFrom] = React.useState()

  function swap() {
    setTravel({ from: travel.to, to: travel.from })
  }

  fromFocus = () => {
    setColor({ ...color, from: true })
    setAutoCompleteTo([])
  }
  fromBlur = () => {
    setColor({ ...color, from: false })
  }
  toFocus = () => {
    setColor({ ...color, to: true })
    setAutoCompleteFrom([])
  }
  toBlur = () => {
    setColor({ ...color, to: false })
  }

  function handleTextInput(value, func) {
    if (value != "") {
      let list = []
      stations.forEach((station) => {
        if (station.AdvertisedLocationName.toLowerCase().includes(value.toLowerCase())) {
          list.push(station.AdvertisedLocationName)
        }
      })
      func(list)
    } else {
      func([])
    }
  }

  async function trySearch() {
    let fromSignature = ""
    let toSignature = ""

    stations.forEach((station) => {
      if (station.AdvertisedLocationName.toLowerCase() == travel.from.toLowerCase()) {
        fromSignature = station.LocationSignature
      } else if (station.AdvertisedLocationName.toLowerCase() == travel.to.toLowerCase()) {
        toSignature = station.LocationSignature
      }
    })

    if (fromSignature != "" && toSignature != "") {
      await getTimeTable(fromSignature, toSignature)
    }
  }

  return (
    <SafeAreaView style={[{ ...Base.center }]}>
      <StatusBar barStyle="light-content" backgroundColor="rgb(55, 0, 180)" />
      <Text style={[{ ...Typography.header }, { ...Typography.center }]}>
        F??r vilken str??cka vill du hitta f??rsenade t??g?
      </Text>
      <View style={{ ...Base.row }}>
        <View style={{ ...Base.column }}>
          <TextInput
            onFocus={fromFocus}
            onBlur={fromBlur}
            style={[{ ...Forms.input }, {
              borderBottomColor: color.from
                ? 'rgb(20, 210, 190)'
                : 'rgb(0, 0, 0)',
              borderBottomWidth: color.from
                ? 2
                : 1,
            }]}
            selectionColor={'rgb(20, 210, 190)'}
            onChangeText={(fromChange) => {
              setTravel({ ...travel, from: fromChange })
              handleTextInput(fromChange, setAutoCompleteFrom)
            }}
            value={travel?.from}
            placeholder="Avg. station"
            blurOnSubmit={true}
          />
          <View style={{ position: 'relative' }}>
            <FlatList
              data={autoCompleteFrom}
              style={{ ...Forms.flatList }}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[{ ...Forms.flatListItem }]}
                  onPress={() => {
                    setTravel({ ...travel, from: item })
                    setAutoCompleteFrom([])
                  }}
                >
                  <Text>
                    {item}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
          <TextInput
            onFocus={toFocus}
            onBlur={toBlur}
            style={[{ ...Forms.input }, {
              borderBottomColor: color.to
                ? 'rgb(20, 210, 190)'
                : 'rgb(0, 0, 0)',
              borderBottomWidth: color.to
                ? 2
                : 1,
            }]}
            selectionColor={'rgb(20, 210, 190)'}
            onChangeText={(toChange) => {
              setTravel({ ...travel, to: toChange })
              handleTextInput(toChange, setAutoCompleteTo)
            }}
            value={travel?.to}
            placeholder="Ank. station"
            blurOnSubmit={true}
          />
          <View style={{ position: 'relative' }}>
            <FlatList
              data={autoCompleteTo}
              style={{ ...Forms.flatList }}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[{ ...Forms.flatListItem }]}
                  onPress={() => {
                    setTravel({ ...travel, to: item })
                    setAutoCompleteTo([])
                  }}
                >
                  <Text>
                    {item}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
        <View
          style={{ width: 50 }}
        >
          <IconButton
            icon="swap-vertical"
            style={{ ...Unique.swap }}
            onPress={() => {
              swap()
              setAutoCompleteFrom([])
              setAutoCompleteTo([])
            }}
          />
        </View>
        <View
          style={{ width: 90 }}
        >
          <Pressable
            style={[{ ...Unique.sok }, { ...Base.center }]}
            onPress={async () => {
              setAutoCompleteFrom([])
              setAutoCompleteTo([])
              await trySearch()
              navigation.navigate("Sena")
            }}
          >
            <Text
              style={{ fontWeight: '500' }}
            >
              S??K
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}