import './Dropzone.scss';
import { useDropzone } from 'react-dropzone';

type Props = {
    acceptedFileTypes?: any,
    maxFiles?: number,
    showUploads?: boolean,
    onDrop?: (files: any) => void
}

export default function Dropzone(props: Props) {
    const {
        acceptedFileTypes,
        maxFiles = 1,
        showUploads = false,
        onDrop
    } = props

    const {acceptedFiles, getRootProps, getInputProps} = useDropzone({
        accept: acceptedFileTypes,
        maxFiles: maxFiles,
        onDropAccepted: onDrop,
    });

    function getAcceptedFilesTypesString() {
        return Object.keys(acceptedFileTypes).map((key) => {
            return acceptedFileTypes[key]
        }).join(', ');
    }

    const multipleFilesJSX = () => (
        <ul>
            {
                acceptedFiles.map(file => (
                    <li key={file.name}>
                        {file.name} - {file.size} bytes
                    </li>
                ))
            }
        </ul>
    )

    const singleFileJSX = () => (
        <div>
            <p><b>Uploaded {acceptedFiles[0].name}</b></p>
        </div>
    )

    const filesJSX = () => (
        <div>
            <br/>
            { maxFiles > 1 ? multipleFilesJSX() : singleFileJSX() }
        </div>
    );

    return (
        <div {...getRootProps({className: 'dropzone-container dropzone'})}>
            <div className="header">
                <input {...getInputProps()} />
                <p>Drag and drop { maxFiles > 1 ? "some files" : "a file" } here, or click to select files</p>
                { acceptedFileTypes && <p className='acceptable-types-text'>Acceptable file types: {getAcceptedFilesTypesString()}</p> }
            </div>
            {showUploads && acceptedFiles.length > 0 && filesJSX()}
        </div>
    );
}