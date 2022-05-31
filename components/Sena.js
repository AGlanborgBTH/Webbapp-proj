import * as React from 'react';
import { Text, StatusBar, View, ScrollView, TouchableOpacity } from 'react-native';
import CheckBox from 'react-native-check-box'
import SafeAreaView from 'react-native-safe-area-view';
import { Base, Typography, Forms, Unique } from "../styles"
import { IconButton } from 'react-native-paper';

export default function Sena({ navigation, timeTable }) {

  function calTime(time) {
    const mulitplier = time[25]
    const value = time.slice(0, -6)
    const date = new Date(value)
    const final = new Date(date.getTime() - 3600000 * mulitplier)
    let hours = ""
    let mins = ""

    if (final.getHours().toString().length == 1) {
      hours = "0" + final.getHours()
    } else {
      hours = final.getHours()
    }

    if (final.getMinutes().toString().length == 1) {
      mins = "0" + final.getMinutes()
    } else {
      mins = final.getMinutes()
    }

    return hours + ":" + mins
  }

  function calDelay(time, delay) {
    const mulitplier = time[25]

    const timeValue = time.slice(0, -6)
    const timeDate = new Date(timeValue)

    const delayValue = delay.slice(0, -6)
    const delayDate = new Date(delayValue)

    const timeFinal = new Date(timeDate.getTime() - 3600000 * mulitplier)
    const delayFinal = new Date(delayDate.getTime() - 3600000 * mulitplier)

    const final = new Date(delayFinal.getTime() - timeFinal.getTime())

    var mins = Math.round(((final % 86400000) % 3600000) / 60000); // minutes

    return mins + " min"
  }

  function decideContent(train) {
    if (train.PlannedEstimatedTimeAtLocationIsValid) {
      return calDelay(train.AdvertisedTimeAtLocation, train.PlannedEstimatedTimeAtLocation)
    } else if (train.EstimatedTimeIsPreliminary) {
      return calDelay(train.AdvertisedTimeAtLocation, train.EstimatedTimeAtLocation)
    }
      return "1 min"
  }

  const list = timeTable.map((train, index) => {
    return (
      <View style={{ ...Base.travelRow }} key={index}>
        <View style={{ ...Base.row }}>
          <View style={[{ ...Base.rowContent }, { ...Base.center }]}>
            <Text style={[{ ...Unique.sena }, { ...Typography.columnText }]}>
              {train.AdvertisedTrainIdent}
            </Text>
          </View>
          <View style={[{ ...Base.rowContent }, { ...Base.center }]}>
            <Text style={[{ ...Unique.sena }, { ...Typography.columnText }]}>
              {calTime(train.AdvertisedTimeAtLocation)}
            </Text>
          </View>
          <View style={[{ ...Base.rowContent }, { ...Base.center }]}>
            <Text style={[{ ...Unique.sena }, { ...Typography.columnText }]}>
              {decideContent(train)}
            </Text>
          </View>
        </View>
      </View>
    )
  })

  return (
    <SafeAreaView>
      <StatusBar barStyle="light-content" backgroundColor="rgb(55, 0, 180)" />
      <Text style={[{ ...Typography.center }, { ...Typography.header2 }, { ...Unique.sena }]}>
        FÖRSENADE TÅG
      </Text>
      <View style={{ ...Unique.allContainer }}>
        <CheckBox
          onClick={() => { }}
        />
        <Text>
          Alla tåg
        </Text>
      </View>
      <View style={{ ...Base.column }}>
        <View style={[{ ...Base.row }, { paddingBottom: 10 }]}>
          <View style={[{ ...Base.rowContent }, { ...Base.center }]}>
            <Text style={[{ ...Unique.sena }, { ...Typography.columnHeader }]}>
              Tåg
            </Text>
          </View>
          <View style={[{ ...Base.rowContent }, { ...Base.center }]}>
            <Text style={[{ ...Unique.sena }, { ...Typography.columnHeader }]}>
              Avgångstid
            </Text>
          </View>
          <View style={[{ ...Base.rowContent }, { ...Base.center }]}>
            <Text style={[{ ...Unique.sena }, { ...Typography.columnHeader }]}>
              Försenad
            </Text>
          </View>
        </View>
        <View style={{ height: '82%' }}>
          <ScrollView style={{ height: '100%' }}>
            {list.length ? list : (
              <Text>No information</Text>
            )}
          </ScrollView>
        </View>
        <View style={[{ ...Base.row }, { ...Base.footer }]}>
          <IconButton
            icon="home"
            style={{ ...Unique.senaButton }}
            onPress={() => {
              navigation.navigate("Hitta")
            }}
          />
          <IconButton
            icon="dots-horizontal"
            style={{ ...Unique.senaButton }}
            onPress={() => {
              navigation.navigate("Karta")
            }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
