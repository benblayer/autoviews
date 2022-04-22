import {AutoFields, ComponentsRepo} from '@autoviews/core';
import React from 'react';
import {CoreSchemaMetaSchema} from '@autoviews/core';
import {TableCell} from '@mui/material';

import {BootstrapTable} from './BootstrapTable';
import {MUITable, MUITableRow} from './MUITable';

export const oneOfEnumLike = 'oneOfEnumLike';
export function detectEnums(node: CoreSchemaMetaSchema): string {
    if (node.type)
    {return node.type as string;}

    if (node.oneOf && node.oneOf.find(alternative => !alternative.const) === undefined)
    {return oneOfEnumLike;}

    throw new Error('cannot resolve type for JSONSchema node ' + JSON.stringify(node));
}

export const basicRepo = new ComponentsRepo('displayRepo', detectEnums)
    .register('string', {
        name: 'textComponent',
        component: (props) => <span>{props.data}</span>
    })
    .register('number', {
        name: 'numberComponent',
        component: (props) => <span>{props.data}</span>
    })
    .register('boolean', {
        name: 'booleanComponent',
        component: (props) => <span>{props.data ? '+' : '-'}</span>
    })
    .register('oneOfEnumLike', {
        name: 'enumComponent',
        component: (props) => <span>{props.data}</span>
    });

export const MUITableRepo = basicRepo
    .clone('MUITableRepo')
    .register('array', {
        name: 'tableComponent',
        component: MUITable
    })
    .register('object', {
        name: 'tableRowComponent',
        component: MUITableRow
    })
    .addWrapper((item) => <TableCell>{item}</TableCell>, {
        include: ['textComponent', 'numberComponent', 'booleanComponent']
    });

export const BootstrapTableRepo = basicRepo
    .clone('BootstrapTableRepo')
    .register('array', {name: 'tableComponent', component: BootstrapTable})
    .register('object', {
        name: 'tableRowComponent',
        component: (props) => (
            <tr>
                <AutoFields {...props} />
            </tr>
        )
    })
    .addWrapper((item) => <td>{item}</td>, {
        include: ['textComponent', 'numberComponent', 'booleanComponent']
    });
