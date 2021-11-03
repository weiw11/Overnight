# Overnight
*This is still a WIP project.*

A MEAN Stack project to find locations to park overnight for on the road lifestyle.

Uses:
* Open Street Maps
* Leaflet
* Nominatim

Instructions:
requires `.env` file in `backend` folder with the following keys:
```
DB_USER=[Username]
DB_PASS=[Password]
DB_URI=[MongoDB URI]
DB_NAME=[MongoDB Collection Name]
```

requires `.env.ts` file in `frontend/src/app` folder with the following:
```typescript
export const apiURL = `https://localhost/api/locations/`;
```

Angular Frontend Structure:
```
Map Module
│ Map Page Component
│ └► Map View Component
```

Preview:
![Image](https://github.com/weiw11/Overnight/blob/main/.GITHUB/images/overnight_sample.png?raw=true)
