import React, { Component } from 'react'
import $ from 'jquery';
import Summary from '../Summary/Summary';
import './Dropzone.scss';
import { Pie } from 'react-chartjs-2';
import bars from '../../assets/svg-loaders/bars.svg';
let array1 = [];
let allExts = ['js', 'coffee', 'ts', 'jsx', 'py', 'sql', 'db', 'cpp', 'c', 'go', 'scss', 'sass', 'css', 'html',
             'java', 'bash', 'sh', 'less'];

function scanFiles(item) {
    array1.push(item);
    if (item.isDirectory) {
        let directoryReader = item.createReader();
        directoryReader.readEntries(function(entries) {
            entries.forEach(function(entry) {
                scanFiles(entry);
            });
        });
    }
}

async function getFile(fileEntry) {
    try {
        return await new Promise((resolve, reject) => fileEntry.file(resolve, reject));
    } catch (err) {
        console.log(err);
    }
}

function lineCount( text ) {
    var nLines = 0;
    for( var i = 0;  i < text.length;  ++i ) {
        if( text[i] === '\n' ) {
            ++nLines;
        }
    }
    return nLines;
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

class Dropzone extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hightlight: false,
            capturedFiles: [],
            extMap: null,
            root: "<your awesome project name>",
            totalFiles: "counting files ... ",
            locMap: null
        };
        this.fileInputRef = React.createRef();
        this.onDragOver = this.onDragOver.bind(this);
        this.onDragLeave = this.onDragLeave.bind(this);
        this.onDrop = this.onDrop.bind(this);
    }
    
    onDragOver(evt) {
        evt.preventDefault();
        
        if (this.props.disabled) return;
        
        this.setState({ hightlight: true });
    }
    
    onDragLeave() {
        this.setState({ hightlight: false });
    }
    
    onDrop(event) {
        event.preventDefault();
        if (this.props.disabled) return;
        
        const items = event.dataTransfer.items;
        $(".Dropzone, .alert, .outer-title-box").fadeOut(500);
        $(".loader").fadeIn(1000);
        if (this.props.onFilesAdded) {
            for (let i=0; i<items.length; i++) {
                let item = items[i].webkitGetAsEntry();
        
                if (item) {
                    scanFiles(item, []);
                }
            }
            let array2 = [];
            setTimeout(() => {
                let fileExtsMap = new Map();
                this.setState({ root: array1[0].name, totalFiles: array1.length });
                setTimeout(() => {
                    this.setState({ totalFiles: "re-calculating file count ..." });
                }, 2000);
                array1.forEach(async (each) => {
                    if(each.isFile === true) {
                        const path = each.webkitRelativePath || each.fullPath;
                        const sp = path.split(".");
                        const nonDir = path.split("/");
                        const ext = sp[sp.length - 1];
                        if((nonDir.indexOf("node_modules") === -1) &&
                            (nonDir.indexOf("env") === -1)  &&
                            (nonDir.indexOf("venv") === -1) &&
                            (allExts.indexOf(ext) !== -1)) {
                            let rd = new FileReader(), blob = await getFile(each);
                            rd.onload = function (e) {
                                let res = e.target.result;
                                let lines = lineCount(res);
                                let size = blob.size; console.log(size, path);
                                if (fileExtsMap.has(ext)) {
                                    let ct = fileExtsMap.get(ext);
                                    ct.fileCount += 1;
                                    ct.loc += lines;
                                    ct.size += size;
                                    fileExtsMap.set(ext, ct);
                                } else {
                                    fileExtsMap.set(ext, {'fileCount': 1, 'loc': lines, 'size': size });
                                }
                                
                                array2.push(each);
                            }
                            rd.readAsText(blob);
                        }
                    }
                });
                setTimeout(() => {
                    this.setState({ totalFiles: "removing non-code file types 🤔" });
                }, 3000);
                setTimeout(() => {
                    this.setState({ extMap: fileExtsMap, totalFiles: array2.length });
                }, 4000);
                $(".row").fadeIn(4500);
            }, 4500);
            setTimeout(() => {
                this.setState({capturedFiles: array2 });
            }, 5500);
        }
        this.setState({ hightlight: false });
    }
    
    goToHome() {
        window.location.reload();
    }
    
    render() {
        let summary = "", chartData = null, PieChart;
        
        if(this.state.capturedFiles !== undefined && this.state.extMap !== null) {
            let mapData = [], labels = [], data = [], backgroundColor = [];
            console.log(this.state.extMap)
            this.state.extMap.forEach((value, key, map) => {
                let fileObj = {
                    'extension': key,
                    'loc': numberWithCommas(value.loc),
                    'size': value.size,
                    'fileCount': value.fileCount,
                    'color': `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.5)`
                };
                console.log(fileObj)
                labels.push(key); data.push(value.fileCount); backgroundColor.push(fileObj.color);
                mapData.push(fileObj);
            });
            chartData = {
                labels,
                datasets: [
                    {
                        data,
                        backgroundColor,
                    }
                ]
            }
            mapData.sort((a, b) => b.fileCount - a.fileCount);
            summary =  mapData.map((each, key) => {
                return <Summary key={key} fileObj={each} total={this.state.totalFiles} />
            })
        }
        $(".summary-content").fadeIn(5500);
        $(".loader").fadeOut(8500);
        if(chartData !== null)
            PieChart = <div className="chart"><Pie data={chartData} options={{ responsive: true }} width={270} height={270} /></div>
   
        const content = !this.state.hightlight ? "+" : "🙌";
        const alert = this.state.hightlight ?
                    <div className="alert">⚠️ &nbsp; Dropping in the wrong h<span className="special">o</span>le fella 😛</div> :
                    <div className="alert">Drag in your project folder to analy.se 😉</div>;
        return (
            <div className="Dropzone-main">
                <div className={`Dropzone ${this.state.hightlight ? "Highlight" : ""}`}
                     onDragOver={this.onDragOver}
                     onDragLeave={this.onDragLeave}
                     onDrop={this.onDrop}
                     style={{ cursor: this.props.disabled ? "default" : "pointer" }}>
                    <span>{content}</span>
                    <input
                        ref={this.fileInputRef}
                        className="FileInput"
                        type="file"
                        directory="true"
                        webkitdirectory="true"
                        mozdirectory="true"
                        onChange={this.onFilesAdded}
                    />
                </div>
                <div className="summary-content container">
                    <div className="row">
                        <div className="col-md-10 l">
                            <h1 className="root-title">{this.state.root} (<span className="total-files">{this.state.totalFiles}</span>)</h1>
                        </div>
                        <div className="col-md-2 r">
                            <i className="fas fa-arrow-right" onClick={() => this.goToHome()}></i>
                        </div>
                    </div>
                    <br />
                    <h3 className="sub-heading">Languages</h3>
                    <div className="row cont">
                        <div className="col-md-6 col-xs-12">
                            {summary}
                        </div>
                        <div className="col-md-5 col-xs-12">
                            {PieChart}
                        </div>
                    </div>
                </div>
                <div className="loader">
                    <img src={bars} width="50" height="50" /> <br />  <br />
                    Crunching within your project files 🤓
                </div>
                {alert}
            </div>
        );
    }
}

export default Dropzone;