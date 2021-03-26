import * as React from 'react';

//import { IHelpTableRow, IHelpTable, IPageContent, ISinglePageProps } from '../Component/ISinglePageProps';
import { IHelpTableRow, IHelpTable, IPageContent, ISinglePageProps } from '@mikezimm/npmfunctions/dist/HelpInfo/Component/ISinglePageProps';

export function aboutTable() {

    let table : IHelpTable  = {
        heading: 'Version History',
        headers: ['Date','Version','Focus','Notes'],
        rows: [],
    };

    table.rows.push( ['2021-03-26', '1.0.0.7',    <span>Control over styling and data button visibility, npmFunctions v1.0.26</span>,                ''] );
    table.rows.push( ['2021-03-19', '1.0.0.6',    <span>Add pass-down props for data and layout buttons, npmFunctions v1.0.15</span>,                ''] );
    table.rows.push( ['2021-03-19', '1.0.0.5',    <span>Update EarlyAccess and Tricks from npmFunctions v1.0.15</span>,                ''] );
    table.rows.push( ['2021-03-16', '1.0.0.4',    <span>Fix foam Height, update PropPane with styles, options, data choices</span>,                ''] );
    table.rows.push( ['2021-03-14', '1.0.0.2',    <span></span>,                ''] );
    table.rows.push( ['2020-11-12', '1.0.0.1',    <span>Testing</span>,                                                   ''] );

    /*
    table.rows.push( ['2021-00-00', '1.0.0.0',    <span>Add support to view <b>List attachments, List link, Stat chart updates</b></span>,    ''] );
    */
    
    return { table: table };

}