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
                <div className="row top">
                    <div className="col-md-9">
                        <strong><h1 className="lang">{fileData.extension} (&nbsp;<span className="each-total-files">{fileData.fileCount}</span>&nbsp;)</h1></strong>
                    </div>
                    <div className="col-md-3">
                        <div style={{ backgroundColor: `${fileData.color}`, width: '16px', height: '16px', textAlign: 'right', marginTop: '1.1vw', borderRadius: '50%' }}></div>
                    </div>
                </div>
                <div className="row middle">
                    <div className="col-md-12" style={{ padding: '0', margin: '0' }}>
                        <strong><h1 className="percent">Percentage  - &nbsp;<span className="file-percent">{((fileData.fileCount*100)/(fileData.total)).toFixed(1)}</span>&nbsp;%</h1></strong>
                    </div>
                </div>
                <div className="row bottom">
                    <div className="col-md-12" style={{ padding: '0', margin: '0' }}>
                        <strong><h1 className="percent">LOC  - &nbsp;<span className="file-percent">{fileData.loc}</span>&nbsp;</h1></strong>
                    </div>
                </div>
            </div>
        );
    }
}

export default Summary;
