import * as React from 'react';

import { IconButton, IIconProps, IContextualMenuProps, Stack, Link } from 'office-ui-fabric-react';

import { escape } from '@microsoft/sp-lodash-subset';

import { IDropdownOption,  } from "office-ui-fabric-react";

import { FoamTree } from "@carrotsearch/foamtree";




import { IFoamTree, IFoamTreeDataObject, IFoamTreeGroup } from '@mikezimm/npmfunctions/dist/IFoamTree';
import { doesObjectExistInArray, doesObjectExistInArrayInt } from '@mikezimm/npmfunctions/dist/arrayServices';
import { minInfinity, maxInfinity } from '@mikezimm/npmfunctions/dist/columnTypes';




import { getFakeFoamTreeData } from './FakeFoamTreeData';

import { buildFetchList } from './BuildFetchList';

import { getAllItems, IFoamTreeList, IFoamItemInfo } from './GetListData';



import Foamcontrol from './FoamComponent/FoamControl';
import stylesB from './CreateButtons.module.scss';


import styles from './Foamchart.module.scss';
import { IFoamchartProps } from './IFoamchartProps';
import { IFoamchartState } from './IFoamchartState';


export default class Foamchart extends React.Component<IFoamchartProps, IFoamchartState> {

  public constructor(props:IFoamchartProps){
    super(props);

    //function buildFetchList( pageContext: PageContext, webURL: string, listName: string, listTitle: string, isLibrary: boolean, dropDownColumns : any[] ) {
    //let fetchInfo  : any = buildFetchList( this.props.pageContext, this.props.webURL, this.props.listName, this.props.listTitle, false, [] );

    //returns:  fetchInfo = { fetchList: fetchList, selectedDropdowns: selectedDropdowns, };
    let fetchInfo  : any = buildFetchList( this.props.pageContext, this.props.parentListWeb, this.props.listName, this.props.parentListTitle, false, this.props.performance,
         this.props.dropDownColumns, this.props.searchColumns, this.props.metaColumns, [this.props.dateColumn], [this.props.valueColumn] );

    let foamtree : any = getFakeFoamTreeData( true, 90 );

    let errMessage = '';
    this.state = { 

          //Size courtesy of https://www.netwoven.com/2018/11/13/resizing-of-spfx-react-web-parts-in-different-scenarios/
          WebpartHeight: this.props.WebpartElement ? this.props.WebpartElement.getBoundingClientRect().height : 1,
          WebpartWidth:  this.props.WebpartElement ? this.props.WebpartElement.getBoundingClientRect().width : 1,

          dataKey: 'x',
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

          foamTreeData: foamtree,

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

    let foamControl = this.state.allLoaded !== true ? null : <Foamcontrol  
        WebpartElement = { this.props.WebpartElement }   //Size courtesy of https://www.netwoven.com/2018/11/13/resizing-of-spfx-react-web-parts-in-different-scenarios/

        dataKey = { this.state.dataKey }
        foamTreeData = { this.state.allLoaded === true ? this.state.foamTreeData : null } //
        generateSample = { false }  //Gets random sample data

        pageContext = { this.props.pageContext }
        wpContext = {this.props.wpContext }

        tenant = {this.props.tenant }
        urlVars = { [] }

        // 1 - Analytics options
        WebpartHeight = { this.state.WebpartHeight }    //Size courtesy of https://www.netwoven.com/2018/11/13/resizing-of-spfx-react-web-parts-in-different-scenarios/
        WebpartWidth = { this.state.WebpartWidth }     //Size courtesy of https://www.netwoven.com/2018/11/13/resizing-of-spfx-react-web-parts-in-different-scenarios/</div>
      />;

      const defCommandIconStyles : any = {
        root: {padding:'10px !important', height: 32},//color: 'green' works here
        icon: { 
          fontSize: 18,
          fontWeight: "normal",
          margin: '0px 2px',
          color: '#00457e', //This will set icon color
       },
      };

      let button = <div className= {stylesB.buttons} id={ 'NoID' }>
      <IconButton iconProps={{ iconName: 'Cat' }} 
        text= { 'parent component' }
        title= { 'titleText'} 
        //uniqueId= { titleText } 
        //data= { titleText } 
        //key= { titleText } 
        //ariaLabel= { titleText } 
        disabled={false} 
        checked={false}
        onClick={ this._onClick.bind(this) }
        styles={ defCommandIconStyles }
        />
      </div>;

    return (
      <div className={ styles.foamchart }>
        <div className={ styles.container }>
          { button }
          { foamControl }
        </div>
      </div>
    );
  }


  private _onClick () {
    let foamtree : any = getFakeFoamTreeData( true, 90 );
    this.setState({ dataKey: this.state.dataKey + '1', foamTreeData: foamtree });
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

      let foamTreeData = this.buildGroupData( fetchList, allItems );

      //let foamTreeData: IFoamTree = null; //this.buildGridData (fetchList, theseItems);
      // let foamTreeData : any = getFakeFoamTreeData( true, 90 );
      foamTreeData.id ="visualization";
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


   private buildGroupData ( fetchList: IFoamTreeList, allItems : IFoamItemInfo[] ) {

    let count = allItems.length;

    let allDataPoints : any[] = [];

    let groups: IFoamTreeGroup[] = [];
    let groupsXStrings: string[][] = [];

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

    let valueOperator = this.props.valueOperator.toLowerCase() ;

/*
    allItems.map( item => {

      //item.meta.push( item.year.toString() ) ;

      //item.searchString += 'yearMonth=' + item.yearMonth + '|||' + 'yearWeek=' + item.yearWeek + '|||' + 'year=' + item.year + '|||' + 'week=' + item.week + '|||';

      let valueColumn = item[ this.props.valueColumn ];
      let valueType = typeof valueColumn;

      if ( valueType === 'string' ) { valueColumn = parseFloat( valueColumn ) ; }
      else if ( valueType === 'number' ) { valueColumn = parseFloat( valueColumn ) ; }
      else if ( valueType === 'boolean' ) { valueColumn = valueColumn === true ? 1 : 0 ; }
      else if ( valueType === 'object' ) { valueColumn = 0 ; }
      else if ( valueType === 'undefined' ) { valueColumn = 0 ; }
      else if ( valueType === 'function' ) { valueColumn = 0 ; }
    });

    */

    //Get first group tier
    let hiearchy = ['Story', 'Chapter'];
    let start = new Date();

    let result = this.buildHiearchyGroups( allItems, [], hiearchy, 0 );
    let finalGroups = this.buildGroupWeights ( result.allItems, result.groups, 0, 'sum' ) ;
    console.log('finalGroups: ', finalGroups );
    let end = new Date();
    console.log( 'CALCULATION TIME (ms) = ' + ( end.getTime() - start.getTime() ) );

    let foamTree : IFoamTree = getFakeFoamTreeData( true, 90 );
    foamTree.dataObject.groups = finalGroups; 
    return foamTree;

  }

  private updateStandardValues ( thisGroupX: IFoamTreeGroup, valueColumn: number ) {

    thisGroupX.weight ++ ;
    thisGroupX.count ++ ;
    thisGroupX.sum = thisGroupX.sum ? thisGroupX.sum + valueColumn : valueColumn;
    thisGroupX.min = !thisGroupX.min || valueColumn < thisGroupX.min ? valueColumn : thisGroupX.min;
    thisGroupX.max = !thisGroupX.max || valueColumn > thisGroupX.max ? valueColumn : thisGroupX.max;

    return thisGroupX;
  }

  private buildGroupWeights ( allItems: IFoamItemInfo[], groups: IFoamTreeGroup[], tHI: number, operator: string ) { //removed hiearchy: string[], 

    allItems.map( item => {

      //Copied section from GridCharts VVVV
      let valueColumn = item[ this.props.valueColumn ];
      let valueType = typeof valueColumn;

      if ( valueType === 'string' ) { valueColumn = parseFloat( valueColumn ) ; }
      else if ( valueType === 'number' ) { valueColumn = parseFloat( valueColumn ) ; }
      else if ( valueType === 'boolean' ) { valueColumn = valueColumn === true ? 1 : 0 ; }
      else if ( valueType === 'object' ) { valueColumn = 0 ; }
      else if ( valueType === 'undefined' ) { valueColumn = 0 ; }
      else if ( valueType === 'function' ) { valueColumn = 0 ; }
      //Copied section from GridCharts ^^^^

      let thisGroup0 = null;
      let thisGroup1 = null;
      let thisGroup2 = null;

      if ( item.groupIndexs.length > 0 ) {
        thisGroup0 = groups[ item.groupIndexs[0] ] ;
        thisGroup0 = this.updateStandardValues( thisGroup0, valueColumn );

      }
      if ( item.groupIndexs.length > 1 ) {
        thisGroup1 = thisGroup0.groups[ item.groupIndexs[1] ] ;
        thisGroup1 = this.updateStandardValues( thisGroup1, valueColumn );
      }
      if ( item.groupIndexs.length > 2 ) {
        thisGroup2 = thisGroup1.groups[ item.groupIndexs[2] ] ;
        thisGroup2 = this.updateStandardValues( thisGroup2, valueColumn );

      }

    }); 

    groups = this.updateGroupAvg( groups ) ;
    groups = this.setGroupWeight( groups, operator ) ;
    return groups;

  }

  private setGroupWeight( groups: IFoamTreeGroup[], operator: string ) {
    groups.map( group => {
      group.weight = group[operator];
      if ( group.groups.length > 0 ) { group.groups = this.setGroupWeight( group.groups, operator ) ; }
    });
    return groups;
  }

  private updateGroupAvg( groups: IFoamTreeGroup[] ) {
    groups.map( group => {
      if ( group.count > 0 ) { group.avg = group.sum / group.count; } 
      if ( group.groups.length > 0 ) { group.groups = this.updateGroupAvg( group.groups ) ; }
    });
    return groups;
  }

  private buildHiearchyGroups ( allItems: IFoamItemInfo[], groups: IFoamTreeGroup[], hiearchy: string[], tHI: number ) {

    allItems.map( item => {
      item.groupIndexs = [];
      let result = this.buildHiearchyGroupsForItem(item, groups, hiearchy, tHI );
      groups = result.groups;
      item = result.item;
    }); 

    console.log( 'buildHiearchyGroups' , allItems, groups );
    return { allItems: allItems, groups: groups } ;

  }

  //groups.push( this.createDefaultGroup( h ) ); }
  private createDefaultGroup( label: any, weight: number = 0, count: number = 0, sum: number = 0, avg: number = 0, min: number = maxInfinity, max: number = minInfinity ) {
    if ( typeof label !== 'string' ) { label = label.toString(); }
    let newGroup : IFoamTreeGroup = { label: label, weight: weight, count: count, sum: sum, avg: avg, min: min , groups: [] };
    return newGroup;
  }

  private buildHiearchyGroupsForItem ( item: IFoamItemInfo, groups: IFoamTreeGroup[], hiearchy: string[], tHI: number ) {

    let thisHiearchyValue : any = item[hiearchy[ tHI ]];
    //if ( thisHiearchyValue === undefined ) { thisHiearchyValue = 'undefined' ; } else if ( thisHiearchyValue === null ) { thisHiearchyValue = 'null' ; }
    if ( thisHiearchyValue === undefined ) { thisHiearchyValue = 'No ' + hiearchy[ tHI ] ; } else if ( thisHiearchyValue === null ) { thisHiearchyValue = 'No ' + hiearchy[ tHI ] ; }
    if ( thisHiearchyValue ) {

      //This returns boolean (false) or string of the index number.... switch to any so typescript doesn't balk.
      let thisGroupIndex : number = doesObjectExistInArrayInt(groups, 'label', thisHiearchyValue, true ) ; // groups[ tHI ].indexOf( thisHiearchyValue ) ;
      if ( thisGroupIndex < 0 ) {
        groups.push( this.createDefaultGroup( thisHiearchyValue ) );
        thisGroupIndex = groups.length -1;
      }
      item.groupIndexs.push( thisGroupIndex );
      let childGroups = groups[ thisGroupIndex ].groups ;

      if ( ( tHI + 1 ) < hiearchy.length ) { 
        let result = this.buildHiearchyGroupsForItem(item, childGroups, hiearchy, tHI + 1,  ) ; 
        item = result.item;
        groups['groups'] = result.groups;

      }
    }

    return { item: item, groups: groups } ;

  }

}


