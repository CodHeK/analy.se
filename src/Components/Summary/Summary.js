import React, { Component } from "react";
import "./Summary.scss";

class Summary extends Component {
    constructor(props) {
        super(props);
    }
    
    render() {
        const fileData = this.props;
        return (
            <div className="Summary col-md-5 col-xs-12">
                <div className="row sum">
                    <div className="col-md-9">
                        <strong><h1 className="lang">{fileData.extension} (&nbsp;<span className="each-total-files">{fileData.fileCount}</span>&nbsp;)</h1></strong>
                    </div>
                    <div className="col-md-3">
                        <div style={{ backgroundColor: `${fileData.color}`, width: '16px', height: '16px', textAlign: 'right', marginTop: '1.1vw', borderRadius: '50%' }}></div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Summary;
