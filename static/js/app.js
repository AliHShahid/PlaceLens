// // // static/js/app.js

// // document.addEventListener('DOMContentLoaded', () => {
// //     const fileInput = document.getElementById('file-input');
// //     const previewImg = document.getElementById('preview-img');
// //     const placeholder = document.getElementById('upload-placeholder');
// //     const searchBtn = document.getElementById('search-btn');
// //     const resultsContent = document.getElementById('results-content');
// //     const emptyState = document.getElementById('empty-state');
// //     const loader = document.getElementById('loader');

// //     // Initialize Map (Centered on World initially)
// //     let map = L.map('map').setView([20, 0], 2);
// //     L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
// //         attribution: '© OpenStreetMap contributors'
// //     }).addTo(map);
// //     let marker;

// //     // 1. Handle File Selection
// //     fileInput.addEventListener('change', function (e) {
// //         const file = e.target.files[0];
// //         if (file) {
// //             const reader = new FileReader();
// //             reader.onload = function (e) {
// //                 previewImg.src = e.target.result;
// //                 previewImg.classList.remove('hidden');
// //                 placeholder.classList.add('hidden');
// //                 searchBtn.classList.remove('hidden');
// //             }
// //             reader.readAsDataURL(file);
// //         }
// //     });

// //     // 2. Handle Search Click
// //     searchBtn.addEventListener('click', async () => {
// //         const file = fileInput.files[0];
// //         if (!file) return;

// //         // UI Reset
// //         loader.classList.remove('hidden');
// //         emptyState.classList.add('hidden');
// //         resultsContent.classList.add('hidden');

// //         // Prepare Data
// //         const formData = new FormData();
// //         formData.append('image', file);

// //         try {
// //             // Call Django API
// //             const response = await fetch('/api/search/', {
// //                 method: 'POST',
// //                 body: formData,
// //                 headers: {
// //                     // Include CSRF token if not using @csrf_exempt
// //                     'X-CSRFToken': getCookie('csrftoken')
// //                 }
// //             });

// //             const data = await response.json();

// //             if (data.matches && data.matches.length > 0) {
// //                 updateUI(data.matches[0]);
// //             } else {
// //                 alert("No close matches found.");
// //             }

// //         } catch (error) {
// //             console.error('Error:', error);
// //             alert("Analysis failed.");
// //         } finally {
// //             loader.classList.add('hidden');
// //         }
// //     });

// //     // 3. Update UI with Results
// //     function updateUI(match) {
// //         document.getElementById('place-name').textContent = match.name;
// //         document.getElementById('place-country').textContent = match.country;
// //         document.getElementById('place-desc').textContent = match.description;
// //         document.getElementById('confidence-score').textContent = match.confidence;

// //         resultsContent.classList.remove('hidden');

// //         // Update Map
// //         const lat = parseFloat(match.lat);
// //         const lng = parseFloat(match.lng);

// //         // Remove old marker
// //         if (marker) map.removeLayer(marker);

// //         // Add new marker & Fly to location
// //         marker = L.marker([lat, lng]).addTo(map)
// //             .bindPopup(`<b>${match.name}</b><br>${match.country}`).openPopup();

// //         map.flyTo([lat, lng], 13, {
// //             animate: true,
// //             duration: 1.5
// //         });
// //     }

// //     // Helper: Get CSRF Token from cookies
// //     function getCookie(name) {
// //         let cookieValue = null;
// //         if (document.cookie && document.cookie !== '') {
// //             const cookies = document.cookie.split(';');
// //             for (let i = 0; i < cookies.length; i++) {
// //                 const cookie = cookies[i].trim();
// //                 if (cookie.substring(0, name.length + 1) === (name + '=')) {
// //                     cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
// //                     break;
// //                 }
// //             }
// //         }
// //         return cookieValue;
// //     }
// // });

// // static/js/app.js

// document.addEventListener('DOMContentLoaded', () => {
//     const fileInput = document.getElementById('file-input');
//     const previewImg = document.getElementById('preview-img');
//     const placeholder = document.getElementById('upload-placeholder');
//     const searchBtn = document.getElementById('search-btn');
//     const resultsContent = document.getElementById('results-content');
//     const emptyState = document.getElementById('empty-state');
//     const loader = document.getElementById('loader');

//     // Initialize Map (Centered on World initially)
//     let map = L.map('map').setView([20, 0], 2);
//     L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//         attribution: '© OpenStreetMap contributors'
//     }).addTo(map);
//     let marker;

//     // 1. Handle File Selection
//     fileInput.addEventListener('change', function (e) {
//         const file = e.target.files[0];
//         if (file) {
//             const reader = new FileReader();
//             reader.onload = function (e) {
//                 previewImg.src = e.target.result;
//                 previewImg.classList.remove('hidden');
//                 placeholder.classList.add('hidden');
//                 searchBtn.classList.remove('hidden');
//             }
//             reader.readAsDataURL(file);
//         }
//     });

//     // 2. Handle Search Click
//     searchBtn.addEventListener('click', async () => {
//         const file = fileInput.files[0];
//         if (!file) return;

//         // UI Reset
//         loader.classList.remove('hidden');
//         emptyState.classList.add('hidden');
//         resultsContent.classList.add('hidden');

//         // Prepare Data
//         const formData = new FormData();
//         formData.append('image', file);

//         try {
//             // Call Django API
//             const response = await fetch('/api/search/', {
//                 method: 'POST',
//                 body: formData,
//                 headers: {
//                     'X-CSRFToken': getCookie('csrftoken')
//                 }
//             });

//             // Parse JSON response
//             const data = await response.json();

//             // Check if backend returned a specific error
//             if (data.error) {
//                 throw new Error(data.error);
//             }

//             // Check for valid matches
//             if (data.matches && data.matches.length > 0) {
//                 updateUI(data.matches[0]);
//             } else {
//                 // Handle "No Match" or "Low Confidence"
//                 alert(data.message || "No close matches found.");
//                 loader.classList.add('hidden');
//                 emptyState.classList.remove('hidden');
//             }

//         } catch (error) {
//             console.error('Detailed Error:', error);
//             alert(`Analysis Failed: ${error.message}`);
//         } finally {
//             loader.classList.add('hidden');
//         }
//     });

//     // 3. Update UI with Results
//     function updateUI(match) {
//         document.getElementById('place-name').textContent = match.name;
//         document.getElementById('place-country').textContent = match.country;
//         document.getElementById('place-desc').textContent = match.description;
//         document.getElementById('confidence-score').textContent = match.confidence;

//         resultsContent.classList.remove('hidden');

//         // Update Map
//         const lat = parseFloat(match.lat);
//         const lng = parseFloat(match.lng);
//         // NEW CODE (Replace with this):
//         // console.log("Debug Coordinates:", match); // <--- Check your browser console!

//         // // 1. Try to get lat/lng from different possible key names
//         // let rawLat = match.lat || match.latitude; 
//         // let rawLng = match.lng || match.longitude;

//         // // 2. Parse them safely
//         // const lat = parseFloat(rawLat);
//         // const lng = parseFloat(rawLng);

//         // // 3. Check for NaN (Invalid Number)
//         // if (isNaN(lat) || isNaN(lng)) {
//         //     console.error("Invalid Coordinates found:", rawLat, rawLng);
//         //     alert("Error: This place has invalid location data in the database.");
//         //     return; // Stop here so map doesn't crash
//         // }

//         // Remove old marker
//         if (marker) map.removeLayer(marker);

//         // Add new marker & Fly to location
//         marker = L.marker([lat, lng]).addTo(map)
//             .bindPopup(`<b>${match.name}</b><br>${match.country}`).openPopup();

//         map.flyTo([lat, lng], 13, {
//             animate: true,
//             duration: 1.5
//         });
//     }

//     // Helper: Get CSRF Token from cookies
//     function getCookie(name) {
//         let cookieValue = null;
//         if (document.cookie && document.cookie !== '') {
//             const cookies = document.cookie.split(';');
//             for (let i = 0; i < cookies.length; i++) {
//                 const cookie = cookies[i].trim();
//                 if (cookie.substring(0, name.length + 1) === (name + '=')) {
//                     cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
//                     break;
//                 }
//             }
//         }
//         return cookieValue;
//     }
// });

// static/js/app.js

document.addEventListener('DOMContentLoaded', () => {
    const dropZone = document.getElementById('drop-zone');
    if (!dropZone) {
        return; // We are on Home Page, stop executing App JS
    }
    // DOM Elements
    const elements = {
        dropZone: document.getElementById('drop-zone'),
        fileInput: document.getElementById('file-input'),
        previewContainer: document.getElementById('preview-container'),
        previewImg: document.getElementById('preview-img'),
        placeholder: document.getElementById('upload-placeholder'),
        searchBtn: document.getElementById('search-btn'),
        resultsContent: document.getElementById('results-content'),
        emptyState: document.getElementById('empty-state'),
        loader: document.getElementById('loader'),

        // Result Fields
        placeName: document.getElementById('place-name'),
        placeCountry: document.getElementById('place-country'),
        placeDesc: document.getElementById('place-desc'),
        confidenceScore: document.getElementById('confidence-score'),
        confidenceBar: document.getElementById('confidence-bar'),
        latLngDisplay: document.getElementById('lat-lng-display'),
        similarGrid: document.getElementById('similar-places-grid')
    };

    // Initialize Map with LIGHT THEME (CartoDB Voyager)
    let map = L.map('map', { zoomControl: false }).setView([20, 0], 2);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 19
    }).addTo(map);

    L.control.zoom({ position: 'topright' }).addTo(map);
    let marker;

    // --- 1. Drag & Drop Visuals (Updated for Light Theme) ---

    ['dragenter', 'dragover'].forEach(eventName => {
        elements.dropZone.addEventListener(eventName, (e) => {
            e.preventDefault();
            // Light theme drag state: Orange border, light orange background
            elements.dropZone.classList.add('border-brand-500', 'bg-brand-50');
            elements.dropZone.classList.remove('border-gray-300', 'bg-gray-50');
        }, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        elements.dropZone.addEventListener(eventName, (e) => {
            e.preventDefault();
            elements.dropZone.classList.remove('border-brand-500', 'bg-brand-50');
            elements.dropZone.classList.add('border-gray-300', 'bg-gray-50');
        }, false);
    });

    // --- 2. File Handling ---
    elements.fileInput.addEventListener('change', handleFileSelect);
    elements.dropZone.addEventListener('drop', (e) => {
        const dt = e.dataTransfer;
        const files = dt.files;
        elements.fileInput.files = files;
        handleFileSelect({ target: elements.fileInput });
    });

    function handleFileSelect(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                elements.previewImg.src = e.target.result;
                elements.previewContainer.classList.remove('hidden');
                elements.placeholder.classList.add('hidden');
                elements.searchBtn.classList.remove('hidden');
                elements.dropZone.classList.add('border-brand-500'); // Keep border active
            }
            reader.readAsDataURL(file);
        }
    }

    // --- 3. Search Logic ---
    elements.searchBtn.addEventListener('click', async () => {
        const file = elements.fileInput.files[0];
        if (!file) return;

        elements.loader.classList.remove('hidden');
        elements.emptyState.classList.add('hidden');
        elements.resultsContent.classList.add('hidden');

        const formData = new FormData();
        formData.append('image', file);

        try {
            const response = await fetch('/api/search/', {
                method: 'POST',
                body: formData,
                headers: { 'X-CSRFToken': getCookie('csrftoken') }
            });

            const data = await response.json();

            if (data.error) throw new Error(data.error);

            if (data.matches && data.matches.length > 0) {
                setTimeout(() => updateUI(data.matches[0], data.matches), 500);
            } else {
                alert(data.message || "No match found.");
                resetUI();
            }

        } catch (error) {
            console.error('Error:', error);
            alert(`Analysis Failed: ${error.message}`);
            resetUI();
        }
    });

    function resetUI() {
        elements.loader.classList.add('hidden');
        elements.emptyState.classList.remove('hidden');
    }

    // --- 4. Update UI (Clean Light Theme) ---
    function updateUI(match, allMatches) {
        elements.loader.classList.add('hidden');
        elements.resultsContent.classList.remove('hidden');

        // Text Data
        elements.placeName.textContent = match.name;
        elements.placeCountry.textContent = match.country;
        elements.placeDesc.textContent = match.description;

        // Confidence
        const score = Math.round(parseFloat(match.confidence) * 100);
        elements.confidenceScore.textContent = `${score}%`;
        if (elements.confidenceBar) elements.confidenceBar.style.width = `${score}%`;

        // Map
        const lat = parseFloat(match.lat || match.latitude);
        const lng = parseFloat(match.lng || match.longitude);
        elements.latLngDisplay.textContent = `${lat.toFixed(4)}, ${lng.toFixed(4)}`;

        if (marker) map.removeLayer(marker);

        // Custom Marker (Optional: could use a custom orange icon here)
        marker = L.marker([lat, lng]).addTo(map)
            .bindPopup(`<div class="font-sans font-bold text-gray-800">${match.name}</div>`);

        marker.openPopup();

        map.flyTo([lat, lng], 13, { animate: true, duration: 1.5 });
        setTimeout(() => map.invalidateSize(), 100);

        // --- Similar Matches (Light Theme Cards) ---
        elements.similarGrid.innerHTML = '';
        const similarMatches = allMatches.slice(1);

        if (similarMatches.length === 0) {
            elements.similarGrid.innerHTML = '<p class="text-gray-400 text-sm italic col-span-2">No other similar locations found.</p>';
        } else {
            similarMatches.forEach(place => {
                const sScore = Math.round(parseFloat(place.confidence) * 100);

                const card = document.createElement('div');
                card.className = "bg-white p-3 rounded-lg border border-gray-200 flex items-center gap-3 hover:border-brand-300 hover:shadow-md transition-all cursor-pointer";

                card.innerHTML = `
                    <div class="w-12 h-12 rounded bg-gray-100 overflow-hidden flex-shrink-0 border border-gray-100">
                        <img src="${place.image_url}" class="w-full h-full object-cover">
                    </div>
                    <div class="flex-grow min-w-0">
                        <h5 class="text-gray-900 font-semibold text-sm truncate">${place.name}</h5>
                        <div class="flex items-center gap-2 mt-1">
                            <div class="h-1.5 flex-grow bg-gray-100 rounded-full overflow-hidden">
                                <div class="h-full bg-orange-400" style="width: ${sScore}%"></div>
                            </div>
                            <span class="text-xs text-gray-500 font-mono">${sScore}%</span>
                        </div>
                    </div>
                `;

                card.addEventListener('click', () => updateUI(place, allMatches));
                elements.similarGrid.appendChild(card);
            });
        }
    }

    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
});