import * as React from 'react';
import styles from './Foamchart.module.scss';
import { IFoamchartProps } from './IFoamchartProps';
import { IFoamchartState } from './IFoamchartState';


import { escape } from '@microsoft/sp-lodash-subset';

import { IDropdownOption,  } from "office-ui-fabric-react";

import { getFakeFoamTreeData } from './FakeFoamTreeData';

import { buildFetchList } from './BuildFetchList';

import { FoamTree } from "@carrotsearch/foamtree";

import { IFoamTree, IFoamTreeDataObject } from '@mikezimm/npmfunctions/dist/IFoamTree';

import { getAllItems, IFoamTreeList, IFoamItemInfo } from './GetListData';

import Foamcontrol from './FoamComponent/FoamControl';

export default class Foamchart extends React.Component<IFoamchartProps, IFoamchartState> {

  public constructor(props:IFoamchartProps){
    super(props);

    //function buildFetchList( pageContext: PageContext, webURL: string, listName: string, listTitle: string, isLibrary: boolean, dropDownColumns : any[] ) {
    //let fetchInfo  : any = buildFetchList( this.props.pageContext, this.props.webURL, this.props.listName, this.props.listTitle, false, [] );

    //returns:  fetchInfo = { fetchList: fetchList, selectedDropdowns: selectedDropdowns, };
    let fetchInfo  : any = buildFetchList( this.props.pageContext, this.props.parentListWeb, this.props.listName, this.props.parentListTitle, false, this.props.performance,
         this.props.dropDownColumns, this.props.searchColumns, this.props.metaColumns, [this.props.dateColumn], [this.props.valueColumn] );

    let errMessage = '';
    this.state = { 

          //Size courtesy of https://www.netwoven.com/2018/11/13/resizing-of-spfx-react-web-parts-in-different-scenarios/
          WebpartHeight: this.props.WebpartElement ? this.props.WebpartElement.getBoundingClientRect().height : 1,
          WebpartWidth:  this.props.WebpartElement ? this.props.WebpartElement.getBoundingClientRect().width : 1,

          timeSliderScale: [ 'Weeks', 'Years', 'Months', 'WeekNo'],
          currentTimeScale: 'Weeks',

          choiceSliderValue: 0,
          breadCrumb: [],
          choiceSliderDropdown: null,
          showChoiceSlider: false,

          dropdownColumnIndex: null,

          selectedYear: null,
          selectedUser: null,
          selectedDropdowns: fetchInfo.selectedDropdowns,
          dropDownItems: [],

          foamTreeData: null,

          fetchList: fetchInfo.fetchList,

          bannerMessage: null,
          showTips: false,

          allLoaded: false,

          allItems: [],
          searchedItems: [],

          first20searchedItems: [],
          searchCount: 0,

          meta: [],

          searchMeta: null, // [pivCats.all.title],
          searchText: '',

          errMessage: errMessage,
          
          pivotCats: [],

          lastStateChange: 'Loading',
          stateChanges: [],
    };

    // because our event handler needs access to the component, bind 
    //  the component to the function so it can get access to the
    //  components properties (this.props)... otherwise "this" is undefined
    //  If you do not do this here, then you need to pass the entire function.bind(this) to functions.
    // this.onLinkClick = this.onLinkClick.bind(this);

  
  }

  public componentDidMount() {

      getAllItems( this.state.fetchList, this.addTheseItemsToState.bind(this), null, null );

  }
  
  /***
*         d8888b. d888888b d8888b.      db    db d8888b. d8888b.  .d8b.  d888888b d88888b 
*         88  `8D   `88'   88  `8D      88    88 88  `8D 88  `8D d8' `8b `~~88~~' 88'     
*         88   88    88    88   88      88    88 88oodD' 88   88 88ooo88    88    88ooooo 
*         88   88    88    88   88      88    88 88~~~   88   88 88~~~88    88    88~~~~~ 
*         88  .8D   .88.   88  .8D      88b  d88 88      88  .8D 88   88    88    88.     
*         Y8888D' Y888888P Y8888D'      ~Y8888P' 88      Y8888D' YP   YP    YP    Y88888P 
*                                                                                         
*                                                                                         
*/

  public componentDidUpdate(prevProps) {

    let reloadData : any = false;
    let refreshMe : any = false;

    let reloadOnThese = [
      'stressMultiplierTime', 'webPartScenario', '', '', '',
      'parentListTitle', 'parentListName', 'parentListWeb', '', '',
      'dateColumn', 'valueColumn', 'valueType', 'valueOperator','dropDownColumns',
    ];

    let reloadOnPerformance = [ 'fetchCount', 'fetchCountMobile', 'restFilter', 'minDataDownload' ] ;

    let refreshOnThese = [
      'setSize','setTab','otherTab','setTab','otherTab','setTab','otherTab','setTab','otherTab', '',
      'pivotSize', 'pivotFormat', 'pivotOptions', 'pivotTab', 'advancedPivotStyles', 'gridStyles',
    ];

    reloadOnThese.map( key => {
      if ( prevProps[key] !== this.props[key] ) { reloadData = true; }
    });

    reloadOnPerformance.map ( key => {
      if ( prevProps.performance[key] !== this.props.performance[key] ) { reloadData = true; }
    });

    if (reloadData === false) {
      refreshOnThese.map( key => {
        if ( prevProps[key] !== this.props[key] ) { refreshMe = true; }
      });
    }

    if (reloadData === true) {

      let fetchInfo  : any = buildFetchList( this.props.pageContext, this.props.parentListWeb, this.props.listName, this.props.parentListTitle, false, this.props.performance,
        this.props.dropDownColumns, this.props.searchColumns, this.props.metaColumns, [this.props.dateColumn], [this.props.valueColumn] );

      this.setState({
        /*          */
        fetchList: fetchInfo.fetchList,
        selectedDropdowns: fetchInfo.selectedDropdowns,
      });

      getAllItems( fetchInfo.fetchList, this.addTheseItemsToState.bind(this), null, null );

    }

  }
  
  public componentWillUnmount() {

  }

  public render(): React.ReactElement<IFoamchartProps> {

    return (
      <div className={ styles.foamchart }>
        <div className={ styles.container }>

        <Foamcontrol  
            WebpartElement = { this.props.WebpartElement }   //Size courtesy of https://www.netwoven.com/2018/11/13/resizing-of-spfx-react-web-parts-in-different-scenarios/

            foamTreeData = { null } //
            generateSample = {true }  //Gets random sample data

            pageContext = { this.props.pageContext }
            wpContext = {this.props.wpContext }
        
            tenant = {this.props.tenant }
            urlVars = { [] }

            // 1 - Analytics options
            WebpartHeight = { this.state.WebpartHeight }    //Size courtesy of https://www.netwoven.com/2018/11/13/resizing-of-spfx-react-web-parts-in-different-scenarios/
            WebpartWidth = { this.state.WebpartWidth }     //Size courtesy of https://www.netwoven.com/2018/11/13/resizing-of-spfx-react-web-parts-in-different-scenarios/</div>
          ></Foamcontrol>
        </div>
      </div>
    );
  }



  /***
 *     .d8b.  d8888b. d8888b.      d888888b d888888b d88888b .88b  d88. .d8888.      d888888b  .d88b.       .d8888. d888888b  .d8b.  d888888b d88888b 
 *    d8' `8b 88  `8D 88  `8D        `88'   `~~88~~' 88'     88'YbdP`88 88'  YP      `~~88~~' .8P  Y8.      88'  YP `~~88~~' d8' `8b `~~88~~' 88'     
 *    88ooo88 88   88 88   88         88       88    88ooooo 88  88  88 `8bo.           88    88    88      `8bo.      88    88ooo88    88    88ooooo 
 *    88~~~88 88   88 88   88         88       88    88~~~~~ 88  88  88   `Y8b.         88    88    88        `Y8b.    88    88~~~88    88    88~~~~~ 
 *    88   88 88  .8D 88  .8D        .88.      88    88.     88  88  88 db   8D         88    `8b  d8'      db   8D    88    88   88    88    88.     
 *    YP   YP Y8888D' Y8888D'      Y888888P    YP    Y88888P YP  YP  YP `8888Y'         YP     `Y88P'       `8888Y'    YP    YP   YP    YP    Y88888P 
 *                                                                                                                                                    
 *                                                                                                                                                    
 */


    private addTheseItemsToState( fetchList: IFoamTreeList, theseItems , errMessage : string, allNewData : boolean = true ) {

      if ( theseItems.length < 300 ) {
          console.log('addTheseItemsToState theseItems: ', theseItems);
      } {
          console.log('addTheseItemsToState theseItems: QTY: ', theseItems.length );
      }

      let allItems = allNewData === false ? this.state.allItems : theseItems;

      let foamTreeData: IFoamTree = null; //this.buildGridData (fetchList, theseItems);

      let dropDownItems : IDropdownOption[][] = allNewData === true ? this.buildDataDropdownItems( fetchList, allItems ) : this.state.dropDownItems ;

      this.setState({
        /*          */
          allItems: allItems,
          searchedItems: theseItems, //newFilteredItems,  //Replaced with theseItems to update when props change.
          searchCount: theseItems.length,
          dropDownItems: dropDownItems,
          errMessage: errMessage,
          searchText: '',
          searchMeta: [],
          fetchList: fetchList,
          foamTreeData: foamTreeData,
          allLoaded: true,

      });

      return true;

    }

    /**
     * 
     * 
     * Another implimentation from this react sample:  https://github.com/atlanteh/react-native-slot-machine
     * 
      constructor(props) {
          super(props);
          this.state = {duration: 4000, slot1: 1234, slot2: 'hello', slot3: '2351'};
      }

      componentDidMount() {
          setTimeout(() => this.setState({duration: 1000, slot1: '4321', slot2: 'world', slot3: '1234'}), 5000);
          setTimeout(() => this.setState({duration: 4000, slot1: '1234', slot2: 'hello', slot3: '2351'}), 7000);
          setTimeout(() => this.refs.slot.spinTo('prize'), 12000);
      }
     */
    
    private buildDataDropdownItems( fetchList: IFoamTreeList, allItems : IFoamItemInfo[] ) {

    let dropDownItems : IDropdownOption[][] = [];

    this.props.dropDownColumns.map( ( col, colIndex ) => {

      let actualColName = col.replace('>', '' ).replace('+', '' ).replace('-', '' );
      let parentColName = colIndex > 0 && col.indexOf('>') > -1 ? this.props.dropDownColumns[colIndex - 1] : null;
      parentColName = parentColName !== null ? parentColName.replace('>', '' ).replace('+', '' ).replace('-', '' ) : null;

      let thisColumnChoices : IDropdownOption[] = [];
      let foundChoices : string[] = [];
      allItems.map( item => {
        let thisItemsChoices = item[ actualColName ];
        if ( actualColName.indexOf( '/') > -1 ) {
          let parts = actualColName.split('/');
          thisItemsChoices = item[ parts[0] ] ? item[ parts[0] ] [parts[1]] :  `. missing ${ parts[0] }`;
        }
        if ( parentColName !== null ) { thisItemsChoices = item[ parentColName ] + ' > ' + item[ actualColName ] ; }
        if ( thisItemsChoices && thisItemsChoices.length > 0 ) {
          if ( foundChoices.indexOf( thisItemsChoices ) < 0 ) {
            if ( thisColumnChoices.length === 0 ) { thisColumnChoices.push( { key: '', text: '- all -' } ) ; }
            thisColumnChoices.push( { key: thisItemsChoices, text: thisItemsChoices } ) ;
            foundChoices.push( thisItemsChoices ) ;
          }
        }
      });

      dropDownItems.push( thisColumnChoices ) ;

    });

    return dropDownItems;

    }



    /***
    *    d8888b. db    db d888888b db      d8888b.       d888b  d8888b. d888888b d8888b.      d8888b.  .d8b.  d888888b  .d8b.  
    *    88  `8D 88    88   `88'   88      88  `8D      88' Y8b 88  `8D   `88'   88  `8D      88  `8D d8' `8b `~~88~~' d8' `8b 
    *    88oooY' 88    88    88    88      88   88      88      88oobY'    88    88   88      88   88 88ooo88    88    88ooo88 
    *    88~~~b. 88    88    88    88      88   88      88  ooo 88`8b      88    88   88      88   88 88~~~88    88    88~~~88 
    *    88   8D 88b  d88   .88.   88booo. 88  .8D      88. ~8~ 88 `88.   .88.   88  .8D      88  .8D 88   88    88    88   88 
    *    Y8888P' ~Y8888P' Y888888P Y88888P Y8888D'       Y888P  88   YD Y888888P Y8888D'      Y8888D' YP   YP    YP    YP   YP 
    *                                                                                                                          
    *                                                                                                                          
    */


   private buildGridData ( fetchList: IFoamTreeList, allItems : IFoamItemInfo[] ) {

    let count = allItems.length;

    let allDataPoints : any[] = [];

    /**
     * Get entire date range
     * miliseconds for "2021-01-31" is 1612127321000
     * 
     * 1012127321000; 
     * 1612127321000
     */

    let firstTime = 2512127321000; 
    let lastTime = 1012127321000;
    let firstDate = "";
    let lastDate = "";

    allItems.map( item => {
      let theStartTimeMS = item['time' + this.props.dateColumn ].milliseconds;
      let theStartTimeStr = item['time' + this.props.dateColumn ].theTime;

      if ( theStartTimeMS > lastTime ) { 
        lastTime = theStartTimeMS ; 
        lastDate = theStartTimeStr ; }

      if ( theStartTimeMS < firstTime ) { 
        firstTime = theStartTimeMS ; 
        firstDate = theStartTimeStr ; }

    });

    let startDate = new Date( firstDate );
    // let gridStart = this.getOffSetDayOfWeek( firstDate, 7, 'prior' ); //This gets prior sunday

    let valueOperator = this.props.valueOperator.toLowerCase() ;

    allItems.map( item => {
      let itemDateProp = item['time' + this.props.dateColumn ];
      let itemDateDate = new Date( itemDateProp.theTime );
      let itemDate = itemDateDate.toLocaleDateString();

      item.dateNo = itemDateProp.date;
      item.dayNo = itemDateProp.day;
      item.week = itemDateProp.week;
      item.month = itemDateProp.month;
      item.year = itemDateProp.year;

      item.meta.push( item.yearMonth ) ;
      item.meta.push( item.yearWeek ) ;
      item.meta.push( item.year.toString() ) ;

      item.searchString += 'yearMonth=' + item.yearMonth + '|||' + 'yearWeek=' + item.yearWeek + '|||' + 'year=' + item.year + '|||' + 'week=' + item.week + '|||';

      let valueColumn = item[ this.props.valueColumn ];
      let valueType = typeof valueColumn;

      if ( valueType === 'string' ) { valueColumn = parseFloat( valueColumn ) ; }
      else if ( valueType === 'number' ) { valueColumn = parseFloat( valueColumn ) ; }
      else if ( valueType === 'boolean' ) { valueColumn = valueColumn === true ? 1 : 0 ; }
      else if ( valueType === 'object' ) { valueColumn = 0 ; }
      else if ( valueType === 'undefined' ) { valueColumn = 0 ; }
      else if ( valueType === 'function' ) { valueColumn = 0 ; }
    });

    let foamTree: IFoamTree = null;

    return foamTree;

    }


}
