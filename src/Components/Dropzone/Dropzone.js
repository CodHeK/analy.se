import React, { Component } from 'react'
import './Dropzone.scss'

class Dropzone extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hightlight: false
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
        
        const files = event.dataTransfer.files;
        if (this.props.onFilesAdded) {
            const array = this.fileListToArray(files);
            this.props.onFilesAdded(array);
        }
        this.setState({ hightlight: false });
    }
    
    render() {
        return (
            <div className="Dropzone-main">
                <div className={`Dropzone ${this.state.hightlight ? "Highlight" : ""}`}
                     onClick={this.openFileDialog}
                     onDragOver={this.onDragOver}
                     onDragLeave={this.onDragLeave}
                     onDrop={this.onDrop}
                     style={{ cursor: this.props.disabled ? "default" : "pointer" }}>
                    <span>+</span>
                    <input
                        ref={this.fileInputRef}
                        className="FileInput"
                        type="file"
                        multiple
                        onChange={this.onFilesAdded}
                    />
                </div>
                <div className="alert">Dropping in the wrong hole fella !</div>
            </div>
        );
    }
}

export default Dropzone;