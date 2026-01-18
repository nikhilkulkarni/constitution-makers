# Who wrote your constitution - Interactive Map Application

An interactive web application that displays the political map of India with state boundaries and provides information about which members of the Constituent Assembly represented each state.

## Overview

This application allows users to search for any location within India and discover which members of the Constituent Assembly represented that state. The application features:

- **Interactive Map**: A detailed political map of India with state boundaries drawn using dashed lines
- **Location Search**: Autocomplete search powered by GeoApify API to find any location within India
- **State Highlighting**: Selected states are highlighted in blue on the map
- **Constituent Assembly Information**: Displays the number of members and historical context for each state's representation
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## Features

### 1. Location Search
- Search any location within India using the autocomplete textbox
- Powered by GeoApify Geocoder API
- Filtered to show only Indian locations
- Displays multiple suggestions as you type

### 2. Interactive Map
- Built with Leaflet.js for smooth map interactions
- State boundaries displayed with dashed lines
- States colored in grey by default
- Selected state highlighted in blue
- Click on any state to view its information
- Hover effects for better user experience

### 3. State Information Panel
- Displays the name of the selected state
- Shows the number of members from that state in the Constituent Assembly
- Provides historical context and explanation about the state's representation
- Handles special cases like states that were formed after the Constituent Assembly period

### 4. Loading Indicator
- Shows a loading spinner while processing location selections
- Provides user feedback during state detection

## Technical Stack

- **Frontend Framework**: HTML5, CSS3, JavaScript (ES6+)
- **Map Library**: Leaflet.js 1.9.4
- **Geocoding API**: GeoApify Geocoder Autocomplete
- **Map Data**: GeoJSON from udit-001/india-maps-data repository
- **Server**: Python HTTP Server (for local development)

## Project Structure

```
constitution-app-html/
├── index.html              # Main HTML file
├── css/
│   └── style.css          # Styling for the application
├── js/
│   └── app.js             # Main application logic
├── data/
│   └── assembly.json      # Constituent Assembly member data
└── README.md              # This file
```

## File Descriptions

### index.html
The main HTML file containing the page structure with:
- Header with title and subtitle
- Left panel (80%) containing the search box and map
- Right panel (20%) containing state information
- Footer with links and attribution

### css/style.css
Comprehensive styling including:
- Responsive layout for different screen sizes
- Header and footer styling
- Map container styling
- Autocomplete dropdown styling
- Loading spinner animation
- Right panel information display
- Mobile-responsive breakpoints

### js/app.js
Main application logic handling:
- Leaflet map initialization
- GeoJSON data loading from external source
- Autocomplete search functionality
- Point-in-polygon algorithm for state detection
- State selection and highlighting
- Information panel updates
- Loading state management

### data/assembly.json
JSON file containing:
- List of all Indian states and union territories
- Number of members from each state in the Constituent Assembly
- Historical explanations for each state's representation
- Information about states formed after the Constituent Assembly period

## How to Use

1. **Open the Application**
   - Open `index.html` in a web browser
   - Or access via the provided server URL

2. **Search for a Location**
   - Type a city or location name in the search box
   - Select a location from the autocomplete suggestions
   - The application will automatically:
     - Detect which state the location belongs to
     - Highlight that state on the map
     - Display the state's Constituent Assembly information

3. **Click on States**
   - You can also click directly on any state on the map
   - The state will be highlighted and information will be displayed

4. **View Information**
   - The right panel shows:
     - The selected state's name
     - Number of members in the Constituent Assembly
     - Historical context about the state's representation

## API Keys and External Resources

### GeoApify API
- **API Key**: `601412f99d034d21898025c5c6cec28e`
- **Used for**: Location autocomplete and geocoding
- **Documentation**: https://www.geoapify.com/

### Map Data
- **Source**: https://github.com/udit-001/india-maps-data
- **Format**: GeoJSON
- **File**: india.geojson (contains state boundaries)

### Leaflet.js
- **Version**: 1.9.4
- **CDN**: https://unpkg.com/leaflet@1.9.4/
- **Documentation**: https://leafletjs.com/

## Responsive Design

The application is responsive and adapts to different screen sizes:

- **Desktop** (>1024px): 80% left panel, 20% right panel
- **Tablet** (768px-1024px): 70% left panel, 30% right panel
- **Mobile** (<768px): Stacked layout with 50% each

## Browser Compatibility

- Chrome/Chromium (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Running Locally

### Using Python
```bash
cd constitution-app-html
python3 -m http.server 8000
```
Then open `http://localhost:8000` in your browser.

### Using Node.js
```bash
cd constitution-app-html
npx http-server
```

### Using Live Server (VS Code)
- Install the Live Server extension
- Right-click on `index.html` and select "Open with Live Server"

## Data Structure

### Assembly Data (assembly.json)
Each state object contains:
- `name`: Current state name
- `oldName`: Historical name(s) during Constituent Assembly period
- `members`: Number of members in Constituent Assembly
- `explanation`: Historical context about representation

### GeoJSON Structure
Each feature in the GeoJSON contains:
- `properties.name`: State name
- `geometry`: Polygon or MultiPolygon coordinates

## Functionality Details

### Point-in-Polygon Detection
The application uses the ray-casting algorithm to determine which state contains a selected location. This algorithm:
1. Takes the coordinates of the location
2. Casts a ray from the point to infinity
3. Counts how many polygon edges the ray crosses
4. If odd number of crossings, point is inside; if even, point is outside

### State Highlighting
When a state is selected:
1. The map is redrawn with the selected state highlighted in blue
2. All other states remain grey
3. The map automatically zooms to fit the selected state
4. The right panel updates with state information

### Loading State
A loading spinner is displayed while:
1. Processing the location search
2. Detecting which state contains the location
3. Updating the map and information panel

## Limitations and Considerations

1. **Offline Functionality**: The application requires internet connection for:
   - GeoApify API calls for location search
   - Leaflet tile layer (map background)
   - GeoJSON data loading

2. **Browser Console**: Console logs are available for debugging but may not display in all browser environments

3. **State Name Matching**: State names in GeoJSON must exactly match those in assembly.json for proper information display

4. **Coordinate System**: All coordinates use WGS84 (EPSG:4326) projection

## Future Enhancements

Potential improvements for future versions:
- Offline map support using service workers
- Member profiles and detailed information
- Timeline view showing state formation
- Export functionality for selected states
- Multi-language support
- Advanced filtering and search options
- Historical map layers

## Attribution

- **Map Data**: OpenStreetMap contributors
- **State Boundaries**: udit-001/india-maps-data
- **Constituent Assembly Data**: Public sources
- **Original Concept**: Nikhil Kulkarni
- **Website**: https://www.nikhilkulkarni.in/

## License

This project uses data from public sources and open-source libraries. Please refer to individual library licenses for usage terms.

## Support

For issues, suggestions, or improvements, please refer to:
- https://www.nikhilkulkarni.in/
- https://twitter.com/kulkarninikhil
- https://linkedin.com/in/nkulkarni

## Changelog

### Version 1.0.0
- Initial release
- Interactive map with state boundaries
- Location search with autocomplete
- Constituent Assembly member information
- Responsive design for all devices
