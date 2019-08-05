import React, { Component } from 'react';
import { Platform, Text, View, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import Constants from 'expo-constants';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import MapView, { Marker } from 'react-native-maps';
import polyline from '@mapbox/polyline';
import Callout from './components/Callout';
const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height / 10;
const LATITUDE_DELTA = 0.00922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
import { data } from './data.js'
export default class App extends Component {
  state = {
    initPosition: {
      latitude: 13.7750064,
      longitude: 109.2244677,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA
    },
    startLoc: "13.7747296,109.2243648",
    destinationLoc: "13.7747392,109.2345415",
    coords: [],
    location: null
  };

  componentWillMount() {
  }
  componentDidMount() {
    var _this = this;
    Location.watchPositionAsync( location => {
      console.log(location);
      _this.setState({
        initPosition: {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        }
      });
    });
    this._getLocationAsync()
    this.getDirections()
  }

  async getDirections() {
    try {
      let points = polyline.decode(data.routes[0].overview_polyline.points);
      let coords = points.map((point, index) => {
        return {
          latitude: point[0],
          longitude: point[1]
        }
      })
      this.setState({ coords: coords })
      return coords
    } catch (error) {
      return error
    }
  }

  _getLocationAsync = async () => {
    Location.setApiKey('AIzaSyB8oN2J4C4pAqcXNS5-dw1TTIJtC6OhsMk')
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.setState({
        errorMessage: 'Permission to access location was denied',
      });
    }

    let location = await Location.getCurrentPositionAsync({});
    console.log(location);

    this.setState({
      initPosition: {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      }
    })
  };
  onReady = () => {
    return { distance: 550, duration: 120 }
  }

  render() {

    return (
      <MapView style={{ flex: 1 }} region={this.state.initPosition}>
        <Marker coordinate={this.state.initPosition} />
        <Marker coordinate={{
          latitude: 13.77746,
          longitude: 109.22833
        }}>
          <MapView.Callout tooltip>
            <Callout
              name={'Ngo Quoc Hung'}
              image={'https://vinagamemobile.com/wp-content/uploads/2018/04/avatar-doi-fb-06.jpg'}
            />
          </MapView.Callout>
        </Marker>
        <MapView.Polyline
          destination="1121"
          tappable={true}
          lineDashPhase={5}
          coordinates={this.state.coords}
          strokeWidth={10}
          geodesic={true}
          strokeColor="#97bcf9">
        </MapView.Polyline>

      </MapView>

    );
  }
}
const styles = StyleSheet.create({
});