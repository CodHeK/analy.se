import React, { Component } from "react";
import Dropzone from '../Dropzone/Dropzone';
import "./Dashboard.scss";

class Dashboard extends Component {
    render() {
        return (
            <div className="Dashboard">
                <div className="outer-title-box">
                    <h1 className="title">ana<span className="dot">.</span>ly</h1>
                    {/*<div className="dash"></div>*/}
                </div>
                <section className="main-content">
                    <div className="outer-card">
                        <Dropzone onFilesAdded={console.log} />
                    </div>
                </section>
            </div>
        );
    }
}

export default Dashboard;
