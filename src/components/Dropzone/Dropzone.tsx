import './Dropzone.scss';
import { useDropzone, type Accept } from 'react-dropzone';

type Props = {
    acceptedFileTypes?: Accept;
    maxFiles?: number;
    showUploads?: boolean;
    onDrop?: (files: File[]) => void;
};

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

    function getAcceptedFilesTypesString(acceptedTypes: Accept) {
        return Object.values(acceptedTypes).flat().join(', ');
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
                <span className='dropzone-icon'><i className='fa-solid fa-file-arrow-up' aria-hidden='true'></i></span>
                <p><strong>Drop { maxFiles > 1 ? "files" : "a world file" } here</strong></p>
                <p className='dropzone-hint'>or click to browse your device</p>
                { acceptedFileTypes && <p className='acceptable-types-text'>{getAcceptedFilesTypesString(acceptedFileTypes)}</p> }
            </div>
            {showUploads && acceptedFiles.length > 0 && filesJSX()}
        </div>
    );
}
