import * as React from 'react';

import { IconButton, IIconProps, IContextualMenuProps, Stack, Link } from 'office-ui-fabric-react';

import { escape } from '@microsoft/sp-lodash-subset';

import { IDropdownOption,  } from "office-ui-fabric-react";

import { FoamTree } from "@carrotsearch/foamtree";




import { IFoamTree, IFoamTreeDataObject, IFoamTreeGroup } from '@mikezimm/npmfunctions/dist/CarrotCharts/IFoamTree';

//import  EarlyAccess from '@mikezimm/npmfunctions/dist/HelpInfo/EarlyAccess';

import  EarlyAccess from './HelpInfo/EarlyAccess';
import { IEarlyAccessItem } from './HelpInfo/EarlyAccess';

import InfoPages from './HelpInfo/Component/InfoPages';

import * as links from '@mikezimm/npmfunctions/dist/HelpInfo/Links/LinksRepos';



import { getFakeFoamTreeData, getEmptyFoamTreeData } from './FakeFoamTreeData';

import { buildFetchList } from './BuildFetchList';

import { getAllItems, IFoamTreeList, IFoamItemInfo } from './GetListData';

import { buildGroupData } from './FoamComponent/FoamFunctions';

import { setBorderSettings } from './FoamComponent/BorderFunctions';


import Foamcontrol from './FoamComponent/FoamControl';
import stylesB from './CreateButtons.module.scss';
import { createIconButton , defCommandIconStyles} from "./createButtons/IconButton";

import styles from './Foamchart.module.scss';
import { IFoamchartProps } from './IFoamchartProps';
import { IFoamchartState } from './IFoamchartState';


export default class Foamchart extends React.Component<IFoamchartProps, IFoamchartState> {

  public constructor(props:IFoamchartProps){
    super(props);

    //function buildFetchList( pageContext: PageContext, webURL: string, listName: string, listTitle: string, isLibrary: boolean, dropDownColumns : any[] ) {
    //let fetchInfo  : any = buildFetchList( this.props.pageContext, this.props.webURL, this.props.listName, this.props.listTitle, false, [] );

    //returns:  fetchInfo = { fetchList: fetchList, selectedDropdowns: selectedDropdowns, };
    let metaColumns = this.props.metaColumns;
    this.props.carrotCats.map( c => { metaColumns.push( c ); });

    let fetchInfo  : any = buildFetchList( this.props.pageContext, this.props.parentListWeb, this.props.listName, this.props.parentListTitle, false, this.props.performance,
         this.props.dropDownColumns, this.props.searchColumns, metaColumns, [this.props.dateColumn], [this.props.valueColumn],
         this.props.carrotCats, this.props.dateColumn, this.props.valueColumn,this.props.valueType, this.props.valueOperator );

    let foamtree : IFoamTree = getEmptyFoamTreeData( this.props.foamStyles );
    foamtree.id = "visualization"     ;
    foamtree.dataObject.groups = [];

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
        this.props.dropDownColumns, this.props.searchColumns, this.props.metaColumns, [this.props.dateColumn], [this.props.valueColumn] ,
        this.props.carrotCats, this.props.dateColumn, this.props.valueColumn,this.props.valueType, this.props.valueOperator );

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

        foamStyles = { this.props.foamStyles }
        foamOptions = { this.props.foamOptions }
        foamData = { this.props.foamData }

        WebpartElement = { this.props.WebpartElement }   //Size courtesy of https://www.netwoven.com/2018/11/13/resizing-of-spfx-react-web-parts-in-different-scenarios/
        chartId = { this.props.chartId }
        dataKey = { this.state.dataKey }
        foamTreeData = { this.state.foamTreeData } //
        allItems = { this.state.allItems }
        fetchList = { this.state.fetchList }
        allLoaded = { this.state.allLoaded }

        enableSearch = { this.props.enableSearch }
        dropDownItems = { this.state.dropDownItems }

        //foamTreeData = { this.state.foamTreeData } //
        generateSample = { false }  //Gets random sample data

        pageContext = { this.props.pageContext }
        wpContext = {this.props.wpContext }

        tenant = {this.props.tenant }
        urlVars = { [] }

        // 1 - Analytics options
        WebpartHeight = { this.state.WebpartHeight }    //Size courtesy of https://www.netwoven.com/2018/11/13/resizing-of-spfx-react-web-parts-in-different-scenarios/
        WebpartWidth = { this.state.WebpartWidth }     //Size courtesy of https://www.netwoven.com/2018/11/13/resizing-of-spfx-react-web-parts-in-different-scenarios/</div>
      />;

      const defCommandIconStylesX : any = {
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
        styles={ defCommandIconStylesX }
        />
      </div>;


    /**
     * Add early access bar
     */
    let earlyAccess = null;
    defCommandIconStyles.icon.fontWeight = '600' ;
    
    let buttonHelp = <div title={ "Feedback" } className= {stylesB.buttons} id={ 'NoID' } style={{background: 'white', opacity: .7, borderRadius: '10px', cursor: 'pointer' }}>
      <IconButton iconProps={{ iconName: 'Help' }} 
        text= { 'parent component' }
        title= { 'titleText'} 
        //uniqueId= { titleText } 
        //data= { titleText } 
        //key= { titleText } 
        //ariaLabel= { titleText } 
        disabled={false} 
        checked={false}
        onClick={ this._toggleInfoPages.bind(this) }
        styles={ defCommandIconStyles }
        />
    </div>;

    if ( this.props.showEarlyAccess === true ) {
      let messages : IEarlyAccessItem[] = [];
      let linksArray : IEarlyAccessItem[] = [];

      messages.push( { minWidth: 1000, item: <div><span><b>{ 'Welcome to ALV Webpart Early Access!!!' }</b></span></div> });
      messages.push( { minWidth: 1000, item: <div><span><b>{ 'Get more info here -->' }</b></span></div> });

      messages.push( { minWidth: 700, maxWidth: 799.9, item: <div><span><b>{ 'Webpart Early Access!!!' }</b></span></div> });
      messages.push( { minWidth: 700, maxWidth: 799.9, item: <div><span><b>{ 'More info ->' }</b></span></div> });

      messages.push( { minWidth: 400, maxWidth: 699.9, item: <div><span><b>{ 'info ->' }</b></span></div> });

      linksArray.push( { minWidth: 450, item: links.gitRepoCarrotCharts.wiki });
      linksArray.push( { minWidth: 600, item: links.gitRepoCarrotCharts.issues });
      linksArray.push( { minWidth: 800, item: links.gitRepoCarrotCharts.projects });

      earlyAccess = 
      <div style={{ paddingBottom: 10 }}>
        <EarlyAccess 
            image = { "https://autoliv.sharepoint.com/sites/crs/PublishingImages/Early%20Access%20Image.png" }
            messages = { messages }
            links = { linksArray }
            email = { 'mailto:General - WebPart Dev <0313a49d.Autoliv.onmicrosoft.com@amer.teams.ms>?subject=Drilldown Webpart Feedback&body=Enter your message here :)  \nScreenshots help!' }
            farRightIcons = { [ { item: buttonHelp } ] }
            WebpartWidth = { this.state.WebpartWidth }
        ></EarlyAccess>
      </div>;

    }

    //Build up hard coded array of user emails that can
    let showTricks = false;
    links.trickyEmails.map( getsTricks => {
      if ( this.props.pageContext.user.email && this.props.pageContext.user.email.toLowerCase().indexOf( getsTricks ) > -1 ) { showTricks = true ; }   } ); 

    let infoPages = <div id={ 'InfoPagesID' + this.props.chartId } style={{ display: 'none' }}><InfoPages 
        showInfo = { true }
        allLoaded = { true }
        showTricks = { showTricks }

        parentListURL = { this.state.fetchList.parentListURL }
        childListURL = { null }

        parentListName = { this.state.fetchList.name }
        childListName = { null }

        gitHubRepo = { links.gitRepoCarrotCharts }

        hideWebPartLinks = { false }
    ></InfoPages></div>;

    return (
      <div className={ styles.foamchart }>
        <div className={ styles.container }>
          { earlyAccess }
          { infoPages }
          { /* button */ }
          { foamControl }
        </div>
      </div>
    );
  }


  private _toggleInfoPages() {
    let newDisplay = document.getElementById('InfoPagesID' + this.props.chartId).style.display ;

    if ( newDisplay === 'none' ) { 
      newDisplay = ''; } 
    else { 
      newDisplay = 'none';
    }

    document.getElementById('InfoPagesID' + this.props.chartId).style.display = newDisplay;
  }

  private _onClick () {
    //let foamtree : any = getFakeFoamTreeData( true, 90 );
    this.setState({ dataKey: this.state.dataKey + '1' }); //, foamTreeData: foamtree
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

      let foamTreeData = buildGroupData( fetchList, allItems, this.props.foamStyles );

      //let foamTreeData: IFoamTree = null; //this.buildGridData (fetchList, theseItems);
      // let foamTreeData : any = getFakeFoamTreeData( true, 90 );
      foamTreeData.id = "visualization" ;

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




}


