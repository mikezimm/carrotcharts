/**
 * 
 * 
 * Official Community Imports
 * 
 * 
 */

import { PageContext } from '@microsoft/sp-page-context';
import { WebPartContext } from '@microsoft/sp-webpart-base';

import { FoamTree } from "@carrotsearch/foamtree";

/**
 * 
 * 
 * @mikezimm/npmfunctions/dist/ Imports
 * 
 * 
 */

import { IPerformanceSettings,  } from '@mikezimm/npmfunctions/dist/Lists/getFunctions';

import { IFoamBorder , FoamBorders, FoamBorderSettings, FoamBordersRound, FoamBordersNone, FoamBordersStraight } 
    from '@mikezimm/npmfunctions/dist/CarrotCharts/IFoamTreeDefaults';

import { IFoamAnimation , FoamAnimations, FoamAnimationSettings, FoamAnimateGentle, FoamAnimateFadeIn, FoamAnimateFlyIn } 
    from '@mikezimm/npmfunctions/dist/CarrotCharts/IFoamTreeDefaults';

import { IFoamColor , FoamColors, FoamColorSettings, FoamColorLight, FoamColorDark, FoamColorWarm } 
    from '@mikezimm/npmfunctions/dist/CarrotCharts/IFoamTreeDefaults';


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
export interface IFoamStyles {
      foamChartHeight: number;  //Fixed number of pixels for the foam rendering
      
      foamAnimations: IFoamAnimation[];
      foamColors: IFoamColor[];
      foamBorders: IFoamBorder[];

      currentAnimation?: IFoamAnimation;
      currentColor?: IFoamColor;
      currentBorder?: IFoamBorder;
}

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
  
      foamStyles: IFoamStyles;

      foamOptions: {
            rollHiearchy: boolean;
            changeLayout: boolean;
            changeTitles: boolean;
      };

      foamData: {
            includeSum: boolean;
            includeCount: boolean;
            includeAvg: boolean;
            includeMax: boolean;
            includeMin: boolean;
            includeRange: boolean;
      };
  
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
