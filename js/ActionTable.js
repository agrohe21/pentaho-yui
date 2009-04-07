YAHOO.namespace('pentaho');

(function(){

	YAHOO.pentaho.ActionTable = function(elContainer, oColumns, oData, elLinks) {

		//dynamically load required YUI modules
	    var loader = new YAHOO.util.YUILoader({
	        base: '/pentaho/yui/',
	        require: ['utilities', 'dragdrop', 'connection', 'datasource', 'element', 'paginator', 'datatable', 'json'],
	        rollup: true,
		    onProgress: function(o) { 
		        YAHOO.log("Loader progress:" + o.name); 
		    }, 
	        onSuccess: function() {
	
				var myResponseSchema = {};
				// fix this to results as set in xaction JavaScript
				myResponseSchema.resultsList = "results";
				
				myResponseSchema.fields =[];
				for (var i=0; i<oColumns.length; i++) {
					myResponseSchema.fields[i] = oColumns[i].id;
				}

				//supply JSON string from JavaSctipt as data
				if (oData) {				
			        var myDataSource = new YAHOO.util.DataSource(oData); 
			        myDataSource.responseType = YAHOO.util.DataSource.TYPE_JSON;
			        myDataSource.responseSchema = myResponseSchema; 
		        }
		 
		 		//make Column Defintions from oColumns JavaScript object
		        var myColumnDefs = [];
				for (var i=0; i<oColumns.length; i++) {
					myColumnDefs[i] = {};
					myColumnDefs[i].key        = oColumns[i].id;
					myColumnDefs[i].sortable   = oColumns[i].sortable;
					myColumnDefs[i].label      = oColumns[i].label;
					myColumnDefs[i].resizeable = true;
					if (oColumns[i].formatter){
						myColumnDefs[i].formattter = oColumns[i].formatter;
					};
				}
		
				//build configuration automatically i.e. hardcoded
		       var myConfigs = {
		   	       draggableColumns:true,
		   	       selectionMode:"single",
		           paginator: new YAHOO.widget.Paginator({
		               rowsPerPage: 15,
		               template: YAHOO.widget.Paginator.TEMPLATE_ROWS_PER_PAGE,
		               rowsPerPageOptions: [15,30,50,100],
		               pageLinks: 10
		   	        })
		       };
		       
		       //if there are columns, automatically sort by the first
		       myConfigs.sortedBy = {};
		       if (oColumns[0]) {
			       myConfigs.sortedBy.key = oColumns[0].id;
			       myConfigs.sortedBy.dir = "asc";
			   }
		
				//create the datatable instance
		        var dtActionTable = new YAHOO.widget.DataTable(elContainer, myColumnDefs, myDataSource, myConfigs); 
		        
				try {
					//highlighting rows
					dtActionTable.subscribe("rowMouseoverEvent", dtActionTable.onEventHighlightRow); 
					dtActionTable.subscribe("rowMouseoutEvent", dtActionTable.onEventUnhighlightRow); 
					dtActionTable.subscribe("rowClickEvent", dtActionTable.onEventSelectRow); 
			
			        // Pre-select the first row 
					dtActionTable.selectRow(dtActionTable.getTrEl(0));
				}
				catch (e) {
					YAHOO.log(e);
				}
			}
	    });  //end loader

	    loader.insert();
		YAHOO.lang.extend(YAHOO.pentaho.ActionTable, YAHOO.widget.DataTable);
	}// end actionTable

})(); 

// register themselves so the YUI Loader knows what it has loaded.  
YAHOO.register('pentaho.ActionTable', YAHOO.pentaho.ActionTable, {version: "0.1", build: '1'});