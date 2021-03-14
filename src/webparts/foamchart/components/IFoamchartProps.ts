/**
 * 
 * 
 * Official Community Imports
 * 
 * 
 */

import { PageContext } from '@microsoft/sp-page-context';
import { WebPartContext } from '@microsoft/sp-webpart-base';


/**
 * 
 * 
 * @mikezimm/npmfunctions/dist/ Imports
 * 
 * 
 */

import { IPerformanceSettings,  } from '@mikezimm/npmfunctions/dist/Lists/getFunctions';

import { FoamTree } from "@carrotsearch/foamtree";

/**
 * 
 * 
 * Services Imports
 * 
 * 
 */


 
/**
 * 
 * 
 * Helper Imports
 * 
 * 
 */


/**
 * 
 * This Component Imports
 * 
 * 
 */


export interface IFoamchartProps {

      WebpartElement?: HTMLElement;   //Size courtesy of https://www.netwoven.com/2018/11/13/resizing-of-spfx-react-web-parts-in-different-scenarios/
      foamtree?: FoamTree;

      pageContext: PageContext;
      wpContext: WebPartContext;
  
      tenant: string;
      urlVars: {};

      parentListWeb?: string;
      parentListURL?: string;
      parentListTitle?: string;
      listName : string;

      chartId: string;
      
      allLoaded: boolean;

      carrotCats: string[];
      dateColumn: string;
      valueColumn: string;
      searchColumns: string[];

      valueType: string;
      valueOperator: string;
      dropDownColumns: string[];

      metaColumns: string[];
      enableSearch: boolean;
  
      performance: IPerformanceSettings;
  
      parentListFieldTitles: string;
  
      // 1 - Analytics options
      WebpartHeight?:  number;    //Size courtesy of https://www.netwoven.com/2018/11/13/resizing-of-spfx-react-web-parts-in-different-scenarios/
      WebpartWidth?:   number;    //Size courtesy of https://www.netwoven.com/2018/11/13/resizing-of-spfx-react-web-parts-in-different-scenarios/
  
      useListAnalytics: boolean;
      analyticsWeb?: string;
      analyticsList?: string;
  
      /**    
       * 'parseBySemiColons' |
       * 'groupBy10s' |  'groupBy100s' |  'groupBy1000s' |  'groupByMillions' |
       * 'groupByDays' |  'groupByMonths' |  'groupByYears' |
       * 'groupByUsers' | 
       * 
       * rules string formatted as JSON : [ string[] ]  =  [['parseBySemiColons''groupByMonths'],['groupByMonths'],['groupByUsers']]
       * [ ['parseBySemiColons''groupByMonths'],
       * ['groupByMonths'],
       * ['groupByUsers'] ]
       * 
      */
  
      // 6 - User Feedback:
      //progress: IMyProgress;
  

      // 9 - Other web part options
      webPartScenario: string; //Choice used to create mutiple versions of the webpart. 
      showEarlyAccess: boolean;

      pivotSize: string;
      pivotFormat: string;
      pivotOptions: string;
      pivotTab: string;  //May not be needed because we have projectMasterPriority

}
