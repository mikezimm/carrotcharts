import * as React from 'react';
import styles from './Foamcontrol.module.scss';
import { IFoamcontrolProps } from './IFoamProps';
import { IFoamcontrolState } from './IFoamState';

import { escape } from '@microsoft/sp-lodash-subset';

import { Spinner, SpinnerSize, SpinnerLabelPosition } from 'office-ui-fabric-react/lib/Spinner';
import { Stack, IStackStyles, IStackTokens } from 'office-ui-fabric-react/lib/Stack';

import {
  MessageBar,
  MessageBarType,
  SearchBox,
  Icon,
  Label,
  Pivot,
  PivotItem,
  PivotLinkFormat,
  PivotLinkSize,
  Dropdown,
  IDropdownOption,
} from "office-ui-fabric-react";
import { IconButton, IIconProps, IContextualMenuProps, Link } from 'office-ui-fabric-react';

import { FoamTree } from "@carrotsearch/foamtree";

import { IFoamTree, IFoamTreeDataObject, IFoamTreeGroup } from '@mikezimm/npmfunctions/dist/CarrotCharts/IFoamTree';
import { FoamTreeLayouts, FoamTreeFillType, FoamTreeStacking, RolloutStartPoint, RolloutMethod } from '@mikezimm/npmfunctions/dist/CarrotCharts/IFoamTree';

import { getNextElementInArray } from '@mikezimm/npmfunctions/dist/Services/Arrays/services';
import { doesObjectExistInArray, getKeySummary, getKeyChanges } from '@mikezimm/npmfunctions/dist/Services/Arrays/checks';
import { sortObjectArrayByStringKey } from '@mikezimm/npmfunctions/dist/Services/Arrays/sorting';

import { IFoamTreeList, IFoamItemInfo } from '../GetListData';

import { getFakeFoamTreeData, getFakeFoamTreeGroups, fakeGroups1, getEmptyFoamTreeData } from '../FakeFoamTreeData';

import { getTotalGroupWeight, buildGroupData } from './FoamFunctions';

import stylesB from '../CreateButtons.module.scss';

export default class Foamcontrol extends React.Component<IFoamcontrolProps, IFoamcontrolState> {
  private foamtreeData: any = getEmptyFoamTreeData( );
  
  private foamtree = null;

  private sbPlaceHolder = "Search items";
  private chartId = this.props.chartId;
  private bC0 = "breadCrumb0" + this.chartId;
  private bC1 = "breadCrumb1" + this.chartId;
  private bCSort = "breadCrumbSort" + this.chartId;
  private bCOper = "breadCrumbOperator" + this.chartId;
  private bCScale = "breadCrumbScale" + this.chartId;
  private bCUnit = "breadCrumbUnits" + this.chartId;
  private bCSum = "breadCrumbSummary" + this.chartId;

  private buttonFW = "buttonFoward" + this.chartId;
  private buttonREV = "buttonReverse" + this.chartId;
  private buttonSum = "buttonSum" + this.chartId;
  private buttonCnt = "buttonCount" + this.chartId;
  private buttonAvg = "buttonAvg" + this.chartId;
  private buttonMax= "buttonMax" + this.chartId;
  private buttonMin= "buttonMin" + this.chartId;
  private buttonRng= "buttonRange" + this.chartId;

  private buttonOperators = [ this.buttonSum, this.buttonCnt, this.buttonAvg, this.buttonMax, this.buttonMin, this.buttonRng ];

  public constructor(props:IFoamcontrolProps){
    super(props);

    console.log( 'CONSTRUCTOR this.props.foamTreeData', this.props.foamTreeData );
    let errMessage = '';
    this.state = { 

        selectedDropdowns: [], //array of selected choices for dropdowns
        dropDownItems: [], //array of array of options for selected dropdown fields

        searchCount: 0,

        searchText: '',
        searchMeta: [],

        searchedItems: [],
        
        first20searchedItems: [],

        allItems: this.props.allItems,

        meta: [],

        errMessage: '',

        lastStateChange: '',
        stateChanges: [], //Log of state changes into array

    };

    // because our event handler needs access to the component, bind 
    //  the component to the function so it can get access to the
    //  components properties (this.props)... otherwise "this" is undefined
    //  If you do not do this here, then you need to pass the entire function.bind(this) to functions.
    // this.onLinkClick = this.onLinkClick.bind(this);

  
  }

  private updateBreadCrumbGroups( order: 'asc' | 'dec' ){

    let newCats : string[] = JSON.parse(JSON.stringify(this.props.fetchList.carrotCats));
    
    if ( this.props.foamOptions.rollHiearchy !== true ) {
      document.getElementById( this.buttonFW ).style.display = 'none';
      document.getElementById( this.buttonREV ).style.display = 'none';

    } else if ( order === 'dec') { 
      newCats.reverse() ;
      document.getElementById( this.buttonFW ).style.display = '';
      document.getElementById( this.buttonREV ).style.display = 'none';

    } else {
      document.getElementById( this.buttonFW ).style.display = 'none';
      document.getElementById( this.buttonREV ).style.display = '';

    }

    document.getElementById( this.bC0 ).innerText = ' > ' + newCats[0];
    if ( newCats.length > 1 ) {
      document.getElementById( this.bC1 ).innerText = ' >' + newCats[1];
      document.getElementById( this.bC1 ).style.display = '';
    } else {

    }


  }

 
  private initializeBreadCrumb() {

    document.getElementById( this.bCSort ).innerText = 'Normal sort';
    document.getElementById( this.bCUnit ).innerText = this.props.fetchList.valueColumn;

    document.getElementById( this.bCOper ).innerText = this.props.fetchList.valueOperator;

    document.getElementById( this.bCScale ).style.display = 'none';

    document.getElementById( this.bCUnit ).innerText = ' of ' + this.props.fetchList.valueColumn;

    document.getElementById( this.bCSum ).style.display = 'none';

    this.updateBreadCrumbGroups( 'asc' );

  }
  public componentDidMount() {
    console.log( 'DID MOUNT this.props.foamTreeData', this.props.foamTreeData );
    this.foamtree = new FoamTree( this.foamtreeData );
    this.addTheseItemsToState();
    this.initializeBreadCrumb();

    return true;

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

    let refreshMe : any = false;
    console.log( 'DID UPDATE this.props.foamTreeData', this.props.foamTreeData );
    //this.tryForEachGroup( );
    //return;
    
    let refreshOnThese = [
      'foamTreeData',
    ];

    if (refreshMe === false) {
      refreshOnThese.map( key => {
        if ( prevProps[key] !== this.props[key] ) { refreshMe = true; }
      });
    }

    if (refreshMe === true) {
      //this.addTheseItemsToState();

      if ( this.foamtree === null ) {
        this.addTheseItemsToState();
      } else {
        const dataObject = this.foamtree.get("dataObject");

        dataObject.groups = this.props.foamTreeData.dataObject.groups;

        this.foamtree.update();
      }

    }

  }
  
  public componentWillUnmount() {
    console.log( 'WILL UNMOUNT this.props.foamTreeData', this.props.foamTreeData );
    this.foamtree.dispose();
    //this.tryFoamTree(1,10);
  }
  /* */
  /*
  render() {
    return <div style={{height: "100%"}} ref={e => this.element = e}></div>;
  }
  */

  public render(): React.ReactElement<IFoamcontrolProps> {

    let foamOptions = this.props.foamOptions;
    let foamStyles = this.props.foamStyles;
    let foamData = this.props.foamData;

    let searchStack = null;
    let x = this.props.WebpartWidth > 0 ? ( this.props.WebpartWidth -30 ) + "px" : "500px";
    let y = this.props.foamStyles.foamChartHeight > 0 ? this.props.foamStyles.foamChartHeight + "px" : "500px";
    /*
    let spinner = null;
    if ( this.props.foamTreeData.dataObject.groups.length === 0 ) { 
      y = '1px';
      spinner = <div style={{ width: this.props.WebpartWidth, height: '500px', position: 'absolute', top: '50%', left: '42%' }}>
      <Spinner 
        size={SpinnerSize.large}
        label={ 'Loading data' }
        labelPosition='left'
      ></Spinner>
    </div> ;
    }
*/

      const defCommandIconStyles : any = {
          root: {padding:'10px !important', height: 32},//color: 'green' works here
          icon: { 
            fontSize: 18,
            fontWeight: "normal",
            margin: '0px 2px',
            color: '#00457e', //This will set icon color
        },
      };

      let butOriginal = <div className= {stylesB.buttons} id={ 'NoID' }>
      <IconButton iconProps={{ iconName: 'WebAppBuilderFragment' }} 
        //text= { 'parent component' }
        //title= { 'titleText'} 
        onClick={ this._onLayout.bind(this) }
        styles={ defCommandIconStyles }
        /><span style={{display: 'none'}} id={ 'layout' + this.chartId }>{ this.props.foamTreeData.layout }</span>
      </div>;

      let butLayout = <div className= {stylesB.buttons} id={ 'butLayout' + this.chartId } style={{ display: foamOptions.changeLayout === true ? '' : 'none' }}>
            <IconButton iconProps={{ iconName: 'WebAppBuilderFragment' }} onClick={ this._onLayout.bind(this) } styles={ defCommandIconStyles } /></div>;

      let butStacking = <div className= {stylesB.buttons} id={ 'butStacking' + this.chartId } style={{ display: foamOptions.changeTitles === true ? '' : 'none' }}>
            <IconButton iconProps={{ iconName: 'Header' }} onClick={ this._onStacking.bind(this) } styles={ defCommandIconStyles } /></div>;


/*
      foamStyles: {
            foamChartHeight: number;  //Fixed number of pixels for the foam rendering
            foamAnimations: string[];
            foamColors: string[];
            foamBorders: string[];
      };
*/


      let searchElements = [];
      let choiceSlider = null;
      /**
       * Add Dropdown search
       */
        if ( this.props.dropDownItems.length > 0 ) {

          searchElements = this.props.dropDownItems.map( ( dropDownChoices, index ) => {

              let dropDownSort = this.props.fetchList.dropDownSort[ index ];
              let dropDownChoicesSorted = dropDownSort === '' ? dropDownChoices : sortObjectArrayByStringKey( dropDownChoices, dropDownSort, 'text' );
              let DDLabel = this.getDefaultDDLabel(index);
              return <div id={ 'DDIndex' + index + this.chartId }><Dropdown
                  placeholder={ `Select a ${ DDLabel }` }
                  label={ DDLabel }
                  options={dropDownChoicesSorted}
                  //selectedKey={ this.state.selectedDropdowns [index ] === '' ? null : this.state.selectedDropdowns [ index ] }
                  onChange={(ev: any, value: IDropdownOption) => {
                    this.searchForItems(value.key.toString(), index, ev);
                  }}
                  styles={{ dropdown: { width: 200 } }}
              /></div>;
          });
        } 
        
        /**
         * Add Text search box
         */
        if ( this.props.enableSearch === true ) {
          let searchBox = <div id={ 'SearchBoxParent' + this.chartId }>
            <div style={{ paddingTop: '20px' }}></div>
            <SearchBox className={ styles.searchBox }
                placeholder= { this.sbPlaceHolder }
                iconProps={{ iconName : 'Search'}}
                onSearch={ this.textSearch.bind(this) }
                //value={this.state.searchText}
                onChange={ this.textSearch.bind(this) } />
            </div>;
            searchElements.push( searchBox ) ;

          }

 /*             
          <button onClick={ this.trySetGroups.bind(this) } style={{marginRight:'20px'}}>trySetGroups</button>
          <button onClick={ this.trySetObject.bind(this) } style={{marginRight:'20px'}}>trySetObject</button>
          <button onClick={ this.tryUpdate.bind(this) } style={{marginRight:'20px'}}>tryUpdate</button>
          <button onClick={ this.tryAttach.bind(this) } style={{marginRight:'20px'}}>tryAttach</button>
          <button onClick={ this.tryNew.bind(this) } style={{marginRight:'20px'}}>tryNew</button>
          <button onClick={ this.resetState.bind(this) } style={{marginRight:'20px'}}>resetState</button>

          <button onClick={ this.tryPropsData.bind(this) } style={{marginRight:'20px'}}>tryPropsData</button>    

      foamStyles: {
            foamChartHeight: number;  //Fixed number of pixels for the foam rendering
            foamAnimations: string[];
            foamColors: string[];
            foamBorders: string[];
      };

      foamOptions: {    // foamOptions.changeTitles
            rollHiearchy: boolean;
            changeLayout: boolean;
            changeTitles: boolean;
      };

      foamData: {
            includeSum: boolean;
            includeCount: boolean;
            includeAvg: boolean;
            includeRange: boolean;
      };
*/

          let changeElements = [];
          changeElements.push( <button onClick={ this.forwardHiearchy.bind(this) } style={{marginRight:'20px', width: '70px', display: foamOptions.rollHiearchy === true ? '' : 'none'}} id= { this.buttonFW }>Normal</button> ); 
          changeElements.push( <button onClick={ this.reverseHiearchy.bind(this) } style={{marginRight:'20px', width: '70px', display: 'none' }} id= { this.buttonREV }>Reverse</button> ); 

          changeElements.push( <button onClick={ this.showSum.bind(this) } style={{marginRight:'20px', display: foamData.includeSum === true ? '' : 'none'}} id= { this.buttonSum }>Sum</button> );  //&Sigma;
          changeElements.push( <button onClick={ this.showCount.bind(this) } style={{marginRight:'20px', display: foamData.includeCount === true ? '' : 'none'}} id= { this.buttonCnt }>Count</button> ); 
          changeElements.push( <button onClick={ this.showAvg.bind(this) } style={{marginRight:'20px', display: foamData.includeAvg === true ? '' : 'none'}} id= { this.buttonAvg }>Avg</button> ); 

          changeElements.push( <button onClick={ this.showMax.bind(this) } style={{marginRight:'20px', display: foamData.includeMax === true ? '' : 'none'}} id= { this.buttonMax }>Max</button> ); 
          changeElements.push( <button onClick={ this.showMin.bind(this) } style={{marginRight:'20px', display: foamData.includeMin === true ? '' : 'none'}} id= { this.buttonMin }>Min</button> ); 
          changeElements.push( <button onClick={ this.showRange.bind(this) } style={{marginRight:'20px', display: foamData.includeRange === true ? '' : 'none'}} id= { this.buttonRng }>Range</button> ); 

          const wrapStackTokens: IStackTokens = { childrenGap: 30 };
          searchStack = <div style={{ paddingBottom: '15px' }}>
              <Stack horizontal horizontalAlign="start" verticalAlign="end" wrap tokens={wrapStackTokens}>
                { searchElements }
              </Stack>
              <Stack horizontal horizontalAlign="start" verticalAlign="end" wrap tokens={wrapStackTokens} padding="15px 0px 15px 0px">
                { changeElements }
              </Stack>
              <div style={{display:'inline-flex', paddingTop: '10px', fontSize: 'larger', fontWeight: 'bolder'}}>
                  <div style={{paddingRight:'10px'}} id= { this.bCSort }></div>
                  <div style={{paddingRight:'10px'}} id={ this.bC0 }></div>
                  <div style={{paddingRight:'10px', display: 'none'}} id={ this.bC1 }></div>
                  <div style={{paddingRight:'10px'}} id={ this.bCOper }></div>
                  <div style={{paddingRight:'10px', display: 'none'}} id={ this.bCScale }></div>
                  <div style={{paddingRight:'10px'}} id={ this.bCUnit }></div>
                  <div style={{paddingRight:'10px', display: 'none'}} id={ this.bCSum }></div>
              </div>
              <div style={{display:'inline-flex', paddingTop: '10px', fontSize: 'larger', fontWeight: 'bolder'}}>
                  <div style={{paddingRight:'10px'}} id={ 'layout' + this.chartId }>{ this.props.foamTreeData.layout }</div>
                  <div style={{paddingRight:'10px'}} id={ 'stacking' + this.chartId }>{ this.props.foamTreeData.stacking }</div>
              </div>
              <div style={{display:'inline-flex', paddingTop: '10px', fontSize: 'larger', fontWeight: 'bolder'}}>
                  { butLayout }
                  { butStacking }
              </div>
              <div> { choiceSlider } </div>
          </div>;

    //let foamBox = <div><div className={ styles.container }><button onClick={ this.tryForEachGroup.bind(this) } style={{marginRight:'20px'}}>tryForEachGroup</button>
    let foamBox = <div><div className={ styles.container }>
          <div id={ "visualization"     } style={{height: y, width:  x }}></div>
          { this.foamtree }
        </div></div>;

    return (
      <div className={ styles.foamchart } style={{background: 'gray', padding: '15px'}}>
          { searchStack }
          { foamBox }
          {  }
      </div>
    );
  }
  
  
  /***
 *    .d8888. d88888b  .d8b.  d8888b.  .o88b. db   db      d88888b  .d88b.  d8888b.      d888888b d888888b d88888b .88b  d88. .d8888. 
 *    88'  YP 88'     d8' `8b 88  `8D d8P  Y8 88   88      88'     .8P  Y8. 88  `8D        `88'   `~~88~~' 88'     88'YbdP`88 88'  YP 
 *    `8bo.   88ooooo 88ooo88 88oobY' 8P      88ooo88      88ooo   88    88 88oobY'         88       88    88ooooo 88  88  88 `8bo.   
 *      `Y8b. 88~~~~~ 88~~~88 88`8b   8b      88~~~88      88~~~   88    88 88`8b           88       88    88~~~~~ 88  88  88   `Y8b. 
 *    db   8D 88.     88   88 88 `88. Y8b  d8 88   88      88      `8b  d8' 88 `88.        .88.      88    88.     88  88  88 db   8D 
 *    `8888Y' Y88888P YP   YP 88   YD  `Y88P' YP   YP      YP       `Y88P'  88   YD      Y888888P    YP    Y88888P YP  YP  YP `8888Y' 
 *                                                                                                                                    
 *                                                                                                                                    
 */

  private getDefaultDDLabel( index ) {
    let defaultLabel = this.props.fetchList.dropDownColumns[ index ].replace('>','').replace('+','').replace('-','');
    return defaultLabel;
  }
 
  /**
  * Based on PivotTiles.tsx
  * @param item
  */
  private textSearch = ( searchText: string ): void => {
    this.resetOtherDropdowns( -1 );
    this.fullSearch( null, searchText );

  }

  public searchForItems = (item, choiceSliderDropdown: number, ev: any): void => {

    console.log('searchForItems: ',item, choiceSliderDropdown, ev ) ;
    this.resetOtherDropdowns( choiceSliderDropdown );
    this.resetSearchBox();
    this.fullSearch( item, null );

  }

  private resetSearchBox() {
    let sb = document.getElementById('SearchBoxParent' + this.chartId).getElementsByTagName('input')[0];
    console.log('sb value:  to ' + this.sbPlaceHolder, document.getElementById('SearchBoxParent' + this.chartId).getElementsByTagName('input')[0].value );
    document.getElementById('SearchBoxParent' + this.chartId).getElementsByTagName('input')[0].value = this.sbPlaceHolder;

  }

  private resetOtherDropdowns( choiceSliderDropdown: number ) {
    this.props.dropDownItems.map( ( dropDownChoices, index ) => {
      let otherDDId = 'DDIndex' + index + this.chartId;
      if ( index !== choiceSliderDropdown ) { //clear choice dropdowns to
        let newDDLabel = `Select a ${ this.getDefaultDDLabel(index) }`;
        document.getElementById(otherDDId).getElementsByTagName('span')[0].firstElementChild.textContent = newDDLabel ;
      }
    });
    return;
  }

public fullSearch = (item: any, searchText: string ): void => {

  //This sends back the correct pivot category which matches the category on the tile.
  let e: any = event;

  /*
  console.log('searchForItems: e',e);
  console.log('searchForItems: item', item);
  console.log('searchForItems: this', this);


 
 if ( currentTimeScale === 'Weeks' ) { this.setState({ sliderValueWeek: newValue, }) ; }
 else if ( currentTimeScale === 'Years' ) { this.setState({ sliderValueYear: newValue, }) ; }
 else if ( currentTimeScale === 'Months' ) { this.setState({ sliderValueMonth: newValue, }) ; }
 else if ( currentTimeScale === 'WeekNo' ) { this.setState({ sliderValueWeekNo: newValue, }) ; }
  */

  let searchItems : IFoamItemInfo[] = [];
  let newFilteredItems: IFoamItemInfo[]  = [];

  searchItems =this.state.allItems;

  let searchCount = searchItems.length;
/* */
  let selectedDropdowns = this.state.selectedDropdowns;
  let dropDownItems = this.state.dropDownItems;
  let dropdownColumnIndex = null; //Index of dropdown column that was picked

  if ( searchText === null ) { //Then this is a choice dropdown filter

    dropDownItems.map ( ( thisDropDown, ddIndex ) => {
      thisDropDown.map( thisChoice => {
        if ( dropdownColumnIndex === null && thisChoice.text === item ) { dropdownColumnIndex = ddIndex ; thisChoice.isSelected = true ; }  else { thisChoice.isSelected = false;} 
      });
    });

    selectedDropdowns.map( (dd, index ) => {
      if ( dropdownColumnIndex !== null ) {  //This should never be null but just in case... 
        selectedDropdowns[index] = dropdownColumnIndex === index ? item : ''; 
      }
    });

    if ( item === '' ) {
      newFilteredItems = searchItems;
    } else {
      for (let thisItem of searchItems) {
        let searchChoices = thisItem.meta ;
        if(searchChoices.indexOf( item ) > -1) {
          //console.log('fileName', fileName);
          newFilteredItems.push(thisItem);
        }
      }
    }
  } else { //This is a text box filter

    //Clears the selectedDropdowns array
    selectedDropdowns.map( (dd, index ) => {
        selectedDropdowns[index] = ''; 
    });

    //Sets isSelected on all dropdown options to false
    dropDownItems.map ( ( thisDropDown ) => {
      thisDropDown.map( thisChoice => {
       thisChoice.isSelected = false;
      });
    });

    if ( searchText == null || searchText === '' ) {
      newFilteredItems = searchItems;
    } else {
      let searchTextLC = searchText.toLowerCase();
      for (let thisItem of searchItems) {
        if(thisItem.searchString.indexOf( searchTextLC ) > -1) {
          newFilteredItems.push(thisItem);
        }
      }
    }
  }

  searchCount = newFilteredItems.length;
  
  let foamTreeData = buildGroupData( this.props.fetchList, newFilteredItems );
  let newGroups : IFoamTreeGroup[] = JSON.parse(JSON.stringify( foamTreeData.dataObject.groups ));
  let dataObject: IFoamTreeDataObject = this.foamtree.get("dataObject");
  
  dataObject = this.updateGroupWeights( dataObject, newGroups );

  /**
   * For some reason, whenever I use update, it seems to ignore the showZeroWeightGroups property.

  this.foamtree.update();
   */
  console.log( 'fullSearch dataObject:', this.props.foamTreeData.dataObject );

  /**
   * For some reason, whenever I use set, it re-animates the entire tree
   */
  this.foamtree.set({
    dataObject: dataObject,
    //showZeroWeightGroups: false, //Not required if it's in the initial settings
    groupLabelDecorator: (opts, params, vars) => {
      vars.labelText += " (" +
        ( params.group.weight ? params.group.weight.toFixed(1) : '-' ) + ")";
    }
  });

  return ;
  
}


private _onStacking() {
  let currentLayout = document.getElementById('stacking' + this.chartId).innerText;
  let newStacking = getNextElementInArray( FoamTreeStacking, currentLayout, 'next', true, FoamTreeStacking[0]);
  this.foamtree.set({
    stacking: newStacking,
  });
  this.foamtree.update();
  this.foamtree.redraw();
  console.log('_onStacking',currentLayout,newStacking);
  document.getElementById('stacking' + this.chartId).innerText = newStacking;
}

private _onLayout() {
  let currentLayout = document.getElementById('layout' + this.chartId).innerText;
  let newLayout = getNextElementInArray( FoamTreeLayouts, currentLayout, 'next', true, FoamTreeLayouts[0]);
  this.foamtree.set({
    layout: newLayout,
  });
  this.foamtree.update();
  //this.foamtree.redraw();
  document.getElementById('layout' + this.chartId).innerText = newLayout;
}

/**
 *   document.getElementById("breadCrumbSort").innerText = 'Reverse Sorted';
 *                <div id="breadCrumbSort"></div>
                  <div id="breadCrumb0"></div>
                  <div id="breadCrumb1"></div>
                  <div id="breadCrumbOperator"></div>
                  <div id="breadCrumbScale"></div>
                  <div id="breadCrumbUnits"></div>
                  <div id="breadCrumbSummary"></div>
 */

private reverseHiearchy( ) {
  let newFetchList : IFoamTreeList = JSON.parse(JSON.stringify( this.props.fetchList ) ) ;
  newFetchList.carrotCats.reverse();
  this.rollHiearchy(newFetchList);
  this.updateBreadCrumbGroups( 'dec' );
}

private forwardHiearchy( ) {
  let newFetchList : IFoamTreeList = this.props.fetchList ;
  this.rollHiearchy(newFetchList);
  this.updateBreadCrumbGroups( 'asc' );
}

private rollHiearchy ( newFetchList : IFoamTreeList ) {

  let foamTreeData = buildGroupData( newFetchList, this.props.allItems );
  let newGroups : IFoamTreeGroup[] = JSON.parse(JSON.stringify( foamTreeData.dataObject.groups ));
  let dataObject: IFoamTreeDataObject = this.foamtree.get("dataObject");
  
  dataObject.groups = newGroups;

  /**
   * For some reason, whenever I use update, it seems to ignore the showZeroWeightGroups property.

  this.foamtree.update();
   */
  console.log( 'fullSearch dataObject:', this.props.foamTreeData.dataObject );

  /**
   * For some reason, whenever I use set, it re-animates the entire tree
   */
  this.foamtree.set({
    dataObject: dataObject,
    //showZeroWeightGroups: false, //Not required if it's in the initial settings
    groupLabelDecorator: (opts, params, vars) => {
      vars.labelText += " (" +
        ( params.group.weight ? params.group.weight.toFixed(1) : '-' ) + ")";
    }
  });

}

private updateGroupWeights ( dataObject: IFoamTreeDataObject , newGroups : IFoamTreeGroup[]  ) {

  dataObject.groups.forEach((g) => {
    let newGroupRef : IFoamTreeGroup = null;
    let getNewGroupIndex = doesObjectExistInArray( newGroups,'label',g.label,true );
    if ( getNewGroupIndex !== false ) { 
      newGroupRef = newGroups[ getNewGroupIndex ];
      g.sum = newGroupRef.sum;
      g.min = newGroupRef.min;
      g.max = newGroupRef.max;
      g.count = newGroupRef.count;
      g.avg = newGroupRef.avg;
      g.weight = newGroupRef.weight;

    } else { g.weight = 0; }
  
  });

  return dataObject;
}

 private consoleDataObject( caller: string, obj: string, oldKeySummary: any ) {
  let thisDataObject = null;
  let groups : any[] = [];
  if ( obj === 'full' ) {
    thisDataObject = this.foamtree.get();
    groups = thisDataObject.dataObject.groups;

  } else {
    thisDataObject = this.foamtree.get(obj);
    groups = obj === 'dataObject' ? thisDataObject.groups : [];

  }

  let keySummary: any = getKeySummary( thisDataObject, ['string','number','boolean'], ['element'], true );
  let keyChanges : any = getKeyChanges( thisDataObject, keySummary, oldKeySummary, false );

  console.log('object - ' + caller, getTotalGroupWeight( groups ), keySummary, thisDataObject );
  if ( Object.keys( keyChanges ).length > 0 ) {
    console.log('CHANGES to object - ' + caller, keyChanges );
  }

  return keySummary;
 }

  /**
   * This will change summary operator of existing data... ie count, sum, avg, min, max
   */
  
  private showCount() { this.switchGroupWeights('count'); }
  private showSum() { this.switchGroupWeights('sum'); }
  private showMin() { this.switchGroupWeights('min'); }
  private showMax() { this.switchGroupWeights('max'); }
  private showAvg() { this.switchGroupWeights('avg'); }
  private showRange() { this.switchGroupWeights('range'); }

  private switchGroupWeights( operator: string  ) {
    let keySummary = this.consoleDataObject( 'switchGroupWeights Before', 'full', null );
    let dataObject = this.foamtree.get("dataObject");
    dataObject.groups = this.setGroupWeight( dataObject.groups, operator );
    console.log('tryForEachGroup - newGroups' , dataObject.groups );
    this.foamtree.update();
    this.foamtree.redraw();
    this.consoleDataObject( 'switchGroupWeights After', 'full', keySummary );
    document.getElementById( this.bCOper ).innerText = operator;

    this.buttonOperators.map( op => {
      document.getElementById(op).classList.add( op.toLowerCase().indexOf(operator ) > -1 ? styles.activeButton : null );
      document.getElementById(op).classList.remove( op.toLowerCase().indexOf(operator ) > -1 ? null : styles.activeButton );
    });

  }


  private setGroupWeight( groups: IFoamTreeGroup[], operator: string ) {
    groups.map( group => {
      group.weight = operator === 'range' ? group['max'] - group['min'] : group[operator];

      if ( group.groups.length > 0 ) { group.groups = this.setGroupWeight( group.groups, operator ) ; }
    });
    return groups;
  }

  /**
   * This will "resize" existing groups and animate as I want
   */
    private tryForEachGroup(  ) {
        this.consoleDataObject( 'tryForEachGroup Before', 'full', null );
        let dataObject = this.foamtree.get("dataObject");
        let theBigOne = dataObject.groups[ Math.floor(Math.random() * dataObject.groups.length) ];
        let priorTotal = 0;
        let newTotal = 0;
        dataObject.groups.forEach((g) => {
          if ( g.label === theBigOne.label ) {
            priorTotal += g.weight;
            g.weight = ( 1 + Math.random() ) * ( 30 ) ;
            newTotal += g.weight;
          } else { 
            priorTotal += g.weight;
            g.weight = ( 1 + Math.random() ) ; 
            newTotal += g.weight;
          }
        });

        let newPriorRatio = priorTotal !== 0 ? newTotal / priorTotal : 1;
        console.log('tryForEachGroup totals:', priorTotal, newTotal, newPriorRatio, dataObject.groups );
        dataObject.groups.forEach((g) => {
          g.weight = g.weight / newPriorRatio;
        });
        console.log('tryForEachGroup - newGroups' , dataObject.groups );
        this.foamtree.update();

    }

    /**
     * This gets new data and reanimates by "undrawing" current data and the redrawing with new data... not like a resizing.
     * Seems to do same thing as trySetObject
     */
    private trySetGroups( groups: IFoamTreeGroup[] = [] ) {
      this.consoleDataObject( 'trySetGroups Before', 'full', null );

        if ( groups.length === 0 ) {
          groups = getFakeFoamTreeGroups( 90, 1000, fakeGroups1[1] );
        }
        
        this.foamtree.set({
          fadeDuration: 1500,
          relaxationVisible: true,
          relaxationQualityThreshold: 0,
          relaxationMaxDuration: 1000,
          dataObject: {
            groups: groups
          }
        });
      this.consoleDataObject( 'trySetGroups After', 'full', null );
    }

    /**
     * This gets new data and reanimates by "undrawing" current data and the redrawing with new data... not like a resizing.
     * Seems to do same thing as trySetGroups
     */
    private trySetObject( ) {
      this.consoleDataObject( 'trySetObject Before', 'dataObject', null );
      const newFoamTree = getFakeFoamTreeData( true , 90 );
      this.foamtree.set(newFoamTree);
      this.consoleDataObject( 'trySetObject After', 'dataObject', null );
    }

    /**
     * This gets new group data but does not redraw or animate
     */
    private tryUpdate(  ) {
      this.consoleDataObject( 'tryUpdate Before', 'dataObject', null );
      const newGroups = getFakeFoamTreeGroups( 90, 1000, fakeGroups1[1] );
      this.foamtree.update( newGroups );
      this.consoleDataObject( 'tryUpdate After', 'dataObject', null );
    }

    /**
     * This gets new group data but does not redraw or animate
     */
    private tryAttach(  ) {
      this.consoleDataObject( 'tryAttach Before', 'dataObject', null );
      const newGroups = getFakeFoamTreeGroups( 90, 1000, fakeGroups1[1] );
      this.foamtree.attach( newGroups, 1 );
      this.consoleDataObject( 'tryAttach After', 'dataObject', null );
    }

    /**
     * This wipes the entire foam chart box element
     */
    private tryNew( ) {
      this.consoleDataObject( 'tryNew Before', 'dataObject', null );
      let foamtree : any = getFakeFoamTreeData( true, 90 );
      foamtree.id = "visualization"     ;
      //this.foamtree = foamtree;                 //Causes this error in consoleDataObject:  this.foamtree.get is not a function
      this.foamtree = new FoamTree( foamtree );   // Causes this error in consoleDataObject:  Uncaught FoamTree: visualization already embedded in the element.
      this.consoleDataObject( 'tryNew After', 'dataObject', null );
    }

    /**
     * This replaces the current data object with the one in props
     */
    private tryPropsData( ) {
      this.consoleDataObject( 'tryNew Before', 'dataObject', null );
      console.log( 'addItemsToState dataObject:', this.props.foamTreeData.dataObject );
      let testDataObject : IFoamTreeDataObject = JSON.parse(JSON.stringify( this.props.foamTreeData.dataObject ));
      this.foamtree.set({
        dataObject: testDataObject,
        //showZeroWeightGroups: false,
        groupLabelDecorator: (opts, params, vars) => {
          vars.labelText += " (" +
            ( params.group.weight ? params.group.weight.toFixed(1) : '-' ) + ")";

        }
      });
      this.consoleDataObject( 'tryNew After', 'dataObject', null );
    }

    private resetState() {
      this.setState ({});
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

    private addTheseItemsToState( ) {

      //this.setState({    });

      let groups: IFoamTreeGroup[] = [];
      let groupsUpdated = false;

      if ( this.props.generateSample === true ) {
        groups = getFakeFoamTreeGroups( 90, 1000, fakeGroups1[1] );
        groupsUpdated = true;

      } else if ( this.props.foamTreeData.dataObject.groups.length > 0 ) {
        groups = this.props.foamTreeData.dataObject.groups;
        groupsUpdated = true;

      } else { 
        console.log('FoamControl addItemsToState 4:','Did nothing - could be because data has not yet loaded' );

      }


      if ( groupsUpdated === true ) {

        /*     
        //This does show data once fetched.
        
        console.log( 'addItemsToState groups:', groups );
        this.foamtree.set({
          dataObject: {
            groups: groups
          },
          groupLabelDecorator: (opts, params, vars) => {
            vars.labelText += " (" +
              params.group.weight.toFixed(1) + ")";
  
          }
        });
        */
 
        /*   //This does show data once fetched.
        console.log( 'addItemsToState dataObject:', this.props.foamTreeData.dataObject );
        this.foamtree.set("dataObject", this.props.foamTreeData.dataObject);
        //this.foamtree.update();  //update is not required if using set("dataObject",....)
        //this.foamtree.redraw(); //This does not redraw new groups data
        */

        /*   */   
        //This does show data once fetched.
        
        console.log( 'addItemsToState dataObject:', this.props.foamTreeData.dataObject );
        let testDataObject : IFoamTreeDataObject = JSON.parse(JSON.stringify( this.props.foamTreeData.dataObject ));
        this.foamtree.set({
          dataObject: testDataObject,
          showZeroWeightGroups: false,
          groupLabelDecorator: (opts, params, vars) => {
            vars.labelText += " (" +
              ( params.group.weight ? params.group.weight.toFixed(1) : '-' ) + ")";
  
          }
        });

        /* VVVVV   This did not crash but did not update either    VVVVVVVVVVVVVV

        const dataObject = this.foamtree.get("dataObject");
        dataObject.groups = groups;
        this.foamtree.update();
        this.foamtree.redraw();
        */ 
      }


      return true;

    }
    
    private tryFoamTree( iteration: number = 1, max: number ) {

      if ( iteration <= max ) {

        const update = () => {
          const dataObject = this.foamtree.get("dataObject");
          
          let theBigOne = dataObject.groups[ Math.floor(Math.random() * dataObject.groups.length) ];

          dataObject.groups.forEach((g) => {
            if ( g.label === theBigOne.label ) {
              g.weight = ( 1 + Math.random() ) * ( iteration === max ? 30 : 3 ) ;
            } else { g.weight = ( 1 + Math.random() ) ; }
          });
  
          this.foamtree.update();
          setTimeout( () =>  {
            iteration ++;
            this.tryFoamTree( iteration, max );
          }, 200);
        };

        update();

      } else { 
        return ;
      }

    }

}
