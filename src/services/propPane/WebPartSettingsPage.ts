import {
    IPropertyPanePage,
    PropertyPaneLabel,
    IPropertyPaneLabelProps,
    PropertyPaneHorizontalRule,
    PropertyPaneTextField, IPropertyPaneTextFieldProps,
    PropertyPaneLink, IPropertyPaneLinkProps,
    PropertyPaneDropdown, IPropertyPaneDropdownProps,
    IPropertyPaneDropdownOption,
    PropertyPaneSlider,
    PropertyPaneToggle
  } from '@microsoft/sp-property-pane';
//  import { PropertyFieldMultiSelect } from '@pnp/spfx-property-controls/lib/PropertyFieldMultiSelect';
  
  import * as strings from 'FoamchartWebPartStrings';
  import { gridChartsOptionsGroup } from './index';
  
  export class WebPartSettingsPage {

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
  FieldLabel_LocationChoices: string;  // Office, Customer, Traveling, Home
  FieldLabel_DefaultLocation: string; // 

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


    public getPropertyPanePage(webPartProps): IPropertyPanePage {

      let disableEarlyAccess = false;
      if ( window.location.origin.toLowerCase().indexOf('clickster.share') > -1 || window.location.origin.toLowerCase().indexOf('/autoliv/') > -1 ) {
        disableEarlyAccess = true;
      }

      return <IPropertyPanePage>        { // <page2>
        header: {

          description: strings.PropertyPaneDescription,
        },
        displayGroupsAsAccordion: true,
        groups: [

          /** 3 - General how accurate do you want this to be
            roundTime: string; //Up 5 minutes, Down 5 minutes, No Rounding;
            forceCurrentUser: boolean; //false allows you to put in data for someone else
            confirmPrompt: boolean;  //Make user press confirm
          */
          { groupName: 'Advanced options',
            isCollapsed: true ,
          groupFields: [
            
          PropertyPaneToggle('showEarlyAccess', {
            label: 'Show Early Access Banner',
            offText: 'Off',
            onText: 'On',
            disabled: disableEarlyAccess,
          }),
            
         ]}, // this group

      ]}; // Groups 
    } // getPropertyPanePage()

  } // WebPartSettingsPage
  
  export let webPartSettingsPage = new WebPartSettingsPage();