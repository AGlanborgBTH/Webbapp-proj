import * as React from 'react';
import { Text, StatusBar, Button, StyleSheet } from 'react-native';
import SafeAreaView from 'react-native-safe-area-view';
import config from "../config/config.json"

async function getTimeTable(from, to) {
  const resultFrom = await requestTimeTable(from, to, "Avgang")

  console.log(resultFrom[0])
}

async function requestTimeTable(signature, to, activity) {
  const content = "<REQUEST>" +
    `<LOGIN authenticationkey='${config.authenticationkey}'/>` +
    "<QUERY objecttype='TrainAnnouncement' schemaversion='1.6'>" +
    "<FILTER>" +
    "<AND>" +
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

    return result["RESPONSE"]["RESULT"];
  } catch (error) {
    console.log("Could not request Trainstaions")
  }
}

export default function Sena({ route, navigation }) {
  const { travelFrom, travelTo, travelFromName, travelToName } = route.params;
  let count = 0

  React.useEffect(() => {
    getTimeTable(travelFrom, travelTo)
    console.log(travelFromName, travelToName)
  }, [count])

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: '#ecf0f1' }]}>
      <StatusBar barStyle="dark-content" backgroundColor="#ecf0f1" />
      <Text>
        Dark Screen
      </Text>
      <Button
        title="Next screen"
        onPress={() => {
          navigation.navigate('Hitta')
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', },
});