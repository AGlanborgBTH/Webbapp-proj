import * as React from 'react';
import { View, Text, StatusBar, TextInput, Pressable, FlatList, TouchableOpacity, } from 'react-native';
import { IconButton } from 'react-native-paper';
import SafeAreaView from 'react-native-safe-area-view';
import { Base, Typography, Forms, Unique } from "../styles"
import config from "../config/config.json"
import { showMessage } from "react-native-flash-message";

async function getStations() {
  const result = await requestStations()

  return makeList(result)
}

async function requestStations() {
  const content = "<REQUEST>" +
    `<LOGIN authenticationkey='${config.authenticationkey}'/>` +
    "<QUERY objecttype='TrainStation' schemaversion='1.4'>" +
    "<FILTER/>" +
    "<INCLUDE>Prognosticated</INCLUDE>" +
    "<INCLUDE>AdvertisedLocationName</INCLUDE>" +
    "<INCLUDE>Deleted</INCLUDE>" +
    "<INCLUDE>Advertised</INCLUDE>" +
    "<INCLUDE>Geometry.SWEREF99TM</INCLUDE>" +
    "<INCLUDE>Geometry.WGS84</INCLUDE>" +
    "<INCLUDE>LocationSignature</INCLUDE>" +
    "</QUERY>" +
    "</REQUEST>";

  try {
    const response = await fetch(`https://api.trafikinfo.trafikverket.se/v2/data.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/xml'
      },
      body: content
    });
    const result = await response.json();

    return result["RESPONSE"]["RESULT"][0]["TrainStation"];
  } catch (error) {
    console.log("Could not request Trainstaions")
  }
}

function makeList(result) {
  let list = []

  result.forEach((station) => {
    if (!station.Deleted && station.Advertised) {
      list.push({
        name: station.AdvertisedLocationName,
        signature: station.LocationSignature,
        geometry1: station.Geometry.SWEREF99TM,
        geometry2: station.Geometry.WGS84
      })
    }
  })
  return list
}

export default function Hitta({ navigation }) {
  const [travel, setTravel] = React.useState({})
  const [color, setColor] = React.useState({})
  const [autoCompleteTo, setAutoCompleteTo] = React.useState()
  const [autoCompleteFrom, setAutoCompleteFrom] = React.useState()
  const [stations, setStations] = React.useState([])
  let count = 0

  React.useEffect(() => {
    getStations().then(setStations)
  }, [count])

  function swap() {
    setTravel({ from: travel.to, to: travel.from })
  }

  fromFocus = () => {
    setColor({ ...color, from: true})
    setAutoCompleteTo([])
  }
  fromBlur = () => {
    setColor({ ...color, from: false})
  }
  toFocus = () => {
    setColor({ ...color, to: true})
    setAutoCompleteFrom([])
  }
  toBlur = () => {
    setColor({ ...color, to: false})
  }

  function handleTextEvent(value, func) {
    if (value != "") {
      let list = []
      stations.forEach((station) => {
        if (station.name.toLowerCase().includes(value.toLowerCase())) {
          list.push(station.name)
        }
      })
      func(list)
    } else {
      func([])
    }
  }

  function trySearch() {
    let fromSignature = ""
    let toSignature = ""

    stations.forEach((station) => {
      if (station.name.toLowerCase() == travel.from.toLowerCase()) {
        fromSignature = station.signature
      } else if (station.name.toLowerCase() == travel.to.toLowerCase()) {
        toSignature = station.signature
      }
    })

    if (fromSignature != "" && toSignature != "") {
      navigation.navigate("Sena", {
        travelFrom: fromSignature,
        travelTo: toSignature,
        travelFromName: travel.from,
        travelToName: travel.to
      })
    } else {
      showMessage({
        message: "Sök fel",
        description: "Avg.- eller Ank.-station är skriven fel",
        type: "warning",
    });
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
              handleTextEvent(fromChange, setAutoCompleteFrom)
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
              handleTextEvent(toChange, setAutoCompleteTo)
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
            onPress={() => {
              trySearch()
              setAutoCompleteFrom([])
              setAutoCompleteTo([])
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