import React from 'react';
import { styled } from '../../../../style';
import CloseIcon from "../../../../assets/baseline-close-24px.svg";
import IconButton from '../../../presentational/IconButton';
import DropZone from './DropZone';

const CloseButton = styled(IconButton)(({ theme }) => ({
    padding: 4,
    marginRight: 0,
    marginLeft: 'auto',
    "& svg" : {
        width: 18,
        height: 18,
    },
    "&:focus, &:hover": {
        fill: `${theme.primaryColor} !important`,
        outline: 'none',
    }
}));


const FileUploadContainer = styled.div(()=>({
    textAlign: 'center',
}));

const HiddenFileInput = styled.input(() => ({
    display: 'none',
}));

const AttachFileButton = styled.button(({ theme }) => ({
    padding: theme.unitSize / 2,
    border: 'none',
    backgroundColor: 'transparent',
    color: 'hsla(0, 0%, 0%, .54)',
    fontSize: 14,
    cursor: 'pointer',
    outline: 'none',
    "&:focus, &:hover": {
        color: `${theme.primaryColor} !important`,
        outline: 'none',
    }
}));

const DragDropTypography = styled.span(() => ({
    color: 'hsla(0, 0%, 0%, .54)',
    fontSize: 14,
}));

interface IFileAttachmentSectionProps {
    isFileListEmpty: boolean;
    onAddFilesToList: (fileList: File[]) => void;
    onClose: () => void;
}

class FileAttachmentSection extends React.PureComponent<React.HTMLProps<HTMLDivElement> & IFileAttachmentSectionProps> {    
    fileInputRef: React.RefObject<HTMLInputElement>;
    closeButtonRef: React.RefObject<HTMLButtonElement>;

    constructor(props) {
        super(props);
        this.fileInputRef = React.createRef();
        this.closeButtonRef = React.createRef();
    }

    handleSelectFile = (event: React.ChangeEvent<HTMLInputElement>) => {
        const {onAddFilesToList} = this.props;
        const files = event.target.files;
        const newFilesArray = Array.prototype.slice.call(files);
        onAddFilesToList(newFilesArray);
    }

    handleUploadFile = (event) => {
        event.preventDefault();
        this.fileInputRef.current?.click();
    }

    render() {
        const { isFileListEmpty, onClose, onAddFilesToList } = this.props;

        return (
            <DropZone
                onAddFilesToList={onAddFilesToList}
            >
                <CloseButton
                    onClick={onClose}
                    aria-label="Close File Attacment"
                    ref={this.closeButtonRef}
                >
                    <CloseIcon />
                </CloseButton>
                <FileUploadContainer>
                    <DragDropTypography
                        className="webchat-input-drag-and-drop-file-text"
                    >
                        Drag and drop or
                    </DragDropTypography>
                    <HiddenFileInput
                        ref={this.fileInputRef}
                        type="file"
                        multiple
                        onChange={this.handleSelectFile}
                    />
                    <AttachFileButton
                        className="webchat-input-button-browse-files"
                        aria-label="Browse Files"
                        onClick={this.handleUploadFile}
                    >
                        Attach File
                    </AttachFileButton>
                    {isFileListEmpty && <div style={{height:72}} />}
                </FileUploadContainer>
            </DropZone>
        );
    }
}

export default FileAttachmentSection;