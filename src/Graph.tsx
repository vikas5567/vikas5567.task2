import React, { Component } from 'react';
import { Table } from '@finos/perspective';
import { ServerRespond } from './DataStreamer';
import './Graph.css';

interface IProps {
  data: ServerRespond[],
}

interface PerspectiveViewerElement extends HTMLElement{
  load: (table: Table) => void,
}

class Graph extends Component<IProps, {}> {
  table: Table | undefined;

  render() {
    return React.createElement('perspective-viewer');
  }

  componentDidMount() {
    const elem  = document.getElementsByTagName('perspective-viewer')[0] as unknown as PerspectiveViewerElement;

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
      elem.load(this.table);
      elem.setAttribute('view', 'y_line'); // "y line" is not a valid value. Use "y_line" instead.
      elem.setAttribute('column-pivots', '["stock"]');
      elem.setAttribute('row-pivots', '["timestamp"]');
      elem.setAttribute('columns', '["top_ask_price"]');
      elem.setAttribute('aggregates', 
        {"stock":"distinct count",
         "top_ask_price":"avg", // corrected "top ask_price" to "top_ask_price"
         "top_bid_price":"avg", // corrected "top bid_price" to "top_bid_price"
         "timestamp":"distinct count"});
    }
  }

  componentDidUpdate(prevProps: IProps) {
    if (this.table) {
      // Only update table if data has changed.
      if (JSON.stringify(this.props.data) !== JSON.stringify(prevProps.data)) {
        this.table.update(this.props.data.map((el: any) => {
          return {
            stock: el.stock,
            top_ask_price: el.top_ask && el.top_ask.price || 0,
            top_bid_price: el.top_bid && el.top_bid.price || 0,
            timestamp: el.timestamp,
          };
        }));
      }
    }
  }
}

export default Graph;
