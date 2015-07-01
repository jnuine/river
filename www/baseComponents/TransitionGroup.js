// From https://gist.github.com/tkafka/0d94c6ec94297bb67091
'use strict';

import Velocity from 'velocity-animate';
import React from 'react/addons';
const { TransitionGroup } = React.addons;

const transitions = {
	// Forcefeeding: property order = [after, before]
	'slide-forward': {
		duration: 200,
    easing: [0.23, 1, 0.32, 1],
		enter: {
			translateX: [ '0%', '100%' ]
		},
		leave: {
			translateX: [ '-100%', '0%' ]
		}
	},
	'slide-back': {
		duration: 200,
    easing: [0.23, 1, 0.32, 1],
		enter: {
			translateX: [ '0%', '-100%' ]
		},
		leave: {
			translateX: [ '100%', '0%' ]
		}
	},
	'slideover-forward': {
		duration: 200,
    easing: [0.23, 1, 0.32, 1],
		enter: {
			translateX: [ '0%', '100%' ],
			zIndex: [ 1, 1 ]
		},
		leave: {
			zIndex: [ 0, 0 ]
		}
	},
	'slideover-back': {
		duration: 200,
    easing: [0.23, 1, 0.32, 1],
		enter: {
			zIndex: [ 0, 0 ]
		},
		leave: {
			translateX: [ '100%', '0%' ],
			zIndex: [ 1, 1 ]
		}
	},
	default: {
		duration: 200,
    easing: [0.23, 1, 0.32, 1],
		enter: {
			opacity: [ 1, 0 ],
		},
		leave: {
			opacity: [ 0, 1 ],
		}
	}
};

class VelocityTransitionGroupChild extends React.Component {
	static propTypes = {
		transitionName: React.PropTypes.string.isRequired
	}

  getTransition () {
    if (!transitions[this.props.transitionName]) {
      logger.warn(`TransitionName${this.props.transitionName} wasn\'t found in VelocityTransitionGroupChild transitions.`);
    }
    return transitions[this.props.transitionName] || transitions.default;
  }

  componentWillEnter (done) {
    let node = React.findDOMNode(this);
    let transition = this.getTransition();
    Velocity(
      node,
      transition.enter,
      {
        duration: transition.duration,
        easing: transition.easing || 'linear',
        complete: done
      }
    );
  }

  componentWillLeave (done) {
    let node = React.findDOMNode(this);
    let transition = this.getTransition();
    Velocity(
      node,
      transition.leave,
      {
        duration: transition.duration,
        easing: transition.easing || 'linear',
        complete: done
      }
    );
  }

  render () {
    return React.Children.only(this.props.children);
  }
}

class VelocityTransitionGroup extends React.Component {
  static propTypes = {
    transitionName: React.PropTypes.string.isRequired
  }

  wrapChild (child) {
    return (
      <VelocityTransitionGroupChild
        transitionName={this.props.transitionName}>
        {child}
      </VelocityTransitionGroupChild>
    );
  }

  render () {
    return (
      <TransitionGroup
        {...this.props}
        childFactory={this.wrapChild.bind(this)}
      />
    );
  }
}

export default VelocityTransitionGroup;
