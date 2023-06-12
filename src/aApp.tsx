import React, { Component } from 'react';
import DataStreamer, { ServerRespond } from './DataStreamer';
import Graph from './Graph';
import './App.css';

/**
 * State declaration for <App />
 */
interface IState {
  data: ServerRespond[];
  showGraph: boolean; // Added showGraph property
}

/**
 * The parent element of the react app.
 * It renders title, button and Graph react element.
 */
class App extends Component<{}, IState> {
  constructor(props: {}) {
    super(props);

    this.state = {
      data: [],
      showGraph: false, // Set initial state of showGraph to false
    };
  }

  /**
   * Render Graph react component with state.data parse as property data
   */
  renderGraph() {
    // Only render the graph when showGraph is true
    if (this.state.showGraph) {
      return <Graph data={this.state.data} />;
    }
    return null; // Return null if showGraph is false
  }

  /**
   * Get new data from server and update the state with the new data
   */
  getDataFromServer() {
    const interval = setInterval(() => {
      DataStreamer.getData((serverResponds: ServerRespond[]) => {
        // Update the state by creating a new array of data that consists of
        // Previous data in the state and the new data from server
        this.setState({ data: [...this.state.data, ...serverResponds] });
      });
    }, 100); // Fetch data every 100ms

    // Stop fetching data when the app is closed or no more data is returned
    // You can implement this based on your specific requirements
    // For example, you can use a condition to check if there is no more data
    // and call clearInterval(interval) to stop the interval process.
  }

  /**
   * Render the App react component
   */
  render() {
    return (
      <div className="App">
        <header className="App-header">
          Bank & Merge Co Task 2
        </header>
        <div className="App-content">
          <button
            className="btn btn-primary Stream-button"
            onClick={() => {
              // Update showGraph to true when the button is clicked
              this.setState({ showGraph: true });
              this.getDataFromServer();
            }}
          >
            Start Streaming Data
          </button>
          <div className="Graph">{this.renderGraph()}</div>
        </div>
      </div>
    );
  }
}

export default App;
