import React, { Component } from 'react';
import Button from '../../forms/Button';

import s from './ButtonWithConfirmation.css';

export default class ButtonWithConfirmation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showConfirmation: false
        };
    }

    render() {
        const { showConfirmation } = this.state;
        const {
            className,
            label,
            handleClick,
            buttonClassName
        } = this.props;
        return (
            <div className={s.confirmationWrapper + ' ' + (className || '')}>
                {
                    !showConfirmation &&
                    <Button
                        className={buttonClassName}
                        label={label}
                        handleClick={e => { this.setState({showConfirmation: true}) }}
                    />
                }
                { showConfirmation &&
                    <div>
                        <p>{gettext('Впененi?')}</p>
                        <Button
                            className={'default_button_outline ' + s.cancelButton}
                            label={gettext('Hi')}
                            handleClick={e => {this.setState({showConfirmation: false})}}
                        />
                        <Button
                            className={s.actionButton}
                            label={gettext('Так. ' + label)}
                            handleClick={handleClick}
                        />
                    </div>
                }
            </div>
        )
    }
}