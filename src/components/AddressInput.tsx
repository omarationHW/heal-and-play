import { useState, useEffect, useRef, useCallback } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

interface NominatimResult {
  place_id: number
  display_name: string
  lat: string
  lon: string
}

interface AddressValue {
  text: string
  lat: number | null
  lng: number | null
}

interface AddressInputProps {
  value: AddressValue
  onChange: (value: AddressValue) => void
}

export default function AddressInput({ value, onChange }: AddressInputProps) {
  const [query, setQuery] = useState(value.text)
  const [suggestions, setSuggestions] = useState<NominatimResult[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [searching, setSearching] = useState(false)
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)
  const markerRef = useRef<L.Marker | null>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined)
  const wrapperRef = useRef<HTMLDivElement>(null)

  // Close suggestions on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  // Initialize / update map
  useEffect(() => {
    if (!value.lat || !value.lng || !mapRef.current) {
      // Destroy map if no coords
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
        markerRef.current = null
      }
      return
    }

    const coords: L.LatLngExpression = [value.lat, value.lng]

    if (!mapInstanceRef.current) {
      const map = L.map(mapRef.current, {
        zoomControl: false,
        attributionControl: false,
        dragging: false,
        scrollWheelZoom: false,
        doubleClickZoom: false,
        touchZoom: false,
      }).setView(coords, 15)

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map)

      const marker = L.marker(coords, {
        icon: L.divIcon({
          className: '',
          html: '<div style="width:12px;height:12px;background:#2e2b29;border:2px solid white;border-radius:50%;box-shadow:0 1px 4px rgba(0,0,0,0.3)"></div>',
          iconSize: [12, 12],
          iconAnchor: [6, 6],
        }),
      }).addTo(map)

      mapInstanceRef.current = map
      markerRef.current = marker
    } else {
      mapInstanceRef.current.setView(coords, 15)
      markerRef.current?.setLatLng(coords)
    }
  }, [value.lat, value.lng])

  // Cleanup map on unmount
  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [])

  const searchAddress = useCallback(async (q: string) => {
    if (q.trim().length < 3) {
      setSuggestions([])
      return
    }

    setSearching(true)
    try {
      const params = new URLSearchParams({
        q,
        format: 'json',
        limit: '5',
        addressdetails: '0',
        countrycodes: 'mx',
      })
      const res = await fetch(`https://nominatim.openstreetmap.org/search?${params}`, {
        headers: { 'Accept-Language': 'es' },
      })
      const data: NominatimResult[] = await res.json()
      setSuggestions(data)
      setShowSuggestions(data.length > 0)
    } catch {
      setSuggestions([])
    }
    setSearching(false)
  }, [])

  const handleInputChange = (text: string) => {
    setQuery(text)
    onChange({ text, lat: null, lng: null })

    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      searchAddress(text)
    }, 500)
  }

  const handleSelect = (result: NominatimResult) => {
    setQuery(result.display_name)
    setSuggestions([])
    setShowSuggestions(false)
    onChange({
      text: result.display_name,
      lat: parseFloat(result.lat),
      lng: parseFloat(result.lon),
    })
  }

  const handleClear = () => {
    setQuery('')
    setSuggestions([])
    setShowSuggestions(false)
    onChange({ text: '', lat: null, lng: null })
  }

  return (
    <div ref={wrapperRef}>
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={() => { if (suggestions.length > 0) setShowSuggestions(true) }}
          className="w-full px-4 py-2.5 pr-10 bg-white border border-dark/10 rounded-lg text-sm focus:outline-none focus:border-dark/30 transition-colors"
          placeholder="Escribe tu dirección..."
        />
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-dark/30 hover:text-dark/60 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
        {searching && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="w-4 h-4 border-2 border-dark/20 border-t-dark/60 rounded-full animate-spin" />
          </div>
        )}

        {/* Suggestions dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute z-50 left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-dark/10 py-1 max-h-48 overflow-y-auto">
            {suggestions.map((s) => (
              <button
                key={s.place_id}
                type="button"
                onClick={() => handleSelect(s)}
                className="w-full text-left px-4 py-2.5 text-sm text-dark/70 hover:bg-dark/5 transition-colors leading-snug"
              >
                {s.display_name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Map preview */}
      {value.lat && value.lng && (
        <div
          ref={mapRef}
          className="mt-2 h-32 rounded-lg overflow-hidden border border-dark/10"
        />
      )}
    </div>
  )
}
