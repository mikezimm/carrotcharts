import * as React from 'react';
import styles from './Foamchart.module.scss';
import { IFoamchartProps } from './IFoamchartProps';
import { escape } from '@microsoft/sp-lodash-subset';

import { FoamTree } from "@carrotsearch/foamtree";

export default class Foamchart extends React.Component<IFoamchartProps, {}> {
  private foamtree = null;

  public componentDidMount() {
      this.foamtree = new FoamTree({
        id: "visualization",

        fadeDuration: 1500,
        layoutByWeightOrder: false,
        stacking: 'flattened',
        layout: 'relaxed',

        // Show the relaxation
        relaxationVisible: true,

        // Make the relaxation last longer
        relaxationQualityThreshold: 0,
        relaxationMaxDuration: 15000,

        dataObject: {
          
          groups: [
            { id: "1", label: "Group 1a", weight: 10, groups: [
              { id: "1.1", label: "Group 1.1", weight: 20 },
              { id: "1.2", label: "Group 1.2", weight: 20 }
            ]},
            { id: "2", label: "Group 2b", weight: 50, groups: [
              { id: "2.1", label: "Group 2.1", weight: 20 },
              { id: "2.2", label: "Group 2.2", weight: 10 }
            ]},
            { id: "3", label: "Group 3c", weight: 30, groups: [
              { id: "3.1", label: "Group 3.1", weight: 30 },
              { id: "3.2", label: "Group 3.2", weight: 90 }
            ]},
            { id: "4", label: "Group 4d", weight: 5, groups: [
              { id: "4.1", label: "Group 4.1", weight: 150 },
              { id: "4.2", label: "Group 4.2", weight: 50 }
            ]},
            { id: "5", label: "Group 5e", weight: 20, groups: [
              { id: "5.1", label: "Group 5.1", weight: 20 },
              { id: "5.2", label: "Group 5.2", weight: 80 }
            ]}
          ]
        }
    });

  }
  
  public componentDidUpdate() {

  }
  
  public componentWillUnmount() {
    this.foamtree.dispose();
  }
  
  /*
  render() {
    return <div style={{height: "100%"}} ref={e => this.element = e}></div>;
  }
  */

  public render(): React.ReactElement<IFoamchartProps> {


    return (
      <div className={ styles.foamchart }>
        <div className={ styles.container }>
          <div className={ styles.row }>
            <div className={ styles.column }>
                <div id='visualization' style={{height: "300px", width: "600px"}}></div>
                { this.foamtree }
            </div>
          </div>
        </div>
      </div>
    );
  }
}
