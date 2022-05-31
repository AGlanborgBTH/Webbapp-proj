import * as React from 'react';
import { StatusBar, View } from 'react-native';
import SafeAreaView from 'react-native-safe-area-view';
import { Base, Typography, Forms, Unique } from "../styles"
import { IconButton } from 'react-native-paper';
import * as Location from 'expo-location'
import MapView from 'react-native-maps';
import { Marker } from "react-native-maps";

export default function Sena({ navigation, events }) {
  const [marker, setMarker] = React.useState([]);
  const [locationMarker, setLocationMarker] = React.useState();

  React.useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        setErrorMessage('Permission to access location was denied');
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});

      setLocationMarker(<Marker
        coordinate={{
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude
        }}
        title="Min plats"
        pinColor="blue"
      />);
    })();
  }, []);

  React.useEffect(() => {
    (() => {
      let list = []
      events.forEach(async (thing, index) => {
        const str = thing.Geometry.WGS84.replace("POINT (", "").replace(")", "")

        const coordinates = str.split(" ")

        list.push(<Marker
          key={index}
          coordinate={{ latitude: parseInt(coordinates[1]), longitude: parseInt(coordinates[0]) }}
          title={thing.Header}
        />)
      })

      setMarker(list);
    })();
  }, []);

  return (
    <SafeAreaView>
      <StatusBar barStyle="light-content" backgroundColor="rgb(55, 0, 180)" />
      <View style={{ height: "100%", width: "100%" }}>
        <MapView
          style={{ height: "100%", width: "100%" }}
          region={{
            latitude: 56.1612,
            longitude: 15.5869,
            latitudeDelta: 5,
            longitudeDelta: 5,
          }}>
          {marker}
          {locationMarker}
        </MapView>
      </View>
      <View style={[{ ...Base.row }, { ...Base.footer }]}>
        <IconButton
          icon="arrow-left"
          style={{ ...Unique.senaButton }}
          onPress={() => {
            navigation.navigate("Sena")
          }}
        />
      </View>
    </SafeAreaView>
  );
}