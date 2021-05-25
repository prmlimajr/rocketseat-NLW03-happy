import React, { useEffect, useState } from "react";
import { useParams } from 'react-router-dom'
import { FaWhatsapp } from "react-icons/fa";
import { FiClock, FiInfo } from "react-icons/fi";
import { MapContainer, Marker, TileLayer } from "react-leaflet";
import Sidebar from "../components/Sidebar";

import mapIcon from "../utils/mapIcon";

import '../styles/pages/orphanage.css';
import api from "../services/api";

interface Orphanage {
  name: string;
  latitude: number;
  longitude: number;
  about: string;
  instructions: string;
  opening_hours: string;
  open_on_weekends: boolean;
  images: Array<{
    id: number;
    path: string;
  }>;
}

interface OrphanageParams {
  id: string;
}

export default function Orphanage() {
  const [orphanage, setOrphanages] = useState<Orphanage>({} as Orphanage);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const params = useParams<OrphanageParams>();
  
  useEffect(() => {
    async function fetchOrphanages() {
      await api.get(`/orphanages/${params.id}`).then(response => {
        const orphanage = response.data;
  
        setOrphanages(orphanage);
      })
    }

    fetchOrphanages();
  }, [params.id]);

  return orphanage && orphanage.name ? (
    <div id="page-orphanage">
      <Sidebar />
      <main>
        <div className="orphanage-details">
          <img src={orphanage.images[activeImageIndex].path} alt={orphanage.name} />

          <div className="images">
            {orphanage.images.map((image, index) => {
              return (
                <button key={image.id} className={activeImageIndex === index ? "active" : ""} type="button" onClick={() => setActiveImageIndex(index)}>
                  <img src={image.path} alt={orphanage.name} />
                </button>
              )
            })}
          </div>
          
          <div className="orphanage-details-content">
            <h1>{orphanage.name}</h1>
            <p>{orphanage.about}</p>

            <div className="map-container">
              <MapContainer 
                center={[orphanage.latitude, orphanage.longitude]} 
                zoom={16} 
                style={{ width: '100%', height: 280 }}
                dragging={false}
                touchZoom={false}
                zoomControl={false}
                scrollWheelZoom={false}
                doubleClickZoom={false}
              >
                <TileLayer 
                  url={`https://api.mapbox.com/styles/v1/mapbox/light-v10/tiles/256/{z}/{x}/{y}@2x?access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`}
                />
                <Marker interactive={false} icon={mapIcon} position={[orphanage.latitude, orphanage.longitude]} />
              </MapContainer>

              <footer>
                <a target='_blank' rel='noopener noreferrer' href={`https://www.google.com/maps/dir/?api=1&destination=${orphanage.latitude},${orphanage.longitude}`}>Ver rotas no Google Maps</a>
              </footer>
            </div>

            <hr />

            <h2>Instruções para visita</h2>
            <p>{orphanage.instructions}</p>

            <div className="open-details">
              <div className="hour">
                <FiClock size={32} color="#15B6D6" />
                Segunda à Sexta <br />
                {orphanage.opening_hours}
              </div>
              <div className={orphanage.open_on_weekends ? "open-on-weekends" : "open-on-weekends closed"}>
                <FiInfo size={32} color={orphanage.open_on_weekends ? "#39CC83" : "#FF669D"} />
                {orphanage.open_on_weekends ? 'Atendemos fim de semana' : 'Não atendemos fim de semana'}
              </div>
            </div>

            <button type="button" className="contact-button">
              <FaWhatsapp size={20} color="#FFF" />
              Entrar em contato
            </button>
          </div>
        </div>
      </main>
    </div>
  ) : <p>Carregando...</p>;
}