# GeoSAPOnline
ESRI map for salesforce integration demo

## Index.html
### Sample input object 
```javascript
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
 // This function delivers the sender object to the controller class once the map loads. 
 // You may use the the Controller.handleIdentifyRequest(this.sendObj); function to deliver on-demand. 
 // This method subscribes to load event to fire ONLY when the map first loads.
  this.appLoadHandler = topic.subscribe('controller/AppLoaded', lang.hitch(this, function (args) {
    Controller.handleIdentifyRequest(this.sendObj); // pass sender object to controller for delivery to identify widget
    this.appLoadHandler.remove(); // must only handle once, so remove listener
  }));
  
  // USE THIS FUNCTION FOR YOUR OWN SEPARATE CALL
  Controller.handleIdentifyRequest(this.sendObj);
  
```
### Result return function
```javascript
  topic.subscribe('controller/identifyResult', lang.hitch(this, function (args) {
    var result = args.returnObj; // <- This is your result
    console.log(result);
  }));
```
### Sample Return Object
```javascript
  Object { // sample object with only 'FunctionalLocation' parameter returned
    EquipmentID: undefined, // No 'EquipmentID' for this layer, so returns undefined
    FunctionalLocation: Object { // Object returned for functional location
      alias: "SAP ID", // alias field name for reference
      domain: null, // ignore
      length: 9, // ignore
      name: "SAPID", // field name for referenc e
      result: "SS-000030" // RESULT 
    }
    MaterialID: undefined, // No 'MaterialID' for this layer, so returns undefined
  }
```
## Identify Config (/js/config/identify.js) 
### Sample dojo configuration options
```javascript
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
