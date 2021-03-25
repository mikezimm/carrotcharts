
import { IFoamTree } from '@mikezimm/npmfunctions/dist/CarrotCharts/IFoamTree';

import { IFoamBorder , FoamBorders, FoamBorderSettings, FoamBordersRound, FoamBordersNone, FoamBordersStraight } 
    from '@mikezimm/npmfunctions/dist/CarrotCharts/IFoamTreeDefaults';

import { IFoamAnimation , FoamAnimations, FoamAnimationSettings, FoamAnimateGentle, FoamAnimateFadeIn, FoamAnimateFlyIn } 
    from '@mikezimm/npmfunctions/dist/CarrotCharts/IFoamTreeDefaults';

import { IFoamColor , FoamColors, FoamColorSettings, FoamColorLight, FoamColorDark, FoamColorWarm } 
    from '@mikezimm/npmfunctions/dist/CarrotCharts/IFoamTreeDefaults';


/**
 * This function will clear all border related settings and set new ones.
 * @param newBorder
 * @param availBorders 
 */
export function resetBorderSettings( newBorder: IFoamBorder, availBorders: IFoamBorder[] ) { //currentTree: IFoamTree, 

    let newTree: any = { };  //IFoamTree = { dataObject: null, layout: null };

    availBorders.map( thisBorder => {
        newTree = resetTheseBorderSettings( newTree, thisBorder, 'clear' );
    });

    newTree = resetTheseBorderSettings( newTree, newBorder, 'set' );

    return newTree;

}

/**
 * This resets a particular border objects settings to null
 * @param currentTree 
 * @param thisBorder 
 * @returns 
 */
export function resetTheseBorderSettings( currentTree: IFoamTree, thisBorder: IFoamBorder, clearOrSet : 'clear' | 'set' ) {

    let borderObject = null;
    if ( thisBorder === 'None' ) { borderObject = FoamBordersNone; }
    else if ( thisBorder === 'Round' ) { borderObject = FoamBordersRound; }
    else if ( thisBorder === 'Straight' ) { borderObject = FoamBordersStraight; }

    Object.keys( borderObject ).map ( key => {
        currentTree[key] = clearOrSet === 'set' ? borderObject[key]: undefined;
    });

    return currentTree;

}