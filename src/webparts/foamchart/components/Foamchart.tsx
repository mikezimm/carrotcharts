import * as React from 'react';
import styles from './Foamchart.module.scss';
import { IFoamchartProps } from './IFoamchartProps';
import { escape } from '@microsoft/sp-lodash-subset';

import { getFakeFoamTreeData } from './FakeFoamTreeData';

import { FoamTree } from "@carrotsearch/foamtree";

import { IFoamTree, IFoamTreeDataObject } from '@mikezimm/npmfunctions/dist/IFoamTree';

export default class Foamchart extends React.Component<IFoamchartProps, {}> {
  private foamtree: IFoamTree = null;

  public componentDidMount() {

      this.foamtree = getFakeFoamTreeData();

  }
  
  public componentDidUpdate() {

  }
  /*
  public componentWillUnmount() {
    this.foamtree.dispose();
  }
  */
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
