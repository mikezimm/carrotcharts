import * as React from 'react';
import styles from './Foamchart.module.scss';
import { IFoamchartProps } from './IFoamchartProps';
import { escape } from '@microsoft/sp-lodash-subset';

import { FoamTree } from "@carrotsearch/foamtree";

export default class Foamchart extends React.Component<IFoamchartProps, {}> {
  public render(): React.ReactElement<IFoamchartProps> {
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

    return (
      <div className={ styles.foamchart }>
        <div className={ styles.container }>
          <div className={ styles.row }>
            <div className={ styles.column }>
                <div id='visualization'></div>
                { foamtree }
            </div>
          </div>
        </div>
      </div>
    );
  }
}
