
import { IFoamTree, IFoamTreeDataObject, IFoamTreeGroup } from '@mikezimm/npmfunctions/dist/IFoamTree';
import { doesObjectExistInArray, doesObjectExistInArrayInt } from '@mikezimm/npmfunctions/dist/arrayServices';
import { minInfinity, maxInfinity } from '@mikezimm/npmfunctions/dist/columnTypes';


import { getFakeFoamTreeData, getEmptyFoamTreeData } from '../FakeFoamTreeData';

import { getAllItems, IFoamTreeList, IFoamItemInfo } from '../GetListData';


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


   export function buildGroupData ( fetchList: IFoamTreeList, allItems : IFoamItemInfo[] ) {

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
      let theStartTimeMS = item['time' + fetchList.dateColumn ].milliseconds;
      let theStartTimeStr = item['time' + fetchList.dateColumn ].theTime;

      if ( theStartTimeMS > lastTime ) { 
        lastTime = theStartTimeMS ; 
        lastDate = theStartTimeStr ; }

      if ( theStartTimeMS < firstTime ) { 
        firstTime = theStartTimeMS ; 
        firstDate = theStartTimeStr ; }

    });

    let valueOperator = fetchList.valueOperator.toLowerCase() ;

/*
    allItems.map( item => {

      //item.meta.push( item.year.toString() ) ;

      //item.searchString += 'yearMonth=' + item.yearMonth + '|||' + 'yearWeek=' + item.yearWeek + '|||' + 'year=' + item.year + '|||' + 'week=' + item.week + '|||';

      let valueColumn = item[ fetchList.valueColumn ];
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
    let hiearchy = fetchList.carrotCats;
    let start = new Date();

    let result = buildHiearchyGroups( allItems, [], hiearchy, 0 );
    let finalGroups = buildGroupWeights ( fetchList, result.allItems, result.groups, 0 ) ;
    console.log('finalGroups: ', finalGroups );
    let end = new Date();
    console.log( 'CALCULATION TIME (ms) = ' + ( end.getTime() - start.getTime() ) );

    //let foamTree : IFoamTree = getFakeFoamTreeData( true, 90 );
    let foamTree : IFoamTree = getEmptyFoamTreeData();
    foamTree.dataObject.groups = finalGroups; 
    return foamTree;

  }

  export function updateStandardValues ( thisGroupX: IFoamTreeGroup, valueColumn: number ) {

    thisGroupX.weight ++ ;
    thisGroupX.count ++ ;
    thisGroupX.sum = thisGroupX.sum ? thisGroupX.sum + valueColumn : valueColumn;
    thisGroupX.min = !thisGroupX.min || valueColumn < thisGroupX.min ? valueColumn : thisGroupX.min;
    thisGroupX.max = !thisGroupX.max || valueColumn > thisGroupX.max ? valueColumn : thisGroupX.max;

    return thisGroupX;
  }

  export function buildGroupWeights ( fetchList: IFoamTreeList, allItems: IFoamItemInfo[], groups: IFoamTreeGroup[], tHI: number ) { //removed hiearchy: string[], 

    allItems.map( item => {

      //Copied section from GridCharts VVVV
      let valueColumn = item[ fetchList.valueColumn ];
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
        thisGroup0 = updateStandardValues( thisGroup0, valueColumn );

      }
      if ( item.groupIndexs.length > 1 ) {
        thisGroup1 = thisGroup0.groups[ item.groupIndexs[1] ] ;
        thisGroup1 = updateStandardValues( thisGroup1, valueColumn );
      }
      if ( item.groupIndexs.length > 2 ) {
        thisGroup2 = thisGroup1.groups[ item.groupIndexs[2] ] ;
        thisGroup2 = updateStandardValues( thisGroup2, valueColumn );

      }

    }); 

    groups = updateGroupAvg( groups ) ;
    groups = setGroupWeight( groups, fetchList.valueOperator ) ;
    return groups;

  }

  export function setGroupWeight( groups: IFoamTreeGroup[], operator: string ) {
    operator = operator.toLowerCase();
    groups.map( group => {
      group.weight = group[operator];
      if ( group.groups.length > 0 ) { group.groups = setGroupWeight( group.groups, operator ) ; }
    });
    return groups;
  }

  export function updateGroupAvg( groups: IFoamTreeGroup[] ) {
    groups.map( group => {
      if ( group.count > 0 ) { group.avg = group.sum / group.count; } 
      if ( group.groups.length > 0 ) { group.groups = updateGroupAvg( group.groups ) ; }
    });
    return groups;
  }

  export function buildHiearchyGroups ( allItems: IFoamItemInfo[], groups: IFoamTreeGroup[], hiearchy: string[], tHI: number ) {

    allItems.map( item => {
      item.groupIndexs = [];
      let result = buildHiearchyGroupsForItem(item, groups, hiearchy, tHI );
      groups = result.groups;
      item = result.item;
    }); 

    console.log( 'buildHiearchyGroups' , allItems, groups );
    return { allItems: allItems, groups: groups } ;

  }

  //groups.push( createDefaultGroup( h ) ); }
  export function createDefaultGroup( label: any, weight: number = 0, count: number = 0, sum: number = 0, avg: number = 0, min: number = maxInfinity, max: number = minInfinity ) {
    if ( typeof label !== 'string' ) { label = label.toString(); }
    let newGroup : IFoamTreeGroup = { label: label, weight: weight, count: count, sum: sum, avg: avg, min: min , groups: [] };
    return newGroup;
  }

  export function buildHiearchyGroupsForItem ( item: IFoamItemInfo, groups: IFoamTreeGroup[], hiearchy: string[], tHI: number ) {

    let hiearchyProp = hiearchy[ tHI ];
    let thisHiearchyValue : any = item[hiearchyProp];
    if ( !thisHiearchyValue && ( hiearchyProp.indexOf( '.' ) > -1 || hiearchyProp.indexOf( '/' ) > -1 ) ) {
      let cols = hiearchyProp.split(/\.|\//gm);  //Find the split using either . or / as in Editor.Title or Editor/Title
      if ( item[ cols[0] ]) { thisHiearchyValue = item[ cols[0] ][ cols[1]] ;  }
    }
    //if ( thisHiearchyValue === undefined ) { thisHiearchyValue = 'undefined' ; } else if ( thisHiearchyValue === null ) { thisHiearchyValue = 'null' ; }
    if ( thisHiearchyValue === undefined ) { thisHiearchyValue = 'No ' + hiearchy[ tHI ] ; } else if ( thisHiearchyValue === null ) { thisHiearchyValue = 'No ' + hiearchy[ tHI ] ; }
    if ( thisHiearchyValue ) {

      //This returns boolean (false) or string of the index number.... switch to any so typescript doesn't balk.
      let thisGroupIndex : number = doesObjectExistInArrayInt(groups, 'label', thisHiearchyValue, true ) ; // groups[ tHI ].indexOf( thisHiearchyValue ) ;
      if ( thisGroupIndex < 0 ) {
        groups.push( createDefaultGroup( thisHiearchyValue ) );
        thisGroupIndex = groups.length -1;
      }
      item.groupIndexs.push( thisGroupIndex );
      let childGroups = groups[ thisGroupIndex ].groups ;

      if ( ( tHI + 1 ) < hiearchy.length ) { 
        let result = buildHiearchyGroupsForItem(item, childGroups, hiearchy, tHI + 1,  ) ; 
        item = result.item;
        groups['groups'] = result.groups;

      }
    }

    return { item: item, groups: groups } ;

  }

  export function getTotalGroupWeight ( groups: IFoamTreeGroup[] ) {
    let total = 0 ;
    groups.map( g=> { if ( g.weight ) { total += g.weight ;} });
    return total;
  } 