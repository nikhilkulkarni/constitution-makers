// GeoApify API Key
const GEOAPIFY_API_KEY = '601412f99d034d21898025c5c6cec28e';

// Global variables
let map;
let geoJsonLayer;
let statesData = {};
let assemblyData = {};
let currentHighlightedState = null;
let indiaGeoJson = null;
let autocompleteInstance = null;

// Initialize the application when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
    try {
        console.log('Initializing application...');
        
        // Load assembly data
        await loadAssemblyData();
        
        // Initialize map
        initializeMap();
        
        // Initialize GeoApify autocomplete with a delay to ensure library is loaded
        setTimeout(() => {
            initializeAutocomplete();
        }, 1000);
    } catch (error) {
        console.error('Error initializing app:', error);
    }
});

/**
 * Load constituent assembly data from JSON
 */
async function loadAssemblyData() {
    try {
        const response = await fetch('data/assembly.json');
        const data = await response.json();
        
        // Create a map of state names to their data
        data.states.forEach(state => {
            assemblyData[state.name] = state;
        });
        
        console.log('Assembly data loaded:', Object.keys(assemblyData).length, 'states');
    } catch (error) {
        console.error('Error loading assembly data:', error);
    }
}

/**
 * Initialize the Leaflet map
 */
function initializeMap() {
    console.log('Initializing map...');
    
    // Create map centered on India
    map = L.map('map').setView([20.5937, 78.9629], 5);
    
    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
        minZoom: 4
    }).addTo(map);
    
    // Load India GeoJSON
    loadIndiaGeoJson();
}

/**
 * Load India GeoJSON from the provided source
 */
function loadIndiaGeoJson() {
    const geoJsonUrl = 'https://raw.githubusercontent.com/udit-001/india-maps-data/main/geojson/india.geojson';
    
    console.log('Loading India GeoJSON...');
    
    fetch(geoJsonUrl)
        .then(response => response.json())
        .then(data => {
            indiaGeoJson = data;
            console.log('GeoJSON loaded with', data.features.length, 'features');
            
            // Create a map of state names for quick lookup
            if (data.features) {
                data.features.forEach(feature => {
                    const stateName = feature.properties.name;
                    statesData[stateName] = feature;
                });
            }
            
            console.log('States data created:', Object.keys(statesData).length, 'states');
            
            // Draw the initial map
            drawMap();
        })
        .catch(error => console.error('Error loading GeoJSON:', error));
}

/**
 * Draw the map with state boundaries
 */
function drawMap() {
    if (geoJsonLayer) {
        map.removeLayer(geoJsonLayer);
    }
    
    if (!indiaGeoJson) return;
    
    geoJsonLayer = L.geoJSON(indiaGeoJson, {
        style: function(feature) {
            const stateName = feature.properties.name;
            const isHighlighted = stateName === currentHighlightedState;
            
            return {
                fillColor: isHighlighted ? '#2a5298' : '#e8e8e8',
                weight: 2,
                opacity: 1,
                color: '#999',
                dashArray: '5, 5',
                fillOpacity: isHighlighted ? 0.7 : 0.3,
                transition: 'all 0.3s ease'
            };
        },
        onEachFeature: function(feature, layer) {
            const stateName = feature.properties.name;
            
            // Add click event
            layer.on('click', function() {
                selectState(stateName);
            });
            
            // Add hover effect
            layer.on('mouseover', function() {
                if (stateName !== currentHighlightedState) {
                    this.setStyle({
                        fillColor: '#b3d9ff',
                        fillOpacity: 0.5
                    });
                }
            });
            
            layer.on('mouseout', function() {
                if (stateName !== currentHighlightedState) {
                    this.setStyle({
                        fillColor: '#e8e8e8',
                        fillOpacity: 0.3
                    });
                }
            });
            
            // Add popup
            layer.bindPopup(`<strong>${stateName}</strong>`);
        }
    }).addTo(map);
}

/**
 * Initialize GeoApify autocomplete
 */
function initializeAutocomplete() {
    console.log('Initializing autocomplete...');
    
    const autocompleteContainer = document.getElementById('geoapify-autocomplete');
    
    if (!autocompleteContainer) {
        console.error('Autocomplete container not found');
        return;
    }
    
    // Check if GeoApify library is available
    if (typeof window.GeoapifyGeocoderAutocomplete === 'undefined') {
        console.warn('GeoApify library not loaded, trying alternative approach...');
        initializeSimpleAutocomplete();
        return;
    }
    
    try {
        // Create autocomplete element
        autocompleteInstance = new window.GeoapifyGeocoderAutocomplete(
            autocompleteContainer,
            GEOAPIFY_API_KEY,
            {
                placeholder: 'Search Location in India',
                type: 'city',
                countryCodes: ['in'],
                limit: 10
            }
        );
        
        // Handle selection
        autocompleteInstance.on('select', (location) => {
            console.log('Location selected:', location);
            handleLocationSelected(location);
        });
        
        console.log('Autocomplete initialized successfully');
    } catch (error) {
        console.error('Error initializing autocomplete:', error);
        initializeSimpleAutocomplete();
    }
}

/**
 * Initialize a simple autocomplete using GeoApify API directly
 */
function initializeSimpleAutocomplete() {
    console.log('Initializing simple autocomplete with direct API calls...');
    
    const autocompleteContainer = document.getElementById('geoapify-autocomplete');
    
    // Create input element
    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'Search Location in India';
    input.className = 'autocomplete-input';
    input.style.cssText = `
        width: 100%;
        padding: 12px 15px;
        font-size: 14px;
        border: 1px solid #ddd;
        border-radius: 6px;
        outline: none;
    `;
    
    // Create suggestions container
    const suggestionsContainer = document.createElement('div');
    suggestionsContainer.className = 'suggestions-container';
    suggestionsContainer.style.cssText = `
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: white;
        border: 1px solid #ddd;
        border-top: none;
        border-radius: 0 0 6px 6px;
        max-height: 300px;
        overflow-y: auto;
        z-index: 1000;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        display: none;
    `;
    
    autocompleteContainer.appendChild(input);
    autocompleteContainer.appendChild(suggestionsContainer);
    
    // Handle input
    let searchTimeout;
    input.addEventListener('input', (e) => {
        const query = e.target.value.trim();
        
        if (query.length < 2) {
            suggestionsContainer.style.display = 'none';
            return;
        }
        
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            searchLocations(query, suggestionsContainer, input);
        }, 300);
    });
    
    // Close suggestions when clicking outside
    document.addEventListener('click', (e) => {
        if (e.target !== input) {
            suggestionsContainer.style.display = 'none';
        }
    });
}

/**
 * Search locations using GeoApify API
 */
async function searchLocations(query, suggestionsContainer, input) {
    try {
        const url = `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(query)}&apiKey=${GEOAPIFY_API_KEY}&countryCodes=in`;
        
        const response = await fetch(url);
        const data = await response.json();
        
        suggestionsContainer.innerHTML = '';
        
        if (data.features && data.features.length > 0) {
            data.features.forEach(feature => {
                const suggestion = document.createElement('div');
                suggestion.className = 'suggestion-item';
                suggestion.style.cssText = `
                    padding: 12px 15px;
                    cursor: pointer;
                    border-bottom: 1px solid #f0f0f0;
                    font-size: 13px;
                    transition: background-color 0.2s;
                `;
                
                const displayName = feature.properties.address_line1 || feature.properties.name || 'Unknown';
                suggestion.textContent = displayName;
                
                suggestion.addEventListener('mouseover', () => {
                    suggestion.style.backgroundColor = '#f0f7ff';
                    suggestion.style.color = '#2a5298';
                });
                
                suggestion.addEventListener('mouseout', () => {
                    suggestion.style.backgroundColor = 'white';
                    suggestion.style.color = 'black';
                });
                
                suggestion.addEventListener('click', () => {
                    input.value = displayName;
                    suggestionsContainer.style.display = 'none';
                    handleLocationSelected(feature);
                });
                
                suggestionsContainer.appendChild(suggestion);
            });
            
            suggestionsContainer.style.display = 'block';
        } else {
            suggestionsContainer.style.display = 'none';
        }
    } catch (error) {
        console.error('Error searching locations:', error);
    }
}

/**
 * Handle location selection from autocomplete
 */
function handleLocationSelected(location) {
    console.log('Handling location selection:', location);
    
    if (!location) return;
    
    let lat, lng;
    
    // Handle different location object formats
    if (location.geometry && location.geometry.coordinates) {
        lng = location.geometry.coordinates[0];
        lat = location.geometry.coordinates[1];
    } else if (location.properties && location.properties.lat && location.properties.lon) {
        lat = location.properties.lat;
        lng = location.properties.lon;
    } else {
        console.error('Could not extract coordinates from location');
        return;
    }
    
    console.log('Location coordinates:', lat, lng);
    
    // Show loading spinner
    showLoading(true);
    
    // Find the state containing this point
    setTimeout(() => {
        const stateName = findStateForPoint(lat, lng);
        
        console.log('Found state:', stateName);
        
        if (stateName) {
            selectState(stateName);
            
            // Pan to location
            map.setView([lat, lng], 8);
        } else {
            alert('Could not determine the state for this location.');
        }
        
        showLoading(false);
    }, 500);
}

/**
 * Find the state that contains a given point
 */
function findStateForPoint(lat, lng) {
    if (!indiaGeoJson || !indiaGeoJson.features) return null;
    
    // Simple point-in-polygon check
    for (const feature of indiaGeoJson.features) {
        if (pointInPolygon([lng, lat], feature.geometry)) {
            return feature.properties.name;
        }
    }
    
    return null;
}

/**
 * Point in polygon algorithm (simple version)
 */
function pointInPolygon(point, geometry) {
    if (geometry.type === 'Polygon') {
        return isPointInPolygon(point, geometry.coordinates[0]);
    } else if (geometry.type === 'MultiPolygon') {
        return geometry.coordinates.some(polygon => 
            isPointInPolygon(point, polygon[0])
        );
    }
    return false;
}

/**
 * Check if a point is inside a polygon using ray casting algorithm
 */
function isPointInPolygon(point, polygon) {
    const [x, y] = point;
    let inside = false;
    
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        const [xi, yi] = polygon[i];
        const [xj, yj] = polygon[j];
        
        const intersect = ((yi > y) !== (yj > y)) &&
            (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        
        if (intersect) inside = !inside;
    }
    
    return inside;
}

/**
 * Select a state and update the UI
 */
function selectState(stateName) {
    console.log('Selecting state:', stateName);
    
    currentHighlightedState = stateName;
    
    // Redraw map to highlight selected state
    drawMap();
    
    // Update right panel with state information
    updateStateInfo(stateName);
    
    // Fit bounds to selected state
    if (statesData[stateName]) {
        const feature = statesData[stateName];
        const bounds = L.geoJSON(feature).getBounds();
        map.fitBounds(bounds, { padding: [50, 50] });
    }
}

/**
 * Update the right panel with state information
 */
function updateStateInfo(stateName) {
    const stateData = assemblyData[stateName];
    const infoTextElement = document.getElementById('info-text');
    const membersCountElement = document.getElementById('members-count');
    
    if (stateData) {
        // Update explanation text
        infoTextElement.innerHTML = `
            <strong style="color: #2a5298; font-size: 15px; display: block; margin-bottom: 10px;">
                ${stateName}
            </strong>
            <p>${stateData.explanation}</p>
        `;
        
        // Update member count
        if (stateData.members > 0) {
            membersCountElement.innerHTML = `
                <div>Number of Members in Constituent Assembly</div>
                <div class="number">${stateData.members}</div>
            `;
        } else {
            membersCountElement.innerHTML = `
                <div style="color: #999; font-size: 12px;">
                    This region had no representation in the Constituent Assembly
                </div>
            `;
        }
    } else {
        infoTextElement.textContent = 'No information available for this state.';
        membersCountElement.innerHTML = '';
    }
}

/**
 * Show or hide loading spinner
 */
function showLoading(show) {
    const loadingElement = document.getElementById('loading');
    if (show) {
        loadingElement.classList.add('active');
    } else {
        loadingElement.classList.remove('active');
    }
}

// Handle window resize to maintain map responsiveness
window.addEventListener('resize', () => {
    if (map) {
        map.invalidateSize();
    }
});
