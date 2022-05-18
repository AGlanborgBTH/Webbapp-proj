import * as React from 'react';
import { IconButton } from 'react-native-paper';
import { View, Text, StatusBar, TextInput, Pressable } from 'react-native';
import SafeAreaView from 'react-native-safe-area-view';
import { Base, Typography, Forms, Unique } from "../styles"

export default function Hitta({ navigation }) {
  const [travel, setTravel] = React.useState({})

  function swap() {
    setTravel({ from: travel.to, to: travel.from})
  }

  return (
    <SafeAreaView style={[{ ...Base.center },{ marginBottom: 20 }]}>
      <StatusBar barStyle="light-content" backgroundColor="rgb(55, 0, 180)" />
      <Text style={[{ ...Typography.header }, { ...Typography.center }]}>
        För vilken sträcka vill du hitta försenade tåg?
      </Text>
      <View style={{ ...Base.row }}>
        <View style={{ ...Base.column }}>
          <TextInput
            style={{ ...Forms.input }}
            onChangeText={(fromChange) => {
              setTravel({ ...travel, from: fromChange})
            }}
            value={travel?.from}
            placeholder="Avg. station"
          />
          <TextInput
            style={{ ...Forms.input }}
            onChangeText={(toChange) => {
              setTravel({ ...travel, to: toChange})
            }}
            value={travel?.to}
            placeholder="Ank. station"
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
            onPress={() => navigation.navigate("Sena")}
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