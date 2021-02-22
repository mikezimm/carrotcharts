import { IPropertyPanePage, PropertyPaneLabel, IPropertyPaneLabelProps, 
    PropertyPaneHorizontalRule, PropertyPaneTextField, IPropertyPaneTextFieldProps, 
    PropertyPaneLink, IPropertyPaneLinkProps, PropertyPaneDropdown, 
    IPropertyPaneDropdownProps, IPropertyPaneDropdownOption, PropertyPaneToggle, 
    IPropertyPaneConfiguration, PropertyPaneButton, PropertyPaneButtonType,
  } from "@microsoft/sp-property-pane";

  import { Pivot, IPivotStyles, PivotLinkSize, PivotLinkFormat } from 'office-ui-fabric-react/lib/Pivot';
  import { Image, ImageFit, ImageCoverStyle,IImageProps,IImageState } from 'office-ui-fabric-react/lib/Image';

  import * as strings from 'FoamchartWebPartStrings';

  export class GridChartsOptionsGroup {
    
    public timeSliderIncChoices: IPropertyPaneDropdownOption[] = <IPropertyPaneDropdownOption[]>[
        {   index: 0,   key: 5, text: "5 minutes"  },
        {   index: 1,   key: 10, text: "10 minutes"  },
        {   index: 2,   key: 15, text: "15 minutes"  },
        {   index: 2,   key: 30, text: "30 minutes"  },
    ];
    
    //Currently may not be neccessary
    public getTimeSliderIncChoices (findMe) {
        return findMe;
    }
    
    //Currently may not be neccessary
    public getTargetItemsChoices (findMe) {

        if (findMe === 'your') {
            return findMe;
        } else if (findMe === 'team') {
            return findMe;
        } else if (findMe === 'others') {
            return findMe;
        }

        return 'notSure';
        
    }

    public monthGapChoices: IPropertyPaneDropdownOption[] = <IPropertyPaneDropdownOption[]>[
        {   index: 0,   key: "0", text: "0 Squares"  },
        {   index: 1,   key: "1", text: "1 Square"  },
        {   index: 2,   key: "2", text: "2 Squares"  },
    ];

    public valueTypeChoices: IPropertyPaneDropdownOption[] = <IPropertyPaneDropdownOption[]>[
        {   index: 0,   key: "Any", text: "Any"  },
        {   index: 1,   key: "Number", text: "Number"  },
        {   index: 2,   key: "Date", text: "Date"  },
    ];

    public valueOperatorChoices: IPropertyPaneDropdownOption[] = <IPropertyPaneDropdownOption[]>[
        {   index: 0,   key: "count", text: "Count"  },
        {   index: 1,   key: "sum", text: "Sum"  },
        {   index: 2,   key: "min", text: "Min"  },
        {   index: 3,   key: "max", text: "Max"  },
    ];

    public cellColorChoices: IPropertyPaneDropdownOption[] = <IPropertyPaneDropdownOption[]>[
        {   index: 0,   key: "green", text: "Green"  },
        {   index: 1,   key: "custom", text: "Custom"  },
        {   index: 2,   key: "swatch", text: "Swatch"  },
       //{   index: 3,   key: "red", text: "Red"  },
        {   index: 3,   key: "dark", text: "Dark Theme"  },
    ];

    public scaleMethodChoices: IPropertyPaneDropdownOption[] = <IPropertyPaneDropdownOption[]>[
        {   index: 0,   key: "slider", text: "Slider"  },
        {   index: 0,   key: "blink", text: "Blink"  },
        {   index: 1,   key: "tbd", text: "TBD"  },
    ];

  }

  export let gridChartsOptionsGroup = new GridChartsOptionsGroup();