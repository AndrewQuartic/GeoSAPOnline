define({
	map: true,
	mapClickMode: true,
	mapRightClickMenu: true,
	identifyLayerInfos: true,
	identifyTolerance: 5,
	eventZoomLevel: 25,
	suppressFields: [
		'OBJECTID',
		'SHAPE_Length',
		'Shape'
	],
	sapKey: [
		'FunctionalLocation', 
		'EquipmentID', 
		'MaterialID'
	]
	// Use for custom implementation reference [atangeman20150113]
	// config object definition:
	//	{<layer id>:{
	//		<sub layer number>:{
	//			<pop-up definition, see link below>
	//			}
	//		},
	//	<layer id>:{
	//		<sub layer number>:{
	//			<pop-up definition, see link below>
	//			}
	//		}
	//	}

	// for details on pop-up definition see: https://developers.arcgis.com/javascript/jshelp/intro_popuptemplate.html
});