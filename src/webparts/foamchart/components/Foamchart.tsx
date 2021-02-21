import * as React from 'react';
import styles from './Foamchart.module.scss';
import { IFoamchartProps } from './IFoamchartProps';
import { escape } from '@microsoft/sp-lodash-subset';

import { FoamTree, CarrotSearchFoamTree } from "@carrotsearch/foamtree";

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

  }
  
  public componentDidUpdate() {
    /*
    if (this.props.groups !== this.foamtree.get("dataObject").groups) {
    this.foamtree.set("dataObject", {
      groups: this.props.groups
    });
    }
    */
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
                <div id='visualization' style={{height: "500px"}}></div>
                { this.foamtree }
            </div>
          </div>
        </div>
      </div>
    );
  }
}
