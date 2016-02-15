# GeoSAPOnline
ESRI map for salesforce integration demo. Read this to understand the parameters and objects involved in returning SAP fields to the SalesForce main page.
-atangeman20150115

## Index.html
### Sample input object 
```javascript
  // [atangeman20150115]
  // User defined attributes
  this._x = -117.1638107; // pass long here
  this._y = 32.7170075;   // pass lat here
  this._layerId = 15;     // pass id of layer here
  // New object is declared locally:
  sendObj = new SenderObject({
    x: this._x,
    y: this._y,
    layerId: this._layerId
  });
                    
```
### Sender module (for reference purposes):
```javascript
  // [atangeman20150115]
 // This function delivers the SAP sender object to the controller class once the map loads. 
 // You may use the the Controller.handleIdentifyRequest(this.sendObj); function to deliver on-demand. 
 // This method subscribes to load event to fire ONLY when the map first loads.
  this.appLoadHandler = topic.subscribe('controller/AppLoaded', lang.hitch(this, function (args) {
    Controller.handleIdentifyRequest(this.sendObj); // pass sender object to controller for delivery to identify widget
    this.appLoadHandler.remove(); // must only handle once, so remove listener
  }));
  // [atangeman20150115]
  // USE THIS FUNCTION FOR YOUR OWN SEPARATE SAP CALL
  // function must be called after the map is fully loaded, and within the same scope of the main function!
  Controller.handleIdentifyRequest(this.sendObj);
  
```
### Result return function
```javascript
  // [atangeman20150214]
  // Subscribe to results passed from identify widget
  var resultArray = [];  // <- Use this array to capture multiple results
  // Handle return object
  topic.subscribe('controller/identifyResult', lang.hitch(this, function (args) {
    var result = args.returnObj; // <- This is your result
    resultArray.push(result); // Array will build on multiple returns
    console.log(resultArray); // Print each addition to array to demonstrate return frequency
    console.log(resultArray[0]); // Use indexer to always grab first object returned.
  })); 
```
### Sample SAP Return Object
```javascript
 // [atangeman20150115]
 // sample object with only 'FunctionalLocation' parameter returned
  Object {
    EquipmentID: undefined, // No 'EquipmentID' for this layer, so returns undefined
    FunctionalLocation: Object { // Object returned for functional location
      alias: "SAP ID", // alias field name for reference
      domain: null, // ignore
      length: 9, // ignore
      name: "SAPID", // field name for referenc e
      result: "SS-000030" // RESULT 
    },
    MaterialID: undefined, // No 'MaterialID' for this layer, so returns undefined
    // [atangeman20150214] modified return object to include layerid, lat, lon
    LayerID: 15 //ID of identified layer
    Geometry: Object { // geometry object containing geographic coordinate info
      spatialReference: Object{ // spatial reference of layer
        wkid: 4326 // WKID (well-known ID) of coordinate system - important for reprojecting to different systems
      },
      x: -117.1638107, // Longitude - should be compatible with Google Maps 
      y: 32.7170075 // Latitude - should be compatible with Google Maps 
    }
  }
```
## Identify Config (/js/config/identify.js) 
### Sample dojo configuration options
```javascript
  // [atangeman20150115]
  define({
  	map: true,
  	mapClickMode: true,
  	mapRightClickMenu: true,
  	identifyLayerInfos: true,
  	identifyTolerance: 25, // tolerance for click accuracy
  	eventZoomLevel: 25, // default zoom level (increase for closer initial zoom)
  	suppressFields: [ // fields to omit from popup window
  		'OBJECTID',
  		'SHAPE_Length',
  		'Shape'
  	],
  	sapKey: [ // sap parameter names for return object
  		'FunctionalLocation', 
  		'EquipmentID', 
  		'MaterialID'
  	]
  });
```
