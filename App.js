import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import SafeAreaView from 'react-native-safe-area-view';
import Hitta from "./components/Hitta"
import Sena from "./components/Sena"
import Karta from "./components/Karta"
import { Base } from "./styles"
import config from "./config/config.json"

const Stack = createNativeStackNavigator();

async function getStations() {
  const result = await requestStations()

  return makeList(result)
}

async function requestStations() {
  const content = "<REQUEST>" +
    `<LOGIN authenticationkey='${config.authenticationkey}'/>` +
    "<QUERY objecttype='TrainStation' schemaversion='1.4'>" +
    "<FILTER>" +
    "<EQ name='Deleted' value='false' />" +
    "<EQ name='Advertised' value='true' />" +
    "</FILTER>" +
    "<INCLUDE>Prognosticated</INCLUDE>" +
    "<INCLUDE>AdvertisedLocationName</INCLUDE>" +
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

    return result["RESPONSE"]["RESULT"][0]["TrainStation"]
  } catch (error) {
    console.log("Could not request Trainstaions")
  }
}

async function getEvents() {
  const result = await requestEvents()

  return makeList(result)
}

async function requestEvents() {
  const content = "<REQUEST>" +
    `<LOGIN authenticationkey='${config.authenticationkey}'/>` +
    "<QUERY objecttype='TrainMessage' schemaversion='1.7'>" +
    "<FILTER>" +
    "<EQ name='Deleted' value='false' />" +
    "</FILTER>" +
    "<INCLUDE>EventId</INCLUDE>" +
    "<INCLUDE>Geometry.SWEREF99TM</INCLUDE>" +
    "<INCLUDE>Geometry.WGS84</INCLUDE>" +
    "<INCLUDE>Header</INCLUDE>" +
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

    return result["RESPONSE"]["RESULT"][0]["TrainMessage"]
  } catch (error) {
    console.log("Could not request Trainstaions")
  }
}

function makeList(result) {
  let list = []

  result.forEach((result) => {
    list.push(result)
  })

  return list
}

export default function App() {
  const [stations, setStations] = React.useState([])
  const [events, setEvents] = React.useState([])
  const [timeTable, setTimeTable] = React.useState([])

  React.useEffect(() => {
    getStations().then(setStations)
    getEvents().then(setEvents)
  }, [])

  async function getTimeTable(from, to) {
    const result = await requestTimeTable(from, to, "Avgang")

    setTimeTable(makeList(result))
  }

  async function requestTimeTable(signature, to, activity) {
    const content = "<REQUEST>" +
      `<LOGIN authenticationkey='${config.authenticationkey}'/>` +
      "<QUERY objecttype='TrainAnnouncement' schemaversion='1.6'>" +
      "<FILTER>" +
      "<AND>" +
      "<AND>" +
      "<GT name='AdvertisedTimeAtLocation' value='$dateadd(-05:00:00)' />" +
      "<LT name='AdvertisedTimeAtLocation' value='$dateadd(20:00:00)' />" +
      "</AND>" +
      "<EQ name='LocationSignature' value='" + signature + "' />" +
      "<EQ name='ActivityType' value='" + activity + "' />" +
      "<EQ name='Deleted' value='false' />" +
      "<EQ name='Advertised' value='true' />" +
      "<IN name='ViaToLocation.LocationName' value='" + to + "' />" +
      "</AND>" +
      "</FILTER>" +
      "<INCLUDE>ActivityId</INCLUDE>" +
      "<INCLUDE>ActivityType</INCLUDE>" +
      "<INCLUDE>AdvertisedTrainIdent</INCLUDE>" +
      "<INCLUDE>AdvertisedTimeAtLocation</INCLUDE>" +
      "<INCLUDE>Canceled</INCLUDE>" +
      "<INCLUDE>EstimatedTimeAtLocation</INCLUDE>" +
      "<INCLUDE>EstimatedTimeIsPreliminary</INCLUDE>" +
      "<INCLUDE>LocationSignature</INCLUDE>" +
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

      return result["RESPONSE"]["RESULT"][0]["TrainAnnouncement"]
    } catch (error) {
      console.log("Could not request Trainstaions")
    }
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
            <Stack.Screen name="Karta">
              {(screenProps) => <Karta
                {...screenProps}
                events={events}
              />}
            </Stack.Screen>
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}