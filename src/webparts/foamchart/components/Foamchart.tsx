import * as React from 'react';
import styles from './Foamchart.module.scss';
import { IFoamchartProps } from './IFoamchartProps';
import { IFoamchartState } from './IFoamchartState';


import { escape } from '@microsoft/sp-lodash-subset';

import { getFakeFoamTreeData } from './FakeFoamTreeData';

import { buildFetchList } from './BuildFetchList';

import { IFoamTreeList } from './GetListData';

import { FoamTree } from "@carrotsearch/foamtree";

import { IFoamTree, IFoamTreeDataObject } from '@mikezimm/npmfunctions/dist/IFoamTree';

export default class Foamchart extends React.Component<IFoamchartProps, IFoamchartState> {
  private foamtree: any = null;

  public constructor(props:IFoamchartProps){
    super(props);

    //function buildFetchList( pageContext: PageContext, webURL: string, listName: string, listTitle: string, isLibrary: boolean, dropDownColumns : any[] ) {
    //let fetchInfo  : any = buildFetchList( this.props.pageContext, this.props.webURL, this.props.listName, this.props.listTitle, false, [] );

    //returns:  fetchInfo = { fetchList: fetchList, selectedDropdowns: selectedDropdowns, };
    let fetchInfo  : any = buildFetchList( this.props.pageContext, this.props.parentListWeb, this.props.listName, this.props.parentListTitle, false,
         this.props.dropDownColumns, this.props.searchColumns, this.props.metaColumns, [this.props.dateColumn], [this.props.valueColumn] );

    let errMessage = '';
    this.state = { 

          //Size courtesy of https://www.netwoven.com/2018/11/13/resizing-of-spfx-react-web-parts-in-different-scenarios/
          WebpartHeight: this.props.WebpartElement ? this.props.WebpartElement.getBoundingClientRect().height : null,
          WebpartWidth:  this.props.WebpartElement ? this.props.WebpartElement.getBoundingClientRect().width - 50 : null,

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

      let foamtree : any = getFakeFoamTreeData();
      foamtree.id ="visualization";

      this.foamtree = new FoamTree( foamtree );

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

      let fetchInfo  : any = buildFetchList( this.props.pageContext, this.props.parentListWeb, this.props.listName, this.props.parentListTitle, false,
        this.props.dropDownColumns, this.props.searchColumns, this.props.metaColumns, [this.props.dateColumn], [this.props.valueColumn] );

      this.setState({
        /*          */
        fetchList: fetchInfo.fetchList,
          selectedDropdowns: fetchInfo.selectedDropdowns,

      });
    }

  }
  
  public componentWillUnmount() {
    this.foamtree.dispose();
  }
  /* */
  /*
  render() {
    return <div style={{height: "100%"}} ref={e => this.element = e}></div>;
  }
  */

  public render(): React.ReactElement<IFoamchartProps> {


    return (
      <div className={ styles.foamchart }>
        <div className={ styles.container }>
          <div className={ styles.row }>
            <div className={ styles.column }>
                <div id='visualization' style={{height: "500px", width: "800px"}}></div>
                { this.foamtree }
            </div>
          </div>
        </div>
      </div>
    );
  }
}
