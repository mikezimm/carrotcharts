import * as React from 'react';
import styles from './Foamcontrol.module.scss';
import { IFoamcontrolProps } from './IFoamProps';
import { IFoamcontrolState } from './IFoamState';

import { escape } from '@microsoft/sp-lodash-subset';

import { FoamTree } from "@carrotsearch/foamtree";

import { IFoamTree, IFoamTreeDataObject } from '@mikezimm/npmfunctions/dist/IFoamTree';

import { IFoamTreeList, IFoamItemInfo } from '../GetListData';

import { getFakeFoamTreeData, getFakeFoamTreeGroups, fakeGroups1 } from '../FakeFoamTreeData';

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

    this.tryForEachGroup( );
    return;
    
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
    //this.tryFoamTree(1,10);
  }
  /* */
  /*
  render() {
    return <div style={{height: "100%"}} ref={e => this.element = e}></div>;
  }
  */

  public render(): React.ReactElement<IFoamcontrolProps> {

    let x = this.props.WebpartWidth > 0 ? ( this.props.WebpartWidth -30 ) + "px" : "500px";
    let y = this.props.WebpartHeight > 0 ? this.props.WebpartHeight + "px" : "500px";

    let foamBox =  <div><div className={ styles.container }><button onClick={ this.tryForEachGroup.bind(this) } style={{marginRight:'20px'}}>tryForEachGroup</button>
          <button onClick={ this.trySetGroups.bind(this) } style={{marginRight:'20px'}}>trySetGroups</button>
          <button onClick={ this.trySetObject.bind(this) } style={{marginRight:'20px'}}>trySetObject</button>
          <button onClick={ this.tryUpdate.bind(this) } style={{marginRight:'20px'}}>tryUpdate</button>
          <button onClick={ this.tryAttach.bind(this) } style={{marginRight:'20px'}}>tryAttach</button>
          <button onClick={ this.tryNew.bind(this) } style={{marginRight:'20px'}}>tryNew</button>
          <div id='visualization' style={{height: y, width:  x }}></div>
          { this.foamtree }
        </div></div>;

    return (
      <div className={ styles.foamchart } style={{background: 'gray', padding: '15px'}}>
          { foamBox }
      </div>
    );
  }
  
  private getTotalGroupWeight ( groups: any[] ) {
    let total = 0 ;
    groups.map( g=> { if ( g.weight ) { total += g.weight ;} });
    return total;
  } 

 private consoleDataObject( caller: string, obj: string ) {
  let thisDataObject = null;
  let groups : any[] = [];
  if ( obj === 'full' ) {
    thisDataObject = this.foamtree.get();
    groups = thisDataObject.dataObject.groups;

  } else {
    thisDataObject = this.foamtree.get(obj);
    groups = obj === 'dataObject' ? thisDataObject.groups : [];

  }
  console.log('object - ' + caller, this.getTotalGroupWeight( groups ), thisDataObject );
  return;
 }
  /**
   * This will "resize" existing groups and animate as I want
   */
    private tryForEachGroup(  ) {
        this.consoleDataObject( 'tryForEachGroup Before', 'full' );
        let dataObject = this.foamtree.get("dataObject");
        let theBigOne = dataObject.groups[ Math.floor(Math.random() * dataObject.groups.length) ];
        let priorTotal = 0;
        let newTotal = 0;
        dataObject.groups.forEach((g) => {
          if ( g.label === theBigOne.label ) {
            priorTotal += g.weight;
            g.weight = ( 1 + Math.random() ) * ( 30 ) ;
            newTotal += g.weight;
          } else { 
            priorTotal += g.weight;
            g.weight = ( 1 + Math.random() ) ; 
            newTotal += g.weight;
          }
        });

        let newPriorRatio = priorTotal !== 0 ? newTotal / priorTotal : 1;
        console.log('tryForEachGroup totals:', priorTotal, newTotal, newPriorRatio, dataObject.groups );
        dataObject.groups.forEach((g) => {
          g.weight = g.weight / newPriorRatio;
        });
        console.log('tryForEachGroup - newGroups' , dataObject.groups );
        this.foamtree.update();

    }

    /**
     * This gets new data and reanimates by "undrawing" current data and the redrawing with new data... not like a resizing.
     * Seems to do same thing as trySetObject
     */
    private trySetGroups(  ) {
      this.consoleDataObject( 'trySetGroups Before', 'full' );
        const newGroups = getFakeFoamTreeGroups( 90, 1000, fakeGroups1[1] );
        this.foamtree.set({
          fadeDuration: 1500,
          relaxationVisible: true,
          relaxationQualityThreshold: 0,
          relaxationMaxDuration: 1000,
          dataObject: {
            groups: newGroups
          }
        });
      this.consoleDataObject( 'trySetGroups After', 'full' );
    }

    /**
     * This gets new data and reanimates by "undrawing" current data and the redrawing with new data... not like a resizing.
     * Seems to do same thing as trySetGroups
     */
    private trySetObject( ) {
      this.consoleDataObject( 'trySetObject Before', 'dataObject' );
      const newFoamTree = getFakeFoamTreeData( true , 90 );
      this.foamtree.set(newFoamTree);
      this.consoleDataObject( 'trySetObject After', 'dataObject' );
    }

    /**
     * This gets new group data but does not redraw or animate
     */
    private tryUpdate(  ) {
      this.consoleDataObject( 'tryUpdate Before', 'dataObject' );
      const newGroups = getFakeFoamTreeGroups( 90, 1000, fakeGroups1[1] );
      this.foamtree.update( newGroups );
      this.consoleDataObject( 'tryUpdate After', 'dataObject' );
    }

    /**
     * This gets new group data but does not redraw or animate
     */
    private tryAttach(  ) {
      this.consoleDataObject( 'tryAttach Before', 'dataObject' );
      const newGroups = getFakeFoamTreeGroups( 90, 1000, fakeGroups1[1] );
      this.foamtree.attach( newGroups, 1 );
      this.consoleDataObject( 'tryAttach After', 'dataObject' );
    }

    /**
     * This wipes the entire foam chart box element
     */
    private tryNew( ) {
      this.consoleDataObject( 'tryNew Before', 'dataObject' );
      let foamtree : any = getFakeFoamTreeData( true, 90 );
      foamtree.id ="visualization";
      //this.foamtree = foamtree;                 //Causes this error in consoleDataObject:  this.foamtree.get is not a function
      this.foamtree = new FoamTree( foamtree );   // Causes this error in consoleDataObject:  Uncaught FoamTree: visualization already embedded in the element.
      this.consoleDataObject( 'tryNew After', 'dataObject' );
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
        console.log('FoamControl addItemsToState 1:', foamtree );


      } else if ( this.props.generateSample === true ) {
        let foamtree : any = getFakeFoamTreeData( true, 90 );
        foamtree.id ="visualization";
        this.foamtree = new FoamTree( foamtree );
        console.log('FoamControl addItemsToState 2:', foamtree );

      } else if ( this.props.foamTreeData === null ) {
        let foamtree : any = getFakeFoamTreeData( true, 90 );
        foamtree.id ="visualization";
        this.foamtree = new FoamTree( foamtree );
        console.log('FoamControl addItemsToState 3:', foamtree );
        this.consoleDataObject( 'FoamControl addItemsToState 3', 'full' );

      } else { 
        console.log('FoamControl addItemsToState 4:','Did nothing' );

      }

  
      //this.tryFoamTree(1,10);

      return true;

    }
    
    private tryFoamTree( iteration: number = 1, max: number ) {

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
            this.tryFoamTree( iteration, max );
          }, 200);
        };

        update();

      } else { 
        return ;
      }

    }

}
