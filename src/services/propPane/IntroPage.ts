import { BaseClientSideWebPart,  } from "@microsoft/sp-webpart-base";
import { IPropertyPanePage, PropertyPaneLabel, IPropertyPaneLabelProps, 
  PropertyPaneHorizontalRule, PropertyPaneTextField, IPropertyPaneTextFieldProps, 
  PropertyPaneLink, IPropertyPaneLinkProps, PropertyPaneDropdown, 
  IPropertyPaneDropdownProps, IPropertyPaneDropdownOption, PropertyPaneToggle, 
  IPropertyPaneConfiguration, PropertyPaneButton, PropertyPaneButtonType, PropertyPaneSlider,
} from "@microsoft/sp-property-pane";
import { PropertyPaneWebPartInformation } from '@pnp/spfx-property-controls/lib/PropertyPaneWebPartInformation';


import * as strings from 'FoamchartWebPartStrings';

import { gridChartsOptionsGroup } from './index';

import * as links from '@mikezimm/npmfunctions/dist/HelpInfo/Links/LinksRepos';   //              { links.gitRepoTrackMyTime.issues }

import { IFoamchartWebPartProps } from '../../webparts/foamchart/FoamchartWebPart';

import { PropertyFieldSitePicker } from '@pnp/spfx-property-controls/lib/PropertyFieldSitePicker';
import { PropertyFieldListPicker, PropertyFieldListPickerOrderBy } from '@pnp/spfx-property-controls/lib/PropertyFieldListPicker';

import { PropertyFieldColorPicker, PropertyFieldColorPickerStyle } from '@pnp/spfx-property-controls/lib/PropertyFieldColorPicker';

import { fpsLogo326 } from '@mikezimm/npmfunctions/dist/SVGIcons/fpsLogo326';

import { FoamAnimations, FoamBorders, FoamColors } from '@mikezimm/npmfunctions/dist/CarrotCharts/IFoamTreeDefaults';

import { WebPartInfoGroup, makePropDataToggles, makePropDataText } from '@mikezimm/npmfunctions/dist/Services/PropPane/zReusablePropPane';

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

    let dataToggles : any[] = makePropDataToggles( ['includeSum','includeCount','includeAvg','includeMax','includeMin' ]);
    dataToggles = makePropDataToggles( ['includeRange' ], dataToggles, 'Off', 'On', false, true );

    let optionToggles : any[] = makePropDataToggles( ['rollHiearchy','changeLayout','changeTitles' ]);

    let sourceListTextFields : any[] = makePropDataText( ['parentListWeb', 'parentListTitle', 'carrotCats', 'dateColumn', 'valueColumn' ]  );

    let searchTextFields : any[] = makePropDataText( ['carrotCats', 'dropDownColumns', 'searchColumns', 'metaColumns'], [],'comma separated column names' );

    return <IPropertyPanePage>
    { // <page1>
      header: {
        description: ''
      },
      displayGroupsAsAccordion: true,
      groups: [
        WebPartInfoGroup( links.gitRepoCarrotCharts, `<h4>This webpart looks at data in a whole new way.</h4>
        <p>Use it to show data in a fun animated way allowing drill down and smooth animation.</p>`),

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
        groupFields: sourceListTextFields.concat([

          PropertyPaneDropdown('valueType', <IPropertyPaneDropdownProps>{
            label: 'Value type',
            options: gridChartsOptionsGroup.valueTypeChoices,
          }),

          PropertyPaneDropdown('valueOperator', <IPropertyPaneDropdownProps>{
            label: 'Value operator',
            options: gridChartsOptionsGroup.valueOperatorChoices,
          }),

        ])
      }, // this group
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
        groupFields: searchTextFields.concat([

          PropertyPaneDropdown('scaleMethod', <IPropertyPaneDropdownProps>{
            label: 'Time scale method',
            options: gridChartsOptionsGroup.scaleMethodChoices,
          }),
          
          PropertyPaneToggle('enableSearch', {
            label: 'Allow for text searching',
            offText: 'Off',
            onText: 'On',
          }),

        ])
      }, // this group
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

        ]},

        // this group
        { groupName: 'Foam Styling',
        isCollapsed: true ,
        groupFields: [

          PropertyPaneSlider('foamChartHeight', {
            label: 'Height of the Foam drawing in px',
            min: 100,
            max: 700,
            step: 50,
            value: webPartProps.foamChartHeight,
          }),

          //'foamAnimations', 'foamColors', 'foamBorders'  FoamAnimations, FoamBorders, FoamColors
          PropertyPaneTextField('foamAnimations', {
            label: 'Animation choices ( , separated )',
            description: 'Valid choices: ' + FoamAnimations.join(', '),
            //disabled: true,
          }),
          PropertyPaneTextField('foamColors', {
            label: 'Color choices ( , separated )',
            description: 'Valid choices: ' + FoamColors.join(', '),
            //disabled: true,
          }),
          PropertyPaneTextField('foamBorders', {
            label: 'Border choices ( , separated )',
            description: 'Valid choices: ' + FoamBorders.join(', '),
            //disabled: true,
          }),
        ]
      },

        { groupName: 'Foam Data Options', 
          isCollapsed: true ,
          groupFields: dataToggles
        },
            // this group  dataToggles
        { groupName: 'Foam UI Options',
            isCollapsed: true ,
            groupFields: optionToggles
          },
          
         // this group
         { groupName: 'Special properties.',
         isCollapsed: true ,
         groupFields: [
 
           PropertyPaneTextField('chartId', {
             label: 'Randomly generated chart ID.',
             description: 'In case you have more than one carrtoChart on the page',
           }),
 
         ]
       },

      //foamChartHeight

        //chartId

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