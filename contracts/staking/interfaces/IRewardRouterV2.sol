// SPDX-License-Identifier: MIT

pragma solidity 0.6.12;

interface IRewardRouterV2 {
    function feeGlpTracker() external view returns (address);

    function stakedKlpTracker() external view returns (address);
}
