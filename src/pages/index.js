import React, { useRef, useEffect } from "react";
import { Helmet } from "react-helmet";
import L from "leaflet";
import { useMap } from "react-leaflet";
import { promiseToFlyTo, getCurrentLocation } from "lib/map";
import Layout from "components/Layout";
import Map from "components/Map";
import axios from "axios";
import "leaflet-geosearch/dist/geosearch.css";
import { GeoSearchControl, OpenStreetMapProvider } from "leaflet-geosearch";

const LOCATION = {
  lat: 52.4576,
  lng: 13.5263,
};
const CENTER = [LOCATION.lat, LOCATION.lng];
const DEFAULT_ZOOM = 2;
const ZOOM = 15;

const timeToZoom = 1000;

function LeafletgeoSearch() {
  const map = useMap();
  useEffect(() => {
    const provider = new OpenStreetMapProvider();

    const searchControl = new GeoSearchControl({
      provider,
    });

    map.addControl(searchControl);

    return () => map.removeControl(searchControl);
  }, []);

  return null;
}

function drawLines(tracks, map) {
  console.log(tracks);
  var pointList = [];
  tracks.forEach((track) => {
    pointList = [];
    track.points.forEach((point) => {
      pointList.push(new L.LatLng(point[1], point[0]));
    });

    var firstpolyline = new L.Polyline(pointList, {
      color: "red",
      weight: 3,
      opacity: 0.5,
      smoothFactor: 1,
    });
    firstpolyline.addTo(map);
  });

  console.log("printing last element:");
  console.log(pointList[pointList.length - 1]);

  // get middle point of the last track and set an async event to fly to
  const location = pointList[parseInt(pointList.length / 2)];

  setTimeout(async () => {
    await promiseToFlyTo(map, {
      zoom: ZOOM,
      center: location,
    });
  }, 5000);

  map.flyTo(pointList[pointList.length - 1], 15, {
    duration: 3,
  });
}

/**
 * MapEffect
 * @description This is an example of creating an effect used to zoom in and set a popup on load
 */

const MapEffect = ({ markerRef }) => {
  const map = useMap();

  useEffect(() => {
    axios({
      url: "https://quiet-island-79354.herokuapp.com/graphql",
      method: "post",
      data: {
        query: `
        query Test{tracks {
        points
        }}  
          `,
      },
    })
      .then((result) => {
        console.log(result.data.data.tracks);
        drawLines(result.data.data.tracks, map);
      })
      .catch((err) => {
        console.log(err);
      });

    if (!map) return;

    (async function run() {
      const popup = L.popup({
        maxWidth: 800,
      });

      //const location = await getCurrentLocation().catch(() => LOCATION);
      const location = LOCATION;
      const { current: marker } = markerRef || {};

      setTimeout(async () => {
        await promiseToFlyTo(map, {
          zoom: ZOOM,
          center: location,
        });
      }, timeToZoom);
    })();
  }, [map, markerRef]);

  return null;
};

const IndexPage = () => {
  const markerRef = useRef();

  const mapSettings = {
    center: CENTER,
    defaultBaseMap: "OpenStreetMap",
    zoom: DEFAULT_ZOOM,
  };

  return (
    <Layout pageName="home">
      <Helmet>
        <title>Home Page</title>
      </Helmet>

      <Map {...mapSettings}>
        <LeafletgeoSearch />
        <MapEffect markerRef={markerRef} />
      </Map>
    </Layout>
  );
};

export default IndexPage;
