import React, { FunctionComponent, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import Button from "@material-ui/core/Button";
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import snackBarUpdate from "../../../actions/snackBarActions";
import { useDispatch } from "react-redux";
import { Grid } from "@material-ui/core";

const useStyles = makeStyles(theme => ({
    button: {
        fontSize: 12,
    },
    detail: {
        fontWeight: 'bold',
        fontStyle: 'italic',
    }
}));

type UploadProps = {
    field: string;
    label: string;
    register: any;
    setValue: Function;
    onlyFile?: boolean;
    onlyImage?: boolean;
    required?: boolean;
    requiredErrorMessage?: any;
};

const Upload: FunctionComponent<UploadProps> = ({
    field,
    label,
    register,
    setValue,
    onlyFile = false,
    onlyImage = false,
    required = false,
    requiredErrorMessage,
}) => {
    const [file, setFile] = useState({ preview: '', raw: '' });
    const [docField, setDocField] = useState();
    const [name, setName] = useState("");
    const dispatch = useDispatch();
    const classes = useStyles();

    const validateExtensions = (type: string): boolean => {
        console.log('onlyFile ', onlyFile);
        console.log('onlyImage ', onlyImage);
        if(onlyFile) {
            if(type === 'application/pdf' || type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
                return true;
            }
                
        }
        if(onlyImage) {
            if(type === 'image/png' || type === 'image/jpeg'){
                return true;
            }    
        }
        if(!onlyFile && !onlyImage) {
            if(type === 'image/png' || type === 'image/jpeg' || type === 'application/pdf' || type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
                return true;
            }
        }
        return false;

    }

    const validateMessageExtensions = (type: string): string => {
        if(onlyFile ) return 'Solo de Admiten Archivos con formatos: .pdf - .doc';
        if(onlyImage) return 'Solo de Admiten Imagenes con formatos: .png - .jpg';  
        if(!onlyFile && !onlyImage)  return 'Solo de Admiten los formatos: .png - .jpg - pdf - .doc';
        return '';
    }

    const loadDocument = (e: any) => {
        const current = e.target.files[0];
        if (e.target.files.length > 0) {
            console.log('current.type ', current.type);
            console.log('validateExtensions(current.type) ', validateExtensions(current.type));
            if (validateExtensions(current.type)) {
                if (current.size <= 5000000) {
                    const reader: any = new FileReader();
                    reader.onload = () => {
                        setName(current.name);
                        setValue(field, reader.result);
                    };
                    reader.readAsDataURL(e.target.files[0]);
                } else {
                    setValue(field, '');
                    setName('');
                    dispatch(snackBarUpdate({
                        payload: {
                            message: "Documento debe tener maximo 5MB",
                            type: "error",
                            status: true
                        }
                    }))
                }
            } else {
                setValue(field, '');
                setName('');
                dispatch(snackBarUpdate({
                    payload: {
                        message: validateMessageExtensions(current.type),
                        type: "error",
                        status: true
                    }
                }))
            }
        }
    };

    const triggerClick = (input: any) => {
        if (input) {
            setDocField(input);
        }
    };

    const handleFile = () => {
        docField.click();
        setDocField(docField);
    };

    return (
        <Grid container spacing={2}>
            <Grid item xs={4}>
                <Button
                    startIcon={<CloudUploadIcon />}
                    variant="contained"
                    color="primary"
                    component="span"
                    size="small"
                    className={classes.button}
                    onClick={() => handleFile()}
                >
                    {label}
                </Button>
                <input
                    style={{ display: "none" }}
                    type="file"
                    id="load_image"
                    ref={triggerClick}
                    onChange={loadDocument}
                />
                <input
                    style={{ display: "none" }}
                    name={field}
                    ref={register({
                        required: required ? "Requerido" : false,
                      })}
                />
            </Grid>
            {requiredErrorMessage && (
        <Grid item xs={12} style={{ color: "red" }}>
          {requiredErrorMessage}
        </Grid>
      )}
            <Grid item xs={8} className={classes.detail} >{name}</Grid>
        </Grid>
    );
}


export default Upload;