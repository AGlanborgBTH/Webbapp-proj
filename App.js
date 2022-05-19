import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import SafeAreaView from 'react-native-safe-area-view';
import Hitta from "./components/Hitta"
import Sena from "./components/Sena"
import config from "./config/config.json"
import { Base } from "./styles"

const Stack = createNativeStackNavigator();

async function getStations() {
  const result = await request()

  return makeList(result)
}

async function request() {
  const content = "<REQUEST>" +
    `<LOGIN authenticationkey='${config.authenticationkey}'/>` +
    "<QUERY objecttype='TrainStation' schemaversion='1'>" +
    "<FILTER/>" +
    "<INCLUDE>Prognosticated</INCLUDE>" +
    "<INCLUDE>AdvertisedLocationName</INCLUDE>" +
    "<INCLUDE>Deleted</INCLUDE>" +
    "<INCLUDE>Advertised</INCLUDE>" +
    "<INCLUDE>Geometry.SWEREF99TM</INCLUDE>" +
    "<INCLUDE>Geometry.WGS84</INCLUDE>" +
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
        geometry2: station.Geometry.WGS84,
      })
    }
  })
  return list
}

export default function App() {
  const [stations, setStations] = React.useState([])
  let count = 0

  React.useEffect(() => {
    getStations().then(setStations)
    console.log("run")
  }, [count])

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ ...Base.base }}>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Hitta">
              {() => <Hitta
                stations={stations}
              />}
            </Stack.Screen>
            <Stack.Screen name="Sena" component={Sena} />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}