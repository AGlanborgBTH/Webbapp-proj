import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import SafeAreaView from 'react-native-safe-area-view';
import Hitta from "./components/Hitta"
import Sena from "./components/Sena"
import { Base } from "./styles"
import config from "./config/config.json"

const Stack = createNativeStackNavigator();

async function getStations() {
  const result = await requestStations()

  return makeStationsList(result)
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

function makeStationsList(result) {
  let list = []

  result.forEach((station) => {
    if (!station.Deleted && station.Advertised) {
      list.push({
        name: station.AdvertisedLocationName,
        signature: station.LocationSignature
      })
    }
  })
  return list
}

export default function App() {
  const [stations, setStations] = React.useState([])
  const [timeTable, setTimeTable] = React.useState()
  const [stationFrom, setStationFrom] = React.useState({})
  const [stationTo, setStationTo] = React.useState({})
  let count = 0

  React.useEffect(() => {
    getStations().then(setStations)
  }, [count])

  async function getTimeTable(from, to) {
    const result = await requestTimeTable(from, to, "Avgang")

    const list = makeTimeTableList(result)

    setTimeTable(list)
  }

  async function requestTimeTable(signature, to, activity) {
    console.log(signature, to, activity)
    const content = "<REQUEST>" +
      `<LOGIN authenticationkey='${config.authenticationkey}'/>` +
      "<QUERY objecttype='TrainAnnouncement' schemaversion='1.6'>" +
      "<FILTER>" +
      "<AND>" +
      "<AND>" +
      "<GT name='AdvertisedTimeAtLocation' " +
      "value='$dateadd(-04:0:00)' />" +
      "<LT name='AdvertisedTimeAtLocation' " +
      "value='$dateadd(20:00:00)' />" +
      "</AND>" +
      "<EQ name='LocationSignature' value='" + signature + "' />" +
      "<EQ name='ActivityType' value='" + activity + "' />" +
      "<EQ name='Deleted' value='false' />" +
      "<IN name='ViaToLocation.LocationName' value='" + to + "' />" +
      "</AND>" +
      "</FILTER>" +
      "<INCLUDE>ActivityType</INCLUDE>" +
      "<INCLUDE>Advertised</INCLUDE>" +
      "<INCLUDE>AdvertisedTrainIdent</INCLUDE>" +
      "<INCLUDE>AdvertisedTimeAtLocation</INCLUDE>" +
      "<INCLUDE>Canceled</INCLUDE>" +
      "<INCLUDE>EstimatedTimeAtLocation</INCLUDE>" +
      "<INCLUDE>PlannedEstimatedTimeAtLocation</INCLUDE>" +
      "<INCLUDE>PlannedEstimatedTimeAtLocationIsValid</INCLUDE>" +
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
      console.log(result["RESPONSE"]["RESULT"])
      return result["RESPONSE"]["RESULT"][0]["TrainAnnouncement"];
    } catch (error) {
      console.log("Could not request Trainstaions")
    }
  }

  function makeTimeTableList(result) {
    let list = []

    result.forEach((train) => {
      if (!train.Deleted && train.Advertised) {
        list.push({
          name: train.AdvertisedLocationName,
          signature: train.LocationSignature,
          number: train.AdvertisedTrainIdent,
          arival: train.AdvertisedTimeAtLocation
        })
      }
    })
    return list
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ ...Base.base }}>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Hitta">
              {(screenProps) => <Hitta
                {...screenProps}
                stations={stations}
                setStationFrom={setStationFrom}
                setStationTo={setStationTo}
                getTimeTable={getTimeTable}
                timeTable={timeTable}
              />}
            </Stack.Screen>
            <Stack.Screen name="Sena">
              {(screenProps) => <Sena
                {...screenProps}
                timeTable={timeTable}
              />}
            </Stack.Screen>
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}