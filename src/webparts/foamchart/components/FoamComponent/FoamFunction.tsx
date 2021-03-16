import * as React from 'react';
import styles from './Foamcontrol.module.scss';
import { IFoamcontrolProps } from './IFoamProps';
import { IFoamcontrolState } from './IFoamState';

import { escape } from '@microsoft/sp-lodash-subset';

import { FoamTree } from "@carrotsearch/foamtree";

import { IFoamTree, IFoamTreeDataObject } from '@mikezimm/npmfunctions/dist/CarrotCharts/IFoamTree';

import { IFoamTreeList, IFoamItemInfo } from '../GetListData';

import { getFakeFoamTreeData } from '../FakeFoamTreeData';


export const FoamFunction: React.FunctionComponent<IFoamcontrolProps> = (props: IFoamcontrolProps) => {

    let x = props.WebpartWidth > 0 ? props.WebpartWidth + "px" : "500px";
    let y = props.WebpartHeight > 0 ? props.WebpartHeight + "px" : "500px";

    let foamtree = new FoamTree( props.foamTreeData );

    return (
      <div className={ styles.foamchart }>
        <div className={ styles.container }>
            <div id='visualization1' style={{height: y, width:  x }}></div>
            { foamtree }
        </div>
      </div>
    );

};
