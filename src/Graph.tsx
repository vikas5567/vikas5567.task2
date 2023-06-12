import React, { Component, ReactElement } from 'react';
import { Table } from '@finos/perspective';
import { ServerRespond } from './DataStreamer';
import './Graph.css';

/**
 * Props declaration for <Graph />
 */
interface IProps {
  data: ServerRespond[];
}

/**
 * Perspective library adds load to HTMLElement prototype.
 * This interface acts as a wrapper for Typescript compiler.
 */
interface PerspectiveViewerElement extends HTMLElement {
  load: (table: Table) => void;
}

/**
 * React component that renders Perspective based on data
 * parsed from its parent through data property.
 */
class Graph extends Component<IProps> {
  // Perspective table
  table: Table | undefined;

  render(): ReactElement {
    return <perspective-viewer />;
  }

  componentDidMount() {
    // Get element to attach the table from the DOM.
    const elem = document.getElementsByTagName('perspective-viewer')[0] as PerspectiveViewerElement;

    const schema = {
      stock: 'string',
      top_ask_price: 'float',
      top_bid_price: 'float',
      timestamp: 'date',
    };

    if (window.perspective && window.perspective.worker()) {
      this.table = window.perspective.worker().table(schema);
    }
    if (this.table) {
      // Add more Perspective configurations here.
      elem.load(this.table);
    }
  }

  componentDidUpdate() {
    // Every time the data prop is updated, insert the data into the Perspective table
    if (this.table && this.props.data.length > 0) {
      const newData = this.props.data[this.props.data.length - 1];
      const formattedData = {
        stock: newData.stock,
        top_ask_price: newData.top_ask && newData.top_ask.price || 0,
        top_bid_price: newData.top_bid && newData.top_bid.price || 0,
        timestamp: newData.timestamp,
      };
      this.table.upsert([formattedData]);
    }
  }

  render(): ReactElement {
    return (
      <perspective-viewer
        view="y_line"
        column-pivots='["stock"]'
        row-pivots='["timestamp"]'
        columns='["top_ask_price"]'
        aggregates='{"stock":"distinct count","top_ask_price":"avg","top_bid_price":"avg","timestamp":"distinct count"}'
      />
    );
  }
}

export default Graph;
