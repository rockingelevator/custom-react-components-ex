import React from 'react';
import Dropzone from 'react-dropzone';
import Avatar from '../../common/Avatar';
import Spinner from '../../common/Spinner';

import s from './AvatarDrop.css';

export default function(props) {
    const { errors } = props;
    return (
        <Dropzone
            className={s.avatarWrapper}
            onDrop={ props.handleDrop }
            multiple={ false }
            accept="image/*"
        >
            <Avatar
                size='large'
                className={props.uploading && s.uploadingUserpic}
                src={props.img}
            />
            <Spinner show={props.uploading} className={s.userpicSpinner}/>
            <div>
                {errors &&
                  <ul className={s.errorList}>
                    {errors.map((error, i) => {
                        return (
                          <li key={"error-" + i}>{error}</li>
                        )
                    })}
                  </ul>
                }
            </div>
        </Dropzone>
    )
}