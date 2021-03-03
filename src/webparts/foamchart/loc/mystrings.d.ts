declare interface IFoamchartWebPartStrings {
  PropertyPaneDescription: string;
  BasicGroupName: string;
  DescriptionFieldLabel: string;

  
  // 1 - Analytics options
  analyticsWeb: string;
  analyticsList: string;
  
}

declare module 'FoamchartWebPartStrings' {
  const strings: IFoamchartWebPartStrings;
  export = strings;
}
