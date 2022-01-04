import React, { Component } from "react";
class QrInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      scannedValue: "",
    };
    this.handleImageChange = this.handleImageChange.bind(this);
  }

  handleImageChange(value) {
    console.log("scannedValue : ", value);
  }

  render() {
    return (
      <div className="camera_input_container">
        <input
          //   style={{ display: "none" }}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={(e) => this.handleImageChange(e.target.value)}
        />
      </div>
    );
  }
}

export default QrInput;
