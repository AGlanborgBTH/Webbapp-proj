import * as React from 'react';
import { Text, StatusBar, View, ScrollView } from 'react-native';
import SafeAreaView from 'react-native-safe-area-view';
import { Base, Typography, Forms, Unique } from "../styles"
import { IconButton } from 'react-native-paper';
import * as Location from 'expo-location'
import MapView from 'react-native-maps';
import { Marker } from "react-native-maps";

export default function Sena({ navigation, timeTable }) {
  const [marker, setMarker] = React.useState();
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
    (async () => {
      const results = await getCoordinates(`${56.1612}, ${15.5869}`);

      setMarker(<Marker
        coordinate={{ latitude: parseFloat(results[0].lat), longitude: parseFloat(results[0].lon) }}
        title="Test Marker"
      />);
    })();
  }, []);

  async function getCoordinates(address) {
    const urlEncodedAddress = encodeURIComponent(address);
    const url = "https://nominatim.openstreetmap.org/search.php?format=jsonv2&q=";
    const response = await fetch(`${url}${urlEncodedAddress}`);
    const result = await response.json();

    return result;
};

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