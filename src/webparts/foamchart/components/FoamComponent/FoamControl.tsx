import * as React from 'react';
import styles from './Foamcontrol.module.scss';
import { IFoamcontrolProps } from './IFoamProps';
import { IFoamcontrolState } from './IFoamState';

import { escape } from '@microsoft/sp-lodash-subset';

import { FoamTree } from "@carrotsearch/foamtree";

import { IFoamTree, IFoamTreeDataObject } from '@mikezimm/npmfunctions/dist/IFoamTree';

import { IFoamTreeList, IFoamItemInfo } from '../GetListData';

import { getFakeFoamTreeData } from '../FakeFoamTreeData';

export default class Foamcontrol extends React.Component<IFoamcontrolProps, IFoamcontrolState> {
  private foamtree: any = null;

  public constructor(props:IFoamcontrolProps){
    super(props);

    let errMessage = '';
    this.state = { 

    };

    // because our event handler needs access to the component, bind 
    //  the component to the function so it can get access to the
    //  components properties (this.props)... otherwise "this" is undefined
    //  If you do not do this here, then you need to pass the entire function.bind(this) to functions.
    // this.onLinkClick = this.onLinkClick.bind(this);

  
  }

  public componentDidMount() {
    this.addTheseItemsToState();
    return true;

  }
  
  /***
*         d8888b. d888888b d8888b.      db    db d8888b. d8888b.  .d8b.  d888888b d88888b 
*         88  `8D   `88'   88  `8D      88    88 88  `8D 88  `8D d8' `8b `~~88~~' 88'     
*         88   88    88    88   88      88    88 88oodD' 88   88 88ooo88    88    88ooooo 
*         88   88    88    88   88      88    88 88~~~   88   88 88~~~88    88    88~~~~~ 
*         88  .8D   .88.   88  .8D      88b  d88 88      88  .8D 88   88    88    88.     
*         Y8888D' Y888888P Y8888D'      ~Y8888P' 88      Y8888D' YP   YP    YP    Y88888P 
*                                                                                         
*                                                                                         
*/

  public componentDidUpdate(prevProps) {

    let refreshMe : any = false;

    let refreshOnThese = [
      'dataKey',
    ];

    if (refreshMe === false) {
      refreshOnThese.map( key => {
        if ( prevProps[key] !== this.props[key] ) { refreshMe = true; }
      });
    }

    if (refreshMe === true) {
      //this.addTheseItemsToState();

      if ( this.foamtree = null ) {
        this.foamtree = new FoamTree(  this.props.foamTreeData );
      } else {
        const dataObject = this.foamtree.get("dataObject");

        dataObject.groups = this.props.foamTreeData.groups;

        this.foamtree.update();
      }

    }

  }
  
  public componentWillUnmount() {
    //this.foamtree.dispose();
    //this.cycleFoamTree(1,10);
  }
  /* */
  /*
  render() {
    return <div style={{height: "100%"}} ref={e => this.element = e}></div>;
  }
  */

  public render(): React.ReactElement<IFoamcontrolProps> {

    let x = this.props.WebpartWidth > 0 ? this.props.WebpartWidth + "px" : "500px";
    let y = this.props.WebpartHeight > 0 ? this.props.WebpartHeight + "px" : "500px";

    return (
      <div className={ styles.foamchart }>
        <div className={ styles.container }>
            <div id='visualization' style={{height: y, width:  x }}></div>
            { this.foamtree }
        </div>
      </div>
    );
  }



  /***
 *     .d8b.  d8888b. d8888b.      d888888b d888888b d88888b .88b  d88. .d8888.      d888888b  .d88b.       .d8888. d888888b  .d8b.  d888888b d88888b 
 *    d8' `8b 88  `8D 88  `8D        `88'   `~~88~~' 88'     88'YbdP`88 88'  YP      `~~88~~' .8P  Y8.      88'  YP `~~88~~' d8' `8b `~~88~~' 88'     
 *    88ooo88 88   88 88   88         88       88    88ooooo 88  88  88 `8bo.           88    88    88      `8bo.      88    88ooo88    88    88ooooo 
 *    88~~~88 88   88 88   88         88       88    88~~~~~ 88  88  88   `Y8b.         88    88    88        `Y8b.    88    88~~~88    88    88~~~~~ 
 *    88   88 88  .8D 88  .8D        .88.      88    88.     88  88  88 db   8D         88    `8b  d8'      db   8D    88    88   88    88    88.     
 *    YP   YP Y8888D' Y8888D'      Y888888P    YP    Y88888P YP  YP  YP `8888Y'         YP     `Y88P'       `8888Y'    YP    YP   YP    YP    Y88888P 
 *                                                                                                                                                    
 *                                                                                                                                                    
 */

    private addTheseItemsToState( ) {

      //this.setState({    });
      //let foamtree : IFoamTree

      if ( this.props.foamTreeData !== null && this.props.generateSample !== true ) {
        let foamtree : any = this.props.foamTreeData ;
        foamtree.id ="visualization";
        this.foamtree = new FoamTree( foamtree );

      } else if ( this.props.generateSample === true ) {
        let foamtree : any = getFakeFoamTreeData( true, .1 );
        foamtree.id ="visualization";
        this.foamtree = new FoamTree( foamtree );

      } else if ( this.props.foamTreeData === null ) {
        let foamtree : any = getFakeFoamTreeData( true, .1 );
        foamtree.id ="visualization";
        this.foamtree = new FoamTree( foamtree );

      } else { 
        
      }

  
      //this.cycleFoamTree(1,10);

      return true;

    }
    
    private cycleFoamTree( iteration: number = 1, max: number ) {

      if ( iteration <= max ) {

        const update = () => {
          const dataObject = this.foamtree.get("dataObject");
          
          let theBigOne = dataObject.groups[ Math.floor(Math.random() * dataObject.groups.length) ];

          dataObject.groups.forEach((g) => {
            if ( g.label === theBigOne.label ) {
              g.weight = ( 1 + Math.random() ) * ( iteration === max ? 30 : 3 ) ;
            } else { g.weight = ( 1 + Math.random() ) ; }
          });
  
          this.foamtree.update();
          setTimeout( () =>  {
            iteration ++;
            this.cycleFoamTree( iteration, max );
          }, 200);
        };

        update();

      } else { 
        return ;
      }

    }

}
