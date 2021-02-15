import { useStaticQuery, graphql } from "gatsby";

export default function getTracks() {
  const query = graphql`
    query MyQuery {
      geoapi {
        tracks {
          points
        }
      }
    }
  `;

  const tracks = useStaticQuery(query) || {};
  console.log(traks);

  return tracks?.geoapi;
}
