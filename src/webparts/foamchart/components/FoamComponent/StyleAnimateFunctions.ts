
import { IFoamTree } from '@mikezimm/npmfunctions/dist/CarrotCharts/IFoamTree';

import { IFoamAnimation , FoamAnimations, FoamAnimationSettings, FoamAnimateGentle, FoamAnimateFadeIn, FoamAnimateFlyIn, FoamAnimateDefaults } 
    from '@mikezimm/npmfunctions/dist/CarrotCharts/IFoamTreeDefaults';

export function setAnimateSettings( currentFoamTree: any, newAnimate: IFoamAnimation ) { //currentTree: IFoamTree, 

    currentFoamTree = resetTheseAnimateSettings( currentFoamTree, 'Default', 'set' );
    currentFoamTree = resetTheseAnimateSettings( currentFoamTree, newAnimate, 'set' );

    return currentFoamTree;

}

/**
 * This function will clear all animate related settings and set new ones.
 * @param newAnimate
 * @param availAnimates 
 */
export function resetAnimateSettings( newAnimate: IFoamAnimation, availAnimates: IFoamAnimation[] ) { //currentTree: IFoamTree, 

    let newTree: any = { };  //IFoamTree = { dataObject: null, layout: null };

    newTree = resetTheseAnimateSettings( newTree, 'Default', 'set' );
    newTree = resetTheseAnimateSettings( newTree, newAnimate, 'set' );

    return newTree;

}

/**
 * This resets a particular animate objects settings to null
 * @param currentTree 
 * @param thisAnimate 
 * @returns 
 */
export function resetTheseAnimateSettings( currentTree: IFoamTree, thisAnimate: IFoamAnimation, clearOrSet : 'clear' | 'set' ) {

    let animateObject = null;

    if ( thisAnimate === 'Default' ) { animateObject = FoamAnimateDefaults; }
    else if ( thisAnimate === 'Gentle' ) { animateObject = FoamAnimateGentle; }
    else if ( thisAnimate === 'FadeIn' ) { animateObject = FoamAnimateFadeIn; }
    else if ( thisAnimate === 'FlyIn' ) { animateObject = FoamAnimateFlyIn; }

    Object.keys( animateObject ).map ( key => {
        currentTree[key] = clearOrSet === 'set' ? animateObject[key]: undefined;
    });

    return currentTree;

}