import React, { Component } from 'react'
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
            this.props.onFilesAdded(array);
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
        if (this.props.onFilesAdded) {
            for (let i=0; i<items.length; i++) {
                let item = items[i].webkitGetAsEntry();
        
                if (item) {
                    scanFiles(item, []);
                }
            }
            let array2 = [];
            setTimeout(() => {
                array1.forEach(it => {
                    if(it.isFile === true) array2.push(it);
                });
            }, 3000);
            setTimeout(() => {
                console.log(array2);
                this.setState({ capturedFiles: array2 });
            }, 3500);
            
            this.props.onFilesAdded(array2);
        }
        this.setState({ hightlight: false });
    }
    
    render() {
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
                {alert}
            </div>
        );
    }
}

export default Dropzone;