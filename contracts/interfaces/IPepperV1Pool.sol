// SPDX-License-Identifier: GPL-2.0-or-later
pragma solidity >=0.5.0;

import './pool/IPepperV1PoolImmutables.sol';
import './pool/IPepperV1PoolState.sol';
import './pool/IPepperV1PoolDerivedState.sol';
import './pool/IPepperV1PoolActions.sol';
import './pool/IPepperV1PoolOwnerActions.sol';
import './pool/IPepperV1PoolEvents.sol';

/// @title The interface for a Pepper V1 Pool
/// @notice A Pepper pool facilitates swapping and automated market making between any two assets that strictly conform
/// to the ERC20 specification
/// @dev The pool interface is broken up into many smaller pieces
interface IPepperV1Pool is
    IPepperV1PoolImmutables,
    IPepperV1PoolState,
    IPepperV1PoolDerivedState,
    IPepperV1PoolActions,
    IPepperV1PoolOwnerActions,
    IPepperV1PoolEvents
{

}
