// SPDX-License-Identifier: MIT

pragma solidity 0.6.12;

import "../libraries/math/SafeMath.sol";
import "../libraries/token/IERC20.sol";

import "../core/interfaces/IKlpManager.sol";

import "./interfaces/IRewardTracker.sol";
import "./interfaces/IRewardTracker.sol";

import "../access/Governable.sol";

// provide a way to migrate staked GLP tokens by unstaking from the sender
// and staking for the receiver
// meant for a one-time use for a specified sender
// requires the contract to be added as a handler for stakedKlpTracker and feeGlpTracker
contract StakedKlpMigrator is Governable {
    using SafeMath for uint256;

    address public sender;
    address public glp;
    address public stakedKlpTracker;
    address public feeGlpTracker;
    bool public isEnabled = true;

    constructor(
        address _sender,
        address _glp,
        address _stakedKlpTracker,
        address _feeGlpTracker
    ) public {
        sender = _sender;
        glp = _glp;
        stakedKlpTracker = _stakedKlpTracker;
        feeGlpTracker = _feeGlpTracker;
    }

    function disable() external onlyGov {
        isEnabled = false;
    }

    function transfer(address _recipient, uint256 _amount) external onlyGov {
        _transfer(sender, _recipient, _amount);
    }

    function _transfer(address _sender, address _recipient, uint256 _amount) private {
        require(isEnabled, "StakedKlpMigrator: not enabled");
        require(_sender != address(0), "StakedKlpMigrator: transfer from the zero address");
        require(_recipient != address(0), "StakedKlpMigrator: transfer to the zero address");

        IRewardTracker(stakedKlpTracker).unstakeForAccount(_sender, feeGlpTracker, _amount, _sender);
        IRewardTracker(feeGlpTracker).unstakeForAccount(_sender, glp, _amount, _sender);

        IRewardTracker(feeGlpTracker).stakeForAccount(_sender, _recipient, glp, _amount);
        IRewardTracker(stakedKlpTracker).stakeForAccount(_recipient, _recipient, feeGlpTracker, _amount);
    }
}
