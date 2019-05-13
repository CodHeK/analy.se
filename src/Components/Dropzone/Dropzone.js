import React, { Component } from 'react'
import $ from 'jquery';
import './Dropzone.scss'
let array1 = [];

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

class Dropzone extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hightlight: false,
            capturedFiles: []
        };
        this.fileInputRef = React.createRef();
        this.openFileDialog = this.openFileDialog.bind(this);
        this.onFilesAdded = this.onFilesAdded.bind(this);
        this.onDragOver = this.onDragOver.bind(this);
        this.onDragLeave = this.onDragLeave.bind(this);
        this.onDrop = this.onDrop.bind(this);
    }
    
    openFileDialog() {
        if (this.props.disabled) return;
        this.fileInputRef.current.click();
    }
    
    fileListToArray(list) {
        const array = [];
        for (var i = 0; i < list.length; i++) {
            array.push(list.item(i));
        }
        return array;
    }
    
    onFilesAdded(evt) {
        if (this.props.disabled) return;
        const files = evt.target.files;
        if (this.props.onFilesAdded) {
            const array = this.fileListToArray(files);
            this.setState({ capturedFiles: array });
        }
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
        $(".Dropzone, .alert").fadeOut(500);
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
                array1.forEach(each => {
                    if(each.isFile === true) {
                        const path = each.webkitRelativePath || each.fullPath;
                        const sp = path.split(".");
                        const ext = sp[sp.length - 1];
                        if(ext === 'js' || ext === 'py' || ext === 'java' || ext === 'cpp' || ext === 'c' || ext === 'json') {
                            if (fileExtsMap.has(ext)) {
                                let ct = fileExtsMap.get(ext);
                                ct += 1;
                                fileExtsMap.set(ext, ct);
                            } else {
                                fileExtsMap.set(ext, 1);
                            }
                            array2.push(each);
                        }
                        else {
                            if(fileExtsMap.has(ext)) fileExtsMap.delete(ext);
                        }
                    }
                });
                console.log(fileExtsMap);
            }, 3500);
            setTimeout(() => {
                this.setState({ capturedFiles: array2 });
            }, 3500);
            
            //this.props.onFilesAdded(array2);
        }
        this.setState({ hightlight: false });
    }
    
    render() {
        let files = "";
        if(this.state.capturedFiles !== undefined) {
             console.log(this.state.capturedFiles);
             files = this.state.capturedFiles.map((each, key) => {
                return <h5>{each.webkitRelativePath || each.fullPath}</h5>
            })
        }
        $(".loader").fadeOut(3500);
        const content = !this.state.hightlight ? "+" : "🙌";
        const alert = this.state.hightlight ?
                    <div className="alert">⚠️ &nbsp; Dropping in the wrong h<span className="special">o</span>le fella 😛</div> :
                    <div className="alert">Drag in your project folder to analy-se 😉</div>;
        return (
            <div className="Dropzone-main">
                <div className={`Dropzone ${this.state.hightlight ? "Highlight" : ""}`}
                     onClick={this.openFileDialog}
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
                {files}
                <div className="loader">Crunching your project files 🤓</div>
                {alert}
            </div>
        );
    }
}

export default Dropzone;