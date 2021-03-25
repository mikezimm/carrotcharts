
import { IFoamTree } from '@mikezimm/npmfunctions/dist/CarrotCharts/IFoamTree';

import { IFoamColor , FoamColors, FoamColorSettings, FoamColorLight, FoamColorDark, FoamColorWarm, FoamColorDefaults } 
    from '@mikezimm/npmfunctions/dist/CarrotCharts/IFoamTreeDefaults';

export function setColorSettings( currentFoamTree: any, newColor: IFoamColor ) { //currentTree: IFoamTree, 

    currentFoamTree = resetTheseColorSettings( currentFoamTree, 'Default', 'set' );
    currentFoamTree = resetTheseColorSettings( currentFoamTree, newColor, 'set' );

    return currentFoamTree;

}

/**
 * This function will clear all color related settings and set new ones.
 * @param newColor
 * @param availColors 
 */
export function resetColorSettings( newColor: IFoamColor, availColors: IFoamColor[] ) { //currentTree: IFoamTree, 

    let newTree: any = { };  //IFoamTree = { dataObject: null, layout: null };

    newTree = resetTheseColorSettings( newTree, 'Default', 'set' );
    newTree = resetTheseColorSettings( newTree, newColor, 'set' );

    return newTree;

}

/**
 * This resets a particular color objects settings to null
 * @param currentTree 
 * @param thisColor 
 * @returns 
 */
export function resetTheseColorSettings( currentTree: IFoamTree, thisColor: IFoamColor, clearOrSet : 'clear' | 'set' ) {

    let colorObject = null;

    if ( thisColor === 'Default' ) { colorObject = FoamColorDefaults; }
    else if ( thisColor === 'Light' ) { colorObject = FoamColorLight; }
    else if ( thisColor === 'Dark' ) { colorObject = FoamColorDark; }
    else if ( thisColor === 'Warm' ) { colorObject = FoamColorWarm; }

    Object.keys( colorObject ).map ( key => {
        currentTree[key] = clearOrSet === 'set' ? colorObject[key]: undefined;
    });

    return currentTree;

}