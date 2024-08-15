// SPDX-License-Identifier: GPL-2.0-or-later
pragma solidity >=0.5.0;

import './pool/IPepperV3PoolImmutables.sol';
import './pool/IPepperV3PoolState.sol';
import './pool/IPepperV3PoolDerivedState.sol';
import './pool/IPepperV3PoolActions.sol';
import './pool/IPepperV3PoolOwnerActions.sol';
import './pool/IPepperV3PoolEvents.sol';

/// @title The interface for a Pepper V1 Pool
/// @notice A Pepper pool facilitates swapping and automated market making between any two assets that strictly conform
/// to the ERC20 specification
/// @dev The pool interface is broken up into many smaller pieces
interface IPepperV3Pool is
    IPepperV3PoolImmutables,
    IPepperV3PoolState,
    IPepperV3PoolDerivedState,
    IPepperV3PoolActions,
    IPepperV3PoolOwnerActions,
    IPepperV3PoolEvents
{

}
