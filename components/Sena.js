import * as React from 'react';
import { Text, StatusBar, View, ScrollView } from 'react-native';
import CheckBox from 'react-native-check-box'
import SafeAreaView from 'react-native-safe-area-view';
import { Base, Typography, Forms, Unique } from "../styles"

export default function Sena({ navigation, timeTable }) {

  function calTime(time) {
    const mulitplier = time[25]
    const value = time.slice(0, -6)
    const date = new Date(value)
    const final = new Date(date.getTime() - 3600000 * mulitplier)
    return final.getHours() + ":" + final.getMinutes()
  }

  const list = timeTable.map((train, index) => {
    return (
      <View style={{ ...Base.travelRow }} key={index}>
        <View style={{ ...Base.row }}>
          <View style={[{ ...Base.rowContent }, { ...Base.center }]}>
            <Text style={[{ ...Unique.sena }, { ...Typography.columnText }]}>
              {train.number}
            </Text>
          </View>
          <View style={[{ ...Base.rowContent }, { ...Base.center }]}>
            <Text style={[{ ...Unique.sena }, { ...Typography.columnText }]}>
              {calTime(train.arival)}
            </Text>
          </View>
          <View style={[{ ...Base.rowContent }, { ...Base.center }]}>
            <Text style={[{ ...Unique.sena }, { ...Typography.columnText }]}>
              Försenad
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
          onClick={() => {
            console.log(timeTable)
          }}
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
        <ScrollView style={{ height: '84%'}}>
          {list.length ? list : (
            <Text>No information</Text>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
