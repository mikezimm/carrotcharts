import * as React from 'react';
import styles from './Foamcontrol.module.scss';
import { IFoamcontrolProps } from './IFoamProps';
import { IFoamcontrolState } from './IFoamState';

import { escape } from '@microsoft/sp-lodash-subset';

import { Spinner, SpinnerSize, SpinnerLabelPosition } from 'office-ui-fabric-react/lib/Spinner';

import { FoamTree } from "@carrotsearch/foamtree";

import { IFoamTree, IFoamTreeDataObject, IFoamTreeGroup } from '@mikezimm/npmfunctions/dist/IFoamTree';

import { IFoamTreeList, IFoamItemInfo } from '../GetListData';

import { getFakeFoamTreeData, getFakeFoamTreeGroups, fakeGroups1, getEmptyFoamTreeData } from '../FakeFoamTreeData';

export default class Foamcontrol extends React.Component<IFoamcontrolProps, IFoamcontrolState> {
  private foamtreeData: any = getEmptyFoamTreeData( );
  private foamtree = null;

  public constructor(props:IFoamcontrolProps){
    super(props);
    console.log( 'CONSTRUCTOR this.props.foamTreeData', this.props.foamTreeData );
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
    console.log( 'DID MOUNT this.props.foamTreeData', this.props.foamTreeData );
    this.foamtree = new FoamTree( this.foamtreeData );
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
    console.log( 'DID UPDATE this.props.foamTreeData', this.props.foamTreeData );
    //this.tryForEachGroup( );
    //return;
    
    let refreshOnThese = [
      'foamTreeData',
    ];

    if (refreshMe === false) {
      refreshOnThese.map( key => {
        if ( prevProps[key] !== this.props[key] ) { refreshMe = true; }
      });
    }

    if (refreshMe === true) {
      //this.addTheseItemsToState();

      if ( this.foamtree === null ) {
        this.addTheseItemsToState();
      } else {
        const dataObject = this.foamtree.get("dataObject");

        dataObject.groups = this.props.foamTreeData.dataObject.groups;

        this.foamtree.update();
      }

    }

  }
  
  public componentWillUnmount() {
    console.log( 'WILL UNMOUNT this.props.foamTreeData', this.props.foamTreeData );
    this.foamtree.dispose();
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
    /*
    let spinner = null;
    if ( this.props.foamTreeData.dataObject.groups.length === 0 ) { 
      y = '1px';
      spinner = <div style={{ width: this.props.WebpartWidth, height: '500px', position: 'absolute', top: '50%', left: '42%' }}>
      <Spinner 
        size={SpinnerSize.large}
        label={ 'Loading data' }
        labelPosition='left'
      ></Spinner>
    </div> ;
    }
*/

    let foamBox = <div><div className={ styles.container }><button onClick={ this.tryForEachGroup.bind(this) } style={{marginRight:'20px'}}>tryForEachGroup</button>
          <button onClick={ this.trySetGroups.bind(this) } style={{marginRight:'20px'}}>trySetGroups</button>
          <button onClick={ this.trySetObject.bind(this) } style={{marginRight:'20px'}}>trySetObject</button>
          <button onClick={ this.tryUpdate.bind(this) } style={{marginRight:'20px'}}>tryUpdate</button>
          <button onClick={ this.tryAttach.bind(this) } style={{marginRight:'20px'}}>tryAttach</button>
          <button onClick={ this.tryNew.bind(this) } style={{marginRight:'20px'}}>tryNew</button>

          <button onClick={ this.showSum.bind(this) } style={{marginRight:'20px'}}>Sum</button>
          <button onClick={ this.showCount.bind(this) } style={{marginRight:'20px'}}>Count</button>
          <button onClick={ this.showAvg.bind(this) } style={{marginRight:'20px'}}>Avg</button>

          <div id='visualization' style={{height: y, width:  x }}></div>
          { this.foamtree }
        </div></div>;

    return (
      <div className={ styles.foamchart } style={{background: 'gray', padding: '15px'}}>
          { foamBox }
          {  }
      </div>
    );
  }
  
  private getTotalGroupWeight ( groups: any[] ) {
    let total = 0 ;
    groups.map( g=> { if ( g.weight ) { total += g.weight ;} });
    return total;
  } 

 private consoleDataObject( caller: string, obj: string, oldKeySummary: any ) {
  let thisDataObject = null;
  let groups : any[] = [];
  if ( obj === 'full' ) {
    thisDataObject = this.foamtree.get();
    groups = thisDataObject.dataObject.groups;

  } else {
    thisDataObject = this.foamtree.get(obj);
    groups = obj === 'dataObject' ? thisDataObject.groups : [];

  }

  let keySummary: any = {};

  let compareTypes = ['string','number','boolean'];
  let ignoreKeys = ['element'];
  Object.keys( thisDataObject ).map( key => {
    let keyType = typeof thisDataObject[key];
    if ( compareTypes.indexOf( keyType ) > -1 && ignoreKeys.indexOf( key ) < 0 ) { 
      keySummary[key] = thisDataObject[key];
    } 
  });

  keySummary = JSON.parse( JSON.stringify( keySummary ) ) ;

  let keyChanges : any = {};
  if ( oldKeySummary !== null ) {
    Object.keys( thisDataObject ).map( key => {
      if ( thisDataObject[key] !== oldKeySummary[key] ) { 
        let keyChange = oldKeySummary[key] + ' >>> ' + thisDataObject[key];
        let ignoreCompares = ['undefined >>> null', 'undefined >>> function(){}','undefined >>> [object HTMLDivElement]','undefined >>> [object Object]','undefined >>> '];
        if ( ignoreCompares.indexOf( keyChange ) < 0 && keyChange.indexOf( 'undefined >>> function' ) < 0 ) { 
          keyChanges[key] = keyChange ;
         }
      } 
    });
  }

  console.log('object - ' + caller, this.getTotalGroupWeight( groups ), keySummary, thisDataObject );
  if ( Object.keys( keyChanges ).length > 0 ) {
    console.log('CHANGES to object - ' + caller, keyChanges );
  }

  return keySummary;
 }

  /**
   * This will change summary operator of existing data... ie count, sum, avg, min, max
   */
  
  private showCount() { this.switchGroupWeights('count'); }
  private showSum() { this.switchGroupWeights('sum'); }
  private showMin() { this.switchGroupWeights('min'); }
  private showMax() { this.switchGroupWeights('max'); }
  private showAvg() { this.switchGroupWeights('avg'); }

  private switchGroupWeights( operator: string  ) {
    let keySummary = this.consoleDataObject( 'switchGroupWeights Before', 'full', null );
    let dataObject = this.foamtree.get("dataObject");
    dataObject.groups = this.setGroupWeight( dataObject.groups, operator );
    console.log('tryForEachGroup - newGroups' , dataObject.groups );
    this.foamtree.update();
    this.foamtree.redraw();
    this.consoleDataObject( 'switchGroupWeights After', 'full', keySummary );
  }

  private setGroupWeight( groups: IFoamTreeGroup[], operator: string ) {
    groups.map( group => {
      group.weight = group[operator];
      if ( group.groups.length > 0 ) { group.groups = this.setGroupWeight( group.groups, operator ) ; }
    });
    return groups;
  }

  /**
   * This will "resize" existing groups and animate as I want
   */
    private tryForEachGroup(  ) {
        this.consoleDataObject( 'tryForEachGroup Before', 'full', null );
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
      this.consoleDataObject( 'trySetGroups Before', 'full', null );
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
      this.consoleDataObject( 'trySetGroups After', 'full', null );
    }

    /**
     * This gets new data and reanimates by "undrawing" current data and the redrawing with new data... not like a resizing.
     * Seems to do same thing as trySetGroups
     */
    private trySetObject( ) {
      this.consoleDataObject( 'trySetObject Before', 'dataObject', null );
      const newFoamTree = getFakeFoamTreeData( true , 90 );
      this.foamtree.set(newFoamTree);
      this.consoleDataObject( 'trySetObject After', 'dataObject', null );
    }

    /**
     * This gets new group data but does not redraw or animate
     */
    private tryUpdate(  ) {
      this.consoleDataObject( 'tryUpdate Before', 'dataObject', null );
      const newGroups = getFakeFoamTreeGroups( 90, 1000, fakeGroups1[1] );
      this.foamtree.update( newGroups );
      this.consoleDataObject( 'tryUpdate After', 'dataObject', null );
    }

    /**
     * This gets new group data but does not redraw or animate
     */
    private tryAttach(  ) {
      this.consoleDataObject( 'tryAttach Before', 'dataObject', null );
      const newGroups = getFakeFoamTreeGroups( 90, 1000, fakeGroups1[1] );
      this.foamtree.attach( newGroups, 1 );
      this.consoleDataObject( 'tryAttach After', 'dataObject', null );
    }

    /**
     * This wipes the entire foam chart box element
     */
    private tryNew( ) {
      this.consoleDataObject( 'tryNew Before', 'dataObject', null );
      let foamtree : any = getFakeFoamTreeData( true, 90 );
      foamtree.id ="visualization";
      //this.foamtree = foamtree;                 //Causes this error in consoleDataObject:  this.foamtree.get is not a function
      this.foamtree = new FoamTree( foamtree );   // Causes this error in consoleDataObject:  Uncaught FoamTree: visualization already embedded in the element.
      this.consoleDataObject( 'tryNew After', 'dataObject', null );
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

      let groups: IFoamTreeGroup[] = [];
      let groupsUpdated = false;

      if ( this.props.generateSample === true ) {
        groups = getFakeFoamTreeGroups( 90, 1000, fakeGroups1[1] );
        groupsUpdated = true;

      } else if ( this.props.foamTreeData.dataObject.groups.length > 0 ) {
        groups = this.props.foamTreeData.dataObject.groups;
        groupsUpdated = true;

      } else { 
        console.log('FoamControl addItemsToState 4:','Did nothing - could be because data has not yet loaded' );

      }


      if ( groupsUpdated === true ) {

        console.log( 'addItemsToState groups:', groups );
        //This does show data once fetched.
        this.foamtree.set({
          dataObject: {
            groups: groups
          }
        });

        //this.foamtree.redraw(); //This does not redraw new groups data

        /* VVVVV   This did not crash but did not update either    VVVVVVVVVVVVVV

        const dataObject = this.foamtree.get("dataObject");
        dataObject.groups = groups;
        this.foamtree.update();
        this.foamtree.set("groupLabelDecorator", (opts, params, vars) => {
          vars.labelText += " (" +
            params.group.weight.toFixed(1) + ")";

        });
        this.foamtree.redraw();
        */
      }


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
