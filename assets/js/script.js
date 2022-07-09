const submitButton = document.getElementById('submit')

submitButton.addEventListener('click', async () => {
    const ip = document.getElementById('IP')

    const infoIP = await fetch('https://ipapi.lauty.dev/' + ip.value + '?fields=66846719', {
        mode: 'no-cors'
    }).then(response => response.json()).then(json => json).catch(err => console.log('Solicitud fallida', err))

    const info = document.getElementById('viewInfo')

    var DateTime = luxon.DateTime
    const time = DateTime.now().setZone(infoIP.timezone || 'UTC')

    const divInfo = 
        `<div id="viewInfo">
            <h2>Información</h2>
            
            <div id="info">
                <article class="containerInfo">
                    <h3>IP: ${infoIP.query || 'Sin datos'}</h3>
                    <h3>AS: ${infoIP.as || 'Sin datos'}</h3>
                    <h3>Nombre AS: ${infoIP.asname || 'Sin datos'}</h3>
                    <h3>País: ${infoIP.country || 'Sin datos'} (${infoIP.countryCode || 'Sin datos'})</h3>
                    <h3>Continente: ${infoIP.continent || 'Sin datos'} (${infoIP.continentCode || 'Sin datos'})</h3>
                    <h3>Región: ${infoIP.regionName || 'Sin datos'} (${infoIP.region || 'Sin datos'})</h3>
                    <h3>Ciudad: ${infoIP.city || 'Sin datos'}</h3>
                    <h3>Código postal: ${infoIP.zip || 'Sin datos'}</h3>
                    <h3>Latitud: ${infoIP.lat || 'Sin datos'}</h3>
                    <h3>Longitud: ${infoIP.lon || 'Sin datos'}</h3>
                    <h3>Zona horaria: ${infoIP.timezone || 'Sin datos'} (${time.toLocaleString(DateTime.TIME_24_SIMPLE)})</h3>
                    <h3>Moneda: ${infoIP.currency || 'Sin datos'}</h3>
                    <h3>Proveedor: ${infoIP.org || 'Sin datos'}</h3>
                </article>
                <article class="containerInfo">
                    <div id='map' class="map"></div>
                </article>
            </div>
        </div>`

    info.innerHTML = divInfo

    
    mapboxgl.accessToken = 'pk.eyJ1IjoibGF1dHlkZXYiLCJhIjoiY2w1Y3htOHJ5MGVpbjNibjN3MGQxbjV0NSJ9.vgg471uOM8q8EM9vpX3CgQ';
    
    const geojson = {
        'type': 'FeatureCollection',
        'features': [{
                'type': 'Feature',
                'geometry': {
                    'type': 'Point',
                    'coordinates': [infoIP.lon, infoIP.lat]
                },
                'properties': {
                    'title': 'Ubicación',
                    'description': 'Ubicación de la IP'
                }
            }
        ]
    }
    
    const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [infoIP.lon, infoIP.lat],
        zoom: 13,
        projection: 'globe'
    })

    for (const feature of geojson.features) {
        const markerDiv = document.createElement('div')
        markerDiv.className = 'marker'

        new mapboxgl.Marker(markerDiv)
        .setLngLat(feature.geometry.coordinates)
        .setPopup(
            new mapboxgl.Popup({ offset: 25 })
            .setHTML(
                `<h3>${feature.properties.title}</h3><p>${feature.properties.description}</p>`
            )
        )
        .addTo(map)
    }
})