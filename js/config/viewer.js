define([
 'esri/units', 
    'esri/geometry/Extent', 
    'esri/config', 'esri/urlUtils', 
    'esri/tasks/GeometryService', 
    'esri/layers/ImageParameters', 
    'esri/dijit/Basemap', 
    'esri/dijit/BasemapLayer', 
    'esri/geometry/Point', 
    'dojo/topic', 
], function(units, Extent, esriConfig, urlUtils, GeometryService, ImageParameters, Basemap, BasemapLayer, Point, topic) {

	//esriConfig.defaults.io.proxyUrl = 'https://webmaps.sannet.gov/proxy/proxy.ashx';
    // NOTE: If proxy rule is used, map services used in the JSON Webmap description for PrintTasks are not properly tokenized.
    //esriConfig.defaults.io.alwaysUseProxy = true;
       
    // NOTE: If proxy rule is used, map services used in the JSON Webmap description for PrintTasks are not properly tokenized.
    //esriConfig.defaults.io.alwaysUseProxy = true;
    urlUtils.addProxyRule({
        urlPrefix: 'https://webmaps.sannet.gov',
        proxyUrl: '/proxy/proxy.ashx'
    });
    // url to your geometry server.
    esriConfig.defaults.geometryService = new GeometryService('https://webmaps.sannet.gov/arcgis/rest/services/Utilities/Geometry/GeometryServer');
    //image parameters for dynamic services, set to png32 for higher quality exports.
    var imageParameters = new ImageParameters();
    imageParameters.format = 'png'

    return {
        // used for debugging your app
        isDebug: true,
        //default mapClick mode, mapClickMode lets widgets know what mode the map is in to avoid multipult map click actions from taking place (ie identify while drawing).
        defaultMapClickMode: 'identify',
        // map options, passed to map constructor. see: https://developers.arcgis.com/javascript/jsapi/map-amd.html#map1
		mapOptions: {
            //  minZoom: 9,
            //  maxZoom: 19,
            logo: false,         
            //basemap: 'custom',
              
            basemap: new Basemap({
                id: 'pud',
                
                layers: [new BasemapLayer({
                        url: 'https://webmaps.sannet.gov/arcgis/rest/services/geosap/GeoSAP_Basemap_cache/MapServer',                      
                        displayLevels: [7]   
                    })]
                    
            }),
            
            //lods : customLods,
           // center: [33.514, -117.985],
            zoom: 10,
            sliderStyle: 'small'
        },
        panes: {
            bottom: {
                id: 'sidebarBottom',
                placeAt: 'outer',
                splitter: true,
                collapsible: true,
                region: 'bottom',
                style: 'height:30%; display: none',
                content: '<div id="attributesContainer"></div>'
            }
        
        },
        // collapseButtonsPane: 'center', //center or outer

        // operationalLayers: Array of Layers to load on top of the basemap: valid 'type' options: 'dynamic', 'tiled', 'feature'.
        // The 'options' object is passed as the layers options for constructor. Title will be used in the legend only. id's must be unique and have no spaces.
        // 3 'mode' options: MODE_SNAPSHOT = 0, MODE_ONDEMAND = 1, MODE_SELECTION = 2
        operationalLayers: [{
                type: 'dynamic',
                url: 'https://webmaps.sannet.gov/arcgis/rest/services/geosap/GeoSAP_Dynamic/MapServer',
                title: 'GeoSap Dynamic',
                slider: true,
                mode: 1,
                //noLegend: false,
                //collapsed: false,
                sublayerToggle: false, //true to automatically turn on sublayers
                options: {
                    id: 'GeoSap_Dynamic',
                    opacity: 1.0,
                    visible: true,
                    imageParameters: imageParameters
                },              
		}],
        // set include:true to load. For titlePane type set position the the desired order in the sidebar
        widgets: {
            growler: {
                include: true,
                id: 'growler',
                type: 'domNode',
                path: 'gis/dijit/Growler',
                srcNodeRef: 'growlerDijit',
                options: {}
            },
            geocoder: {
                include: true,
                id: 'geocoder',
                type: 'domNode',
                path: 'gis/dijit/Geocoder',
                srcNodeRef: 'geocodeDijit',
                options: {
                    map: true,
                    mapRightClickMenu: true,
                    geocoderOptions: {
                        autoComplete: true,
                        arcgisGeocoder: {
                            placeholder: 'Enter an address or place'
                        }
                    }
                }
            },
            identify: {
                include: true,
                id: 'identify',
                type: 'titlePane',
                path: 'gis/dijit/Identify',
                title: 'Identify',
                open: false,
                position: 3,
                options: 'config/identify'
            },
            basemaps: {
                include: true,
                id: 'basemaps',
                type: 'domNode',
                path: 'gis/dijit/Basemaps',
                srcNodeRef: 'basemapsDijit',
                options: 'config/basemaps'
            },
            mapInfo: {
                include: false,
                id: 'mapInfo',
                type: 'domNode',
                path: 'gis/dijit/MapInfo',
                srcNodeRef: 'mapInfoDijit',
                options: {
                    map: true,
                    mode: 'dms',
                    firstCoord: 'y',
                    unitScale: 3,
                    showScale: true,
                    xLabel: '',
                    yLabel: '',
                    minWidth: 286
                }
            },
            scalebar: {
                include: true,
                id: 'scalebar',
                type: 'map',
                path: 'esri/dijit/Scalebar',
                options: {
                    map: true,
                    attachTo: 'bottom-left',
                    scalebarStyle: 'line',
                    scalebarUnit: 'dual'
                }
            },
            locateButton: {
                include: true,
                id: 'locateButton',
                type: 'domNode',
                path: 'gis/dijit/LocateButton',
                srcNodeRef: 'locateButton',
                options: {
                    map: true,
                    publishGPSPosition: true,
                    highlightLocation: true,
                    useTracking: true,
                    geolocationOptions: {
                        maximumAge: 0,
                        timeout: 15000,
                        enableHighAccuracy: true
                    }
                }
            },
            overviewMap: {
                include: true,
                id: 'overviewMap',
                type: 'map',
                path: 'esri/dijit/OverviewMap',
                options: {
                    map: true,
                    attachTo: 'bottom-right',
                    color: '#0000CC',
                    height: 100,
                    width: 125,
                    opacity: 0.30,
                    visible: false
                }
            },
            homeButton: {
                include: true,
                id: 'homeButton',
                type: 'domNode',
                path: 'esri/dijit/HomeButton',
                srcNodeRef: 'homeButton',
                options: {
                    map: true,
                    extent: new Extent({
                        xmin: -180,
                        ymin: -85,
                        xmax: 180,
                        ymax: 85,
                        spatialReference: {
                            wkid: 4326
                        }
                    })
                }
            },
            legend: {
                include: false,
                id: 'legend',
                type: 'titlePane',
                path: 'esri/dijit/Legend',
                title: 'Legend',
                open: false,
                position: 0,
                options: {
                    map: true,
                    legendLayerInfos: true
                }
            },
            layerControl: {
                include: true,
                id: 'layerControl',
                type: 'titlePane',
                path: 'gis/dijit/LayerControl',
                title: 'Layers',
                open: false,
                position: 0,
                options: {
                    map: true,
                    layerControlLayerInfos: true,
                    separated: true,
                    vectorReorder: true,
                    overlayReorder: true
                }
            },
            bookmarks: {
                include: true,
                id: 'bookmarks',
                type: 'titlePane',
                path: 'gis/dijit/Bookmarks',
                title: 'Bookmarks',
                open: false,
                position: 2,
                options: 'config/bookmarks'
            },
            find: {
                include: false,
                id: 'find',
                type: 'titlePane',
                canFloat: true,
                path: 'gis/dijit/Find',
                title: 'Find',
                open: false,
                position: 3,
                options: 'config/find'
            },
            draw: {
                include: true,
                id: 'draw',
                type: 'titlePane',
                canFloat: true,
                path: 'gis/dijit/Draw',
                title: 'Draw',
                open: false,
                position: 4,
                options: {
                    map: true,
                    mapClickMode: true
                }
            },
            measure: {
                include: true,
                id: 'measurement',
                type: 'titlePane',
                canFloat: true,
                path: 'gis/dijit/Measurement',
                title: 'Measurement',
                open: false,
                position: 5,
                options: {
                    map: true,
                    mapClickMode: true,
                    defaultAreaUnit: units.SQUARE_MILES,
                    defaultLengthUnit: units.MILES
                }
            },
			/*
            print: {
                include: true,
                id: 'print',
                type: 'titlePane',
                canFloat: true,
                path: 'gis/dijit/Print',
                title: 'Print',
                open: false,
                position: 6,
                options: {
                    map: true,
                    printTaskURL: 'https://utility.arcgisonline.com/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task',
                    copyrightText: 'Copyright 2014',
                    authorText: 'Me',
                    defaultTitle: 'Viewer Map',
                    defaultFormat: 'PDF',
                    defaultLayout: 'Letter ANSI A Landscape'
                }
            },*/
            editor: {
                include: false,
                id: 'editor',
                type: 'titlePane',
                path: 'gis/dijit/Editor',
                title: 'Editor',
                open: false,
                position: 8,
                options: {
                    map: true,
                    mapClickMode: true,
                    editorLayerInfos: true,
                    settings: {
                        toolbarVisible: true,
                        showAttributesOnClick: true,
                        enableUndoRedo: true,
                        createOptions: {
                            polygonDrawTools: ['freehandpolygon', 'autocomplete']
                        },
                        toolbarOptions: {
                            reshapeVisible: true,
                            cutVisible: true,
                            mergeVisible: true
                        }
                    }
                }
            },
            streetview: {
                include: false,
                id: 'streetview',
                type: 'titlePane',
                canFloat: true,
                position: 9,
                path: 'gis/dijit/StreetView',
                title: 'Google Street View',
                options: {
                    map: true,
                    mapClickMode: true,
                    mapRightClickMenu: true
                }
            },
            help: {
                include: true,
                id: 'help',
                type: 'floating',
                path: 'gis/dijit/Help',
                title: 'Help',
                options: {}
            }

        }
    };
});