

/***
 *    d888888b .88b  d88. d8888b.  .d88b.  d8888b. d888888b       .d88b.  d88888b d88888b d888888b  .o88b. d888888b  .d8b.  db      
 *      `88'   88'YbdP`88 88  `8D .8P  Y8. 88  `8D `~~88~~'      .8P  Y8. 88'     88'       `88'   d8P  Y8   `88'   d8' `8b 88      
 *       88    88  88  88 88oodD' 88    88 88oobY'    88         88    88 88ooo   88ooo      88    8P         88    88ooo88 88      
 *       88    88  88  88 88~~~   88    88 88`8b      88         88    88 88~~~   88~~~      88    8b         88    88~~~88 88      
 *      .88.   88  88  88 88      `8b  d8' 88 `88.    88         `8b  d8' 88      88        .88.   Y8b  d8   .88.   88   88 88booo. 
 *    Y888888P YP  YP  YP 88       `Y88P'  88   YD    YP          `Y88P'  YP      YP      Y888888P  `Y88P' Y888888P YP   YP Y88888P 
 *                                                                                                                                  
 *                                                                                                                                  
 */
import * as React from 'react';
import * as ReactDom from 'react-dom';

import { Version } from "@microsoft/sp-core-library";
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
} from "@microsoft/sp-property-pane";
import { BaseClientSideWebPart } from "@microsoft/sp-webpart-base";
import { escape } from "@microsoft/sp-lodash-subset";

// 2020-09-08:  Add for dynamic data refiners.
import { IDynamicDataCallables, IDynamicDataPropertyDefinition } from '@microsoft/sp-dynamic-data';

import { sp } from '@pnp/sp';

import { PageContext } from '@microsoft/sp-page-context';

import { FoamTree } from "@carrotsearch/foamtree";

import { IPropertyFieldSite } from "@pnp/spfx-property-controls/lib/PropertyFieldSitePicker";

/***
 *    d888888b .88b  d88. d8888b.  .d88b.  d8888b. d888888b      d8b   db d8888b. .88b  d88.      d88888b db    db d8b   db  .o88b. d888888b d888888b  .d88b.  d8b   db .d8888. 
 *      `88'   88'YbdP`88 88  `8D .8P  Y8. 88  `8D `~~88~~'      888o  88 88  `8D 88'YbdP`88      88'     88    88 888o  88 d8P  Y8 `~~88~~'   `88'   .8P  Y8. 888o  88 88'  YP 
 *       88    88  88  88 88oodD' 88    88 88oobY'    88         88V8o 88 88oodD' 88  88  88      88ooo   88    88 88V8o 88 8P         88       88    88    88 88V8o 88 `8bo.   
 *       88    88  88  88 88~~~   88    88 88`8b      88         88 V8o88 88~~~   88  88  88      88~~~   88    88 88 V8o88 8b         88       88    88    88 88 V8o88   `Y8b. 
 *      .88.   88  88  88 88      `8b  d8' 88 `88.    88         88  V888 88      88  88  88      88      88b  d88 88  V888 Y8b  d8    88      .88.   `8b  d8' 88  V888 db   8D 
 *    Y888888P YP  YP  YP 88       `Y88P'  88   YD    YP         VP   V8P 88      YP  YP  YP      YP      ~Y8888P' VP   V8P  `Y88P'    YP    Y888888P  `Y88P'  VP   V8P `8888Y' 
 *                                                                                                                                                                              
 *                                                                                                                                                                              
 */

import { IFoamTree, IFoamTreeDataObject } from '@mikezimm/npmfunctions/dist/CarrotCharts/IFoamTree';

import { getAllItems } from '@mikezimm/npmfunctions/dist/Services/PropPane/PPFunctions';

import { doesObjectExistInArray } from '@mikezimm/npmfunctions/dist/Services/Arrays/checks';

import { makeid } from '@mikezimm/npmfunctions/dist/Services/Strings/stringServices';

import { FoamAnimations, FoamBorders, FoamColors } from '@mikezimm/npmfunctions/dist/CarrotCharts/IFoamTreeDefaults';

/***
 *    d888888b .88b  d88. d8888b.  .d88b.  d8888b. d888888b      .d8888. d88888b d8888b. db    db d888888b  .o88b. d88888b .d8888. 
 *      `88'   88'YbdP`88 88  `8D .8P  Y8. 88  `8D `~~88~~'      88'  YP 88'     88  `8D 88    88   `88'   d8P  Y8 88'     88'  YP 
 *       88    88  88  88 88oodD' 88    88 88oobY'    88         `8bo.   88ooooo 88oobY' Y8    8P    88    8P      88ooooo `8bo.   
 *       88    88  88  88 88~~~   88    88 88`8b      88           `Y8b. 88~~~~~ 88`8b   `8b  d8'    88    8b      88~~~~~   `Y8b. 
 *      .88.   88  88  88 88      `8b  d8' 88 `88.    88         db   8D 88.     88 `88.  `8bd8'    .88.   Y8b  d8 88.     db   8D 
 *    Y888888P YP  YP  YP 88       `Y88P'  88   YD    YP         `8888Y' Y88888P 88   YD    YP    Y888888P  `Y88P' Y88888P `8888Y' 
 *                                                                                                                                 
 *                                                                                                                                 
 */

import { propertyPaneBuilder } from '../../services/propPane/PropPaneBuilder';

require('../../services/GrayPropPaneAccordions.css');

 /***
 *    d888888b .88b  d88. d8888b.  .d88b.  d8888b. d888888b      db   db d88888b db      d8888b. d88888b d8888b. .d8888. 
 *      `88'   88'YbdP`88 88  `8D .8P  Y8. 88  `8D `~~88~~'      88   88 88'     88      88  `8D 88'     88  `8D 88'  YP 
 *       88    88  88  88 88oodD' 88    88 88oobY'    88         88ooo88 88ooooo 88      88oodD' 88ooooo 88oobY' `8bo.   
 *       88    88  88  88 88~~~   88    88 88`8b      88         88~~~88 88~~~~~ 88      88~~~   88~~~~~ 88`8b     `Y8b. 
 *      .88.   88  88  88 88      `8b  d8' 88 `88.    88         88   88 88.     88booo. 88      88.     88 `88. db   8D 
 *    Y888888P YP  YP  YP 88       `Y88P'  88   YD    YP         YP   YP Y88888P Y88888P 88      Y88888P 88   YD `8888Y' 
 *                                                                                                                       
 *                                                                                                                       
 */

import { getFakeFoamTreeData } from './components/FakeFoamTreeData';

 /***
 *    d888888b .88b  d88. d8888b.  .d88b.  d8888b. d888888b       .o88b.  .d88b.  .88b  d88. d8888b.  .d88b.  d8b   db d88888b d8b   db d888888b 
 *      `88'   88'YbdP`88 88  `8D .8P  Y8. 88  `8D `~~88~~'      d8P  Y8 .8P  Y8. 88'YbdP`88 88  `8D .8P  Y8. 888o  88 88'     888o  88 `~~88~~' 
 *       88    88  88  88 88oodD' 88    88 88oobY'    88         8P      88    88 88  88  88 88oodD' 88    88 88V8o 88 88ooooo 88V8o 88    88    
 *       88    88  88  88 88~~~   88    88 88`8b      88         8b      88    88 88  88  88 88~~~   88    88 88 V8o88 88~~~~~ 88 V8o88    88    
 *      .88.   88  88  88 88      `8b  d8' 88 `88.    88         Y8b  d8 `8b  d8' 88  88  88 88      `8b  d8' 88  V888 88.     88  V888    88    
 *    Y888888P YP  YP  YP 88       `Y88P'  88   YD    YP          `Y88P'  `Y88P'  YP  YP  YP 88       `Y88P'  VP   V8P Y88888P VP   V8P    YP    
 *                                                                                                                                               
 *                                                                                                                                               
 */

import * as strings from 'FoamchartWebPartStrings';
import Foamchart from './components/Foamchart';
import { IFoamchartProps } from './components/IFoamchartProps';

/***
 *    d88888b db    db d8888b.  .d88b.  d8888b. d888888b      d888888b d8b   db d888888b d88888b d8888b. d88888b  .d8b.   .o88b. d88888b .d8888. 
 *    88'     `8b  d8' 88  `8D .8P  Y8. 88  `8D `~~88~~'        `88'   888o  88 `~~88~~' 88'     88  `8D 88'     d8' `8b d8P  Y8 88'     88'  YP 
 *    88ooooo  `8bd8'  88oodD' 88    88 88oobY'    88            88    88V8o 88    88    88ooooo 88oobY' 88ooo   88ooo88 8P      88ooooo `8bo.   
 *    88~~~~~  .dPYb.  88~~~   88    88 88`8b      88            88    88 V8o88    88    88~~~~~ 88`8b   88~~~   88~~~88 8b      88~~~~~   `Y8b. 
 *    88.     .8P  Y8. 88      `8b  d8' 88 `88.    88           .88.   88  V888    88    88.     88 `88. 88      88   88 Y8b  d8 88.     db   8D 
 *    Y88888P YP    YP 88       `Y88P'  88   YD    YP         Y888888P VP   V8P    YP    Y88888P 88   YD YP      YP   YP  `Y88P' Y88888P `8888Y' 
 *                                                                                                                                               
 *                                                                                                                                               
 */



export interface IFoamchartWebPartProps {

    // 0 - Context
    pageContext: PageContext;

    // 1 - Analytics options
    useListAnalytics: boolean;
    analyticsWeb?: string;
    analyticsList?: string;
    stressMultiplierTime?: number;
    stressMultiplierProject?: number;
    
    sites: IPropertyFieldSite[];
    lists: string | string[];
  
    foamChartHeight: number;  //Fixed number of pixels for the foam rendering

    foamAnimations: string;  // 'foamAnimations', 'foamColors', 'foamBorders'
    foamColors: string;
    foamBorders: string;

    //foamOptions components:
    rollHiearchy: boolean;
    includeSum: boolean;
    includeCount: boolean;
    includeAvg: boolean;
    includeMax: boolean;
    includeMin: boolean;
    includeRange: boolean;
    changeLayout: boolean;
    changeTitles: boolean;

    parentListTitle: string;
    parentListName: string;
    parentListWeb: string;
    fetchListFieldTitles: string;

    dateColumn: string;
    //monthGap: string;

    carrotProps?: string;  //For all the properties for carrotProps
    carrotCats: string;
    carrotStyles?: string;  //For all the properties for carrotProps

    valueColumn: string;
    valueType: string;
    valueOperator: string;
    minDataDownload: boolean;
    dropDownColumns: string;
    searchColumns: string;
    metaColumns: string;
    enableSearch: boolean;

    webPartScenario: string; //Choice used to create mutiple versions of the webpart.
    showEarlyAccess: boolean;
    definitionToggle: boolean;
    listDefinition: any; //Picked list defintion :  Title

    chartId: string;
    newMap?: any[];

    //Items copied but not needed from GridCharts
    /* 
    
    cellColor: string;
    yearStyles: string;
    monthStyles: string;
    dayStyles: string;
    cellStyles: string;
    cellhoverInfoColor: string;
    
    otherStyles: string;
    scaleMethod: IScaleMethod;

    squareCustom: string;
    squareColor: string;
    emptyColor: string;
    backGroundColor: string;    
*/
    advancedPivotStyles: boolean;
    pivotSize: string;
    pivotFormat: string;
    pivotOptions: string;
    pivotTab: string;


    fetchCount: number;
    fetchCountMobile: number;
    restFilter: string;

}


/**
 * 2020-09-08:  Add for dynamic data refiners.
 * 
 * was:
 * export default class FoamchartWebPart extends BaseClientSideWebPart<IFoamchartWebPartProps> {
 */




//export default class FoamchartWebPart extends BaseClientSideWebPart<IFoamchartWebPartProps> implements IDynamicDataCallables {


export default class FoamchartWebPart extends BaseClientSideWebPart<IFoamchartWebPartProps> implements IDynamicDataCallables {



  /**
   * 2020-09-08:  Add for dynamic data refiners.
   */
  private _selectedWebUrl: string;
  private _selectedListName: string;
  private _selectedColumns: string;

  private _foamTreeObject: IFoamTree;  
  private _dataObject: IFoamTreeDataObject;

  //  _foamTreeObject  foamTreeObject
  //  _dataObject  dataObject
  
/***
 *          .d88b.  d8b   db d888888b d8b   db d888888b d888888b 
 *         .8P  Y8. 888o  88   `88'   888o  88   `88'   `~~88~~' 
 *         88    88 88V8o 88    88    88V8o 88    88       88    
 *         88    88 88 V8o88    88    88 V8o88    88       88    
 *         `8b  d8' 88  V888   .88.   88  V888   .88.      88    
 *          `Y88P'  VP   V8P Y888888P VP   V8P Y888888P    YP    
 *                                                               
 *                                                               
 */

    //Added for Get List Data:  https://www.youtube.com/watch?v=b9Ymnicb1kc
    public onInit():Promise<void> {
      return super.onInit().then(_ => {
        
        //2020-09-08:  Add for dynamic data refiners.
        this.context.dynamicDataSourceManager.initializeSource(this);

        // other init code may be present

        let mess = 'onInit - ONINIT: ' + new Date().toLocaleTimeString();

        console.log(mess);

        //https://stackoverflow.com/questions/52010321/sharepoint-online-full-width-page
        if ( window.location.href &&  
          window.location.href.toLowerCase().indexOf("layouts/15/workbench.aspx") > 0 ) {
            
          if (document.getElementById("workbenchPageContent")) {
            document.getElementById("workbenchPageContent").style.maxWidth = "none";
          }
        } 

        if ( this.properties.chartId && this.properties.chartId.length > 0 ) {} else { 
          this.properties.chartId = makeid( 7 ) ;
        }

        this._getListDefintions(true, true);
        //console.log('window.location',window.location);
        sp.setup({
          spfxContext: this.context
        });

        if ( this.properties.foamAnimations && this.properties.foamAnimations.length > 0 ) {} else { this.properties.foamAnimations = FoamAnimations.join(',') ; }
        if ( this.properties.foamColors && this.properties.foamColors.length > 0 ) {} else { this.properties.foamColors = FoamColors.join(',') ; }
        if ( this.properties.foamBorders && this.properties.foamBorders.length > 0 ) {} else { this.properties.foamBorders = FoamBorders.join(',') ; }

        ['includeSum','includeCount','includeAvg','includeMax','includeMin', 'includeRange'].map( p => {   //Data Options Settings
          if ( this.properties[p] === null || this.properties[p] === undefined ) { this.properties[p] = true ; }
        });

        ['rollHiearchy','changeLayout','changeTitles',].map( p => {  //UI Settings
          if ( this.properties[p] === null || this.properties[p] === undefined ) { this.properties[p] = true ; }
        });

      });
    }
  
    
    public getUrlVars(): {} {
      var vars = {};
      vars = location.search
      .slice(1)
      .split('&')
      .map(p => p.split('='))
      .reduce((obj, pair) => {
        const [key, value] = pair.map(decodeURIComponent);
        return ({ ...obj, [key]: value }) ;
      }, {});
      return vars;
    }


    /**
     * 2020-09-08:  Add for dynamic data refiners.   public getPropertyDefinitions():
     * 
     */
    public getPropertyDefinitions(): ReadonlyArray<IDynamicDataPropertyDefinition>{
      return [
        {
          id: 'selectedWebUrl',
          title: 'Field you are filtering on',
        },
        {
          id: 'selectedListName',
          title: 'Value you are filtering on',
        },
        {
          id: 'selectedColumns',
          title: 'Filter by refiner component',
        },
        {
          id: 'foamTreeObject',
          title: 'Filter by refiner component',
        },
        {
          id: 'dataObject',
          title: 'Filter by refiner component',
        }
      ];
    }


    /**
     * 2020-09-08:  Add for dynamic data refiners.   public getPropertyValue:
     * @param propertyId 
     */
    public getPropertyValue(propertyId: string): string | IFoamTreeDataObject | IFoamTree {
      switch(propertyId) {
        case 'selectedWebUrl': 
          return this._selectedWebUrl;
        case 'selectedListName':
          return this._selectedListName;
        case 'selectedColumns':
          return this._selectedColumns;
        case 'foamTreeObject':
          return this._foamTreeObject;
        case 'dataObject':
          return this._dataObject;
      }
      throw new Error('Bad property ID');
    
    }


      /***
 *         d8888b. d88888b d8b   db d8888b. d88888b d8888b. 
 *         88  `8D 88'     888o  88 88  `8D 88'     88  `8D 
 *         88oobY' 88ooooo 88V8o 88 88   88 88ooooo 88oobY' 
 *         88`8b   88~~~~~ 88 V8o88 88   88 88~~~~~ 88`8b   
 *         88 `88. 88.     88  V888 88  .8D 88.     88 `88. 
 *         88   YD Y88888P VP   V8P Y8888D' Y88888P 88   YD 
 *                                                          
 *                                                          
 */

  public render(): void {

    if ( this.properties.fetchCount == null ) { this.properties.fetchCount = 1000 ;}

    if ( this.properties.parentListWeb && this.properties.parentListWeb.length > 0 ) {} else { this.properties.parentListWeb = this.context.pageContext.web.serverRelativeUrl ; }

    let showEarlyAccess : boolean = false;

    if ( window.location.origin.toLowerCase().indexOf('clickster.share') > -1 || window.location.origin.toLowerCase().indexOf('/autoliv/') > -1 ) {
      showEarlyAccess = true;
      this.properties.showEarlyAccess = true;
    } else {
      showEarlyAccess = this.properties.showEarlyAccess;
    }
    if ( this.properties.parentListWeb === '' ) {

    }
    let tenant = this.context.pageContext.web.absoluteUrl.replace(this.context.pageContext.web.serverRelativeUrl,"");
    let parentListWeb = this.properties.parentListWeb.indexOf('/sites/') === 0 ? tenant + this.properties.parentListWeb : this.properties.parentListWeb;

    const element: React.ReactElement<IFoamchartProps> = React.createElement(
      Foamchart,
      {

        //Size courtesy of https://www.netwoven.com/2018/11/13/resizing-of-spfx-react-web-parts-in-different-scenarios/
        WebpartElement:this.domElement,
        foamtree: null,

        foamStyles: {
            foamChartHeight: this.properties.foamChartHeight,  //Fixed number of pixels for the foam rendering
            foamAnimations: this.properties.foamAnimations.split(',') ,
            foamColors: this.properties.foamColors.split(',') ,
            foamBorders: this.properties.foamBorders.split(',') ,
        },

        foamOptions: {
            rollHiearchy: this.properties.rollHiearchy,
            changeLayout: this.properties.changeLayout,
            changeTitles: this.properties.changeTitles,
        },

        foamData: {
          includeSum: this.properties.includeSum,
          includeCount: this.properties.includeCount,
          includeAvg: this.properties.includeAvg,
          includeMax: this.properties.includeMax,
          includeMin: this.properties.includeMin,
          includeRange: this.properties.includeRange,
        },

        // 0 - Context
        pageContext: this.context.pageContext,
        wpContext: this.context,
        chartId: this.properties.chartId,
        
        tenant: tenant,
        urlVars: this.getUrlVars(),

        // 2 - Source and destination list information
        parentListWeb: parentListWeb,
        parentListURL: null,
        parentListTitle: this.properties.parentListTitle,
        listName: null,

        allLoaded: null,

        carrotCats: this.properties.carrotCats ? this.properties.carrotCats.split(',') : [], 
        dateColumn: this.properties.dateColumn,
        valueColumn: this.properties.valueColumn,
        searchColumns: this.properties.searchColumns ? this.properties.searchColumns.split(',') : [], 

        valueType: this.properties.valueType,
        valueOperator: this.properties.valueOperator,
        dropDownColumns: this.properties.dropDownColumns ? this.properties.dropDownColumns.split(',') : [],

        metaColumns: this.properties.metaColumns ? this.properties.metaColumns.split(',') : [], 
        enableSearch: this.properties.enableSearch,
    
        performance: {
          fetchCount: this.properties.fetchCount,
          fetchCountMobile: this.properties.fetchCountMobile,
          restFilter: !this.properties.restFilter ? '' : this.properties.restFilter,
          minDataDownload: this.properties.minDataDownload,
        },
    
        parentListFieldTitles: null,

        // 9 - Other web part options
        WebpartHeight: this.domElement.getBoundingClientRect().height ,
        WebpartWidth:  this.domElement.getBoundingClientRect().width - 50 ,
    
        // 1 - Analytics options  
        useListAnalytics: this.properties.useListAnalytics,
        analyticsWeb: strings.analyticsWeb,
        analyticsList: strings.analyticsList,
        
        // 9 - Other web part options
        webPartScenario: this.properties.webPartScenario, //Choice used to create mutiple versions of the webpart.
        showEarlyAccess: showEarlyAccess,

        pivotSize: this.properties.pivotSize,
        pivotFormat: this.properties.pivotFormat,
        pivotOptions: this.properties.pivotOptions,
        pivotTab: 'Projects', //this.properties.pivotTab (was setTab in pivot-tiles)

        // 6 - User Feedback:
        //progress: IMyProgress,

        /**
         * 2020-09-08:  Add for dynamic data refiners.   onRefiner0Selected  -- callback to update main web part dynamic data props.
         */

        //For DD

      }
    );

    ReactDom.render(element, this.domElement);

  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  /*
  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }
*/
  
  private async UpdateTitles(): Promise<boolean> {

    let listName = this.properties.parentListTitle ? this.properties.parentListTitle : 'ParentListTitle';
    const list = sp.web.lists.getByTitle(listName);
    const r = await list.fields();

    //2020-05-13:  Remove Active since it's replaced with StatusTMT which is not applicable here
    let defFields = ["Title","Author","Editor","Created","Modified"];
    let filterFields=["SSChoice1","SSChoiceA","MSChoice2","MSChoiceB"];
    let allFields = defFields.concat(filterFields);

    let fieldTitles = r.filter(f => f.Hidden !== true && allFields.indexOf(f.StaticName) > -1).map( 
      f => {return [f.StaticName,f.Title,f.Description,f.Required,f.FieldTypeKind];});
    
    //Update properties here:
    this.properties.fetchListFieldTitles = JSON.stringify(fieldTitles);

    console.log('list fields: ', r);
    console.log('fieldTitles: ', fieldTitles);
    
    return true;

  } 


  /***
  *         d8888b. d8888b.  .d88b.  d8888b.      d8888b.  .d8b.  d8b   db d88888b 
  *         88  `8D 88  `8D .8P  Y8. 88  `8D      88  `8D d8' `8b 888o  88 88'     
  *         88oodD' 88oobY' 88    88 88oodD'      88oodD' 88ooo88 88V8o 88 88ooooo 
  *         88~~~   88`8b   88    88 88~~~        88~~~   88~~~88 88 V8o88 88~~~~~ 
  *         88      88 `88. `8b  d8' 88           88      88   88 88  V888 88.     
  *         88      88   YD  `Y88P'  88           88      YP   YP VP   V8P Y88888P 
  *                                                                                
  *                                                                                
  */

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return propertyPaneBuilder.getPropertyPaneConfiguration(
      this.properties,
      this.context,
      this.onPropertyPaneFieldChanged.bind(this),
      this._getListDefintions.bind(this),
      //this.CreateTTIMTimeList.bind(this),
      //this.CreateTTIMProjectList.bind(this),
      //this.UpdateTitles.bind(this),

      );
  }

  
  //runAsync is an idea that is not currently being used.
  /**
   * 2021-03-06 Copied from Drilldown7 to CarrotCharts and GridCharts
   * @param forceUpdate 
   * @param runAsync 
   * @returns 
   */
   protected async _getListDefintions(forceUpdate: boolean, runAsync: boolean) {
    /**
     * This section is for Templated properties
     */

    let newMap = [];
    if ( !this.properties.newMap || forceUpdate === true ) { 
      console.log('GETTING LIST DEFINITIONS');
      let configWebURL = this.context.pageContext.site.absoluteUrl;
      configWebURL = configWebURL.substring( 0, configWebURL.indexOf('/sites/') );
      configWebURL += '/sites/PreConfigProps/';

      let thisProps: string[] = Object.keys( this.properties );

      let restFilterLD = '';

      if ( this.properties.webPartScenario !== '' && this.properties.webPartScenario != null ) {
        //newMap = getAllItems(configWebURL, 'DrilldownPreConfigProps', thisProps );
        restFilterLD = "webPartScenario eq '" + this.properties.webPartScenario + "'";
        console.log('_getListDefintions restFilterLD:', restFilterLD );
      }

      //Must remove 'newMap' from props because it's one can't be mapped.
      //let newMapIdx = thisProps.indexOf('newMap');
      //if (newMapIdx > -1) { thisProps.splice(newMapIdx, 1); }

      //if ( runAsync === true ) {
        newMap = await getAllItems(configWebURL, 'CarrotCharts', thisProps, restFilterLD, runAsync );
      //} else {
      //  newMap = getAllItems(configWebURL, 'DrilldownPreConfigProps', thisProps, runAsync );
      //}

      this.properties.newMap = newMap;
      console.log('this.properties.newMap:',  this.properties.newMap );

    } else {
      console.log('NOT GETTING LIST DEFINITIONS, already fetched:', this.properties.newMap);
      newMap = this.properties.newMap;

    }
    
    return newMap;
  }


  protected onPropertyPaneFieldChanged(propertyPath: string, oldValue: any, newValue: any): void {

      if ( this.properties.chartId && this.properties.chartId.length > 0 ) {} else { 
        this.properties.chartId = makeid( 7 ) ;
        this.context.propertyPane.refresh() ;
      }
      /**
       * 2021-03-06 Copied from Drilldown7 to CarrotCharts and GridCharts
       */
      if (propertyPath === 'listDefinition' && newValue !== oldValue) {

      let thisProps: string[] = Object.keys( this.properties );
      const hasValues = Object.keys(this.properties.newMap).length;

      if (hasValues !== 0) {
        /**
         * defIndex is the propertie's list item index that was found for this listDefinition.
         */
        let defIndex : any = doesObjectExistInArray(this.properties.newMap,'Title',newValue);
        if ( defIndex !== false ) {
          /**
           * thisProps is an array of of the keys of this webpart's 'properties' keys (properties)
           */
          thisProps.map( thisWebPartProp => {
            /**
             * Add columns here that are in the PreConfigProps list that should be ignored and are not an actual mapped property.
             * webPartScenario is an example which is a list column but is used to filter out what list items to load.
             */
            let ignoreTheseColumns = ['webPartScenario']; 

            if ( ignoreTheseColumns.indexOf( thisWebPartProp) > -1 ) {  
              console.log('not mapping this property: ', thisWebPartProp );

            } else if ( thisWebPartProp === 'listDefinition' ) { 
                console.log('thisWebPartProp === listDefinition:', defIndex, thisWebPartProp);
                this.properties[thisWebPartProp] = newValue;

            } else {
              /**
               * this.properties.newMap is the property defs loaded from the tenanat list.
               */
              if ( Object.keys(this.properties.newMap[defIndex]).indexOf(thisWebPartProp) < 0 ) {
                console.log('This thisWebPartProp is not to be mapped or updated:', thisWebPartProp );
              } else {
                /**
                 * At this point, we should only find current this.properties.keys( thisWebPartProp ) found in the newMap list as a column.
                 * 
                 * potentialValue is the value found in the list that should be set for this webpart prop.  Currently all are rich text fields.
                 */

                let potentialValue = this.properties.newMap[defIndex][thisWebPartProp] ? this.properties.newMap[defIndex][thisWebPartProp] : undefined;

                if ( potentialValue ) { //If value exists, continue

                  let typeOfPotentialValue = typeof potentialValue;
                  if ( typeOfPotentialValue === 'string') {
                    potentialValue = potentialValue.replace('\"','"'); //Replace any cases where I copied the hashed characters from JSON file directly.
                  }

                  if ( typeof this.properties[thisWebPartProp] === 'boolean') {
                    if ( potentialValue === "true" ) { potentialValue = true; }
                    else if ( potentialValue === "false" ) { potentialValue = false; }
                  }

                  /**
                   * Deal with special cases where potentialValue needs to be converted to an array first.
                   */
                  if ( ['rules0','rules1','rules2'].indexOf(thisWebPartProp) > -1 ) { //These should be arrays of strings

                    if ( potentialValue != null && potentialValue != undefined ) {
                      try {
                        potentialValue = JSON.parse(potentialValue);
                      } catch (e) {
                        alert('Hey!  Check the PreConfigProps list ' + thisWebPartProp + ' field.  It should be valid JSON array string, it currently is: ' + potentialValue + '  Drilldown7WebPart.ts onPropertyPaneFieldChanged');
                      }

                    } else { potentialValue = [] ; }

                    this.properties[thisWebPartProp] = potentialValue;

                  } else if ( this.properties[thisWebPartProp] !== potentialValue ) { //If values are different, then update
                      if ( potentialValue === '') { //If value is intentionally empty string, do the update
                        this.properties[thisWebPartProp] = potentialValue;
                      } else {
                        this.properties[thisWebPartProp] = potentialValue;
                      }
                  }

                }
              }
            }
          });
        } else {
          if ( newValue.toLowerCase() !== 'na') {
            alert('I think there is an error in onPropertyPaneFieldChanged:  \ndefIndex is false.\nCan\'t find listDefintion of ' + newValue);
          } else {
            console.log('I think there is an error in onPropertyPaneFieldChanged:  \ndefIndex is false.\nCan\'t find listDefintion of ' + newValue);
          }
        }
      } else {
        console.log('Did NOT List Defintion... updating column name props');
      }
      this.context.propertyPane.refresh();
    }

    /**
     * This section is used to determine when to refresh the pane options
     */
    let updateOnThese = [
      'setSize','setTab','otherTab','setTab','otherTab','setTab','otherTab','setTab','otherTab', '',

      'stressMultiplierTime', 'webPartScenario', '', '', '',

      'parentListTitle', 'parentListName', 'parentListWeb', 'sites', 'lists',

      'fetchCount', 'fetchCountMobile', 'restFilter', 'minDataDownload', '', '',  //Performance Settings

      'pivotSize', 'pivotFormat', 'pivotOptions', 'pivotTab', 'advancedPivotStyles',  //Pivot Style Settings (may not be needed)

      'dateColumn', 'valueColumn', 'valueType', 'valueOperator','dropDownColumns','searchColumns', 'metaColumns',  //List columns used for webpart

      'scaleMethod', //Specific to GridCharts Settings

      'carrotCats', 'carrotProps', 'carrotStyles', 'foamChartHeight', //Specific to CarrotSearch Settings

      'includeSum','includeCount','includeAvg','includeMax','includeMin', 'includeRange',  //Data Options Settings

      'rollHiearchy','changeLayout','changeTitles',  //UI Settings

      'foamAnimations', 'foamColors', 'foamBorders',  //Styling Settings
      
    ];

    //alert('props updated');
    console.log('onPropertyPaneFieldChanged:', propertyPath, oldValue, newValue);
    if (updateOnThese.indexOf(propertyPath) > -1 ) {
      this.properties[propertyPath] = newValue;
      this.context.propertyPane.refresh();

    } else { //This can be removed if it works

    }
    this.render();
  }

}
