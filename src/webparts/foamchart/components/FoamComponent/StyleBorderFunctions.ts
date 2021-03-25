
import { IFoamTree } from '@mikezimm/npmfunctions/dist/CarrotCharts/IFoamTree';

import { IFoamBorder , FoamBorders, FoamBorderSettings, FoamBordersRound, FoamBordersNone, FoamBordersStraight, FoamBordersDefaults } 
    from '@mikezimm/npmfunctions/dist/CarrotCharts/IFoamTreeDefaults';

export function setBorderSettings( currentFoamTree: any, newBorder: IFoamBorder ) { //currentTree: IFoamTree, 

    currentFoamTree = resetTheseBorderSettings( currentFoamTree, 'Default', 'set' );
    currentFoamTree = resetTheseBorderSettings( currentFoamTree, newBorder, 'set' );

    return currentFoamTree;

}

/**
 * This function will clear all border related settings and set new ones.
 * @param newBorder
 * @param availBorders 
 */
export function resetBorderSettings( newBorder: IFoamBorder, availBorders: IFoamBorder[] ) { //currentTree: IFoamTree, 

    let newTree: any = { };  //IFoamTree = { dataObject: null, layout: null };

    newTree = resetTheseBorderSettings( newTree, 'Default', 'set' );
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
    
    if ( thisBorder === 'Default' ) { borderObject = FoamBordersDefaults; }
    else if ( thisBorder === 'None' ) { borderObject = FoamBordersNone; }
    else if ( thisBorder === 'Round' ) { borderObject = FoamBordersRound; }
    else if ( thisBorder === 'Straight' ) { borderObject = FoamBordersStraight; }

    Object.keys( borderObject ).map ( key => {
        currentTree[key] = clearOrSet === 'set' ? borderObject[key]: undefined;
    });

    return currentTree;

}