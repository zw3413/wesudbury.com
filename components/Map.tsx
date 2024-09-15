'use client'

import { useEffect, useRef } from 'react'
import { Loader } from '@googlemaps/js-api-loader'

type MapProps = {
  onStartLocationSelect: (location: { lat: number; lng: number }) => void;
  onEndLocationSelect: (location: { lat: number; lng: number }) => void;
}

export default function Map({ onStartLocationSelect, onEndLocationSelect }: MapProps) {
  const mapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const loader = new Loader({
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
      version: 'weekly',
    })

    loader.load().then(() => {
      if (mapRef.current) {
        const map = new google.maps.Map(mapRef.current, {
          center: { lat: 46.4917, lng: -80.9930 }, // Sudbury coordinates
          zoom: 12,
        })

        let startMarker: google.maps.Marker | null = null
        let endMarker: google.maps.Marker | null = null

        map.addListener('click', (e: google.maps.MapMouseEvent) => {
          if (e.latLng) {
            if (!startMarker) {
              startMarker = new google.maps.Marker({
                position: e.latLng,
                map: map,
                label: 'A',
              })
              onStartLocationSelect({ lat: e.latLng.lat(), lng: e.latLng.lng() })
            } else if (!endMarker) {
              endMarker = new google.maps.Marker({
                position: e.latLng,
                map: map,
                label: 'B',
              })
              onEndLocationSelect({ lat: e.latLng.lat(), lng: e.latLng.lng() })
            }
          }
        })
      }
    })
  }, [onStartLocationSelect, onEndLocationSelect])

  return <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
}