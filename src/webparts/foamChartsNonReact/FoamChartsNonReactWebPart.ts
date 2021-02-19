import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { escape } from '@microsoft/sp-lodash-subset';

import styles from './FoamChartsNonReactWebPart.module.scss';
import * as strings from 'FoamChartsNonReactWebPartStrings';

import { FoamTree , CarrotSearchFoamTree } from "@carrotsearch/foamtree";

export interface IFoamChartsNonReactWebPartProps {
  description: string;
}

export default class FoamChartsNonReactWebPart extends BaseClientSideWebPart<IFoamChartsNonReactWebPartProps> {

  public render(): void {
      var foamtree = null;

        foamtree = new FoamTree({
          id: "visualization",
          dataObject: {
            groups: [
              { id: "1", label: "Group 1", groups: [
                { id: "1.1", label: "Group 1.1" },
                { id: "1.2", label: "Group 1.2" }
              ]},
              { id: "2", label: "Group 2", groups: [
                { id: "2.1", label: "Group 2.1" },
                { id: "2.2", label: "Group 2.2" }
              ]},
              { id: "3", label: "Group 3", groups: [
                { id: "3.1", label: "Group 3.1" },
                { id: "3.2", label: "Group 3.2" }
              ]},
              { id: "4", label: "Group 4", groups: [
                { id: "4.1", label: "Group 4.1" },
                { id: "4.2", label: "Group 4.2" }
              ]},
              { id: "5", label: "Group 5", groups: [
                { id: "5.1", label: "Group 5.1" },
                { id: "5.2", label: "Group 5.2" }
              ]}
            ]
          }
      });


    this.domElement.innerHTML = `
      <div class="${ styles.foamChartsNonReact }">
        <div class="${ styles.container }">
          <div class="${ styles.row }">
            <div id="visualization" class="${ styles.column }">
                ${ foamtree }
            </div>
          </div>
        </div>
      </div>`;
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
