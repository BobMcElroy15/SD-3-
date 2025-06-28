<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Sewer District 3 Pump Station Map</title>
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <link rel="manifest" href="manifest.json">
  <meta name="theme-color" content="#0066cc">

  <!-- Leaflet CSS -->
  <link
    rel="stylesheet"
    href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
  />

  <style>
    body { margin:0; padding:0; }
    #map { height:100vh; }
    #title {
      position:absolute; top:10px; left:5%; width:90%; max-width:90%;
      z-index:1000; background:white; padding:6px; border-radius:6px;
      font-size:18px; font-weight:bold; text-align:center;
    }
    #stationSelect {
      position:absolute; top:60px; left:5%; width:90%; max-width:90%;
      z-index:1000; background:white; padding:6px; border-radius:6px;
      font-size:14px;
    }
    #shareBtn {
      position:absolute; top:110px; left:5%; z-index:1000;
      background:#0066cc; color:#fff; padding:8px 12px; border:none;
      border-radius:4px; font-size:14px; cursor:pointer;
    }
    #shareOverlay {
      position:fixed; top:0; left:0; width:100%; height:100%;
      background:rgba(0,0,0,0.7); display:flex; align-items:center;
      justify-content:center; z-index:2000;
    }
    #shareOverlayContent {
      background:#fff; padding:20px; border-radius:8px; text-align:center;
    }
    #shareOverlayContent img {
      max-width:80vw; height:auto;
    }
    #closeShare {
      margin-top:10px; background:#333; color:#fff; border:none;
      padding:8px 12px; border-radius:4px; cursor:pointer;
    }
    @media(min-width:600px){
      #title { left:50px; width:auto; max-width:400px; }
      #stationSelect { left:50px; width:auto; max-width:300px; }
      #shareBtn { left:50px; }
    }
  </style>
</head>
<body>
  <div id="title">Sewer District 3 Pump Station Map</div>

  <select id="stationSelect">
    <option value="">Select Pump Station</option>
  </select>

  <button id="shareBtn">Share</button>

  <!-- hidden on load via the hidden attribute -->
  <div id="shareOverlay" hidden>
    <div id="shareOverlayContent">
      <p>Scan to share:</p>
      <img src="qr-code.png" alt="QR code"><br>
      <button id="closeShare">Close</button>
    </div>
  </div>

  <div id="map"></div>

  <!-- Leaflet JS -->
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <!-- Firebase compat SDKs -->
  <script src="https://www.gstatic.com/firebasejs/9.22.2/firebase-app-compat.js"></script>
  <script src="https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore-compat.js"></script>
  <script>
    // Firebase config
    firebase.initializeApp({
      apiKey: "AIzaSyBC4ytQPxzKZd1L47Gc5M4FoRYn44C5q9w",
      authDomain: "sd3ps-map.firebaseapp.com",
      projectId: "sd3ps-map",
      storageBucket: "sd3ps-map.appspot.com",
      messagingSenderId: "14976888367",
      appId: "1:14976888367:web:9ef05a76be1ca780d7e0da",
      measurementId: "G-HHX1X8KFSF"
    });
    const db = firebase.firestore();
  </script>

  <script>
    // Station data
    const stations = [
      {"code":"PS#300 AWXIA","lat":40.7227675,"lon":-73.2307527,"address":"50 South Saxon Avenue, Bay Shore, NY 11706"},
      /* …all the rest… */
      {"code":"PS#317-2","lat":40.7868774,"lon":-73.406908,"address":"270 McGovern Drive, Melville, NY 11747"}
    ];

    // Init map
    const map = L.map('map').setView([40.730889, -73.284654], 12);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
      attribution:'© OpenStreetMap contributors'
    }).addTo(map);

    const tempDeleted = {};
    const select      = document.getElementById('stationSelect');
    const markers     = [];

    // Build markers & dropdown
    stations.forEach((st, idx) => {
      const popupHtml = `
        <strong>${st.code}</strong><br>
        ${st.address}<br>
        <a href="https://www.google.com/maps/dir/?api=1&destination=${st.lat},${st.lon}"
           target="_blank">Navigate</a>
        <span> | </span>
        <a href="#" class="note-btn" data-idx="${idx}">Add/Edit Note</a>
        <span> | </span>
        <a href="#" class="delete-note-btn" data-idx="${idx}">Delete Note</a>
        <span> | </span>
        <a href="#" class="undo-note-btn" data-idx="${idx}" style="display:none">Undo Delete</a>
        <div id="note-display-${idx}"
             style="margin-top:6px;font-style:italic;color:#555;"></div>
      `;
      markers[idx] = L.marker([st.lat, st.lon]).addTo(map).bindPopup(popupHtml);

      const opt = document.createElement('option');
      opt.value = idx;
      opt.text  = `${st.code} – ${st.address}`;
      select.append
