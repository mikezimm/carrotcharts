import { BaseClientSideWebPart,  } from "@microsoft/sp-webpart-base";
import { IPropertyPanePage, PropertyPaneLabel, IPropertyPaneLabelProps, 
  PropertyPaneHorizontalRule, PropertyPaneTextField, IPropertyPaneTextFieldProps, 
  PropertyPaneLink, IPropertyPaneLinkProps, PropertyPaneDropdown, 
  IPropertyPaneDropdownProps, IPropertyPaneDropdownOption, PropertyPaneToggle, 
  IPropertyPaneConfiguration, PropertyPaneButton, PropertyPaneButtonType, PropertyPaneSlider,
} from "@microsoft/sp-property-pane";
import { PropertyPaneWebPartInformation } from '@pnp/spfx-property-controls/lib/PropertyPaneWebPartInformation';


import * as strings from 'FoamchartWebPartStrings';
import { pivotOptionsGroup} from './index';
import { gridChartsOptionsGroup } from './index';

import * as links from '../../webparts/foamchart/components/HelpInfo/AllLinks';   //              { links.gitRepoTrackMyTime.issues }

import { IFoamchartWebPartProps } from '../../webparts/foamchart/FoamchartWebPart';

import { PropertyFieldSitePicker } from '@pnp/spfx-property-controls/lib/PropertyFieldSitePicker';
import { PropertyFieldListPicker, PropertyFieldListPickerOrderBy } from '@pnp/spfx-property-controls/lib/PropertyFieldListPicker';

import { PropertyFieldColorPicker, PropertyFieldColorPickerStyle } from '@pnp/spfx-property-controls/lib/PropertyFieldColorPicker';

import { fpsLogo326 } from '@mikezimm/npmfunctions/dist/SVGIcons/fpsLogo326';

/*

  // 1 - Analytics options
  useListAnalytics: boolean;
  analyticsWeb?: string;
  analyticsList?: string;

  // 2 - Source and destination list information
  projectListTitle: string;
  projectListWeb: string;

  timeTrackListTitle: string;
  timeTrackListWeb: string;

  // 3 - General how accurate do you want this to be
  roundTime: string; //Up 5 minutes, Down 5 minutes, No Rounding;
  forceCurrentUser: boolean; //false allows you to put in data for someone else
  confirmPrompt: boolean;  //Make user press confirm

  // 4 -Project options
  allowUserProjects: boolean; //Will build list of ProjectsUser based on existing data from TrackMyTime list
  projectMasterPriority: string; //Use to determine what projects float to top.... your most recent?  last day?
  projectUserPriority: string; //Use to determine what projects float to top.... your most recent?  last day?

  // 5 - UI Defaults
  defaultProjectPicker: string; //Recent, Your Projects, All Projects etc...
  defaultTimePicker: string; //SinceLast, Slider, Manual???

  // 6 - User Feedback:
  showElapsedTimeSinceLast: boolean;  // Idea is that it can be like a clock showing how long it's been since your last entry.

  // Target will be used to provide user feedback on how much/well they are tracking time
  showTargetBar: boolean; //Eventually have some kind of way to tell user that x% of hours have been entered for day/week
  showTargetToggle: boolean; //Maybe give user option to toggle between day/week
  targetType:  string; //Day, Week, Both?
  targetValue: number; //Hours for typical day/week

  // 7 - Slider Options
  showTimeSlider: boolean; //true allows you to define end time and slider for how long you spent
  timeSliderInc: number; //incriment of time slider
  timeSliderMax: number; //max of time slider

  // 9 - Other web part options
  webPartScenario: string; //Choice used to create mutiple versions of the webpart.

  pivotSize: string;
  pivotFormat: string;
  pivotOptions: string;

    */

export class IntroPage {
  public getPropertyPanePage(webPartProps: IFoamchartWebPartProps, context, onPropertyPaneFieldChanged, _getListDefintions ): IPropertyPanePage { //_onClickCreateTime, _onClickCreateProject, _onClickUpdateTitles

    let webAbsoluteUrl = context.pageContext.web.absoluteUrl;

    if ( webPartProps.sites && webPartProps.sites.length > 0 && webPartProps.sites[0].url && webPartProps.sites[0].url.length > 0 ) { webAbsoluteUrl = webPartProps.sites[0].url ; }
    let selectedUrl = "Site Url: " + webAbsoluteUrl.slice(webAbsoluteUrl.indexOf('/sites/'));


    //2021-03-06:  For PreConfigProps lookup, copied from Drilldown7 VVVVVVV
    let theListChoices : IPropertyPaneDropdownOption[] = [];

    //Tried checking but for some reason this returns false when the promise for .newMap was actually resolved.
    //if ( webPartProps.newMap && webPartProps.newMap.length > 0 ) {
      theListChoices.push ( { key: 'na', text: 'na' } );
      theListChoices = theListChoices.concat(  webPartProps.newMap.map( d => {
        return { key: d.Title, text: d.Title };
      }) );
    //2021-03-06:  For PreConfigProps lookup, copied from Drilldown7 ^^^^^


    return <IPropertyPanePage>
    { // <page1>
      header: {
        description: ''
      },
      displayGroupsAsAccordion: true,
      groups: [
        { groupName: 'Web Part Info',
          isCollapsed: true ,
          groupFields: [
            PropertyPaneWebPartInformation({
              description: `<img src='${fpsLogo326}'/>`,
              key: 'webPartInfoId'
            }) ,
            PropertyPaneWebPartInformation({
              description: `<p><i>"If you change the way you look at things, the things you look at change."</i></p>`,
              key: 'webPartInfoId2'
            }) ,
/*
            PropertyPanePropertyEditor({
              webpart: this,
              key: 'propertyEditor'
            })  ,
 */
            PropertyPaneWebPartInformation({
              description: `<h4>This webpart looks at data in a whole new way.</h4>
              <p>Use it to show data in a fun animated way allowing drill down and smooth animation.</p>`,
              key: 'webPartInfoId3'
            }) ,

            PropertyPaneLink('About Link' , {
              text: 'Github Repo:  ' + links.gitRepoCarrotCharts.desc ,
              href: links.gitRepoCarrotCharts.href,
              target: links.gitRepoCarrotCharts.target,
            }),

            PropertyPaneLink('Issues Link' , {
              text: 'Report Issues:  ' + links.gitRepoCarrotCharts.desc ,
              href: links.gitRepoCarrotCharts.href  + '/issues',
              target: links.gitRepoCarrotCharts.target,
            }),

          ]
        },
        //2021-03-06:  For PreConfigProps lookup, copied from Drilldown7 VVVVVVV
        {  groupName: 'Get pre-configured setup',
            isCollapsed: false ,
            groupFields: [
              PropertyPaneToggle('definitionToggle', {
                label: 'Lock list defintion - prevents accidently reseting props!',
                offText: 'Off',
                onText: 'On',
              }),

              PropertyPaneDropdown('listDefinition', <IPropertyPaneDropdownProps>{
                label: 'Pre-defined setup choices',
                options: theListChoices,
                selectedKey: webPartProps.listDefinition != '' ? webPartProps.listDefinition : 'na',
                disabled: webPartProps.definitionToggle,
              }),
            ]},
            //2021-03-06:  For PreConfigProps lookup, copied from Drilldown7 ^^^^^^


        // 2 - Source and destination list information    
        { groupName: 'Your list info',
        isCollapsed: true ,
        groupFields: [

          PropertyPaneTextField('parentListWeb', {
              label: 'Your List Web url'
          }),
          PropertyPaneTextField('parentListTitle', {
            label: 'Your List Title'
          }),

          PropertyPaneTextField('carrotCats', {
            label: 'Carrot Cats'
          }),

          PropertyPaneTextField('valueColumn', {
            label: 'Value Column'
          }),

          PropertyPaneDropdown('valueType', <IPropertyPaneDropdownProps>{
            label: 'Value type',
            options: gridChartsOptionsGroup.valueTypeChoices,
          }),

          PropertyPaneDropdown('valueOperator', <IPropertyPaneDropdownProps>{
            label: 'Value operator',
            options: gridChartsOptionsGroup.valueOperatorChoices,
          }),

        ]}, // this group
/* */

        // 2 - Source and destination list information    
        { groupName: 'Prop Pane Picker examples (DEV)',
        isCollapsed: true ,
        groupFields: [

          PropertyFieldSitePicker('sites', {
            label: 'Select sites',
            initialSites: webPartProps.sites,
            context: context,
            deferredValidationTime: 300,
            multiSelect: false,
            onPropertyChange: onPropertyPaneFieldChanged,
            properties: webPartProps,
            key: 'sitesFieldId'
          }),

          PropertyPaneLabel('Selected Url', {
            text: selectedUrl,

          }),

          PropertyFieldListPicker('lists', {
            label: 'Select a list',
            selectedList: webPartProps.lists,
            includeHidden: false,
            orderBy: PropertyFieldListPickerOrderBy.Title,
            disabled: false,
            onPropertyChange: onPropertyPaneFieldChanged,
            properties: webPartProps,
            context: context,
            onGetErrorMessage: null,
            webAbsoluteUrl: webAbsoluteUrl,
            deferredValidationTime: 0,
            includeListTitleAndUrl: true,
            key: 'listPickerFieldId'
          }),

        ]}, // this group
/* */

        // 2 - Source and destination list information    
        { groupName: 'Search settings',
        isCollapsed: true ,
        groupFields: [
  
          PropertyPaneTextField('carrotCats', {
            label: 'Hiearchy columns',
            description: 'comma separated column names (3 max)'
          }),

          PropertyPaneTextField('dropDownColumns', {
            label: 'Dropdown Columns',
            description: 'comma separated column names'
          }),

          PropertyPaneTextField('searchColumns', {
            label: 'Search Columns',
            description: 'comma separated column names'
          }),

          PropertyPaneTextField('metaColumns', {
            label: 'Meta Columns',
            description: 'comma separated column names'
          }),

          PropertyPaneDropdown('scaleMethod', <IPropertyPaneDropdownProps>{
            label: 'Time scale method',
            options: gridChartsOptionsGroup.scaleMethodChoices,
          }),
          
          PropertyPaneToggle('enableSearch', {
            label: 'Allow for text searching',
            offText: 'Off',
            onText: 'On',
          }),


        ]}, // this group
/* */

        { groupName: 'Performance Properties',
        isCollapsed: true ,
        groupFields: [

          //minDataDownload

          PropertyPaneToggle('minDataDownload', {
            label: 'Download only required item data',
            offText: 'Everything',
            onText: 'Minimual',
          }),

          PropertyPaneSlider('fetchCount', {
            label: 'Load this many items from PC',
            min: 100,
            max: 5000,
            step: 500,
            value: webPartProps.fetchCount,
          }),

          PropertyPaneSlider('fetchCountMobile', {
            label: 'Load this many items',
            min: 100,
            max: 2000,
            step: 100,
            value: webPartProps.fetchCountMobile,
            disabled: true,
          }),

          PropertyPaneTextField('restFilter', {
            label: 'Rest filter to load only specific items.',
            description: 'See Github Wiki for examples',
            multiline: true,
            value: webPartProps.restFilter,
          }),

        ]}, // this group

        /*
        // 2 - Source and destination list information    
        { groupName: 'Styling',
        isCollapsed: true ,

        groupFields: [

          PropertyPaneTextField('yearStyles', {
            label: 'css for Year headings'
          }),

          PropertyPaneTextField('monthStyles', {
            label: 'css for Month headings'
          }),

          PropertyPaneTextField('dayStyles', {
            label: 'css for Day headings'
          }),
          
          PropertyPaneTextField('cellStyles', {
            label: 'css for Cell headings'
          }),
                      
          PropertyPaneTextField('otherStyles', {
            label: 'Other styles',
            disabled: true,
          }),

          PropertyPaneTextField('hoverInfo', {
            label: 'Hover settings',
            disabled: true,
          }),

        ]}, // this group

        // 2 - Source and destination list information    
        { groupName: 'Squares styling',
        isCollapsed: true ,
        groupFields: [

          
          PropertyPaneDropdown('cellColor', <IPropertyPaneDropdownProps>{
            label: 'Cell color',
            options: gridChartsOptionsGroup.cellColorChoices,
          }),

          //squareCustom
          PropertyPaneTextField('squareCustom', {
            label: 'Must be 4 colors , separated',
            disabled: webPartProps.cellColor === 'custom' ? false : true,
            description: 'Empty/Gap,Level1,Level2,Level3',
          }),

          PropertyFieldColorPicker('squareColor', {
            label: 'Square Color',
            selectedColor: webPartProps.squareColor,
            onPropertyChange: onPropertyPaneFieldChanged,
            properties: webPartProps,
            disabled: webPartProps.cellColor === 'swatch' ? false : true,
            isHidden: false,
            alphaSliderHidden: false,
            style: PropertyFieldColorPickerStyle.Inline,
            iconName: 'Color',
            key: 'squareColorFieldId'
          }),

          PropertyFieldColorPicker('backGroundColor', {
            label: 'Background Color',
            selectedColor: webPartProps.backGroundColor,
            onPropertyChange: onPropertyPaneFieldChanged,
            properties: webPartProps,
            disabled: webPartProps.cellColor === 'swatch' ? false : true,
            isHidden: false,
            alphaSliderHidden: false,
            style: PropertyFieldColorPickerStyle.Inline,
            iconName: 'Color',
            key: 'backGroundColorFieldId'
          }),


          PropertyFieldColorPicker('emptyColor', {
            label: 'Empty Color',
            selectedColor: webPartProps.emptyColor,
            onPropertyChange: onPropertyPaneFieldChanged,
            properties: webPartProps,
            disabled: webPartProps.cellColor === 'swatch' ? false : true,
            isHidden: false,
            alphaSliderHidden: false,
            style: PropertyFieldColorPickerStyle.Inline,
            iconName: 'Color',
            key: 'emptyColorFieldId'
          }),


        ]}, // this group

        */
          /* 

        // 9 - Other web part options
        { groupName: 'Pivot Styles (headings) - future use',
          isCollapsed: true ,
          groupFields: [
            PropertyPaneDropdown('pivotSize', <IPropertyPaneDropdownProps>{
              label: strings.FieldLabel_PivSize,
              options: pivotOptionsGroup.pivSizeChoices,
              disabled: true,
            }),
            PropertyPaneDropdown('pivotFormat', <IPropertyPaneDropdownProps>{
              label: strings.FieldLabel_PivFormat,
              options: pivotOptionsGroup.pivFormatChoices,
              disabled: true,
            }),
            PropertyPaneDropdown('pivotOptions', <IPropertyPaneDropdownProps>{
              label: strings.FieldLabel_PivOptions,
              options: pivotOptionsGroup.pivOptionsChoices,
              disabled: true,
            }),
          ]}, // this group
          */

        ]}; // Groups
  } // getPropertyPanePage()
}

export let introPage = new IntroPage();