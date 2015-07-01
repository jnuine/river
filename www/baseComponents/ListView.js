'use strict';

import React from 'react';

import ScrollView from './ScrollView';
import StaticRenderer from './StaticRenderer';
import ListViewDataSource from './ListViewDataSource';

class ListView extends React.Component {

  constructor (props) {
    super(props);
    this.state = {
      curRenderedRowsCount: props.initialListSize,
      prevRenderedRowsCount: 0
    };
  }

  componentWillMount () {
    // this data should never trigger a render pass, so don't put in state
    this.scrollProperties = {
      visibleHeight: null,
      contentHeight: null,
      offsetY: 0
    };
    this._childFrames = [];
    this._visibleRows = {};
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.dataSource !== nextProps.dataSource) {
      this.setState({ prevRenderedRowsCount: 0 });
    }
  }

  render () {
    var bodyComponents = [];

    var dataSource = this.props.dataSource;
    var allRowIDs = dataSource.rowIdentities;
    var rowCount = 0;
    var sectionHeaderIndices = [];

    var header = this.props.renderHeader && this.props.renderHeader();
    var footer = this.props.renderFooter && this.props.renderFooter();
    var totalIndex = header ? 1 : 0;

    for (var sectionIdx = 0; sectionIdx < allRowIDs.length; sectionIdx++) {
      var sectionID = dataSource.sectionIdentities[sectionIdx];
      var rowIDs = allRowIDs[sectionIdx];
      if (rowIDs.length === 0) {
        continue;
      }

      if (this.props.renderSectionHeader) {
        var shouldUpdateHeader = rowCount >= this.state.prevRenderedRowsCount &&
          dataSource.sectionHeaderShouldUpdate(sectionIdx);
        bodyComponents.push(
          <StaticRenderer
            key={'s_' + sectionID}
            shouldUpdate={!!shouldUpdateHeader}
            render={this.props.renderSectionHeader.bind(
              null,
              dataSource.getSectionHeaderData(sectionIdx),
              sectionID
            )}
          />
        );
        sectionHeaderIndices.push(totalIndex++);
      }

      for (var rowIdx = 0; rowIdx < rowIDs.length; rowIdx++) {
        var rowID = rowIDs[rowIdx];
        var comboID = sectionID + rowID;
        var shouldUpdateRow = rowCount >= this.state.prevRenderedRowsCount &&
          dataSource.rowShouldUpdate(sectionIdx, rowIdx);
        var row =
          <StaticRenderer
            key={'r_' + comboID}
            shouldUpdate={!!shouldUpdateRow}
            render={this.props.renderRow.bind(
              null,
              dataSource.getRowData(sectionIdx, rowIdx),
              sectionID,
              rowID
            )}
          />;
        bodyComponents.push(row);
        totalIndex++;
        if (++rowCount === this.state.curRenderedRowsCount) {
          break;
        }
      }
      if (rowCount >= this.state.curRenderedRowsCount) {
        break;
      }
    }

    var props = Object.assign(
      {},
      this.props,
      {
        onScroll: this._onScroll,
        stickyHeaderIndices: sectionHeaderIndices,
      }
    );

    return (
      <ScrollView {...props} ref={c => this.scrollView = c}>
        {header}
        {bodyComponents}
        {footer}
      </ScrollView>
    );
  }

}

ListView.propTypes = {
  dataSource: React.PropTypes.instanceOf(ListViewDataSource),
  initialListSize: React.PropTypes.number,
  onEndReached: React.PropTypes.func,
  onEndReachedThreshold: React.PropTypes.number,
  pageSize: React.PropTypes.number,
  removeClippedSubviews: React.PropTypes.bool,
  renderFooter: React.PropTypes.func,
  renderHeader: React.PropTypes.func,
  renderRow: React.PropTypes.func,
  renderSectionHeader: React.PropTypes.func,
  scrollRenderAheadDistance: React.PropTypes.number
};

ListView.DataSource = ListViewDataSource;

export default ListView;
